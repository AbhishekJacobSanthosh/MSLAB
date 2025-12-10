import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostGig = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reward: '',
        maxPositions: 1
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8082/gigs', {
                ...formData,
                reward: parseFloat(formData.reward),
                maxPositions: parseInt(formData.maxPositions),
                status: 'OPEN'
            });
            alert('Gig Posted!');
            navigate('/admin/home'); // Go back to home
        } catch (error) {
            console.error('Error posting gig:', error);
            alert('Failed to post gig: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>Post New Gig</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Reward ($)</label>
                        <input type="number" name="reward" value={formData.reward} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Max Positions</label>
                        <input type="number" name="maxPositions" value={formData.maxPositions} onChange={handleChange} required min="1" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>🚀 Post Gig</button>
                </form>
            </div>
        </div>
    );
};

export default PostGig;
