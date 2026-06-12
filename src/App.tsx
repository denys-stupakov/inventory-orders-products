import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import './styles/global.css';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));

const PageSpinner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/orders" replace />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/groups" element={<GroupsPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
