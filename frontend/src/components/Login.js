import React, { useState } from 'react';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Welcome back</h2>
      <p className="auth-sub">Sign in to your account</p>

      {error && <div className="auth-error">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="auth-switch">
        Don't have an account? <button type="button" onClick={onSwitch}>Register</button>
      </p>
    </form>
  );
}
