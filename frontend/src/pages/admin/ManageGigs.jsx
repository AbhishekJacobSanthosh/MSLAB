import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageGigs = () => {
    const [gigs, setGigs] = useState([]);
    const [students, setStudents] = useState({});
    const [applications, setApplications] = useState({}); // Map gigId -> List<Application>

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Use Gateway
            const gigRes = await axios.get('/api/gigs');
            const userRes = await axios.get('/api/users');

            const userMap = {};
            userRes.data.forEach(u => userMap[u.id] = u);
            setStudents(userMap);
            setGigs(gigRes.data);

            // Fetch applications for all gigs
            gigRes.data.forEach(gig => fetchApplications(gig.id));
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const fetchApplications = async (gigId) => {
        try {
            const res = await axios.get(`/api/applications/gig/${gigId}`);
            setApplications(prev => ({ ...prev, [gigId]: res.data }));
        } catch (error) {
            console.error(`Error fetching applications for gig ${gigId}`, error);
        }
    };

    const handleApprove = async (applicationId) => {
        try {
            await axios.put(`/api/applications/${applicationId}/approve`);
            alert('Application Approved!');
            fetchData(); // Refresh all data
        } catch (error) {
            console.error(error);
            alert('Failed to approve');
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await axios.put(`/api/applications/${applicationId}/reject`);
            alert('Application Rejected.');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to reject');
        }
    };

    const handleComplete = async (gigId, studentId) => {
        try {
            // This still goes to Gig Service, but via Gateway
            // Note: Application Service sends points. Gig Service has 'complete' endpoint.
            await axios.post(`/api/gigs/${gigId}/complete?studentId=${studentId}`);
            alert('Gig Completed! Student Rewarded.');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to mark complete');
        }
    };

    const handleDelete = async (gigId) => {
        if (!window.confirm("Are you sure you want to delete this gig?")) return;
        try {
            await axios.delete(`/api/gigs/${gigId}`);
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
                            {/* Check applications map for this gig */}
                            {(!applications[gig.id] || applications[gig.id].filter(a => a.status === 'PENDING').length === 0) && (
                                <p style={{ color: 'var(--text-muted)' }}>No pending applications.</p>
                            )}

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {applications[gig.id] && applications[gig.id]
                                    .filter(app => app.status === 'PENDING') // Only show pending here
                                    .map(app => {
                                        const student = students[app.studentId];
                                        return (
                                            <li key={app.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', margin: '0.5rem 0', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{student?.name || `Student #${app.studentId}`}</span>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn btn-sm" style={{ background: '#2ecc71' }} onClick={() => handleApprove(app.id)}>✓</button>
                                                        <button className="btn btn-sm" style={{ background: '#e74c3c' }} onClick={() => handleReject(app.id)}>✕</button>
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
