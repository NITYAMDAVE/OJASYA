import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

const ROLES = [
  { key: 'patient', label: 'Patient' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'receptionist', label: 'Receptionist' },
  { key: 'pharmacist', label: 'Pharmacist' },
  { key: 'admin', label: 'Admin' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        ...form,
        role
      });

      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🫀 Ojasya</h1>
          <p>Healthcare Management System</p>
        </div>

        <div className="role-grid">
          {ROLES.map(r => (
            <button
              key={r.key}
              className={`role-btn ${role === r.key ? 'active' : ''}`}
              onClick={() => setRole(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button disabled={loading}>
            {loading ? 'Signing in...' : `Sign in as ${role}`}
          </button>
        </form>

        <p style={{ fontSize: 12 }}>
          Demo admin: admin@ojasya.com / Admin@123
        </p>
      </div>
    </div>
  );
}

// ================= SIGNUP =================

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        ...form,
        role
      });

      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <Link to="/login">Already have an account?</Link>
      </div>
    </div>
  );
}
