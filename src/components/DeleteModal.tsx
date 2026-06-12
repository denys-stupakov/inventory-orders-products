import React from 'react';
import { Product } from '../types';

interface DeleteModalProps {
  title: string;
  product?: Product | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ title, product, onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay animate__animated animate__fadeIn animate__faster" onClick={onCancel}>
      <div
        className="modal-box animate__animated animate__zoomIn animate__faster"
        style={{ position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onCancel}>×</button>

        <div className="modal-body">
          <div className="modal-title">{title}</div>
          {product && (
            <div className="modal-product-row">
              <span className="modal-dot" />
              <div className="modal-product-icon">🖥</div>
              <div>
                <div className="modal-product-title">{product.title}</div>
                <div className="modal-product-serial">SN-{product.serialNumber}</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>ОТМЕНИТЬ</button>
          <button className="modal-btn-delete" onClick={onConfirm}>
            🗑 УДАЛИТЬ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
