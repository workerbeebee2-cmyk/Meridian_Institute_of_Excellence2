import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, BookOpen, Calendar, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Admin() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0
  });

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && role !== 'admin') {
      navigate('/login');
    }
  }, [role, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (role !== 'admin') return;
      
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
        
        setStats({
          users: usersSnapshot.size,
          courses: coursesSnapshot.size,
          enrollments: enrollmentsSnapshot.size
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admin-dashboard');
      } finally {
        setIsLoadingData(false);
      }
    }
    
    fetchData();
  }, [role]);

  if (loading || isLoadingData) {
    return <div className="min-h-screen pt-32 flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Admin Control Panel</h1>
            <p className="font-sans text-slate-500 mt-1">Manage users, courses, and site content.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-sans font-medium hover:bg-primary/90 transition-colors">
            <Plus size={18} />
            Add New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stat Cards */}
          {[
            { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Total Enrollments', value: stats.enrollments, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
            { label: 'New Messages', value: '0', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-sans">{stat.value}</div>
                <div className="text-sm font-sans text-slate-500 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Quick Actions Pending</h3>
            <p className="text-slate-500 font-sans max-w-md">The admin architecture is fully set up. Content management features, enrollment approvals, and payment integrations will appear here.</p>
        </div>
      </div>
    </div>
  );
}
