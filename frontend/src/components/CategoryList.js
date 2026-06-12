import React from 'react';

export default function CategoryList({ categories, selected, editingId, onSelect, onEdit, onDelete }) {
  return (
    <div className="category-list">
      <div className="category-list-header">
        <h3>Categories</h3>
        <span className="count">{categories.length}</span>
      </div>
      <button
        className={`category-item ${!selected ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        <span>All Notes</span>
      </button>
      {categories.map((cat) => (
        <div
          key={cat._id}
          className={`category-item ${selected === cat._id ? 'active' : ''} ${editingId === cat._id ? 'editing' : ''}`}
        >
          <span className="cat-name" onClick={() => onSelect(cat._id)}>{cat.name}</span>
          <div className="category-actions">
            <button
              className="btn-sm"
              onClick={(e) => { e.stopPropagation(); onEdit(cat); }}
              title="Edit category"
            >
              Edit
            </button>
            <button
              className="btn-sm btn-sm-danger"
              onClick={(e) => { e.stopPropagation(); onDelete(cat._id); }}
              title="Delete category"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
