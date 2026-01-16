import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/app/components/HomePage';
import LoginPage from '@/app/components/LoginPage';
import AdminPage from '@/app/components/AdminPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;
