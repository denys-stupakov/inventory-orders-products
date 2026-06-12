import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, Product } from '../types';
import { initialOrders, initialProducts } from '../data';

interface AppState {
  orders: Order[];
  products: Product[];
  activeSessions: number;
}

const loadState = (): AppState | undefined => {
  try {
    const serialized = localStorage.getItem('inventoryState');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

const savedState = loadState();

const initialState: AppState = savedState || {
  orders: initialOrders,
  products: initialProducts,
  activeSessions: 1,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    deleteOrder(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.orders = state.orders.map((o) => ({
        ...o,
        products: o.products.filter((p) => p.id !== action.payload),
      }));
    },
    addProductToOrder(state, action: PayloadAction<{ orderId: number; product: Product }>) {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.products.push(action.payload.product);
        state.products.push(action.payload.product);
      }
    },
    setActiveSessions(state, action: PayloadAction<number>) {
      state.activeSessions = action.payload;
    },
  },
});

export const { deleteOrder, deleteProduct, addProductToOrder, setActiveSessions } = appSlice.actions;
export default appSlice.reducer;
