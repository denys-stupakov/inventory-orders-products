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

// Typed hooks
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector = useReduxSelector;
