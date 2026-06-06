import React, { useState } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await client.post('/api/auth/login', { username, password });
      localStorage.setItem('admin_token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 20% 0%, rgba(184,134,11,0.14), transparent 42%), radial-gradient(circle at 90% 100%, rgba(184,134,11,0.1), transparent 38%), #050505',
      }}
    >
      <div className="card" style={{ width: 360 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 6,
            color: '#b8860b',
          }}
        >
          Flic Microwaves
        </h1>
        <p style={{ fontSize: 13, color: '#6c757d', marginBottom: 24 }}>
          Admin Panel — sign in to continue
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
