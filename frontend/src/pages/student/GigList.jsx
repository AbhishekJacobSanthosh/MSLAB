import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GigList = ({ user }) => {
    const [gigs, setGigs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        fetchGigs();
        if (user) {
            fetchMyApplications();
        }
    }, [user]);

    const fetchGigs = async () => {
        try {
            // Use Gateway path
            const response = await axios.get('/api/gigs');
            setGigs(response.data.filter(g => g.status !== 'COMPLETED'));
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    const fetchMyApplications = async () => {
        try {
            // Fetch applications from Application Service via Gateway
            const response = await axios.get(`/api/applications/student/${user.id}`);
            setMyApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleApply = async (gigId) => {
        try {
            // Post to Application Service via Gateway
            await axios.post('/api/applications', {
                gigId: gigId,
                studentId: user.id
            });
            alert('Applied successfully!');
            fetchMyApplications(); // Refresh applications list to update UI
        } catch (error) {
            console.error('Error applying:', error);
            alert('Failed to apply: ' + (error.response?.data?.message || error.message));
        }
    };

    // Helper to check status
    const getApplicationStatus = (gigId) => {
        const app = myApplications.find(a => a.gigId === gigId);
        return app ? app.status : null;
    };

    return (
        <div>
            <h1>Available Gigs</h1>
            <div className="grid">
                {gigs.map(gig => {
                    const status = getApplicationStatus(gig.id);
                    const isAssignedToMe = gig.studentIds && gig.studentIds.includes(user.id);
                    // We can also check rejectedIds if the gig service still populates them, 
                    // or rely on application status 'REJECTED'
                    const isRejected = status === 'REJECTED';

                    return (
                        <div key={gig.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3>{gig.title}</h3>
                                <span className={`badge badge-${status ? status.toLowerCase() : (gig.status ? gig.status.toLowerCase() : 'open')}`}>
                                    {status ? `You: ${status}` : (gig.status || 'OPEN')}
                                </span>
                            </div>
                            <p>{gig.description}</p>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: 'var(--secondary)' }}>💰 ${gig.reward}</strong>

                                {status === 'PENDING' ? (
                                    <button className="btn btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Applied ⏳</button>
                                ) : isAssignedToMe || status === 'APPROVED' ? (
                                    <button className="btn btn-sm" disabled style={{ background: '#2ecc71', cursor: 'default' }}>Assigned ✅</button>
                                ) : isRejected ? (
                                    <button className="btn btn-sm" disabled style={{ background: '#e74c3c', cursor: 'not-allowed' }}>Rejected ❌</button>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleApply(gig.id)}
                                        disabled={gig.status !== 'OPEN'}
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GigList;
