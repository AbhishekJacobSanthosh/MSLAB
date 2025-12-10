import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
    const activeStyle = ({ isActive }) => ({
        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
        borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
        paddingBottom: '0.2rem',
        textDecoration: 'none',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.3s ease'
    });

    return (
        <nav className="navbar">
            <div className="nav-brand">UniGIG</div>
            <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {role === 'STUDENT' && (
                    <>
                        <NavLink to="/student/home" style={activeStyle}>Home</NavLink>
                        <NavLink to="/student/gigs" style={activeStyle}>Gigs</NavLink>
                        <NavLink to="/student/history" style={activeStyle}>My History</NavLink>
                        <NavLink to="/student/profile" style={activeStyle}>Profile</NavLink>
                    </>
                )}
                {role === 'ADMIN' && (
                    <>
                        <NavLink to="/admin/home" style={activeStyle}>Home</NavLink>
                        <NavLink to="/admin/post-gig" style={activeStyle}>Post Gig</NavLink>
                        <NavLink to="/admin/manage-gigs" style={activeStyle}>Manage Gigs</NavLink>
                    </>
                )}
                <button className="btn btn-sm" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
