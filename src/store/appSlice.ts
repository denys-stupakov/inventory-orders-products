import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, Product } from '../types';
import { initialOrders, initialProducts } from '../data';
import * as api from '../api';

interface AppState {
  orders: Order[];
  products: Product[];
  activeSessions: number;
  loading: boolean;
  error: string | null;
}

const loadState = (): Partial<AppState> | undefined => {
  try {
    const s = localStorage.getItem('inventoryState');
    return s ? JSON.parse(s) : undefined;
  } catch {
    return undefined;
  }
};

const saved = loadState();

const initialState: AppState = {
  orders: saved?.orders ?? initialOrders,
  products: saved?.products ?? initialProducts,
  activeSessions: 1,
  loading: false,
  error: null,
};

// ── Async thunks ──────────────────────────────────────────────

export const loadOrders = createAsyncThunk('app/loadOrders', async () => {
  const res = await api.fetchOrders();
  return res.data as Order[];
});

export const loadProducts = createAsyncThunk('app/loadProducts', async () => {
  const res = await api.fetchProducts();
  return res.data as Product[];
});

export const createOrder = createAsyncThunk(
  'app/createOrder',
  async (data: { title: string; date: string; description?: string }) => {
    const res = await api.createOrder(data);
    return res.data as Order;
  }
);

export const deleteOrderAsync = createAsyncThunk('app/deleteOrder', async (id: number) => {
  await api.removeOrder(id);
  return id;
});

export const deleteProductAsync = createAsyncThunk('app/deleteProduct', async (id: number) => {
  await api.removeProduct(id);
  return id;
});

// ── Slice ─────────────────────────────────────────────────────

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Kept for socket.io real-time sync
    setOrderFromSocket(state, action: PayloadAction<Order>) {
      if (!state.orders.find((o) => o.id === action.payload.id)) {
        state.orders.push(action.payload);
      }
    },
    removeOrderFromSocket(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      state.products = state.products.filter((p) => p.order !== action.payload);
    },
    removeProductFromSocket(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.orders = state.orders.map((o) => ({
        ...o,
        products: o.products.filter((p) => p.id !== action.payload),
      }));
    },
    setActiveSessions(state, action: PayloadAction<number>) {
      state.activeSessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(loadOrders.rejected, (state) => { state.loading = false; }) // keep cached data

      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })

      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        state.products = state.products.filter((p) => p.order !== action.payload);
      })

      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.orders = state.orders.map((o) => ({
          ...o,
          products: o.products.filter((p) => p.id !== action.payload),
        }));
      });
  },
});

export const {
  setOrderFromSocket,
  removeOrderFromSocket,
  removeProductFromSocket,
  setActiveSessions,
} = appSlice.actions;

// Legacy exports for backward compat with pages not yet migrated
export const deleteOrder = deleteOrderAsync;
export const deleteProduct = deleteProductAsync;
export const addProductToOrder = appSlice.actions.setOrderFromSocket; // placeholder

export default appSlice.reducer;
