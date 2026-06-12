import React, { useState } from 'react';

export default function Register({ onRegister, onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onRegister({ name, email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create account</h2>
      <p className="auth-sub">Start organizing your notes</p>

      {error && <div className="auth-error">{error}</div>}

      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>

      <p className="auth-switch">
        Already have an account? <button type="button" onClick={onSwitch}>Sign In</button>
      </p>
    </form>
  );
}
