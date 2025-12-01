import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app">
        {user && (
          <nav className="navbar">
            <a href="/" className="nav-brand">UniGIG</a>
            <div className="nav-links">
              <span>Welcome, {user.name} ({user.role})</span>
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          </nav>
        )}
        <Routes>
          <Route path="/" element={
            user ? (
              user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/student" />
            ) : (
              <Login onLogin={setUser} />
            )
          } />
          <Route path="/student" element={user && user.role === 'STUDENT' ? <StudentDashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.role === 'ADMIN' ? <AdminDashboard user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
