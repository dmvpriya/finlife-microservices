import axios from 'axios';

const API_BASE = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const login = (data) =>
    api.post('/api/auth/login', data);
export const register = (data) =>
    api.post('/api/auth/register', data);

// Expenses
export const getExpenses = () =>
    api.get('/api/expenses');
export const addExpense = (data) =>
    api.post('/api/expenses', data);
export const deleteExpense = (id) =>
    api.delete(`/api/expenses/${id}`);

// Savings
export const getSavings = () =>
    api.get('/api/savings');
export const addSavings = (data) =>
    api.post('/api/savings', data);
export const addSavingsAmount = (id, amount) =>
    api.put(`/api/savings/${id}/add-savings?amount=${amount}`);

// Budget
export const getBudgets = () =>
    api.get('/api/budgets');
export const setBudget = (data) =>
    api.post('/api/budgets', data);

// Investments
export const getInvestments = () =>
    api.get('/api/investments');
export const addInvestment = (data) =>
    api.post('/api/investments', data);
export const getPortfolioSummary = () =>
    api.get('/api/investments/summary');

// AI Advisor
export const askAdvisor = (data) =>
    api.post('/api/advisor/ask', data);

export const deleteSavingsGoal = (id) =>
    api.delete(`/api/savings/${id}`);

export default api;