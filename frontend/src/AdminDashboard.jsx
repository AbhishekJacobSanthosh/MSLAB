import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard({ user }) {
    const [gigs, setGigs] = useState([]);
    const [newGig, setNewGig] = useState({ title: '', description: '', reward: '', status: 'OPEN' });

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const response = await axios.get('/api/gigs');
            setGigs(response.data);
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/gigs', newGig);
            setNewGig({ title: '', description: '', reward: '', status: 'OPEN' });
            fetchGigs();
            alert('Gig posted successfully!');
        } catch (error) {
            console.error('Error creating gig:', error);
        }
    };

    const handlePay = async (gig) => {
        try {
            await axios.post('/api/payments', {
                userId: 1,
                gigId: gig.id,
                amount: gig.reward
            });
            await axios.put(`/api/gigs/${gig.id}`, { ...gig, status: 'COMPLETED' });
            alert('Payment processed and gig marked completed!');
            fetchGigs();
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Professor Dashboard</h1>
            </div>

            <div className="card">
                <h3>Post a New Gig</h3>
                <form onSubmit={handleCreate}>
                    <div className="input-group">
                        <label>Title</label>
                        <input
                            value={newGig.title}
                            onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            value={newGig.description}
                            onChange={(e) => setNewGig({ ...newGig, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Reward ($)</label>
                        <input
                            type="number"
                            value={newGig.reward}
                            onChange={(e) => setNewGig({ ...newGig, reward: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Post Gig</button>
                </form>
            </div>

            <h2>Manage Gigs</h2>
            <div className="grid">
                {gigs.map(gig => (
                    <div key={gig.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3>{gig.title}</h3>
                            <span className={`badge badge-${gig.status.toLowerCase()}`}>{gig.status}</span>
                        </div>
                        <p>{gig.description}</p>
                        <p><strong>Reward:</strong> ${gig.reward}</p>
                        {gig.status === 'ASSIGNED' && (
                            <button className="btn btn-primary" onClick={() => handlePay(gig)}>
                                Approve & Pay (User 1)
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
