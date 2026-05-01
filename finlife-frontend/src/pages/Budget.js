import React, { useState, useEffect } from 'react';
import { getBudgets, setBudget } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        category: 'FOOD', monthlyLimit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });
    const navigate = useNavigate();

    useEffect(() => { loadBudgets(); }, []);

    const loadBudgets = async () => {
        const res = await getBudgets();
        setBudgets(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await setBudget({
            ...form,
            monthlyLimit: parseFloat(form.monthlyLimit)
        });
        setShowForm(false);
        loadBudgets();
    };

    const alertColors = {
        SAFE: '#2ECC71', MODERATE: '#F5A623',
        WARNING: '#E67E22', EXCEEDED: '#E94560'
    };

    const categories = ['FOOD', 'TRAVEL', 'ENTERTAINMENT',
        'SHOPPING', 'HEALTH', 'EDUCATION',
        'UTILITIES', 'OTHER'];

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>💰 FinLife</h2>
                {[
                    { label: '🏠 Dashboard',
                      path: '/dashboard' },
                    { label: '💸 Expenses',
                      path: '/expenses' },
                    { label: '🎯 Savings',
                      path: '/savings' },
                    { label: '📊 Budget', path: '/budget' },
                    { label: '📈 Investments',
                      path: '/investments' },
                    { label: '🤖 AI Advisor',
                      path: '/advisor' },
                ].map(item => (
                    <div key={item.path}
                        style={{
                            ...styles.navItem,
                            background: item.path === '/budget'
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
                    <h1 style={styles.title}>📊 Budget</h1>
                    <button style={styles.addBtn}
                        onClick={() =>
                            setShowForm(!showForm)}>
                        + Set Budget
                    </button>
                </div>

                {showForm && (
                    <div style={styles.formCard}>
                        <h3 style={{ color: '#0F3460',
                            marginBottom: '16px' }}>
                            Set Monthly Budget
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formRow}>
                                <select style={styles.input}
                                    value={form.category}
                                    onChange={e => setForm({
                                        ...form,
                                        category: e.target.value
                                    })}>
                                    {categories.map(c => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Monthly Limit (₹)"
                                    value={form.monthlyLimit}
                                    onChange={e => setForm({
                                        ...form,
                                        monthlyLimit: e.target.value
                                    })}
                                    required/>
                            </div>
                            <div style={styles.formRow}>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Month (1-12)"
                                    value={form.month}
                                    min="1" max="12"
                                    onChange={e => setForm({
                                        ...form,
                                        month: parseInt(
                                            e.target.value)
                                    })}
                                    required/>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Year"
                                    value={form.year}
                                    onChange={e => setForm({
                                        ...form,
                                        year: parseInt(
                                            e.target.value)
                                    })}
                                    required/>
                            </div>
                            <button style={styles.submitBtn}
                                type="submit">
                                Set Budget
                            </button>
                        </form>
                    </div>
                )}

                <div style={styles.grid}>
                    {budgets.map(budget => (
                        <div key={budget.id}
                            style={{
                                ...styles.budgetCard,
                                borderTop: `4px solid ${
                                    alertColors[
                                        budget.alertStatus]}`
                            }}>
                            <div style={styles.budgetHeader}>
                                <h3 style={styles.category}>
                                    {budget.category}
                                </h3>
                                <span style={{
                                    ...styles.alertBadge,
                                    background:
                                        alertColors[
                                            budget.alertStatus]
                                }}>
                                    {budget.alertStatus}
                                </span>
                            </div>

                            <div style={styles.amounts}>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Spent
                                    </p>
                                    <p style={styles.amtValue}>
                                        ₹{budget.spentAmount}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Limit
                                    </p>
                                    <p style={styles.amtValue}>
                                        ₹{budget.monthlyLimit}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.amtLabel}>
                                        Remaining
                                    </p>
                                    <p style={{
                                        ...styles.amtValue,
                                        color: budget
                                            .remainingAmount < 0
                                            ? '#E94560' : '#2ECC71'
                                    }}>
                                        ₹{budget.remainingAmount}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${Math.min(
                                        budget
                                        .utilizationPercentage,
                                        100)}%`,
                                    background:
                                        alertColors[
                                            budget.alertStatus]
                                }}/>
                            </div>
                            <p style={styles.utilText}>
                                {budget.utilizationPercentage
                                    .toFixed(1)}% utilized
                                &nbsp;•&nbsp;
                                {budget.month}/{budget.year}
                            </p>
                        </div>
                    ))}
                </div>

                {budgets.length === 0 && (
                    <div style={styles.empty}>
                        No budgets set yet!
                        Set your first monthly budget.
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px' },
    budgetCard: { background: 'white', borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    budgetHeader: { display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px' },
    category: { margin: 0, color: '#0F3460', fontSize: '16px' },
    alertBadge: { padding: '4px 12px', borderRadius: '20px',
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
    progressFill: { height: '100%', borderRadius: '4px' },
    utilText: { fontSize: '12px', color: '#888', margin: 0 },
    empty: { textAlign: 'center', padding: '60px',
        color: '#888', background: 'white',
        borderRadius: '16px' },
};

export default Budget;