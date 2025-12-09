import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                const userData = { name: name || email.split('@')[0], email, role, password };
                const response = await axios.post('/api/users', userData);
                alert('Registration successful! Please login.');
                setIsRegistering(false);
            } else {
                const response = await axios.post('/api/users/login', { email, password });
                onLogin(response.data);
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            const msg = error.response?.status === 401
                ? 'Invalid email or password'
                : (error.response?.data?.message || error.message);
            alert(`Authentication failed: ${msg}`);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
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
                    )}
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
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    {isRegistering && (
                        <div className="input-group">
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="STUDENT">Student</option>
                                <option value="ADMIN">Professor (Admin)</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
