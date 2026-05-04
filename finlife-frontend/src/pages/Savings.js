import React, { useState, useEffect } from 'react';
import { getSavings, addSavings,
         addSavingsAmount,
         deleteSavingsGoal } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Savings = () => {
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [addAmount, setAddAmount] = useState({});
    const [form, setForm] = useState({
        title: '', description: '',
        targetAmount: '', targetDate: ''
    });
    const navigate = useNavigate();

    useEffect(() => { loadGoals(); }, []);

    const loadGoals = async () => {
        const res = await getSavings();
        setGoals(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (form.targetDate &&
            new Date(form.targetDate) <= new Date()) {
            alert('Target date must be in the future!');
            return;
        }
        await addSavings({
            ...form,
            targetAmount: parseFloat(form.targetAmount)
        });
        setShowForm(false);
        setForm({ title: '', description: '',
            targetAmount: '', targetDate: '' });
        loadGoals();
    };

    const handleAddAmount = async (id) => {
        const amount = addAmount[id];
        if (!amount) return;
        await addSavingsAmount(id, amount);
        setAddAmount({ ...addAmount, [id]: '' });
        loadGoals();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this goal?')) return;
        await deleteSavingsGoal(id);
        loadGoals();
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>💰 FinLife</h2>
                {[
                    { label: '🏠 Dashboard', path: '/dashboard' },
                    { label: '💸 Expenses', path: '/expenses' },
                    { label: '🎯 Savings', path: '/savings' },
                    { label: '📊 Budget', path: '/budget' },
                    { label: '📈 Investments',
                      path: '/investments' },
                    { label: '🤖 AI Advisor', path: '/advisor' },
                ].map(item => (
                    <div key={item.path}
                        style={{
                            ...styles.navItem,
                            background: item.path === '/savings'
                                ? 'rgba(108,99,255,0.3)'
                                : 'transparent'
                        }}
                        onClick={() => navigate(item.path)}>
                        {item.label}
                    </div>
                ))}
            </div>

            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🎯 Savings Goals</h1>
                    <button style={styles.addBtn}
                        onClick={() => setShowForm(!showForm)}>
                        + New Goal
                    </button>
                </div>

                {showForm && (
                    <div style={styles.formCard}>
                        <h3 style={{ color: '#0F3460',
                            marginBottom: '16px' }}>
                            Create Savings Goal
                        </h3>
                        <form onSubmit={handleAdd}>
                            <div style={styles.formRow}>
                                <input style={styles.input}
                                    placeholder="Goal Title
                                    (e.g. Bali Trip)"
                                    value={form.title}
                                    onChange={e => setForm({
                                        ...form,
                                        title: e.target.value
                                    })}
                                    required/>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Target Amount (₹)"
                                    value={form.targetAmount}
                                    onChange={e => setForm({
                                        ...form,
                                        targetAmount: e.target.value
                                    })}
                                    required/>
                            </div>
                            <div style={styles.formRow}>
                            <input style={styles.input}
                                    type="date"
                                    value={form.targetDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setForm({
                                        ...form,
                                        targetDate: e.target.value
                                    })}/>
                                <input style={styles.input}
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={e => setForm({
                                        ...form,
                                        description: e.target.value
                                    })}/>
                            </div>
                            <button style={styles.submitBtn}
                                type="submit">
                                Create Goal
                            </button>
                        </form>
                    </div>
                )}

                <div style={styles.grid}>
                    {goals.map(goal => (
                        <div key={goal.id}
                            style={styles.goalCard}>
                            <div style={styles.goalHeader}>
                                <h3 style={styles.goalTitle}>
                                    {goal.title}
                                </h3>
                                <span style={{
                                    ...styles.statusBadge,
                                    background:
                                        goal.status === 'COMPLETED'
                                        ? '#2ECC71' : '#6C63FF'
                                }}>
                                    {goal.status}
                                </span>
                            </div>

                            <div style={styles.amounts}>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Saved
                                    </p>
                                    <p style={styles.amtValue}>
                                        ₹{goal.savedAmount}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Target
                                    </p>
                                    <p style={styles.amtValue}>
                                        ₹{goal.targetAmount}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Monthly Need
                                    </p>
                                    <p style={{
                                        ...styles.amtValue,
                                        color: '#6C63FF'
                                    }}>
                                        ₹{goal.monthlySavingsNeeded}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${Math.min(
                                        goal.progressPercentage,
                                        100)}%`
                                }}/>
                            </div>
                            <p style={styles.progressText}>
                                {goal.progressPercentage
                                    .toFixed(1)}% complete
                            </p>

                            {goal.status !== 'COMPLETED' && (
                                <div style={styles.addRow}>
                                    <input
                                        style={styles.smallInput}
                                        type="number"
                                        placeholder="Add amount ₹"
                                        value={addAmount[goal.id]
                                            || ''}
                                        onChange={e => setAddAmount({
                                            ...addAmount,
                                            [goal.id]: e.target.value
                                        })}/>
                                    <button
                                        style={styles.addAmtBtn}
                                        onClick={() =>
                                            handleAddAmount(goal.id)}>
                                        + Add
                                    </button>
                                    <button
                                        style={styles.deleteGoalBtn}
                                        onClick={() => handleDelete(goal.id)}>
                                        🗑️ Delete Goal
                                    </button>
                                </div>
                            )}

                            {goal.targetDate && (
                                <p style={styles.dateText}>
                                    🗓️ Target: {goal.targetDate}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {goals.length === 0 && (
                    <div style={styles.empty}>
                        No savings goals yet! Create your first one.
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', minHeight: '100vh',
        background: '#F0F2F5' },
    sidebar: { width: '240px',
        background: 'linear-gradient(180deg, #0F3460, #16213E)',
        padding: '30px 20px', position: 'fixed',
        height: '100vh', overflowY: 'auto' },
    logo: { color: 'white', fontSize: '22px',
        margin: '0 0 30px 0' },
    navItem: { color: 'white', padding: '12px 16px',
        borderRadius: '10px', marginBottom: '6px',
        cursor: 'pointer', fontSize: '14px' },
    main: { marginLeft: '240px', padding: '30px', flex: 1 },
    header: { display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', color: '#0F3460', margin: 0 },
    addBtn: { padding: '12px 24px',
        background: 'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none', borderRadius: '10px',
        cursor: 'pointer', fontSize: '14px' },
    formCard: { background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    formRow: { display: 'flex', gap: '16px' },
    input: { width: '100%', padding: '12px 16px',
        marginBottom: '16px', border: '2px solid #eee',
        borderRadius: '10px', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box' },
    submitBtn: { padding: '12px 32px',
        background: 'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none', borderRadius: '10px',
        cursor: 'pointer', fontSize: '14px' },
    grid: { display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px' },
    goalCard: { background: 'white', borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    goalHeader: { display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px' },
    goalTitle: { margin: 0, color: '#0F3460', fontSize: '16px' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px',
        color: 'white', fontSize: '11px', fontWeight: 'bold' },
    amounts: { display: 'flex', justifyContent: 'space-between',
        marginBottom: '16px' },
    amtLabel: { margin: '0 0 4px 0', fontSize: '11px',
        color: '#888', textTransform: 'uppercase' },
    amtValue: { margin: 0, fontWeight: 'bold',
        color: '#0F3460', fontSize: '16px' },
    progressBar: { height: '8px', background: '#eee',
        borderRadius: '4px', overflow: 'hidden',
        marginBottom: '6px' },
    progressFill: { height: '100%',
        background: 'linear-gradient(90deg, #6C63FF, #0F3460)',
        borderRadius: '4px' },
    progressText: { fontSize: '12px', color: '#888',
        marginBottom: '16px' },
    addRow: { display: 'flex', gap: '8px',
        marginBottom: '12px' },
    smallInput: { flex: 1, padding: '8px 12px',
        border: '2px solid #eee', borderRadius: '8px',
        fontSize: '13px', outline: 'none' },
    addAmtBtn: { padding: '8px 16px',
        background: '#6C63FF', color: 'white',
        border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontSize: '13px' },
    dateText: { fontSize: '12px', color: '#888', margin: 0 },
    empty: { textAlign: 'center', padding: '60px',
        color: '#888', background: 'white',
        borderRadius: '16px' },
    deleteGoalBtn: {
        width: '100%', padding: '8px',
        background: 'rgba(233,69,96,0.1)',
        color: '#E94560',
        border: '1px solid #E94560',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '12px', marginTop: '8px'
    },
};

export default Savings;