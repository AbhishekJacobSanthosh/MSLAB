import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
    const [pointsLeaderboard, setPointsLeaderboard] = useState([]);
    const [gigsLeaderboard, setGigsLeaderboard] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pointsRes, gigsRes, allRes] = await Promise.all([
                    axios.get('http://localhost:8081/users/leaderboard/points'),
                    axios.get('http://localhost:8081/users/leaderboard/gigs'),
                    axios.get('http://localhost:8081/users')
                ]);
                setPointsLeaderboard(pointsRes.data);
                setGigsLeaderboard(gigsRes.data);
                // Filter only students for the search list
                setAllStudents(allRes.data.filter(u => u.role === 'STUDENT'));
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const filteredStudents = allStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="grid">
                <div className="card">
                    <h2>🏆 Top Earners (Points)</h2>
                    <ul>
                        {pointsLeaderboard.map((u, idx) => (
                            <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>
                                <span>{idx + 1}. {u.name}</span>
                                <span className="badge badge-assigned">{u.points || 0} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card">
                    <h2>🚀 Top Hustlers (Gigs)</h2>
                    <ul>
                        {gigsLeaderboard.map((u, idx) => (
                            <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--card-border)' }}>
                                <span>{idx + 1}. {u.name}</span>
                                <span className="badge badge-completed">{u.gigsCompleted || 0} gigs</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2>🔍 Student Directory</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '400px' }}
                    />
                </div>
                <div className="card">
                    {filteredStudents.length > 0 ? (
                        <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredStudents.map(u => (
                                <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--card-border)' }}>
                                    <div>
                                        <strong style={{ fontSize: '1.1rem' }}>{u.name}</strong>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <span className="badge badge-assigned">{u.points} pts</span>
                                        <span className="badge badge-completed">{u.gigsCompleted} gigs</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No students found matching "{searchTerm}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
