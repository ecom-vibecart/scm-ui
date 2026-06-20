import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Button, FormControl, InputGroup, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {API_URLS} from '../config';
import './Styling/inv_console.css'; // Ensure this path is correct

const InventoryConsole = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageRange, setPageRange] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URLS.getAllInventories);
        const result = response.data;
        if (result.success) {
          setData(result.data.map(item => ({
            skuId: item.skuId,
            availableQty: item.availableQuantity,
            reservedQty: item.reservedQuantity,
            totalQty: item.totalQuantity,
          })));
        } else {
          setError('Failed to fetch inventory data.');
        }
      } catch {
        setError('Failed to load inventory data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Columns definition
  const columns = useMemo(
    () => [
      { Header: 'SKU ID', accessor: 'skuId' },
      { Header: 'Available Quantity', accessor: 'availableQty' },
      { Header: 'Reserved Quantity', accessor: 'reservedQty' },
      { Header: 'Total Quantity', accessor: 'totalQty' },
    ],
    []
  );

  // Filter data based on search term
  const filteredData = useMemo(
    () =>
      data.filter(item =>
        item.skuId.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <div fluid className="mt-3" style={{ marginBottom: '150px' }}>
      <Row className="mb-4">
        <Col md={4} className="custom-input-group">
          <InputGroup style={{ border: "0px solid #dedede", borderRadius: "9px 9px" }}>
            <FormControl
              placeholder="Search by SKU ID"
              aria-label="Search by SKU ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input"
            />
            <Button className='bg-secondary text-white btn btn-light' onClick={() => console.log('Search term:', searchTerm)}>
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <table {...getTableProps()} className="table table-bordered table-hover">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
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
      </table>

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
    </div>
  );
};

export default InventoryConsole;
