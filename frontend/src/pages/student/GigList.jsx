import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GigList = ({ user }) => {
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const response = await axios.get('http://localhost:8082/gigs');
            setGigs(response.data.filter(g => g.status !== 'COMPLETED'));
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    const handleApply = async (gigId) => {
        try {
            await axios.post(`http://localhost:8082/gigs/${gigId}/apply?studentId=${user.id}`);
            alert('Applied successfully!');
            fetchGigs(); // Refresh to potentially show "Applied" status if we were tracking it in UI more granularly
        } catch (error) {
            console.error('Error applying:', error);
            alert('Failed to apply.');
        }
    };

    return (
        <div>
            <h1>Available Gigs</h1>
            <div className="grid">
                {gigs.map(gig => (
                    <div key={gig.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3>{gig.title}</h3>
                            <span className={`badge badge-${gig.status ? gig.status.toLowerCase() : 'open'}`}>{gig.status || 'OPEN'}</span>
                        </div>
                        <p>{gig.description}</p>
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--secondary)' }}>💰 ${gig.reward}</strong>
                            {gig.applicantIds && gig.applicantIds.includes(user.id) ? (
                                <button className="btn btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Applied ⏳</button>
                            ) : gig.studentIds && gig.studentIds.includes(user.id) ? (
                                <button className="btn btn-sm" disabled style={{ background: '#2ecc71', cursor: 'default' }}>Assigned ✅</button>
                            ) : gig.rejectedIds && gig.rejectedIds.includes(user.id) ? (
                                <button className="btn btn-sm" disabled style={{ background: '#e74c3c', cursor: 'not-allowed' }}>Rejected ❌</button>
                            ) : (
                                <button className="btn btn-primary btn-sm" onClick={() => handleApply(gig.id)} disabled={gig.status !== 'OPEN'}>Apply Now</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GigList;
