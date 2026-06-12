import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteProduct } from '../store/appSlice';
import { Product } from '../types';
import DeleteModal from '../components/DeleteModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ProductsPage: React.FC = () => {
  const products = useSelector((s: RootState) => s.app.products);
  const orders = useSelector((s: RootState) => s.app.orders);
  const dispatch = useDispatch();

  const [typeFilter, setTypeFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const types = useMemo(() => {
    const t = Array.from(new Set(products.map((p) => p.type)));
    return ['', ...t];
  }, [products]);

  const specs = useMemo(() => {
    const s = Array.from(new Set(products.map((p) => p.specification)));
    return ['', ...s];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (typeFilter && p.type !== typeFilter) return false;
      if (specFilter && p.specification !== specFilter) return false;
      return true;
    });
  }, [products, typeFilter, specFilter]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd / MM / yyyy', { locale: ru });
    } catch {
      return dateStr;
    }
  };

  const getOrderTitle = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    return order ? order.title : '—';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Продукты / {filtered.length}</h1>

        <div className="products-filters" style={{ marginLeft: 24 }}>
          <div className="filter-select-wrap">
            <span>Тип:</span>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t || 'Все типы'}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrap">
            <span>Спецификация:</span>
            <select
              className="filter-select"
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
            >
              {specs.map((s) => (
                <option key={s} value={s}>
                  {s || 'Все'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <table className="products-table">
        <tbody>
          {filtered.map((product) => (
            <tr key={product.id}>
              {/* Status dot */}
              <td style={{ width: 20, paddingRight: 0 }}>
                <span
                  className="product-status-dot"
                  style={{
                    background: product.isNew
                      ? 'var(--status-free)'
                      : '#ccc',
                  }}
                />
              </td>

              {/* Icon */}
              <td style={{ width: 52 }}>
                <div className="product-icon-cell">🖥</div>
              </td>

              {/* Title & serial */}
              <td>
                <div className="product-title-main">{product.title}</div>
                <div className="product-title-serial">SN-{product.serialNumber}</div>
              </td>

              {/* Status */}
              <td>
                <span
                  className={`status-badge ${
                    product.isNew ? 'status-badge--free' : 'status-badge--repair'
                  }`}
                >
                  {product.isNew ? 'свободен' : 'В ремонте'}
                </span>
              </td>

              {/* Guarantee dates */}
              <td>
                <div style={{ fontSize: 12 }}>
                  с {formatDate(product.guarantee.start)}
                </div>
                <div style={{ fontSize: 12 }}>
                  по {formatDate(product.guarantee.end)}
                </div>
              </td>

              {/* Condition */}
              <td>
                <span style={{ fontSize: 12 }}>
                  {product.isNew ? 'новый' : 'Б/У'}
                </span>
              </td>

              {/* Price */}
              <td>
                <div className="product-price-usd">
                  {product.price.find((p) => p.symbol === 'USD')?.value.toLocaleString()} $
                </div>
                <div className="product-price-uah">
                  {product.price.find((p) => p.symbol === 'UAH')?.value.toLocaleString()} UAH
                </div>
              </td>

              {/* Group name */}
              <td>
                <div className="product-group-name">
                  Длинное предлинное длиннючее название группы
                </div>
              </td>

              {/* Assigned user */}
              <td style={{ fontSize: 12, color: '#999' }}>—</td>

              {/* Order */}
              <td>
                <div
                  className="product-group-name"
                  style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {getOrderTitle(product.order)}
                </div>
              </td>

              {/* Date */}
              <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {formatDate(product.date)}
              </td>

              {/* Delete */}
              <td>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 15 }}
                  onClick={() => setDeleteTarget(product)}
                  title="Удалить"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteTarget && (
        <DeleteModal
          title="Вы уверены, что хотите удалить этот продукт?"
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            dispatch(deleteProduct(deleteTarget.id));
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
