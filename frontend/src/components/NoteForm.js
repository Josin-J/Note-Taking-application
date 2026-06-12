import React, { useState, useEffect, useRef } from 'react';

export default function NoteForm({ categories, onSave, initial, onCancel, focusTrigger }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setContent(initial.content);
      setCategory(initial.category?._id || '');
    } else {
      setTitle('');
      setContent('');
      setCategory('');
    }
  }, [initial]);

  useEffect(() => {
    if (!initial && titleRef.current) {
      titleRef.current.focus();
    }
  }, [focusTrigger, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      category: category || null,
    });
  };

  const isEditing = !!initial;

  return (
    <form onSubmit={handleSubmit} className={`note-form ${isEditing ? 'editing' : ''}`}>
      <div className="note-form-header">
        <h3>{isEditing ? 'Edit Note' : 'New Note'}</h3>
        {isEditing && <span className="edit-badge">Editing</span>}
      </div>
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        rows={4}
        required
      />
      <div className="note-form-meta">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <span className="char-count">{content.length} chars</span>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Note' : 'Add Note'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
