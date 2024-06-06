import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';
import Top from '../Components/Top';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
  const [product, setProduct] = useState({
    ProductID: '',  // Manually input ProductID
    ProductCode: '',
    ProductName: '',
    ProductImage: null,
    CreatedUser: 1,
    IsFavourite: false,
    Active: true,
    HSNCode: '',
    TotalStock: 0,
    variants: []
  });
  const notify = () => toast.success("Stock Updated!");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const variants = [...product.variants];
    variants[index][name] = value;
    setProduct(prevState => ({
      ...prevState,
      variants
    }));
  };

  const handleSubVariantChange = (variantIndex, subVariantIndex, e) => {
    const { value } = e.target;
    const variants = [...product.variants];
    variants[variantIndex].subvariants[subVariantIndex].option = value;
    setProduct(prevState => ({
      ...prevState,
      variants
    }));
  };

  const addVariant = () => {
    setProduct(prevState => ({
      ...prevState,
      variants: [...prevState.variants, { name: '', subvariants: [{ option: '' }] }]
    }));
  };

  const addSubVariant = (variantIndex) => {
    const variants = [...product.variants];
    variants[variantIndex].subvariants.push({ option: '' });
    setProduct(prevState => ({
      ...prevState,
      variants
    }));
  };

  const removeVariant = (index) => {
    const variants = [...product.variants];
    variants.splice(index, 1);
    setProduct(prevState => ({
      ...prevState,
      variants
    }));
  };

  const removeSubVariant = (variantIndex, subVariantIndex) => {
    const variants = [...product.variants];
    variants[variantIndex].subvariants.splice(subVariantIndex, 1);
    setProduct(prevState => ({
      ...prevState,
      variants
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/products/', product)
      .then(response => {
        console.log('Product added successfully:', response.data);
        notify()
      })
      .catch(error => {
        console.error('There was an error adding the product:', error);
      });
  };



  return (

    <>
      <div style={{ height: "100%" }}>
        <ToastContainer/>
        <Top />
        <div className='d-flex'>
          <div>
            <Sidebar />
          </div>
          <div className='mt-5' style={{ marginLeft: "8rem", width: '90%' }}>
            <Header />
            <div style={{ width: "200rem" }}>


              <form onSubmit={handleSubmit}>
                <div>
                  <label>
                    Product ID:
                    <input type="text" className='form-control' name="ProductID" value={product.ProductID} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Product Code:
                    <input type="text" className='form-control' name="ProductCode" value={product.ProductCode} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Product Name:
                    <input type="text" className='form-control' name="ProductName" value={product.ProductName} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    HSN Code:
                    <input type="text" className='form-control' name="HSNCode" value={product.HSNCode} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Total Stock:
                    <input type="number" className='form-control' name="TotalStock" value={product.TotalStock} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Active:
                    <input type="checkbox" className='form-check-input' name="Active" checked={product.Active} onChange={() => setProduct(prevState => ({ ...prevState, Active: !prevState.Active }))} />
                  </label>
                </div>
                <div>
                  <label>
                    Favourite:
                    <input type="checkbox" className='form-check-input' name="IsFavourite" checked={product.IsFavourite} onChange={() => setProduct(prevState => ({ ...prevState, IsFavourite: !prevState.IsFavourite }))} />
                  </label>
                </div>
                <div>
                  <h2>Variants</h2>
                  {product.variants.map((variant, variantIndex) => (
                    <div key={variantIndex}>
                      <div>
                        <label>
                          Variant Name:
                          <input type="text" className='form-control' name="name" value={variant.name} onChange={(e) => handleVariantChange(variantIndex, e)} required />
                        </label>
                        <button className='btn btn-primary-1' type="button" onClick={() => removeVariant(variantIndex)}>Remove Variant</button>
                      </div>
                      {variant.subvariants.map((subvariant, subVariantIndex) => (
                        <div key={subVariantIndex}>
                          <label>
                            Subvariant Option:
                            <input type="text" className='form-control' value={subvariant.option} onChange={(e) => handleSubVariantChange(variantIndex, subVariantIndex, e)} required />
                          </label>
                          <button className='btn btn-primary-1' type="button" onClick={() => removeSubVariant(variantIndex, subVariantIndex)}>Remove Subvariant</button>
                        </div>
                      ))}
                      <button className='btn btn-primary-1 ' type="button" onClick={() => addSubVariant(variantIndex)}>Add Subvariant</button>
                    </div>
                  ))}
                  <button className='btn btn-primary-1' type="button" onClick={addVariant}>Add Variant</button>
                </div>
                <button className='btn btn-primary-1' type="submit">Add Product</button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
