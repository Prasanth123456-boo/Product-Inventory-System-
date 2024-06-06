import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductForm from './Pages/ProductForm';
import ProductList from './Pages/ProductList';
import StockManagement from './Pages/StockManagement';
import ProductDetail from './Pages/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/manage-stock" element={<StockManagement />} />
        <Route path="/product/:id" element={<ProductDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;
