import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteOrderAsync, deleteProductAsync, loadOrders } from '../store/appSlice';
import { Order, Product } from '../types';
import DeleteModal from '../components/DeleteModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const OrdersPage: React.FC = () => {
  const orders = useSelector((s: RootState) => s.app.orders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => { dispatch(loadOrders()); }, [dispatch]);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [deleteOrderTarget, setDeleteOrderTarget] = useState<Order | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd / MMM / yyyy', { locale: ru });
    } catch { return dateStr; }
  };

  const formatDateTwo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        top: format(d, 'dd / MM', { locale: ru }),
        bottom: format(d, 'dd / MMM / yyyy', { locale: ru }),
      };
    } catch { return { top: '', bottom: dateStr }; }
  };

  const getTotalUSD = (order: Order) =>
    order.products.reduce((sum, p) => {
      const pr = p.price.find((x) => x.symbol === 'USD');
      return sum + (pr ? pr.value : 0);
    }, 0);

  const getTotalUAH = (order: Order) =>
    order.products.reduce((sum, p) => {
      const pr = p.price.find((x) => x.symbol === 'UAH');
      return sum + (pr ? pr.value : 0);
    }, 0);

  return (
    <div>
      <div className="page-header">
        <button className="page-header__add-btn" title="Добавить приход">+</button>
        <h1 className="page-header__title">Приходы / {orders.length}</h1>
      </div>

      <div className="orders-layout">
        {/* LEFT: список приходов */}
        <div className="orders-list">
          {orders.map((order) => {
            const dates = formatDateTwo(order.date);
            const isActive = selectedOrderId === order.id;
            return (
              <div
                key={order.id}
                className={`order-card${isActive ? ' order-card--active' : ''}`}
                onClick={() => setSelectedOrderId(isActive ? null : order.id)}
              >
                {/* Иконка списка */}
                <div className="order-card__icon">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <rect x="0" y="0" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="0" width="12" height="3" rx="1" fill="#bbb"/>
                    <rect x="0" y="5.5" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="5.5" width="12" height="3" rx="1" fill="#bbb"/>
                    <rect x="0" y="11" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="11" width="12" height="3" rx="1" fill="#bbb"/>
                  </svg>
                </div>

                {/* Название */}
                <div className="order-card__title">{order.title}</div>

                {/* Кол-во продуктов */}
                <div className="order-card__products-block">
                  <div className="order-card__products-count">{dates.top}</div>
                  <div className="order-card__products-label">
                    {order.products.length} / {order.products.length}
                    <br/>Продукта
                  </div>
                </div>

                {/* Дата */}
                <div className="order-card__date">{dates.bottom}</div>

                {/* Цены */}
                <div className="order-card__prices">
                  <div className="order-card__price-usd">
                    {getTotalUSD(order).toLocaleString()} $
                  </div>
                  <div className="order-card__price-uah">
                    {getTotalUAH(order).toLocaleString()} UAH
                  </div>
                </div>

                {/* Удалить */}
                <button
                  className="order-card__delete"
                  title="Удалить"
                  onClick={(e) => { e.stopPropagation(); setDeleteOrderTarget(order); }}
                >
                  🗑
                </button>

                {isActive && <span className="order-card__arrow">›</span>}
              </div>
            );
          })}
        </div>

        {/* RIGHT: детали прихода */}
        {selectedOrder && (
          <div className="order-detail slide-in">
            <button
              className="order-detail__close"
              onClick={() => setSelectedOrderId(null)}
            >
              ×
            </button>

            <div className="order-detail__title">{selectedOrder.title}</div>

            <button className="order-detail__add">
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Добавить продукт
            </button>

            {selectedOrder.products.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Нет продуктов в этом приходе
              </div>
            )}

            {selectedOrder.products.map((product) => (
              <div key={product.id} className="product-row">
                <span className={`product-row__status ${product.isNew ? 'product-row__status--new' : 'product-row__status--used'}`} />
                <div className="product-row__icon">🖥</div>
                <div className="product-row__info">
                  <div className="product-row__title">{product.title}</div>
                  <div className="product-row__serial">SN-{product.serialNumber}</div>
                </div>
                <div className="product-row__available">Свободен</div>
                <button
                  className="product-row__delete"
                  onClick={(e) => { e.stopPropagation(); setDeleteProductTarget(product); }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteOrderTarget && (
        <DeleteModal
          title="Вы уверены, что хотите удалить этот приход?"
          product={deleteOrderTarget.products[0] || null}
          onCancel={() => setDeleteOrderTarget(null)}
          onConfirm={() => {
            dispatch(deleteOrderAsync(deleteOrderTarget.id));
            setDeleteOrderTarget(null);
            if (selectedOrderId === deleteOrderTarget.id) setSelectedOrderId(null);
          }}
        />
      )}

      {deleteProductTarget && (
        <DeleteModal
          title="Вы уверены, что хотите удалить этот продукт?"
          product={deleteProductTarget}
          onCancel={() => setDeleteProductTarget(null)}
          onConfirm={() => {
            dispatch(deleteProductAsync(deleteProductTarget.id));
            setDeleteProductTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
