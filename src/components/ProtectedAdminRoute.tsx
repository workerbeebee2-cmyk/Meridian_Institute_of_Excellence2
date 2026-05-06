import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../lib/AuthContext';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Requires user and admin role
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}
