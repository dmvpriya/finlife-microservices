import React, { useState, useEffect } from 'react';
import { getInvestments, addInvestment,
         getPortfolioSummary } from '../services/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NAV_ITEMS = [
    { label: '🏠 Dashboard', path: '/dashboard' },
    { label: '💸 Expenses', path: '/expenses' },
    { label: '🎯 Savings', path: '/savings' },
    { label: '📊 Budget', path: '/budget' },
    { label: '📈 Investments', path: '/investments' },
    { label: '🤖 AI Advisor', path: '/advisor' },
];

const Investments = () => {
    const [investments, setInvestments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', symbol: '', type: 'STOCK',
        quantity: '', buyPrice: '', currentPrice: '',
        buyDate: new Date().toISOString().split('T')[0]
    });
    const navigate = useNavigate();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [invRes, sumRes] = await Promise.all([
                getInvestments(),
                getPortfolioSummary()
            ]);
            setInvestments(invRes.data);
            setSummary(sumRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addInvestment({
                ...form,
                quantity: parseFloat(form.quantity),
                buyPrice: parseFloat(form.buyPrice),
                currentPrice: parseFloat(
                    form.currentPrice || form.buyPrice)
            });
            setShowForm(false);
            setForm({ name: '', symbol: '',
                type: 'STOCK', quantity: '',
                buyPrice: '', currentPrice: '',
                buyDate: new Date()
                    .toISOString().split('T')[0] });
            loadData();
        } catch (err) {
            alert('Failed to add investment!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(
            'Delete this investment?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:8080/api/investments/${id}`,
                { headers: {
                    Authorization: `Bearer ${token}` }}
            );
            loadData();
        } catch (err) {
            alert('Failed to delete investment!');
        }
    };

    const types = ['STOCK', 'MUTUAL_FUND', 'CRYPTO',
        'FIXED_DEPOSIT', 'GOLD', 'OTHER'];

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>💰 FinLife</h2>
                {NAV_ITEMS.map(item => (
                    <div key={item.path}
                        style={{
                            ...styles.navItem,
                            background:
                                item.path === '/investments'
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
                        📈 Investments
                    </h1>
                    <button style={styles.addBtn}
                        onClick={() =>
                            setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel'
                            : '+ Add Investment'}
                    </button>
                </div>

                {/* Portfolio Summary */}
                {summary && (
                    <div style={styles.summaryRow}>
                        <div style={{
                            ...styles.summaryCard,
                            background:
                                'linear-gradient(135deg, #0F3460, #6C63FF)'
                        }}>
                            <p style={styles.sumLabel}>
                                Total Invested
                            </p>
                            <h2 style={styles.sumValue}>
                                ₹{summary.investedAmount
                                    ?.toFixed(2) || '0.00'}
                            </h2>
                        </div>
                        <div style={{
                            ...styles.summaryCard,
                            background:
                                'linear-gradient(135deg, #1B4332, #2ECC71)'
                        }}>
                            <p style={styles.sumLabel}>
                                Current Value
                            </p>
                            <h2 style={styles.sumValue}>
                                ₹{summary.currentValue
                                    ?.toFixed(2) || '0.00'}
                            </h2>
                        </div>
                        <div style={{
                            ...styles.summaryCard,
                            background:
                                summary.performance === 'PROFIT'
                                ? 'linear-gradient(135deg, #1B4332, #27AE60)'
                                : 'linear-gradient(135deg, #7B1818, #E94560)'
                        }}>
                            <p style={styles.sumLabel}>
                                Total P&L
                            </p>
                            <h2 style={styles.sumValue}>
                                ₹{summary.profitLoss
                                    ?.toFixed(2) || '0.00'}
                            </h2>
                            <p style={{ color:
                                'rgba(255,255,255,0.8)',
                                fontSize: '12px', margin: 0 }}>
                                {summary.performance || 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                {showForm && (
                    <div style={styles.formCard}>
                        <h3 style={{ color: '#0F3460',
                            marginBottom: '16px' }}>
                            Add Investment
                        </h3>
                        <form onSubmit={handleAdd}>
                            <div style={styles.formRow}>
                                <input style={styles.input}
                                    placeholder="Name (e.g. Infosys)"
                                    value={form.name}
                                    onChange={e => setForm({
                                        ...form,
                                        name: e.target.value
                                    })}
                                    required/>
                                <input style={styles.input}
                                    placeholder="Symbol (e.g. INFY)"
                                    value={form.symbol}
                                    onChange={e => setForm({
                                        ...form,
                                        symbol: e.target.value
                                    })}
                                    required/>
                            </div>
                            <div style={styles.formRow}>
                                <select style={styles.input}
                                    value={form.type}
                                    onChange={e => setForm({
                                        ...form,
                                        type: e.target.value
                                    })}>
                                    {types.map(t => (
                                        <option key={t}
                                            value={t}>{t}
                                        </option>
                                    ))}
                                </select>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Quantity"
                                    value={form.quantity}
                                    onChange={e => setForm({
                                        ...form,
                                        quantity: e.target.value
                                    })}
                                    required/>
                            </div>
                            <div style={styles.formRow}>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Buy Price (₹)"
                                    value={form.buyPrice}
                                    onChange={e => setForm({
                                        ...form,
                                        buyPrice: e.target.value
                                    })}
                                    required/>
                                <input style={styles.input}
                                    type="number"
                                    placeholder="Current Price (₹)"
                                    value={form.currentPrice}
                                    onChange={e => setForm({
                                        ...form,
                                        currentPrice:
                                            e.target.value
                                    })}/>
                            </div>
                            <input style={styles.input}
                                type="date"
                                value={form.buyDate}
                                max={new Date()
                                    .toISOString()
                                    .split('T')[0]}
                                onChange={e => setForm({
                                    ...form,
                                    buyDate: e.target.value
                                })}/>
                            <button style={styles.submitBtn}
                                type="submit">
                                Add Investment
                            </button>
                        </form>
                    </div>
                )}

                <div style={styles.list}>
                    {investments.length === 0 ? (
                        <div style={styles.empty}>
                            No investments yet!
                            Add your first investment.
                        </div>
                    ) : (
                        investments.map(inv => (
                            <div key={inv.id}
                                style={styles.invCard}>
                                <div style={styles.invLeft}>
                                    <div style={
                                        styles.symbolBox}>
                                        {inv.symbol
                                            ?.substring(0, 4)}
                                    </div>
                                    <div>
                                        <p style={
                                            styles.invName}>
                                            {inv.name}
                                        </p>
                                        <p style={
                                            styles.invType}>
                                            {inv.type} •
                                            Qty: {inv.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div style={styles.invRight}>
                                    <div style={
                                        styles.priceCol}>
                                        <p style={
                                            styles.priceLabel}>
                                            Invested
                                        </p>
                                        <p style={
                                            styles.priceValue}>
                                            ₹{inv.investedAmount
                                                ?.toFixed(2)}
                                        </p>
                                    </div>
                                    <div style={
                                        styles.priceCol}>
                                        <p style={
                                            styles.priceLabel}>
                                            Current
                                        </p>
                                        <p style={
                                            styles.priceValue}>
                                            ₹{inv.currentValue
                                                ?.toFixed(2)}
                                        </p>
                                    </div>
                                    <div style={
                                        styles.priceCol}>
                                        <p style={
                                            styles.priceLabel}>
                                            P&L
                                        </p>
                                        <p style={{
                                            ...styles.priceValue,
                                            color:
                                                inv.performance
                                                === 'PROFIT'
                                                ? '#2ECC71'
                                                : '#E94560'
                                        }}>
                                            ₹{inv.profitLoss
                                                ?.toFixed(2)}
                                            ({inv
                                            .profitLossPercentage
                                            ?.toFixed(1)}%)
                                        </p>
                                    </div>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() =>
                                            handleDelete(inv.id)}
                                        title="Delete">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: '#F0F2F5',
    },
    sidebar: {
        width: '240px',
        minWidth: '240px',
        background:
            'linear-gradient(180deg, #0F3460, #16213E)',
        padding: '30px 20px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 100,
    },
    logo: { color: 'white', fontSize: '22px',
        margin: '0 0 30px 0' },
    navItem: { color: 'white', padding: '12px 16px',
        borderRadius: '10px', marginBottom: '6px',
        cursor: 'pointer', fontSize: '14px' },
    main: {
        marginLeft: '240px',
        padding: '30px',
        flex: 1,
        minWidth: 0,
    },
    header: { display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', color: '#0F3460', margin: 0 },
    addBtn: { padding: '12px 24px',
        background:
            'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none',
        borderRadius: '10px', cursor: 'pointer',
        fontSize: '14px' },
    summaryRow: { display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px', marginBottom: '24px' },
    summaryCard: { borderRadius: '16px',
        padding: '20px', color: 'white' },
    sumLabel: { margin: '0 0 8px 0', fontSize: '12px',
        opacity: 0.8, textTransform: 'uppercase' },
    sumValue: { margin: 0, fontSize: '24px' },
    formCard: { background: 'white', borderRadius: '16px',
        padding: '24px', marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    formRow: { display: 'flex', gap: '16px' },
    input: { width: '100%', padding: '12px 16px',
        marginBottom: '16px', border: '2px solid #eee',
        borderRadius: '10px', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box' },
    submitBtn: { padding: '12px 32px',
        background:
            'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none',
        borderRadius: '10px', cursor: 'pointer',
        fontSize: '14px' },
    list: { display: 'flex', flexDirection: 'column',
        gap: '12px' },
    invCard: { background: 'white', borderRadius: '12px',
        padding: '20px', display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    invLeft: { display: 'flex', alignItems: 'center',
        gap: '16px' },
    symbolBox: { width: '48px', height: '48px',
        background:
            'linear-gradient(135deg, #0F3460, #6C63FF)',
        borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 'bold',
        fontSize: '11px', textAlign: 'center' },
    invName: { margin: 0, fontWeight: 'bold',
        color: '#0F3460' },
    invType: { margin: 0, fontSize: '12px',
        color: '#888' },
    invRight: { display: 'flex', gap: '32px',
        alignItems: 'center' },
    priceCol: { textAlign: 'right' },
    priceLabel: { margin: '0 0 4px 0', fontSize: '11px',
        color: '#888', textTransform: 'uppercase' },
    priceValue: { margin: 0, fontWeight: 'bold',
        color: '#0F3460' },
    deleteBtn: { background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '18px',
        padding: '4px 8px', borderRadius: '8px',
        transition: 'background 0.2s' },
    empty: { textAlign: 'center', padding: '60px',
        color: '#888', background: 'white',
        borderRadius: '16px' },
};

export default Investments;