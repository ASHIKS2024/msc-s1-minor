// ========== src/pages/Register.js (COMPLETE WORKING VERSION) ==========
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'developer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8000/api/auth/register/', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.username?.[0] || 
               err.response?.data?.email?.[0] || 
               'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={styles.input}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={styles.input}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            style={styles.input}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            style={styles.input}
            disabled={loading}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={styles.input}
            disabled={loading}
          >
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
            <option value="manager">Project Manager</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={styles.input}
            required
            disabled={loading}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p style={styles.link}>
          Already have an account? <Link to="/login" style={styles.linkText}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
  },
  link: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#666',
  },
  linkText: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Register;