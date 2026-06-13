import { describe, it, expect } from 'vitest';
import reducer, {
  setActiveSessions,
  removeOrderFromSocket,
  removeProductFromSocket,
  setOrderFromSocket,
} from '../store/appSlice';
import { initialOrders, initialProducts } from '../data';

const baseState = {
  orders: initialOrders,
  products: initialProducts,
  activeSessions: 1,
  loading: false,
  error: null,
};

describe('appSlice reducers', () => {
  it('setActiveSessions updates count', () => {
    const state = reducer(baseState, setActiveSessions(5));
    expect(state.activeSessions).toBe(5);
  });

  it('removeOrderFromSocket removes order and its products', () => {
    const state = reducer(baseState, removeOrderFromSocket(1));
    expect(state.orders.find((o) => o.id === 1)).toBeUndefined();
    expect(state.products.every((p) => p.order !== 1)).toBe(true);
  });

  it('removeProductFromSocket removes product from state and from orders', () => {
    const state = reducer(baseState, removeProductFromSocket(1));
    expect(state.products.find((p) => p.id === 1)).toBeUndefined();
    state.orders.forEach((o) => {
      expect(o.products.find((p) => p.id === 1)).toBeUndefined();
    });
  });

  it('setOrderFromSocket adds new order if not exists', () => {
    const newOrder = { id: 99, title: 'New', date: '2024-01-01', description: '', products: [] };
    const state = reducer(baseState, setOrderFromSocket(newOrder));
    expect(state.orders.find((o) => o.id === 99)).toBeDefined();
  });

  it('setOrderFromSocket does not duplicate if order already exists', () => {
    const existing = { ...initialOrders[0] };
    const state = reducer(baseState, setOrderFromSocket(existing));
    const count = state.orders.filter((o) => o.id === existing.id).length;
    expect(count).toBe(1);
  });

  it('initial state has correct orders count', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.orders.length).toBeGreaterThan(0);
  });
});
