import React, { useState } from 'react';

export default function Profile({ user, onUpdateName, onLogout }) {
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === user.name) return;
    setSaving(true);
    try {
      await onUpdateName(name.trim());
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-joined">Member since {memberSince}</p>
      </div>

      <div className="profile-section">
        <h3>Change Name</h3>
        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !name.trim() || name.trim() === user.name}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      <div className="profile-section">
        <h3>Account Details</h3>
        <div className="profile-details">
          <div className="profile-detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Member since</span>
            <span className="detail-value">{memberSince}</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">User ID</span>
            <span className="detail-value detail-id">{user._id}</span>
          </div>
        </div>
      </div>

      <div className="profile-section profile-danger">
        <h3>Sign Out</h3>
        <p>You will be redirected to the login page.</p>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
