import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses, getSavings,
         getPortfolioSummary, getBudgets } from '../services/api';
import { PieChart, Pie, Cell, Tooltip,
         ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6C63FF', '#0F3460', '#E94560',
                '#16213E', '#F5A623', '#2ECC71'];

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [savings, setSavings] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [expRes, savRes, portRes, budRes] =
                await Promise.all([
                    getExpenses(),
                    getSavings(),
                    getPortfolioSummary(),
                    getBudgets(),
                ]);
            setExpenses(expRes.data);
            setSavings(savRes.data);
            setPortfolio(portRes.data);
            setBudgets(budRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalExpenses = expenses.reduce(
        (sum, e) => sum + e.amount, 0);

    const expenseByCategory = expenses.reduce((acc, e) => {
        const found = acc.find(
            item => item.name === e.category);
        if (found) found.value += e.amount;
        else acc.push({ name: e.category, value: e.amount });
        return acc;
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (loading) return (
        <div style={styles.loading}>Loading FinLife... 💰</div>
    );

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>💰 FinLife</h2>
                <p style={styles.userEmail}>
                    {user?.email}
                </p>
                <nav>
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
                        <div
                            key={item.path}
                            style={styles.navItem}
                            onClick={() =>
                                navigate(item.path)}>
                            {item.label}
                        </div>
                    ))}
                </nav>
                <button
                    style={styles.logoutBtn}
                    onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                <h1 style={styles.title}>
                    Welcome back, {user?.firstName}! 👋
                </h1>

                {/* Stats Cards */}
                <div style={styles.cardsRow}>
                    <div style={{...styles.card,
                        background: 'linear-gradient(135deg, #0F3460, #6C63FF)'}}>
                        <p style={styles.cardLabel}>
                            Total Expenses
                        </p>
                        <h2 style={styles.cardValue}>
                            ₹{totalExpenses.toFixed(2)}
                        </h2>
                        <p style={styles.cardSub}>
                            {expenses.length} transactions
                        </p>
                    </div>

                    <div style={{...styles.card,
                        background: 'linear-gradient(135deg, #1B6B3A, #2ECC71)'}}>
                        <p style={styles.cardLabel}>
                            Savings Goals
                        </p>
                        <h2 style={styles.cardValue}>
                            {savings.length}
                        </h2>
                        <p style={styles.cardSub}>
                            Active goals
                        </p>
                    </div>

                    <div style={{...styles.card,
                        background: portfolio?.performance
                            === 'PROFIT'
                            ? 'linear-gradient(135deg, #1B6B3A, #2ECC71)'
                            : 'linear-gradient(135deg, #E94560, #C0392B)'}}>
                        <p style={styles.cardLabel}>
                            Portfolio P&L
                        </p>
                        <h2 style={styles.cardValue}>
                            ₹{portfolio?.profitLoss
                                ?.toFixed(2) || '0.00'}
                        </h2>
                        <p style={styles.cardSub}>
                            {portfolio?.performance || 'N/A'}
                        </p>
                    </div>

                    <div style={{...styles.card,
                        background: 'linear-gradient(135deg, #E94560, #F5A623)'}}>
                        <p style={styles.cardLabel}>
                            Budget Alerts
                        </p>
                        <h2 style={styles.cardValue}>
                            {budgets.filter(b =>
                                b.alertStatus === 'WARNING'
                                || b.alertStatus === 'EXCEEDED'
                            ).length}
                        </h2>
                        <p style={styles.cardSub}>
                            Need attention
                        </p>
                    </div>
                </div>

                {/* Charts Row */}
                <div style={styles.chartsRow}>
                    {/* Expense Pie Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>
                            Expenses by Category
                        </h3>
                        {expenseByCategory.length > 0 ? (
                            <ResponsiveContainer
                                width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={expenseByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({name, value}) =>
                                            `${name}: ₹${value}`}>
                                        {expenseByCategory
                                            .map((_, i) => (
                                            <Cell key={i}
                                                fill={
                                                    COLORS[i %
                                                    COLORS.length]
                                                }/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={styles.noData}>
                                No expenses yet!
                            </p>
                        )}
                    </div>

                    {/* Savings Progress */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>
                            Savings Goals Progress
                        </h3>
                        {savings.length > 0 ? (
                            savings.slice(0, 3).map(goal => (
                                <div key={goal.id}
                                    style={styles.goalItem}>
                                    <div style={
                                        styles.goalHeader}>
                                        <span>{goal.title}</span>
                                        <span style={{
                                            color: '#6C63FF',
                                            fontWeight: 'bold'
                                        }}>
                                            {goal
                                            .progressPercentage
                                            .toFixed(1)}%
                                        </span>
                                    </div>
                                    <div style={
                                        styles.progressBar}>
                                        <div style={{
                                            ...styles.progressFill,
                                            width: `${Math.min(
                                                goal
                                                .progressPercentage,
                                                100)}%`
                                        }}/>
                                    </div>
                                    <p style={styles.goalSub}>
                                        ₹{goal.savedAmount} /
                                        ₹{goal.targetAmount}
                                        {' '}• Save ₹
                                        {goal.monthlySavingsNeeded}
                                        /month
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={styles.noData}>
                                No savings goals yet!
                            </p>
                        )}
                    </div>
                </div>

                {/* Budget Alerts */}
                {budgets.filter(b =>
                    b.alertStatus !== 'SAFE').length > 0 && (
                    <div style={styles.alertsCard}>
                        <h3 style={styles.chartTitle}>
                            ⚠️ Budget Alerts
                        </h3>
                        {budgets
                            .filter(b =>
                                b.alertStatus !== 'SAFE')
                            .map(b => (
                            <div key={b.id}
                                style={{
                                    ...styles.alertItem,
                                    borderLeft: `4px solid ${
                                        b.alertStatus ===
                                        'EXCEEDED'
                                            ? '#E94560'
                                            : '#F5A623'}`
                                }}>
                                <span style={{fontWeight:'bold'}}>
                                    {b.category}
                                </span>
                                <span style={{
                                    color: b.alertStatus ===
                                        'EXCEEDED'
                                        ? '#E94560' : '#F5A623',
                                    fontWeight: 'bold'
                                }}>
                                    {b.alertStatus} —{' '}
                                    {b.utilizationPercentage
                                        .toFixed(1)}% used
                                </span>
                            </div>
                        ))}
                    </div>
                )}
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
        background: 'linear-gradient(180deg, #0F3460, #16213E)',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
    },
    logo: {
        color: 'white',
        fontSize: '22px',
        margin: '0 0 4px 0',
    },
    userEmail: {
        color: '#90CAF9',
        fontSize: '11px',
        marginBottom: '30px',
        wordBreak: 'break-all',
    },
    navItem: {
        color: 'white',
        padding: '12px 16px',
        borderRadius: '10px',
        marginBottom: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s',
    },
    logoutBtn: {
        marginTop: 'auto',
        padding: '12px',
        background: 'rgba(233,69,96,0.2)',
        color: '#E94560',
        border: '1px solid #E94560',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '20px',
    },
    main: {
        marginLeft: '240px',
        padding: '30px',
        flex: 1,
    },
    title: {
        fontSize: '24px',
        color: '#0F3460',
        marginBottom: '24px',
    },
    cardsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px',
    },
    card: {
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
    },
    cardLabel: {
        fontSize: '12px',
        opacity: 0.8,
        margin: '0 0 8px 0',
        textTransform: 'uppercase',
    },
    cardValue: {
        fontSize: '24px',
        margin: '0 0 4px 0',
    },
    cardSub: {
        fontSize: '12px',
        opacity: 0.7,
        margin: 0,
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '24px',
    },
    chartCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
    chartTitle: {
        fontSize: '16px',
        color: '#0F3460',
        marginBottom: '16px',
    },
    goalItem: {
        marginBottom: '16px',
    },
    goalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '14px',
    },
    progressBar: {
        height: '8px',
        background: '#eee',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #6C63FF, #0F3460)',
        borderRadius: '4px',
        transition: 'width 0.5s',
    },
    goalSub: {
        fontSize: '11px',
        color: '#888',
        margin: '4px 0 0 0',
    },
    alertsCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
    alertItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px',
        marginBottom: '8px',
        background: '#FFF9F9',
        borderRadius: '8px',
        fontSize: '14px',
    },
    noData: {
        color: '#888',
        textAlign: 'center',
        padding: '40px 0',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#0F3460',
    },
};

export default Dashboard;