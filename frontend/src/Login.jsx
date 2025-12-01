import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if user exists
            const usersResponse = await axios.get('/api/users');
            const existingUser = usersResponse.data.find(u => u.email === email);

            if (existingUser) {
                onLogin(existingUser);
            } else {
                const userData = { name: name || email.split('@')[0], email, role };
                const response = await axios.post('/api/users', userData);
                onLogin(response.data);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(`Login failed: ${error.message}\nDetails: ${error.response ? JSON.stringify(error.response.data) : 'No response from server'}`);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>UniGIG Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="student@college.edu"
                        />
                    </div>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="STUDENT">Student</option>
                            <option value="ADMIN">Professor (Admin)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        {isRegistering ? 'Register' : 'Login / Start'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
