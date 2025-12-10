import React, { useState } from 'react';
import axios from 'axios';

const StudentProfile = ({ user }) => {
    const [formData, setFormData] = useState({
        bio: user.bio || '',
        skills: user.skills || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assuming patch for partial update or put. Using User Service.
            await axios.patch(`http://localhost:8081/users/${user.id}`, formData);
            alert('Profile updated!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>My Profile</h1>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" value={user.name} disabled style={{ opacity: 0.7 }} />
                    </div>
                    <div className="input-group">
                        <label>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
                    </div>
                    <div className="input-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Java, React, SQL..." />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
