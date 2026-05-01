import React from 'react';
import { BrowserRouter, Routes, Route,
         Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Budget from './pages/Budget';
import Investments from './pages/Investments';
import AIAdvisor from './pages/AIAdvisor';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login"
                        element={<Login />} />
                    <Route path="/register"
                        element={<Register />} />
                    <Route path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }/>
                    <Route path="/expenses"
                        element={
                            <PrivateRoute>
                                <Expenses />
                            </PrivateRoute>
                        }/>
                    <Route path="/savings"
                        element={
                            <PrivateRoute>
                                <Savings />
                            </PrivateRoute>
                        }/>
                    <Route path="/budget"
                        element={
                            <PrivateRoute>
                                <Budget />
                            </PrivateRoute>
                        }/>
                    <Route path="/investments"
                        element={
                            <PrivateRoute>
                                <Investments />
                            </PrivateRoute>
                        }/>
                    <Route path="/advisor"
                        element={
                            <PrivateRoute>
                                <AIAdvisor />
                            </PrivateRoute>
                        }/>
                    <Route path="/"
                        element={
                            <Navigate to="/dashboard" />
                        }/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;