import { describe, it, expect } from 'vitest';

interface FormState { title: string; date: string; description: string; }
interface Errors { title?: string; date?: string; }

const validate = (form: FormState): Errors => {
  const errors: Errors = {};
  if (!form.title.trim()) errors.title = "Назва обов'язкова";
  else if (form.title.trim().length < 3) errors.title = 'Мінімум 3 символи';
  if (!form.date) errors.date = "Дата обов'язкова";
  return errors;
};

describe('OrderForm validation', () => {
  it('requires title', () => {
    const errs = validate({ title: '', date: '2024-01-01', description: '' });
    expect(errs.title).toBeDefined();
  });

  it('requires title min 3 chars', () => {
    const errs = validate({ title: 'ab', date: '2024-01-01', description: '' });
    expect(errs.title).toMatch(/3/);
  });

  it('requires date', () => {
    const errs = validate({ title: 'Test Order', date: '', description: '' });
    expect(errs.date).toBeDefined();
  });

  it('passes with valid data', () => {
    const errs = validate({ title: 'Test Order', date: '2024-01-01', description: '' });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  it('description is optional', () => {
    const errs = validate({ title: 'Test Order', date: '2024-01-01', description: '' });
    expect(errs).not.toHaveProperty('description');
  });
});
