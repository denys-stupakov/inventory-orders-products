import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { createOrder } from '../store/appSlice';

interface Props {
  onClose: () => void;
}

interface FormState {
  title: string;
  date: string;
  description: string;
}

interface Errors {
  title?: string;
  date?: string;
}

const validate = (form: FormState): Errors => {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = 'Назва обов\'язкова';
  else if (form.title.trim().length < 3) errors.title = 'Мінімум 3 символи';
  if (!form.date) errors.date = 'Дата обов\'язкова';
  return errors;
};

const OrderForm: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormState>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await dispatch(createOrder({
        title: form.title.trim(),
        date: `${form.date} 00:00:00`,
        description: form.description.trim(),
      })).unwrap();
      onClose();
    } catch {
      // server may be down — Redux still updates via fulfilled
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate__animated animate__fadeIn animate__faster" onClick={onClose}>
      <div
        className="modal-box animate__animated animate__zoomIn animate__faster"
        style={{ position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <div className="modal-body">
          <div className="modal-title">Новий прихід</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-label">Назва *</label>
              <input
                type="text"
                name="title"
                className={`form-input${errors.title ? ' form-input--error' : ''}`}
                value={form.title}
                onChange={handleChange}
                placeholder="Введіть назву прихода"
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Дата *</label>
              <input
                type="date"
                name="date"
                className={`form-input${errors.date ? ' form-input--error' : ''}`}
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-field">
              <label className="form-label">Опис</label>
              <textarea
                name="description"
                className="form-input form-textarea"
                value={form.description}
                onChange={handleChange}
                placeholder="Необов'язково"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="modal-btn-cancel" style={{ color: '#555' }} onClick={onClose}>
                Скасувати
              </button>
              <button type="submit" className="form-submit-btn" disabled={loading}>
                {loading ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
