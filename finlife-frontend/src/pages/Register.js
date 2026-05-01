import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
    const [form, setForm] = useState({
        firstName: '', lastName: '',
        email: '', password: '', phoneNumber: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(form);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>💰 FinLife</h1>
                <p style={styles.subtitle}>Create Your Account</p>
                <form onSubmit={handleSubmit}>
                    <div style={styles.row}>
                        <input
                            style={{...styles.input,
                                marginRight: '8px'}}
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={e => setForm({
                                ...form,
                                firstName: e.target.value
                            })}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={e => setForm({
                                ...form,
                                lastName: e.target.value
                            })}
                            required
                        />
                    </div>
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
                    <input
                        style={styles.input}
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={e => setForm({
                            ...form, phoneNumber: e.target.value
                        })}
                    />
                    {error && (
                        <p style={styles.error}>{error}</p>
                    )}
                    <button
                        style={styles.button}
                        type="submit"
                        disabled={loading}>
                        {loading
                            ? 'Creating account...'
                            : 'Create Account'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account?{' '}
                    <Link to="/login"
                        style={{ color: '#6C63FF' }}>
                        Login
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
        width: '420px',
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
        marginBottom: '24px',
        fontSize: '14px',
    },
    row: {
        display: 'flex',
        marginBottom: '0px',
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

export default Register;