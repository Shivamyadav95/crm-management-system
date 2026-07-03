import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Sales from './pages/Sales';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute><Customers /></ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute><Leads /></ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute><Tasks /></ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute><Sales /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
