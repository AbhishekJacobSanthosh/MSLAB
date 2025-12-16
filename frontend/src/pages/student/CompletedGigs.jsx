import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompletedGigs = ({ user }) => {
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        fetchCompletedGigs();
    }, []);

    const fetchCompletedGigs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/gigs');
            // Filter where user is in completedStudentIds
            const myCompleted = response.data.filter(g =>
                g.completedStudentIds && g.completedStudentIds.includes(user.id)
            );
            setGigs(myCompleted);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    return (
        <div>
            <h1>🏆 My Completed Gigs</h1>
            {gigs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>You haven't completed any gigs yet. Keep hustling!</p>
            ) : (
                <div className="grid">
                    {gigs.map(gig => (
                        <div key={gig.id} className="card" style={{ borderColor: '#2ecc71', borderWidth: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3>{gig.title}</h3>
                                <span className="badge badge-assigned">COMPLETED</span>
                            </div>
                            <p>{gig.description}</p>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ color: '#2ecc71' }}>Earlier Reward: ${gig.reward}</strong>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Great Job! 🎉</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedGigs;
