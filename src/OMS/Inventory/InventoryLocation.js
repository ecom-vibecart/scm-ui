import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Table, InputGroup, FormControl, Alert } from 'react-bootstrap';
import './Styling/inv_location.css';
import ClipLoader from 'react-spinners/ClipLoader'; // Loader
import { API_URLS } from "../config";
import axios from 'axios';

const InventoryLocation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(11); // Show 11 rows per page
    const [loading, setLoading] = useState(true); // Loader state true initially
    const [inventoryData, setInventoryData] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'skuId', direction: 'asc' });

    // Define state variables for pagination logic
    const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < totalPages;

    const gotoPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageChange = (action) => {
        if (action === 'next' && canNextPage) {
            gotoPage(currentPage + 1);
        } else if (action === 'previous' && canPreviousPage) {
            gotoPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: result } = await axios.get(API_URLS.getAllWarehouses);
                if (result.success) {
                    setInventoryData(result.data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError('Error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedData = useMemo(() => {
        let sortableItems = [...inventoryData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [inventoryData, sortConfig]);

    const filteredData = useMemo(
        () => sortedData.filter(item =>
            item.skuId.toString().includes(searchTerm.toLowerCase()) ||
            item.warehouseId.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [searchTerm, sortedData]
    );

    // Get the current paginated data
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Create dynamic page numbers around the current page
    const getPageRange = () => {
        const range = [];
        const maxVisiblePages = 4;
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        if (end - start < maxVisiblePages - 1) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    const pageRange = getPageRange();

    return (
        <Container fluid className="mt-4">
            <Row className="h-100">
                <Col md={12} className="d-flex flex-column h-100">
                    {/* Search Input */}
                    <Row className="mb-4">
                        <Col md={4} className="custom-input-group">
                            <InputGroup>
                                <FormControl
                                    placeholder="Search by SKU or Warehouse ID"
                                    aria-label="Search by SKU or Warehouse ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="custom-input"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => console.log('Search term:', searchTerm)}
                                >
                                    Search
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>

                    {/* Loader or Error Display */}
                    {loading ? (
                        <Row className="justify-content-center align-items-center flex-grow-1" style={{ height: '100%' }}>
                            <Col className="text-center">
                                <ClipLoader color="#007bff" size={50} />
                                <div className="mt-2">Loading data...</div>
                            </Col>
                        </Row>
                    ) : error ? (
                        <Row className="justify-content-center align-items-center flex-grow-1" style={{ height: '100%' }}>
                            <Col className="text-center">
                                <Alert variant="danger">{error}</Alert>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <div className="table-wrapper flex-grow-1">
                                <Row>
                                    <Col>
                                        {/* Inventory Table */}
                                        <div className='table-responsive'>
                                            <Table bordered hover className='table'>
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => handleSort('skuId')}>
                                                            SKU ID {sortConfig.key === 'skuId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
                                                        </th>
                                                        <th onClick={() => handleSort('warehouseId')}>
                                                            Warehouse ID {sortConfig.key === 'warehouseId' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
                                                        </th>
                                                        <th onClick={() => handleSort('availableQuantity')}>
                                                            Available Quantity {sortConfig.key === 'availableQuantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
                                                        </th>
                                                        <th onClick={() => handleSort('reservedQuantity')}>
                                                            Reserved Quantity {sortConfig.key === 'reservedQuantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
                                                        </th>
                                                        <th onClick={() => handleSort('totalQuantity')}>
                                                            Total Quantity {sortConfig.key === 'totalQuantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedData.length > 0 ? (
                                                        paginatedData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.skuId}</td>
                                                                <td>{item.warehouseId}</td>
                                                                <td>{item.availableQuantity}</td>
                                                                <td>{item.reservedQuantity}</td>
                                                                <td>{item.totalQuantity}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">
                                                                No data found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Custom Pagination */}
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                style={{ color: '#dd1e25' }}
                                                onClick={() => handlePageChange('previous')}
                                                disabled={!canPreviousPage}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {pageRange.map((num) => (
                                            <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                                                <button
                                                    className={`page-link ${currentPage === num ? 'active-page' : ''}`}
                                                    onClick={() => gotoPage(num)}
                                                >
                                                    {num}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                style={{ color: '#dd1e25' }}
                                                onClick={() => handlePageChange('next')}
                                                disabled={!canNextPage}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default InventoryLocation;
