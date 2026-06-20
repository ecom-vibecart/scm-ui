import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../ReduxToolkit/OrderSlice';
import axios from 'axios';
import { Container, Row, Col, Table, InputGroup, FormControl, Button, Modal } from 'react-bootstrap';
import "./orderconsole.css"
import { API_URLS } from "../config"

const OrderConsole = () => {
  const dispatch = useDispatch();
  const { orderData, status, error } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    // Filter data based on search term
    const filtered = orderData.filter((item) =>
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [orderData, searchTerm]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleShowDetails = async (orderId) => {
    setSelectedOrder(null);
    setShowModal(true);
    setModalLoading(true);
    try {
      const response = await axios.get(API_URLS.getOrderById(orderId));
      setSelectedOrder(response.data.data);
    } catch {
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Order Details</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.querySelector('.modal-body').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
        <Row className="mb-4">
          <Col md={4} className="custom-input-group">
            <InputGroup style={{ border: "0px solid #dedede", borderRadius: "9px 9px" }}>
              <FormControl
                placeholder="Search by Order ID"
                aria-label="Search by Order ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="custom-input"
              />
              <Button className='bg-secondary text-white  btn btn-light ' onClick={() => console.log('Search term:', searchTerm)}>
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Table bordered hover responsive className="w-100 data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.orderId} onClick={() => handleShowDetails(item.orderId)} style={{ cursor: 'pointer' }}>
                      <td className="text-primary">{item.orderId}</td>
                      <td>${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">No orders found</td>
                  </tr>
                )}
              </tbody>
            </Table>

          </Col>
        </Row>
      </Container>

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-dark">
            {selectedOrder ? `Order Details - ${selectedOrder.orderId}` : 'Order Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {modalLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : selectedOrder ? (
            <Container>
              {/* Order and Customer Information */}
              <Row className="mb-3">
                {/* Order Information */}
                <Col md={4}>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Order Information
                  </h5>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Ordered Items:</strong> {selectedOrder.orderItems ? selectedOrder.orderItems.length : 0}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Ordered Quantity:</strong> {selectedOrder.totalQuantity}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Delivery Date:</strong> {new Date(selectedOrder.estimated_delivery_date).toLocaleDateString()}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                </Col>
                {/* Customer Information */}
                <Col md={4}>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Customer Information
                  </h5>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Name:</strong> {selectedOrder.customer.customerName}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Phone Number:</strong> {selectedOrder.customer.phoneNumber}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipcode}</p>
                </Col>
                {/* Payment Information */}
                <Col md={4}>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Payment Information
                  </h5>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Sub Amount:</strong> ${selectedOrder.subTotal.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Offer ID:</strong> {selectedOrder.offerId}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Discount Price:</strong> ${selectedOrder.discountPrice.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                </Col>
              </Row>

              {/* Shipping, Billing, and Payment Information */}
              <Row className="mb-3">
                {/* Shipping Address */}
                <Col md={4}>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Shipping Address
                  </h5>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Name:</strong> {selectedOrder.shippingAddress.name}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedOrder.shippingAddress.email}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNumber}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipcode}</p>
                </Col>
                {/* Billing Address */}
                <Col md={4}>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Billing Address
                  </h5>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Name:</strong> {selectedOrder.billingAddress.name}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Email:</strong> {selectedOrder.billingAddress.email}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Phone:</strong> {selectedOrder.billingAddress.phoneNumber}</p>
                  <p style={{ fontSize: '14px', marginBottom: '0.5rem' }}><strong>Address:</strong> {selectedOrder.billingAddress.address}, {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state}, {selectedOrder.billingAddress.zipcode}</p>
                </Col>
              </Row>

              {/* Order Items Table */}
              <Row className="mb-3">
                <Col>
                  <h5 className="font-weight-bold" style={{ textAlign: 'left', fontSize: '14px', color: '#dd1e25', marginBottom: '1rem' }}>
                    Ordered Items
                  </h5>
                  <Table bordered hover size="sm" className="text-center" style={{ marginBottom: '1rem', width: '100%', tableLayout: 'auto' }}>
                    <thead className="bg-light">
                      <tr>
                        <th>SKU ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '14px' }}>
                      {selectedOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.skuId}</td>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0">
          <Button variant="dark" onClick={handleCloseModal} style={{ padding: '0.5rem 1rem' }}>
            Close
          </Button>
          {selectedOrder && <Button variant="primary" onClick={handlePrint}>Print</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderConsole;
