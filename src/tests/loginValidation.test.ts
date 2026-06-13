import { describe, it, expect } from 'vitest';

// Extracted validation logic (same as in LoginPage)
interface FormState { email: string; password: string; }
interface Errors { email?: string; password?: string; }

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

describe('Login form validation', () => {
  it('returns error for empty email', () => {
    const errs = validate({ email: '', password: 'pass123' });
    expect(errs.email).toBeDefined();
  });

  it('returns error for invalid email format', () => {
    const errs = validate({ email: 'notanemail', password: 'pass123' });
    expect(errs.email).toMatch(/формат/i);
  });

  it('returns error for empty password', () => {
    const errs = validate({ email: 'a@b.com', password: '' });
    expect(errs.password).toBeDefined();
  });

  it('returns error for short password', () => {
    const errs = validate({ email: 'a@b.com', password: '123' });
    expect(errs.password).toMatch(/6/);
  });

  it('returns no errors for valid input', () => {
    const errs = validate({ email: 'admin@inventory.com', password: 'admin123' });
    expect(Object.keys(errs)).toHaveLength(0);
  });
});
