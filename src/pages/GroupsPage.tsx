import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteProductAsync } from '../store/appSlice';
import { Product } from '../types';
import DeleteModal from '../components/DeleteModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Группы — уникальные типы продуктов, каждая группа содержит свои продукты
interface Group {
  id: number;
  name: string;
  products: Product[];
}

const GroupsPage: React.FC = () => {
  const products = useSelector((s: RootState) => s.app.products);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Строим группы из уникальных типов
  const groups: Group[] = React.useMemo(() => {
    const typeMap = new Map<string, Product[]>();
    products.forEach((p) => {
      if (!typeMap.has(p.type)) typeMap.set(p.type, []);
      typeMap.get(p.type)!.push(p);
    });
    let id = 1;
    return Array.from(typeMap.entries()).map(([name, prods]) => ({
      id: id++,
      name,
      products: prods,
    }));
  }, [products]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd / MM / yyyy', { locale: ru });
    } catch { return dateStr; }
  };

  return (
    <div>
      <div className="page-header">
        <button className="page-header__add-btn" title="Добавить группу">+</button>
        <h1 className="page-header__title">Группы / {groups.length}</h1>
      </div>

      <div className="orders-layout">
        {/* LEFT: список групп (короткие карточки) */}
        <div className="orders-list">
          {groups.map((group) => {
            const isActive = selectedGroupId === group.id;
            return (
              <div
                key={group.id}
                className={`group-card${isActive ? ' group-card--active' : ''}`}
                onClick={() => setSelectedGroupId(isActive ? null : group.id)}
              >
                <div className="group-card__icon">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <rect x="0" y="0" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="0" width="12" height="3" rx="1" fill="#bbb"/>
                    <rect x="0" y="5.5" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="5.5" width="12" height="3" rx="1" fill="#bbb"/>
                    <rect x="0" y="11" width="4" height="3" rx="1" fill="#bbb"/>
                    <rect x="6" y="11" width="12" height="3" rx="1" fill="#bbb"/>
                  </svg>
                </div>

                <div className="group-card__name">{group.name}</div>

                <div className="group-card__count">
                  <span className="group-card__count-num">{group.products.length}</span>
                  <span className="group-card__count-label">Продуктов</span>
                </div>

                {isActive && <span className="group-card__arrow">›</span>}
              </div>
            );
          })}
        </div>

        {/* RIGHT: продукты группы */}
        {selectedGroup && (
          <div className="order-detail slide-in">
            <button
              className="order-detail__close"
              onClick={() => setSelectedGroupId(null)}
            >
              ×
            </button>

            <div className="order-detail__title">{selectedGroup.name}</div>

            <button className="order-detail__add">
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Добавить продукт
            </button>

            {selectedGroup.products.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Нет продуктов в этой группе
              </div>
            )}

            {selectedGroup.products.map((product) => (
              <div key={product.id} className="product-row">
                <span className={`product-row__status ${product.isNew ? 'product-row__status--new' : 'product-row__status--used'}`} />
                <div className="product-row__icon">🖥</div>
                <div className="product-row__info">
                  <div className="product-row__title">{product.title}</div>
                  <div className="product-row__serial">SN-{product.serialNumber}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 90, textAlign: 'center' }}>
                  <div>с {formatDate(product.guarantee.start)}</div>
                  <div>по {formatDate(product.guarantee.end)}</div>
                </div>
                <div className="product-row__available">
                  {product.isNew ? 'Свободен' : 'В ремонте'}
                </div>
                <button
                  className="product-row__delete"
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          title="Вы уверены, что хотите удалить этот продукт?"
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            dispatch(deleteProductAsync(deleteTarget.id));
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default GroupsPage;
