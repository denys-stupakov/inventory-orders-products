import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

interface FormState {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  server?: string;
}

const validate = (form: FormState): Errors => {
  const errors: Errors = {};
  if (!form.email) {
    errors.email = 'Email обязателен';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Неверный формат email';
  }
  if (!form.password) {
    errors.password = 'Пароль обязателен';
  } else if (form.password.length < 6) {
    errors.password = 'Минимум 6 символов';
  }
  return errors;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, server: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.user));
      navigate('/orders');
    } catch {
      setErrors({ server: 'Неверный email или пароль' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box animate__animated animate__fadeInDown animate__faster">
        <div className="login-logo">🛡 INVENTORY</div>
        <h2 className="login-title">Вход в систему</h2>

        <form onSubmit={handleSubmit} noValidate>
          {errors.server && (
            <div className="login-error-banner">{errors.server}</div>
          )}

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              name="email"
              className={`login-input${errors.email ? ' login-input--error' : ''}`}
              value={form.email}
              onChange={handleChange}
              placeholder="admin@inventory.com"
              autoComplete="email"
            />
            {errors.email && <span className="login-field-error">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label className="login-label">Пароль</label>
            <input
              type="password"
              name="password"
              className={`login-input${errors.password ? ' login-input--error' : ''}`}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <span className="login-field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="login-hint">
          <span>Demo: </span>
          <code>admin@inventory.com</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
