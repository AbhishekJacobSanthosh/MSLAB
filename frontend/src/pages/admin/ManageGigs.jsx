import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [students, setStudents] = useState({}); // Map userId -> full user object

    useEffect(() => {
        fetchGigsAndStudents();
    }, []);

    const fetchGigsAndStudents = async () => {
        try {
            const gigRes = await axios.get('http://localhost:8082/gigs');
            const userRes = await axios.get('http://localhost:8081/users');

            const userMap = {};
            userRes.data.forEach(u => userMap[u.id] = u); // Store full object
            setStudents(userMap);
            setGigs(gigRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleApprove = async (gigId, studentId) => {
        try {
            await axios.post(`http://localhost:8082/gigs/${gigId}/approve?studentId=${studentId}`);
            alert('Student Approved! Gig assigned.');
            fetchGigsAndStudents();
        } catch (error) {
            console.error(error);
            alert('Failed to approve');
        }
    };

    const handleReject = async (gigId, studentId) => {
        try {
            await axios.post(`http://localhost:8082/gigs/${gigId}/reject?studentId=${studentId}`);
            alert('Student Rejected.');
            fetchGigsAndStudents();
        } catch (error) {
            console.error(error);
            alert('Failed to reject');
        }
    };

    const handleComplete = async (gigId, studentId) => {
        try {
            await axios.post(`http://localhost:8082/gigs/${gigId}/complete?studentId=${studentId}`);
            alert('Gig Completed! Student Rewarded.');
            fetchGigsAndStudents();
        } catch (error) {
            console.error(error);
            alert('Failed to mark complete');
        }
    };

    const handleDelete = async (gigId) => {
        if (!window.confirm("Are you sure you want to delete this gig?")) return;
        try {
            await axios.delete(`http://localhost:8082/gigs/${gigId}`);
            setGigs(gigs.filter(g => g.id !== gigId));
            alert('Gig deleted successfully');
        } catch (error) {
            console.error("Error deleting gig", error);
            alert('Failed to delete gig');
        }
    };

    return (
        <div>
            <h1>Manage Gigs</h1>
            <div className="grid">
                {gigs.map(gig => (
                    <div key={gig.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>{gig.title}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className={`badge badge-${gig.status.toLowerCase()}`}>{gig.status}</span>
                                <button className="btn btn-sm" style={{ background: '#e74c3c' }} onClick={() => handleDelete(gig.id)}>🗑️</button>
                            </div>
                        </div>
                        <p>{gig.description}</p>

                        <div style={{ marginTop: '1rem' }}>
                            <h4>👨‍🎓 Applicants</h4>
                            {(!gig.applicantIds || gig.applicantIds.length === 0) && <p style={{ color: 'var(--text-muted)' }}>No pending applications.</p>}
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {gig.applicantIds && gig.applicantIds.map(sid => {
                                    const student = students[sid];
                                    return (
                                        <li key={sid} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 'bold' }}>{student?.name || `Student #${sid}`}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="btn btn-sm" style={{ background: '#2ecc71' }} onClick={() => handleApprove(gig.id, sid)}>✓</button>
                                                    <button className="btn btn-sm" style={{ background: '#e74c3c' }} onClick={() => handleReject(gig.id, sid)}>✕</button>
                                                </div>
                                            </div>
                                            {student && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                                    <p style={{ margin: 0 }}><strong>Bio:</strong> {student.bio || 'N/A'}</p>
                                                    <p style={{ margin: 0 }}><strong>Skills:</strong> {student.skills || 'N/A'}</p>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {gig.studentIds && gig.studentIds.length > 0 && (
                                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: '#2ecc71' }}>✅ Assigned</h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {gig.studentIds.map(sid => (
                                            <li key={sid} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                                <span>• {students[sid]?.name || `Student #${sid}`}</span>
                                                {(!gig.completedStudentIds || !gig.completedStudentIds.includes(sid)) ? (
                                                    <button className="btn btn-sm" style={{ background: '#f1c40f', color: '#000' }} onClick={() => handleComplete(gig.id, sid)}>Mark Complete 🏁</button>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>Done ✓</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageGigs;
