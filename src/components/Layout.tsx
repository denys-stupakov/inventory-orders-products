import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setActiveSessions } from '../store/appSlice';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState('');
  const activeSessions = useSelector((s: RootState) => s.app.activeSessions);
  const dispatch = useDispatch();
  const location = useLocation();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate WebSocket sessions count using BroadcastChannel
  useEffect(() => {
    let count = 1;
    const channel = new BroadcastChannel('inventory-sessions');

    const sendPing = () => channel.postMessage({ type: 'ping' });
    const sendPong = () => channel.postMessage({ type: 'pong' });

    // Notify others on open
    channel.postMessage({ type: 'open' });

    channel.onmessage = (e) => {
      if (e.data.type === 'open') {
        count++;
        dispatch(setActiveSessions(count));
        sendPong();
      } else if (e.data.type === 'pong') {
        // another tab acknowledged
        count = Math.max(count, activeSessions + 1);
        dispatch(setActiveSessions(activeSessions + 1));
      } else if (e.data.type === 'close') {
        count = Math.max(1, count - 1);
        dispatch(setActiveSessions(count));
      }
    };

    window.addEventListener('beforeunload', () => {
      channel.postMessage({ type: 'close' });
    });

    return () => {
      channel.postMessage({ type: 'close' });
      channel.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayName = format(now, 'EEEE', { locale: ru });
  const dateStr = format(now, 'dd MMM, yyyy', { locale: ru });
  const timeStr = format(now, 'HH:mm');

  return (
    <div className="app-layout">
      {/* TOP HEADER */}
      <header className="app-header">
        <a href="/orders" className="app-header__logo">
          <div className="app-header__logo-icon">🛡</div>
          INVENTORY
        </a>

        <div className="app-header__search">
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="app-header__right">
          <div className="app-header__date">
            <span style={{ textTransform: 'capitalize' }}>{dayName}</span>{' '}
            <span>{dateStr}</span>
            {' '}
            <span className="app-header__time">⏱ {timeStr}</span>
          </div>
          <div className="app-header__sessions">
            Активных сессий: {activeSessions}
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar__avatar-wrap">
            <div className="sidebar__avatar">👤</div>
            <span className="sidebar__settings">⚙</span>
          </div>

          <div className="sidebar__nav">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              ПРИХОД
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              ГРУППЫ
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              ПРОДУКТЫ
            </NavLink>
            <span className="sidebar__nav-link">ПОЛЬЗОВАТЕЛИ</span>
            <span className="sidebar__nav-link">НАСТРОЙКИ</span>
          </div>
        </nav>

        {/* MAIN */}
        <main className="main-content">
          <div key={location.pathname} className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
