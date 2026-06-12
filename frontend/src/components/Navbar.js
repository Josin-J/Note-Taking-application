import React from 'react';

export default function Navbar({ page, onPageChange, user, onLogout, onNewNote }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">{'\uD83D\uDCDD'}</span>
        <span className="navbar-title">Note Taking App</span>
      </div>

      <div className="navbar-center">
        <button
          className={`navbar-link ${page === 'notes' ? 'active' : ''}`}
          onClick={() => onPageChange('notes')}
        >
          My Notes
        </button>
        <button
          className={`navbar-link ${page === 'profile' ? 'active' : ''}`}
          onClick={() => onPageChange('profile')}
        >
          Profile
        </button>
      </div>

      <div className="navbar-right">
        <button className="btn btn-primary btn-new-note" onClick={onNewNote}>
          + New Note
        </button>
        <span className="navbar-user-name">{user.name}</span>
        <button className="btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
