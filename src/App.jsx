import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProProfile from './pages/ProProfile';
import Login from './pages/Login';
import SignupClient from './pages/SignupClient';
import SignupPro from './pages/SignupPro';
import ClientDashboard from './pages/ClientDashboard';
import ProDashboard from './pages/ProDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<SearchResults />} />
          <Route path="/pro/:id" element={<ProProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-client" element={<SignupClient />} />
          <Route path="/signup-pro" element={<SignupPro />} />
          <Route path="/dashboard" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
          <Route path="/pro-dashboard" element={<ProtectedRoute role="pro"><ProDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
