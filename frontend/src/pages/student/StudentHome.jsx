import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentHome = () => {
    const [pointsLeaderboard, setPointsLeaderboard] = useState([]);
    const [gigsLeaderboard, setGigsLeaderboard] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = sessionStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;

                if (user && user.id) {
                    const earningsRes = await axios.get(`http://localhost:8080/api/payments/user/${user.id}/earnings`);
                    setTotalEarnings(earningsRes.data);
                }

                const pointsRes = await axios.get('http://localhost:8080/api/users/leaderboard/points');
                setPointsLeaderboard(pointsRes.data);
                const gigsRes = await axios.get('http://localhost:8080/api/users/leaderboard/gigs');
                setGigsLeaderboard(gigsRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)' }}>
                <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>💰 Total Earnings</h2>
                <h1 style={{ color: 'white', fontSize: '3rem', margin: 0 }}>${totalEarnings}</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>from completed gigs</p>
            </div>

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
