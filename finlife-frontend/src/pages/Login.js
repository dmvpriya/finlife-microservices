import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(form);
            loginUser(res.data, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>💰 FinLife</h1>
                <p style={styles.subtitle}>
                    Your Personal Finance Assistant
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({
                            ...form, email: e.target.value
                        })}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({
                            ...form, password: e.target.value
                        })}
                        required
                    />
                    {error && (
                        <p style={styles.error}>{error}</p>
                    )}
                    <button
                        style={styles.button}
                        type="submit"
                        disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={styles.link}>
                    Don't have an account?{' '}
                    <Link to="/register"
                        style={{ color: '#6C63FF' }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F3460 0%, #16213E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '380px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    logo: {
        fontSize: '32px',
        color: '#0F3460',
        margin: '0 0 8px 0',
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        marginBottom: '16px',
        border: '2px solid #eee',
        borderRadius: '10px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        color: '#e74c3c',
        fontSize: '13px',
        marginBottom: '10px',
    },
    link: {
        marginTop: '20px',
        color: '#666',
        fontSize: '14px',
    },
};

export default Login;