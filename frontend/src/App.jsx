import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import StudentHome from './pages/student/StudentHome';
import GigList from './pages/student/GigList';
import CompletedGigs from './pages/student/CompletedGigs';
import StudentProfile from './pages/student/StudentProfile';
import AdminHome from './pages/admin/AdminHome';
import PostGig from './pages/admin/PostGig';
import ManageGigs from './pages/admin/ManageGigs';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <Navbar role={user.role} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            {user.role === 'STUDENT' ? (
              <>
                <Route path="/student/home" element={<StudentHome />} />
                <Route path="/student/gigs" element={<GigList user={user} />} />
                <Route path="/student/history" element={<CompletedGigs user={user} />} />
                <Route path="/student/profile" element={<StudentProfile user={user} />} />
                <Route path="*" element={<Navigate to="/student/home" />} />
              </>
            ) : (
              <>
                <Route path="/admin/home" element={<AdminHome />} />
                <Route path="/admin/post-gig" element={<PostGig />} />
                <Route path="/admin/manage-gigs" element={<ManageGigs />} />
                <Route path="*" element={<Navigate to="/admin/home" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
