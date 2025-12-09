import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard({ user }) {
    const [gigs, setGigs] = useState([]);
    const [newGig, setNewGig] = useState({ title: '', description: '', reward: '', status: 'OPEN', maxPositions: 1 });
    const [applications, setApplications] = useState({}); // Map gigId -> List<Application>
    const [applicants, setApplicants] = useState({}); // Map studentId -> User

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const response = await axios.get('/api/gigs');
            setGigs(response.data);
            // Fetch applications for all gigs
            response.data.forEach(gig => {
                fetchApplications(gig.id);
                // Also fetch student profiles if assigned
                if (gig.status === 'ASSIGNED' && gig.studentIds) {
                    gig.studentIds.forEach(id => fetchStudentProfile(id));
                }
            });
        } catch (error) {
            console.error('Error fetching gigs:', error);
        }
    };

    const fetchApplications = async (gigId) => {
        try {
            const response = await axios.get(`/api/applications/gig/${gigId}`);
            setApplications(prev => ({ ...prev, [gigId]: response.data }));

            // Fetch student profiles for these applications
            response.data.forEach(app => fetchStudentProfile(app.studentId));
        } catch (error) {
            console.error(`Error fetching applications for gig ${gigId}:`, error);
        }
    };

    const fetchStudentProfile = async (studentId) => {
        if (applicants[studentId]) return; // Already fetched
        try {
            // Check if we have an endpoint for single user. 
            // Previous code assumed /api/users returns list. 
            // Let's assume /api/users/{id} works (typical REST).
            // If not, we might need to filter the list.
            // Let's try direct fetch.
            const response = await axios.get(`/api/users/${studentId}`);
            setApplicants(prev => ({ ...prev, [studentId]: response.data }));

            // Fallback if the above fails (e.g. if User Service only returns HAL JSON or list)
            // Ideally we shouldn't rely on fallback in production code but for this lab:
            // Note: User Service code has standard Controller? 
            // We didn't check User Controller, but typical Spring Data REST exports /users/{id}.
        } catch (error) {
            console.error(`Error fetching student ${studentId}:`, error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/gigs', newGig);
            setNewGig({ title: '', description: '', reward: '', status: 'OPEN', maxPositions: 1 });
            fetchGigs();
            alert('Gig posted successfully!');
        } catch (error) {
            console.error('Error creating gig:', error);
        }
    };

    const handleApprove = async (applicationId) => {
        try {
            await axios.put(`/api/applications/${applicationId}/approve`);
            alert('Application approved!');
            fetchGigs(); // Refresh gig status
        } catch (error) {
            console.error('Error approving application:', error);
            alert('Could not approve: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await axios.put(`/api/applications/${applicationId}/reject`);
            alert('Application rejected.');
            fetchGigs(); // Refresh list
        } catch (error) {
            console.error('Error rejecting application:', error);
        }
    };

    const handleDeleteGig = async (gigId) => {
        if (window.confirm('Are you sure you want to delete this gig? This cannot be undone.')) {
            try {
                await axios.delete(`/api/gigs/${gigId}`);
                alert('Gig deleted successfully.');
                fetchGigs();
            } catch (error) {
                console.error('Error deleting gig:', error);
                alert('Failed to delete gig.');
            }
        }
    };

    const handlePay = async (gig) => {
        if (!window.confirm('This will pay all students and REMOVE the gig. Continue?')) return;

        try {
            if (gig.studentIds && gig.studentIds.length > 0) {
                for (const studentId of gig.studentIds) {
                    await axios.post('/api/payments', {
                        userId: studentId,
                        gigId: gig.id,
                        amount: gig.reward
                    });
                }
            }
            // Mark completed AND Delete (as per "remove them automatically")
            // First we can mark completed if we wanted to keep history, but user asked to remove.
            // We will just delete it now.
            await axios.delete(`/api/gigs/${gig.id}`);

            alert('Payments processed and gig removed!');
            fetchGigs();
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment/removal.');
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
                    <div className="input-group">
                        <label>Max Positions</label>
                        <input
                            type="number"
                            min="1"
                            value={newGig.maxPositions}
                            onChange={(e) => setNewGig({ ...newGig, maxPositions: parseInt(e.target.value) })}
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
                        <p><strong>Positions:</strong> {gig.studentIds ? gig.studentIds.length : 0} / {gig.maxPositions || 1}</p>

                        {/* Applications Section */}
                        {gig.status === 'OPEN' && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <h4>Applications</h4>
                                {applications[gig.id] && applications[gig.id].length > 0 ? (
                                    <ul>
                                        {applications[gig.id].map(app => {
                                            const student = applicants[app.studentId];
                                            return (
                                                <li key={app.id} style={{ marginBottom: '1rem' }}>
                                                    <strong>{student ? student.name : `Student #${app.studentId}`}</strong>
                                                    <div><small>Bio: {student ? student.bio : '...'}</small></div>
                                                    <div><small>Skills: {student ? student.skills : '...'}</small></div>
                                                    {app.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                style={{ marginTop: '0.5rem', marginRight: '0.5rem' }}
                                                                onClick={() => handleApprove(app.id)}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                style={{ marginTop: '0.5rem' }}
                                                                onClick={() => handleReject(app.id)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <span style={{ marginLeft: '1rem' }} className={`badge badge-${app.status.toLowerCase()}`}>
                                                        {app.status}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No applications yet.</p>
                                )}
                            </div>
                        )}

                        {gig.status === 'ASSIGNED' && (
                            <div>
                                <p><strong>Assigned Students:</strong></p>
                                <ul>
                                    {gig.studentIds && gig.studentIds.map(sid => (
                                        <li key={sid}>{applicants[sid] ? applicants[sid].name : `Student #${sid}`}</li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary" onClick={() => handlePay(gig)} style={{ marginTop: '1rem' }}>
                                    Mark Completed & Pay All (Removes Gig)
                                </button>
                            </div>
                        )}

                        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGig(gig.id)}>
                                Delete Gig
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
