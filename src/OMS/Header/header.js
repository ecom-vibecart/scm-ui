import React, { useState, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';

const Header = ({ onLogout, isLoggedIn, isLoginPage }) => {
    const [username, setUsername] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        
        const storedUsername = sessionStorage.getItem('email');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            setUsername(''); 
        }
    }, [isLoggedIn]); 

    const handleLogout = () => {
        sessionStorage.removeItem('email'); 
        sessionStorage.removeItem('token');
        onLogout();
    };

    return (
        <header className="header-container">
            <div className="header-title">
                <span className='bold'>VIBE</span><span>CART</span>
            </div>

            <div className="header-subtitle">
                <h5>Order Management System</h5>
            </div>

            <div className="header-actions">
                {isLoggedIn && (
                    <div
                        className="user-info"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <FaRegUserCircle className="user-icon" size={26} color='#dd1e25'/>
                        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                            <div className="dropdown-header">Account</div>
                            <span className="dropdown-item">{username || 'User'}</span>
                            <button className="dropdown-item" onClick={handleLogout}>Sign out</button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
