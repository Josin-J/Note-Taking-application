import React, { useState, useEffect } from 'react';

export default function CategoryForm({ onSave, initial, onCancel }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initial) setName(initial.name);
    else setName('');
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim() });
    if (!initial) setName('');
  };

  const isEditing = !!initial;

  return (
    <form onSubmit={handleSubmit} className={`category-form ${isEditing ? 'editing' : ''}`}>
      <div className="category-form-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isEditing ? 'Edit category...' : 'New category...'}
          required
        />
        <button type="submit" className="btn-icon" title={isEditing ? 'Update' : 'Add'}>
          {isEditing ? '\u2713' : '+'}
        </button>
        {isEditing && onCancel && (
          <button type="button" className="btn-icon cancel" onClick={onCancel} title="Cancel">
            \u2715
          </button>
        )}
      </div>
    </form>
  );
}
