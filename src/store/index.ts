import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

store.subscribe(() => {
  try {
    const state = store.getState().app;
    localStorage.setItem('inventoryState', JSON.stringify(state));
  } catch {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
