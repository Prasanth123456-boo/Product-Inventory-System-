import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Top from '../Components/Top';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL params
    const [product, setProduct] = useState(null);
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('There was an error fetching the product details!', error);
            }
        };

        fetchProduct();
    }, [id]); // Fetch product details whenever the product ID changes

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('ProductImage', newImage);

            const response = await axiosInstance.put(`/products/${id}/update-image/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Image uploaded successfully:', response.data);
            // Refresh product data after image update
            fetchProduct();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    if (!product) {
        return <div>Loading...</div>; // Display a loading indicator while fetching data
    }

    return (
        <div>
            <Top />
            <div className='d-flex'>
                <div>
                    <Sidebar />
                </div>
                <div className='mt-5' style={{ marginLeft: "8rem", width: '90%' }}>
                    <Header />
                  
                    <div className="product-details-container d-flex gap-4">
                        <div className="product-image d-flex flex-column">
                            <img src={product.ProductImage} alt={product.ProductName} style={{height:"30rem"}}/>
                            <input className='form-control' type="file" onChange={handleImageChange} />
                            <button className='btn btn-primary-1' onClick={handleImageUpload}>Update Image</button>
                        </div>
                        <div className="product-info">
                            <h2>{product.ProductName}</h2>
                            <p>Product ID: <span className='text-dark fs-3'>{product.ProductID}</span> </p>
                            <p>Product Code: <span className='text-dark fs-3'>{product.ProductCode}</span> </p>
                            <p>HSN Code:  <span className='text-dark fs-3'>{product.HSNCode}</span></p>
                            <p>Total Stock: <span className='text-dark fs-3'>{product.TotalStock}</span> </p>
                            {product.variants.map(variant => (
                                <div key={variant.id}>
                                    <p><strong>{variant.name}</strong> - {variant.subvariants.map(subvariant => subvariant.option).join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
