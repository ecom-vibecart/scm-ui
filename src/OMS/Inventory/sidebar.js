import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../ReduxToolkit/AuthSlice';
import './Styling/sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const [showInventoryLinks, setShowInventoryLinks] = useState(false);
    const [showOrderLinks, setShowOrderLinks] = useState(false);
    const [activeButton, setActiveButton] = useState('');
   
    
    const toggleInventoryLinks = () => {
        setShowInventoryLinks(prev => !prev);
    };

    const toggleOrderLinks = () => {
        setShowOrderLinks(prev => !prev);
    };

    const handleButtonClick = (path) => {
        setActiveButton(path);
        navigate(path);
    };

    return (
        <div className='sidebar'>
            <div className="sidebar">
                <button
                    className={`sidebar-btn ${activeButton === '/dashboard' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('/dashboard')}
                >
                    Dashboard
                </button>
                <div className="mb-2">
                    <button
                        className={`sidebar-btn d-flex justify-content-between align-items-center ${showInventoryLinks ? 'active' : ''}`}
                        onClick={toggleInventoryLinks}
                    >
                        <span>Inventory</span> {showInventoryLinks ? <FaMinus /> : <FaPlus />}
                    </button>
                    {showInventoryLinks && (
                        <div className="sub-menu">
                            <button
                                className={`sidebar-btn ${activeButton === '/inventoryConsole' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('/inventoryConsole')}
                            >
                                Inventory Console
                            </button>
                            {isAdmin() && (
                            <button
                                className={`sidebar-btn ${activeButton === '/adjustInventory' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('/adjustInventory')}
                            >
                                Adjust Inventory
                            </button>
                            )}
                            <button
                                className={`sidebar-btn ${activeButton === '/inventoryLocation' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('/inventoryLocation')}
                            >
                                Inventory Location
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <button
                        className={`sidebar-btn d-flex justify-content-between align-items-center ${showOrderLinks ? 'active' : ''}`}
                        onClick={toggleOrderLinks}
                    >
                        <span>Orders</span> {showOrderLinks ? <FaMinus /> : <FaPlus />}
                    </button>
                    {showOrderLinks && (
                        <div className='sub-menu'>
                            <button
                                className={`sidebar-btn ${activeButton === '/orderConsole' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('/orderConsole')}
                            >
                                Order Console
                            </button>
                            {isAdmin() && (
                            <button
                                className={`sidebar-btn ${activeButton === '/updateOrder' ? 'active' : ''}`}
                                onClick={() => handleButtonClick('/updateOrder')}
                            >
                                Cancel Order
                            </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
