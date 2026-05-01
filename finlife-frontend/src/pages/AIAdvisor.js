import React, { useState, useRef, useEffect } from 'react';
import { askAdvisor } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AIAdvisor = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm FinLife AI 🤖 Your personal " +
                "financial advisor. Ask me anything about " +
                "your expenses, savings, investments or " +
                "how to reach your financial goals!"
        }
    ]);
    const [conversationHistory, setConversationHistory] =
        useState([]);
    const [input, setInput] = useState('');
    const [context, setContext] = useState({
        monthlyIncome: '', totalExpenses: '',
        totalSavings: '', savingsGoal: '',
        savingsGoalTarget: '', savingsGoalProgress: ''
    });
    const [showContext, setShowContext] = useState(false);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView(
            { behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);

        const newHistory = [
            ...conversationHistory,
            { role: 'user', content: input }
        ];
        setConversationHistory(newHistory);
        setInput('');
        setLoading(true);

        try {
            const contextData = {};
            if (context.monthlyIncome)
                contextData.monthlyIncome =
                    parseFloat(context.monthlyIncome);
            if (context.totalExpenses)
                contextData.totalExpenses =
                    parseFloat(context.totalExpenses);
            if (context.totalSavings)
                contextData.totalSavings =
                    parseFloat(context.totalSavings);
            if (context.savingsGoal)
                contextData.savingsGoal = context.savingsGoal;
            if (context.savingsGoalTarget)
                contextData.savingsGoalTarget =
                    parseFloat(context.savingsGoalTarget);
            if (context.savingsGoalProgress)
                contextData.savingsGoalProgress =
                    parseFloat(context.savingsGoalProgress);

            // Build question with history context
            const historyText = newHistory
                .slice(-6) // last 3 exchanges
                .map(m => `${m.role === 'user'
                    ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            const fullQuestion = newHistory.length > 1
                ? `Previous conversation:\n${historyText}\n\nNew question: ${input}`
                : input;

            const res = await askAdvisor({
                question: fullQuestion,
                context: Object.keys(contextData).length > 0
                    ? contextData : null
            });

            const aiReply = res.data.advice;
            setMessages(prev => [...prev, {
                role: 'assistant', content: aiReply
            }]);
            setConversationHistory(prev => [
                ...prev,
                { role: 'assistant', content: aiReply }
            ]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. ' +
                    'Please try again!'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickQuestions = [
        "How can I save more money?",
        "Best way to invest ₹10,000?",
        "How to create emergency fund?",
        "Tips to reduce food expenses?",
        "How to plan for retirement?",
    ];

    const navItems = [
        { label: '🏠 Dashboard', path: '/dashboard' },
        { label: '💸 Expenses', path: '/expenses' },
        { label: '🎯 Savings', path: '/savings' },
        { label: '📊 Budget', path: '/budget' },
        { label: '📈 Investments', path: '/investments' },
        { label: '🤖 AI Advisor', path: '/advisor' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>💰 FinLife</h2>
                {navItems.map(item => (
                    <div key={item.path}
                        style={{
                            ...styles.navItem,
                            background:
                                item.path === '/advisor'
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
                    <div>
                        <h1 style={styles.title}>
                            🤖 AI Financial Advisor
                        </h1>
                        <p style={styles.subtitle}>
                            Powered by LLaMA 3 via Groq
                            — remembers conversation context
                        </p>
                    </div>
                    <div style={{ display: 'flex',
                        gap: '10px' }}>
                        <button
                            style={styles.clearBtn}
                            onClick={() => {
                                setMessages([{
                                    role: 'assistant',
                                    content: "Hi! I'm FinLife AI 🤖 Ask me anything!"
                                }]);
                                setConversationHistory([]);
                            }}>
                            🗑️ Clear Chat
                        </button>
                        <button
                            style={styles.contextBtn}
                            onClick={() =>
                                setShowContext(!showContext)}>
                            ⚙️ Set Context
                        </button>
                    </div>
                </div>

                {showContext && (
                    <div style={styles.contextCard}>
                        <h3 style={{ color: '#0F3460',
                            marginBottom: '12px',
                            fontSize: '14px' }}>
                            Your Financial Context (helps AI
                            give personalized advice)
                        </h3>
                        <div style={styles.ctxRow}>
                            <input style={styles.ctxInput}
                                placeholder="Monthly Income (₹)"
                                value={context.monthlyIncome}
                                onChange={e => setContext({
                                    ...context,
                                    monthlyIncome:
                                        e.target.value })}/>
                            <input style={styles.ctxInput}
                                placeholder="Total Expenses (₹)"
                                value={context.totalExpenses}
                                onChange={e => setContext({
                                    ...context,
                                    totalExpenses:
                                        e.target.value })}/>
                            <input style={styles.ctxInput}
                                placeholder="Total Savings (₹)"
                                value={context.totalSavings}
                                onChange={e => setContext({
                                    ...context,
                                    totalSavings:
                                        e.target.value })}/>
                        </div>
                        <div style={styles.ctxRow}>
                            <input style={styles.ctxInput}
                                placeholder="Savings Goal Name"
                                value={context.savingsGoal}
                                onChange={e => setContext({
                                    ...context,
                                    savingsGoal:
                                        e.target.value })}/>
                            <input style={styles.ctxInput}
                                placeholder="Goal Target (₹)"
                                value={context.savingsGoalTarget}
                                onChange={e => setContext({
                                    ...context,
                                    savingsGoalTarget:
                                        e.target.value })}/>
                            <input style={styles.ctxInput}
                                placeholder="Goal Progress (₹)"
                                value={
                                    context.savingsGoalProgress}
                                onChange={e => setContext({
                                    ...context,
                                    savingsGoalProgress:
                                        e.target.value })}/>
                        </div>
                    </div>
                )}

                <div style={styles.quickRow}>
                    {quickQuestions.map((q, i) => (
                        <button key={i}
                            style={styles.quickBtn}
                            onClick={() => setInput(q)}>
                            {q}
                        </button>
                    ))}
                </div>

                <div style={styles.chatWindow}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent:
                                msg.role === 'user'
                                ? 'flex-end' : 'flex-start',
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                maxWidth: '75%',
                                padding: '14px 18px',
                                borderRadius:
                                    msg.role === 'user'
                                    ? '18px 18px 4px 18px'
                                    : '18px 18px 18px 4px',
                                background:
                                    msg.role === 'user'
                                    ? 'linear-gradient(135deg, #0F3460, #6C63FF)'
                                    : 'white',
                                color: msg.role === 'user'
                                    ? 'white' : '#333',
                                boxShadow:
                                    '0 2px 8px rgba(0,0,0,0.08)',
                            }}>
                                {msg.role === 'assistant' && (
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        color: '#6C63FF',
                                        display: 'block',
                                        marginBottom: '6px'
                                    }}>
                                        🤖 FinLife AI
                                    </span>
                                )}
                                <p style={{
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontSize: '14px',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex',
                            justifyContent: 'flex-start',
                            marginBottom: '12px' }}>
                            <div style={{
                                padding: '14px 18px',
                                background: 'white',
                                borderRadius:
                                    '18px 18px 18px 4px',
                                color: '#888',
                                boxShadow:
                                    '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                🤖 Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef}/>
                </div>

                <div style={styles.inputRow}>
                    <input
                        style={styles.chatInput}
                        placeholder="Ask me anything about
                        your finances..."
                        value={input}
                        onChange={e =>
                            setInput(e.target.value)}
                        onKeyPress={e =>
                            e.key === 'Enter' && handleSend()}
                    />
                    <button
                        style={{
                            ...styles.sendBtn,
                            opacity: loading ? 0.6 : 1
                        }}
                        onClick={handleSend}
                        disabled={loading}>
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#F0F2F5'
    },
    sidebar: {
        width: '240px',
        minWidth: '240px',
        background:
            'linear-gradient(180deg, #0F3460, #16213E)',
        padding: '30px 20px',
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
    },
    logo: { color: 'white', fontSize: '22px',
        margin: '0 0 30px 0' },
    navItem: { color: 'white', padding: '12px 16px',
        borderRadius: '10px', marginBottom: '6px',
        cursor: 'pointer', fontSize: '14px' },
    main: {
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        flexShrink: 0,
    },
    title: { fontSize: '22px', color: '#0F3460', margin: 0 },
    subtitle: { color: '#888', fontSize: '12px',
        margin: '4px 0 0 0' },
    contextBtn: { padding: '8px 16px', background: 'white',
        color: '#0F3460', border: '2px solid #0F3460',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '12px' },
    clearBtn: { padding: '8px 16px',
        background: 'rgba(233,69,96,0.1)',
        color: '#E94560',
        border: '2px solid #E94560',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '12px' },
    contextCard: { background: 'white', borderRadius: '12px',
        padding: '16px', marginBottom: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        flexShrink: 0 },
    ctxRow: { display: 'flex', gap: '10px',
        marginBottom: '10px' },
    ctxInput: { flex: 1, padding: '8px 12px',
        border: '2px solid #eee', borderRadius: '8px',
        fontSize: '12px', outline: 'none' },
    quickRow: { display: 'flex', flexWrap: 'wrap',
        gap: '6px', marginBottom: '12px', flexShrink: 0 },
    quickBtn: { padding: '6px 12px', background: 'white',
        color: '#6C63FF', border: '2px solid #6C63FF',
        borderRadius: '20px', cursor: 'pointer',
        fontSize: '11px' },
    chatWindow: {
        flex: 1,
        background: '#F8F9FA',
        borderRadius: '16px',
        padding: '16px',
        overflowY: 'auto',
        marginBottom: '12px',
        minHeight: 0,
    },
    inputRow: { display: 'flex', gap: '10px',
        flexShrink: 0 },
    chatInput: { flex: 1, padding: '12px 18px',
        border: '2px solid #eee', borderRadius: '12px',
        fontSize: '14px', outline: 'none' },
    sendBtn: { padding: '12px 22px',
        background:
            'linear-gradient(135deg, #0F3460, #6C63FF)',
        color: 'white', border: 'none',
        borderRadius: '12px', cursor: 'pointer',
        fontSize: '18px' },
};

export default AIAdvisor;