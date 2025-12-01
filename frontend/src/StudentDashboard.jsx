import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard({ user }) {
    const [gigs, setGigs] = useState([]);
    const [wallet, setWallet] = useState([]);

    useEffect(() => {
        fetchGigs();
        fetchWallet();
    }, []);

    const fetchGigs = async () => {
        try {
            const response = await axios.get('/api/gigs');
            setGigs(response.data);
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    const fetchWallet = async () => {
        try {
            const response = await axios.get(`/api/payments/user/${user.id}`);
            setWallet(response.data);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        }
    };

    const handleApply = async (gigId) => {
        try {
            const gig = gigs.find(g => g.id === gigId);
            await axios.put(`/api/gigs/${gigId}`, { ...gig, status: 'ASSIGNED' });
            alert('Applied successfully!');
            fetchGigs();
        } catch (error) {
            console.error('Error applying:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Student Dashboard</h1>
                <div className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                    <h3>Wallet Balance: ${wallet.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</h3>
                </div>
            </div>

            <h2>Available Micro-Internships</h2>
            <div className="grid">
                {gigs.map(gig => (
                    <div key={gig.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3>{gig.title}</h3>
                            <span className={`badge badge-${gig.status.toLowerCase()}`}>{gig.status}</span>
                        </div>
                        <p>{gig.description}</p>
                        <p><strong>Reward:</strong> ${gig.reward}</p>
                        {gig.status === 'OPEN' && (
                            <button className="btn btn-primary" onClick={() => handleApply(gig.id)}>
                                Apply Now
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentDashboard;
