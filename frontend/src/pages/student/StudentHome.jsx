import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentHome = () => {
    const [pointsLeaderboard, setPointsLeaderboard] = useState([]);
    const [gigsLeaderboard, setGigsLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboards = async () => {
            try {
                const pointsRes = await axios.get('http://localhost:8081/users/leaderboard/points');
                setPointsLeaderboard(pointsRes.data);
                const gigsRes = await axios.get('http://localhost:8081/users/leaderboard/gigs');
                setGigsLeaderboard(gigsRes.data);
            } catch (error) {
                console.error("Error fetching leaderboards", error);
            }
        };
        fetchLeaderboards();
    }, []);

    return (
        <div>
            <h1>Leaderboards</h1>
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
        </div>
    );
};

export default StudentHome;
