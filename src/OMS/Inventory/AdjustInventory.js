import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Container, Row, Col, Table, Button, Modal, FormControl, InputGroup, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Styling/inv_console.css'; // Ensure this path is correct
import "../config";
import { API_URLS } from '../config';
import axios from 'axios';

const AdjustInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageRange, setPageRange] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  // Fetch Inventory Data
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const { data: result } = await axios.get(API_URLS.getAllWarehouses);
        if (result.success) {
          setInventoryData(result.data);
        } else {
          setError('Failed to fetch inventory data.');
        }
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError('Error occurred while fetching inventory data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Columns definition
  const columns = useMemo(
    () => [
      { Header: 'SKU ID', accessor: 'skuId' },
      { Header: 'Warehouse ID', accessor: 'warehouseId' },
      { Header: 'Available Quantity', accessor: 'availableQuantity' },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <Button
            variant="success"
            onClick={() => handleAddQuantity(row.original)}
            style={{
              height: '36px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            Add Quantity
          </Button>
        ),
      },
    ],
    []
  );

  // Filter data based on search term
  const filteredData = useMemo(
    () =>
      inventoryData.filter((item) =>
        item.warehouseId.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [inventoryData, searchTerm]
  );

  // Table setup using react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,

    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 11 }, // Show 11 rows per page
    },
    useSortBy,
    usePagination
  );

  // Update page numbers dynamically
  const handlePageChange = (action) => {
    if (action === 'next' && canNextPage) {
      nextPage();
      setPageRange((prevRange) =>
        prevRange.map((num) => num + 1)
      );
    } else if (action === 'previous' && canPreviousPage) {
      previousPage();
      // Ensure that the page numbers do not go below 1
      setPageRange((prevRange) => {
        const newRange = prevRange.map((num) => (num - 1 >= 1 ? num - 1 : num));
        return newRange[0] === 1 ? [1, 2, 3] : newRange;
      });
    }
  };

  // Handle modal
  const handleAddQuantity = (row) => {
    setSelectedRow(row);
    setQuantityToAdd('');
    setValidationMessage('');
    setShowModal(true);
  };

  const handleSaveQuantity = async () => {
    if (quantityToAdd <= 0) {
      setValidationMessage('Quantity must be greater than 0');
      return;
    }

    try {
      const { data: result } = await axios.put(API_URLS.updateSingleInventory, {
        sku: selectedRow.skuId,
        quantityToAdd: parseInt(quantityToAdd),
        warehouseId: selectedRow.warehouseId,
      });
      if (result.success) {
        setInventoryData((prevData) =>
          prevData.map((item) =>
            item.skuId === selectedRow.skuId
              ? { ...item, availableQuantity: item.availableQuantity + parseInt(quantityToAdd) }
              : item
          )
        );
        setShowModal(false);
        Swal.fire('Success', 'Quantity updated successfully!', 'success');
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      Swal.fire('Error', 'Failed to update inventory.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col md={4} className="custom-input-group">
          <InputGroup style={{ border: '0px solid #dedede', borderRadius: '9px 9px' }}>
            <FormControl
              placeholder="Search by Warehouse ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input"
            />
            <Button
              className="bg-secondary text-white btn btn-light"
              onClick={() => console.log('Search term:', searchTerm)}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table bordered hover className="inventory-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Updated Pagination Controls */}
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
            <li key={num} className={`page-item ${pageIndex + 1 === num ? 'active' : ''}`}>
              <button
                className={`page-link ${pageIndex + 1 === num ? 'active-page' : ''}`}
                onClick={() => gotoPage(num - 1)}
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

      {/* Quantity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Quantity</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              type="number"
              placeholder="Enter quantity to add"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(e.target.value)}
            />
          </InputGroup>
          {validationMessage && <Alert variant="danger">{validationMessage}</Alert>}
        </Modal.Body> */}
        <Modal.Body>
          <p>SKU ID: {selectedRow?.skuId}</p>
          <p>Warehouse ID: {selectedRow?.warehouseId}</p>
          <p>Available Quantity: {selectedRow?.availableQuantity}</p>
          <InputGroup className="mb-3">
            <FormControl
              type="number"
              placeholder="Enter quantity to add"
              value={quantityToAdd}
              onChange={(e) => {
                setQuantityToAdd(e.target.value);
                setValidationMessage(''); // Clear validation message on input change
              }}
            />
          </InputGroup>
          {validationMessage && (
            <Alert variant="danger">
              {validationMessage}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSaveQuantity}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdjustInventory;
