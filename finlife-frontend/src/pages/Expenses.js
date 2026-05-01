import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense,
         deleteExpense } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', amount: '',
        category: 'FOOD',
        expenseDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { loadExpenses(); }, []);

    const loadExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addExpense({
                ...form, amount: parseFloat(form.amount)
            });
            setShowForm(false);
            setForm({ title: '', description: '',
                amount: '', category: 'FOOD',
                expenseDate: new Date()
                    .toISOString().split('T')[0] });
            loadExpenses();
        } catch (err) {
            alert('Failed to add expense!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            await deleteExpense(id);
            loadExpenses();
        }
    };

    const categories = ['FOOD', 'TRAVEL', 'ENTERTAINMENT',
        'SHOPPING', 'HEALTH', 'EDUCATION',
        'UTILITIES', 'OTHER'];

    const categoryColors = {
        FOOD: '#E94560', TRAVEL: '#6C63FF',
        ENTERTAINMENT: '#F5A623', SHOPPING: '#2ECC71',
        HEALTH: '#E74C3C', EDUCATION: '#3498DB',
        UTILITIES: '#95A5A6', OTHER: '#9B59B6'
    };

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
                    { label: '📊 Budget',
                      path: '/budget' },
                    { label: '📈 Investments',
                      path: '/investments' },
                    { label: '🤖 AI Advisor',
                      path: '/advisor' },
                ].map(item => (
                    <div key={item.path}
                        style={{
                            ...styles.navItem,
                            background: item.path ===
                                '/expenses'
                                ? 'rgba(108,99,255,0.3)'
                                : 'transparent'
                        }}
                        onClick={() =>
                            navigate(item.path)}>
                        {item.label}
                    </div>
                ))}
            </div>

            <div style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        💸 Expenses
                    </h1>
                    <button
                        style={styles.addBtn}
                        onClick={() =>
                            setShowForm(!showForm)}>
                        + Add Expense
                    </button>
                </div>

                {showForm && (
                    <div style={styles.formCard}>
                        <h3 style={{ color: '#0F3460',
                            marginBottom: '16px' }}>
                            New Expense
                        </h3>
                        <form onSubmit={handleAdd}>
                            <div style={styles.formRow}>
                                <input
                                    style={styles.input}
                                    placeholder="Title"
                                    value={form.title}
                                    onChange={e => setForm({
                                        ...form,
                                        title: e.target.value
                                    })}
                                    required
                                />
                                <input
                                    style={styles.input}
                                    type="number"
                                    placeholder="Amount (₹)"
                                    value={form.amount}
                                    onChange={e => setForm({
                                        ...form,
                                        amount: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <select
                                    style={styles.input}
                                    value={form.category}
                                    onChange={e => setForm({
                                        ...form,
                                        category: e.target.value
                                    })}>
                                    {categories.map(c => (
                                        <option key={c}
                                            value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    style={styles.input}
                                    type="date"
                                    value={form.expenseDate}
                                    onChange={e => setForm({
                                        ...form,
                                        expenseDate:
                                            e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <input
                                style={styles.input}
                                placeholder="Description (optional)"
                                value={form.description}
                                onChange={e => setForm({
                                    ...form,
                                    description: e.target.value
                                })}
                            />
                            <button style={styles.submitBtn}
                                type="submit">
                                Add Expense
                            </button>
                        </form>
                    </div>
                )}

                <div style={styles.total}>
                    Total: ₹{expenses.reduce(
                        (s, e) => s + e.amount, 0
                    ).toFixed(2)}
                    &nbsp;•&nbsp;
                    {expenses.length} transactions
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : expenses.length === 0 ? (
                    <div style={styles.empty}>
                        No expenses yet! Add your first one.
                    </div>
                ) : (
                    <div style={styles.list}>
                        {expenses.map(exp => (
                            <div key={exp.id}
                                style={styles.expenseItem}>
                                <div style={{
                                    ...styles.categoryBadge,
                                    background:
                                        categoryColors[
                                            exp.category]
                                        || '#888'
                                }}>
                                    {exp.category}
                                </div>
                                <div style={styles.expInfo}>
                                    <p style={styles.expTitle}>
                                        {exp.title}
                                    </p>
                                    <p style={styles.expDate}>
                                        {exp.expenseDate}
                                    </p>
                                </div>
                                <div style={styles.expAmount}>
                                    ₹{exp.amount.toFixed(2)}
                                </div>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() =>
                                        handleDelete(exp.id)}>
                                    🗑️
                                </button>
                            </div>
                        ))}
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
    formRow: { display: 'flex', gap: '16px',
        marginBottom: '0' },
    input: { width: '100%', padding: '12px 16px',
        marginBottom: '16px', border: '2px solid #eee',
        borderRadius: '10px', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box' },
    submitBtn: { padding: '12px 32px',
        background: 'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none', borderRadius: '10px',
        cursor: 'pointer', fontSize: '14px' },
    total: { background: 'white', padding: '16px 20px',
        borderRadius: '12px', marginBottom: '16px',
        color: '#0F3460', fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    list: { display: 'flex', flexDirection: 'column',
        gap: '12px' },
    expenseItem: { background: 'white', borderRadius: '12px',
        padding: '16px 20px', display: 'flex',
        alignItems: 'center', gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    categoryBadge: { padding: '6px 12px', borderRadius: '20px',
        color: 'white', fontSize: '12px',
        fontWeight: 'bold', minWidth: '80px',
        textAlign: 'center' },
    expInfo: { flex: 1 },
    expTitle: { margin: 0, fontWeight: 'bold',
        color: '#0F3460' },
    expDate: { margin: 0, fontSize: '12px', color: '#888' },
    expAmount: { fontSize: '18px', fontWeight: 'bold',
        color: '#0F3460' },
    deleteBtn: { background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '18px' },
    empty: { textAlign: 'center', padding: '60px',
        color: '#888', background: 'white',
        borderRadius: '16px' },
};

export default Expenses;