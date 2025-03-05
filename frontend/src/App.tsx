import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedApp: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome to Your Dashboard</h2>
          <p className="mt-4 text-xl text-gray-600">Hello, {user?.name || 'User'}! 👋</p>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500">You're successfully logged in to the protected area.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<ProtectedApp />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;