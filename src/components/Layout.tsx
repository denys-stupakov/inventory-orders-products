import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setActiveSessions } from '../store/appSlice';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState('');

  const toggleLang = () => {
    const next = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };
  const activeSessions = useSelector((s: RootState) => s.app.activeSessions);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const authUser = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Socket.io — real WebSocket sessions counter
  useEffect(() => {
    const socket = io('http://localhost:3001', { transports: ['websocket'] });
    socket.on('sessions:update', (count: number) => dispatch(setActiveSessions(count)));
    return () => { socket.disconnect(); };
  }, [dispatch]);

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
            {t('header.sessions')} {activeSessions}
          </div>
          <button className="lang-toggle" onClick={toggleLang}>
            {i18n.language === 'uk' ? 'EN' : 'UK'}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar__avatar-wrap">
            <div className="sidebar__avatar">👤</div>
            <span className="sidebar__settings">⚙</span>
          </div>
          {authUser && (
            <div className="sidebar__user-name">{authUser.name}</div>
          )}

          <div className="sidebar__nav">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              {t('nav.orders')}
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              {t('nav.groups')}
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                'sidebar__nav-link' + (isActive ? ' active' : '')
              }
            >
              {t('nav.products')}
            </NavLink>
            <span className="sidebar__nav-link">{t('nav.users')}</span>
            <span className="sidebar__nav-link">{t('nav.settings')}</span>
            <button className="sidebar__logout" onClick={handleLogout}>{t('nav.logout')}</button>
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
