import React from 'react';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export default function NoteList({ notes, selectedCategory, categories, onEdit, onDelete }) {
  if (notes.length === 0) {
    const catName = selectedCategory
      ? categories.find((c) => c._id === selectedCategory)?.name
      : null;
    return (
      <div className="empty">
        <div className="empty-icon">📝</div>
        <p>{catName ? `No notes in "${catName}"` : 'No notes yet'}</p>
        <span>Create one above</span>
      </div>
    );
  }

  return (
    <div className="note-list">
      <div className="note-list-header">
        <h3>Notes ({notes.length})</h3>
      </div>
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <div className="note-card-top">
            <h4>{note.title}</h4>
            <span className={`note-cat ${note.category ? '' : 'uncategorized'}`}>
              {note.category?.name || 'Uncategorized'}
            </span>
          </div>
          <p className="note-content">{note.content}</p>
          <div className="note-card-bottom">
            <span className="note-time">{formatDate(note.updatedAt)}</span>
            <div className="note-actions">
              <button className="btn-sm" onClick={() => onEdit(note)}>Edit</button>
              <button className="btn-sm btn-sm-danger" onClick={() => onDelete(note._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
