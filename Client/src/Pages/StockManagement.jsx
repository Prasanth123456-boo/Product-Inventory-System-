import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Top from '../Components/Top';
import { ToastContainer, toast } from 'react-toastify';

const StockManagement = () => {
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [operation, setOperation] = useState('add');
  const [errorMessage, setErrorMessage] = useState('');

  const notify = () => toast.success("Stock Updated!");

  const handleStockChange = async () => {
    if (!productCode || !quantity) {
      setErrorMessage('Please provide both product code and quantity.');
      return;
    }

    try {
      const url = operation === 'add'
        ? '/stock/create-by-product-code/'
        : '/stock/remove-by-product-code/';

      await axiosInstance.post(url, {
        product_code: productCode,
        quantity: parseInt(quantity, 10),
      });

      notify()
      setErrorMessage('');
    } catch (error) {
      console.error('There was an error updating the stock!', error);
      setErrorMessage('There was an error updating the stock.');
    }
  };

  return (
    <div>
      <ToastContainer/>
      <Top />
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='mt-5' style={{ marginLeft: "8rem", width: '90%' }}>
          <Header />
          <label>
            Product Code:
            <input
              className='form-control'
              type='text'
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              className='form-control'
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>
          <label>
            Operation:
            <select className='form-control' value={operation} onChange={(e) => setOperation(e.target.value)}>
              <option value='add'>Add</option>
              <option value='remove'>Remove</option>
            </select>
          </label>
          <button className='btn btn-primary-1' onClick={handleStockChange}>Update Stock</button>
          {errorMessage && <div className='alert alert-danger mt-3'>{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
