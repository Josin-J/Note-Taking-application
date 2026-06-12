import React, { useState, useEffect, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api/notesApi';
import { getCategories, createCategory, updateCategory, deleteCategory } from './api/categoriesApi';
import { login, register, getMe, updateProfile } from './api/authApi';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(!!token);
  const [authPage, setAuthPage] = useState('login');
  const [page, setPage] = useState('notes');

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteFocus, setNoteFocus] = useState(0);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = () => setToast(null);

  useEffect(() => {
    if (!token) { setAuthLoading(false); return; }
    getMe(token)
      .then((u) => { setUser(u); })
      .catch(() => { localStorage.removeItem('token'); setToken(null); })
      .finally(() => setAuthLoading(false));
  }, [token]);

  const handleLogin = async (creds) => {
    const data = await login(creds);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const handleRegister = async (creds) => {
    const data = await register(creds);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setNotes([]);
    setCategories([]);
    setSelectedCategory(null);
  };

  const handleUpdateName = async (name) => {
    const updated = await updateProfile(token, name);
    setUser(updated);
    showToast('Name updated');
  };

  const handleNewNote = () => {
    setPage('notes');
    setEditingNote(null);
    setNoteFocus((v) => v + 1);
    setSidebarOpen(true);
  };

  const fetchNotes = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getNotes(token, selectedCategory, searchTerm);
      setNotes(data);
    } catch {
      showToast('Failed to load notes', 'error');
    }
  }, [token, selectedCategory, searchTerm]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch {
      showToast('Failed to load categories', 'error');
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchNotes().catch(() => {});
    fetchCategories().catch(() => {});
    setLoading(false);
  }, [fetchNotes, fetchCategories, token]);

  const handleSaveNote = async (note) => {
    try {
      if (editingNote) {
        const updated = await updateNote(token, editingNote._id, note);
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
        setEditingNote(null);
        showToast('Note updated');
      } else {
        const created = await createNote(token, note);
        setNotes((prev) => [created, ...prev]);
        showToast('Note created');
      }
    } catch {
      showToast('Failed to save note', 'error');
    }
  };

  const handleDeleteNote = (id) => {
    setConfirm({
      message: 'Delete this note permanently?',
      onConfirm: async () => {
        try {
          await deleteNote(token, id);
          setNotes((prev) => prev.filter((n) => n._id !== id));
          showToast('Note deleted');
        } catch {
          showToast('Failed to delete note', 'error');
        }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  const handleSaveCategory = async ({ name }) => {
    try {
      if (editingCategory) {
        const updated = await updateCategory(token, editingCategory._id, name);
        setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
        setEditingCategory(null);
        showToast('Category updated');
      } else {
        const created = await createCategory(token, name);
        setCategories((prev) => [...prev, created]);
        showToast('Category created');
      }
    } catch {
      showToast('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = (id) => {
    setConfirm({
      message: 'Delete this category? Notes in it will become uncategorized.',
      onConfirm: async () => {
        try {
          await deleteCategory(token, id);
          setCategories((prev) => prev.filter((c) => c._id !== id));
          if (selectedCategory === id) setSelectedCategory(null);
          showToast('Category deleted');
        } catch {
          showToast('Failed to delete category', 'error');
        }
        setConfirm(null);
      },
      onCancel: () => setConfirm(null),
    });
  };

  const cancelEditCategory = () => setEditingCategory(null);

  if (authLoading) {
    return <div className="loading" style={{ marginTop: '20vh' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          {authPage === 'login' ? (
            <Login onLogin={handleLogin} onSwitch={() => setAuthPage('register')} />
          ) : (
            <Register onRegister={handleRegister} onSwitch={() => setAuthPage('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar page={page} onPageChange={setPage} user={user} onLogout={handleLogout} onNewNote={handleNewNote} />

      <div className="app-body">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)}>
          {sidebarOpen ? '\u2715' : '\u2630'}
        </button>

        {page === 'notes' && (
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
              <h2>Categories</h2>
            </div>

            <CategoryForm
              onSave={handleSaveCategory}
              initial={editingCategory}
              onCancel={editingCategory ? cancelEditCategory : undefined}
              key={editingCategory?._id || 'new-cat'}
            />

            <CategoryList
              categories={categories}
              selected={selectedCategory}
              editingId={editingCategory?._id}
              onSelect={(id) => { setSelectedCategory(id); setEditingNote(null); }}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
            />
          </aside>
        )}

        <main className="main">
          {page === 'notes' ? (
            <>
              <NoteForm
                categories={categories}
                onSave={handleSaveNote}
                initial={editingNote}
                onCancel={editingNote ? () => setEditingNote(null) : undefined}
                key={editingNote?._id || 'new-note'}
                focusTrigger={noteFocus}
              />

              <div className="search-bar">
                <span className="search-icon">{'\uD83D\uDD0D'}</span>
                <input
                  type="text"
                  placeholder="Search notes by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="search-clear" onClick={() => setSearchTerm('')}>
                    {'\u2715'}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="loading">Loading notes...</div>
              ) : (
                <NoteList
                  notes={notes}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  onEdit={(note) => { setEditingNote(note); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  onDelete={handleDeleteNote}
                />
              )}
            </>
          ) : (
            <Profile user={user} onUpdateName={handleUpdateName} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      {confirm && <ConfirmModal {...confirm} />}
    </div>
  );
}
