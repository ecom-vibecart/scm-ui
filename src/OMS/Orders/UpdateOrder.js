import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, cancelOrder } from '../ReduxToolkit/OrderSlice'; 
import { Container, Row, Col, Button, Table, InputGroup, FormControl } from 'react-bootstrap';

const OrderUpdate = () => {
  const dispatch = useDispatch();
  const { orderData, status, error } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [disabledOrders, setDisabledOrders] = useState([]);
  const [cancelAllDisabled, setCancelAllDisabled] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(orderData);
  }, [orderData]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = orderData.filter((item) =>
      item.orderId.toString().toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setFilteredData((prevData) =>
      prevData.map((item) => ({ ...item, selected: !selectAll }))
    );
  };

  const handleCheckboxChange = (orderId) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.orderId === orderId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCancelOrder = (orderId, orderStatus) => {
    if (orderStatus === 'CONFIRMED' || orderStatus === 'DISPATCHED') {
      dispatch(cancelOrder(orderId))
        .then(() => {
          setDisabledOrders((prev) => [...prev, orderId]); 
          alert('Order has been canceled successfully');
          dispatch(fetchOrders()); 
        })
        .catch((error) => console.error('Error canceling order:', error));
    } else {
      alert(`Unable to cancel order because it is already ${orderStatus.replace(/_/g, ' ').toLowerCase()}.`);
    }
  };

  const handleCancelAll = () => {
    const selectedOrders = filteredData.filter((item) => item.selected);
    if (selectedOrders.length > 0) {
      Promise.all(
        selectedOrders.map((item) => {
          if (item.orderStatus === 'CONFIRMED' || item.orderStatus === 'DISPATCHED') {
            return dispatch(cancelOrder(item.orderId))
              .then(() => item.orderId)
              .catch((error) => console.error('Error canceling order:', error));
          } else {
            alert(`Unable to cancel order ID ${item.orderId} because it is already ${item.orderStatus.replace(/_/g, ' ').toLowerCase()}.`);
            return Promise.reject();
          }
        })
      )
        .then((canceledOrderIds) => {
          setDisabledOrders((prev) => [...prev, ...canceledOrderIds]); 
          setCancelAllDisabled(true); 
          alert('Selected orders have been canceled successfully');
          dispatch(fetchOrders()); 
        })
        .catch(() => {
          alert('Error canceling some orders');
        });
    } else {
      alert('No orders selected for cancellation');
    }
  };

  if (status === 'loading') return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (status === 'failed') return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="alert alert-danger">{error || 'Failed to load orders.'}</div>
    </div>
  );

  return (
    <div className='content-section'>
      <Container fluid className="mt-4">
        <Row>
          <Col md={12}>
            <Row className="mb-4">
              <Col md={4}>
                <InputGroup style={{border:"0px solid #dedede", borderRadius:"9px 9px" }}>
                  <FormControl
                    placeholder="Search by Order ID"
                    aria-label="Search by Order ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Button className='bg-secondary text-white  btn btn-light '  onClick={() => console.log('Search term:', searchTerm)}>
                Search
              </Button>
                </InputGroup>
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label htmlFor="selectAll" className="ms-2">Select All</label>
                <Button
                  variant="outline-secondary"
                  className="ms-3"
                  onClick={handleCancelAll}
                  disabled={cancelAllDisabled}
                  style={{ backgroundColor: '#dd1e25', color: '#fff', border: 'none' }}
                >
                  Cancel ALL
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table bordered hover responsive className="w-100 data-table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Order ID</th>
                      <th>Order Total</th>
                      <th>Payment Method</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Pincode</th>
                      <th>Order Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.orderId}>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.selected || false}
                              onChange={() => handleCheckboxChange(item.orderId)}
                            />
                          </td>
                          <td>{item.orderId}</td>
                          <td>{item.totalPrice}</td>
                          <td>{item.paymentMethod}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.phone}</td>
                          <td>{item.address}</td>
                          <td>{item.city}</td>
                          <td>{item.state}</td>
                          <td>{item.pincode}</td>
                          <td>{item.orderStatus}</td>
                          <td>
                            <Button
                              variant='outline-danger' 
                              onClick={() => handleCancelOrder(item.orderId, item.orderStatus)}
                              disabled={disabledOrders.includes(item.orderId) || 
                                        item.orderStatus === 'CANCELLED' ||
                                        !(item.orderStatus === 'CONFIRMED' || item.orderStatus === 'DISPATCHED')}
                              style={{ backgroundColor: '#dd1e25', color: '#fff', border: 'none' }}
                            >
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="13" className="text-center">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderUpdate;
