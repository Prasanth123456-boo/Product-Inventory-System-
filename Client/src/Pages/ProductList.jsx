import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Top from '../Components/Top';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/products/');
                setProducts(response.data);
            } catch (error) {
                console.error('There was an error fetching the products!', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // Calculate total pages based on products length
        const totalPages = Math.ceil(products.length / 10);

        // Generate page numbers array
        setPageNumbers(Array.from({ length: totalPages }, (_, index) => index + 1));
    }, [products]);

    // Calculate the index of the last product to be displayed
    const indexOfLastProduct = currentPage * 10;

    // Calculate the index of the first product to be displayed
    const indexOfFirstProduct = indexOfLastProduct - 10;

    // Slice the products array to get the products for the current page
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Change to the next page
    const nextPage = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Change to the previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <Top />
            <div className='d-flex'>
                <div>
                    <Sidebar />
                </div>
                <div className='mt-5' style={{ marginLeft: "8rem", width: '90%' }}>
                    <Header />
                    <table className="table table-bordered">
                        <thead className="table-secondary">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Code</th>
                                <th>Product Name</th>
                                <th>HSN Code</th>
                                <th>Total Stock</th>
                                <th>Actions</th> {/* New column for actions */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.ProductID}</td>
                                    <td>{product.ProductCode}</td>
                                    <td>{product.ProductName}</td>
                                    <td>{product.HSNCode}</td>
                                    <td>{product.TotalStock}</td>
                                    <td>
                                        {/* Button or link to view full details */}
                                        <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={prevPage}>Previous</button>
                            </li>
                            {pageNumbers.map((page) => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={nextPage}>Next</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
