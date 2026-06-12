import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import GroupsPage from './pages/GroupsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
