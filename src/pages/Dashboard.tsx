import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role === 'admin')) {
      navigate('/login');
    }
  }, [user, loading, role, navigate]);

  useEffect(() => {
    async function fetchMyData() {
      if (!user) return;
      try {
        const q = query(collection(db, 'enrollments'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEnrollments(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'student-dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMyData();
  }, [user]);

  if (loading || isLoading) {
    return <div className="min-h-screen pt-32 flex items-center justify-center">Loading portal...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-white mb-8 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!</h1>
              <p className="text-white/80 font-sans text-lg">Your learning journey continues. You have 0 assignments due this week.</p>
            </div>
            <div className="flex md:justify-end gap-4">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                  <div className="text-3xl font-bold mb-1">{enrollments.length}</div>
                  <div className="text-xs font-sans uppercase tracking-wider text-white/70">Active Courses</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                  <div className="text-3xl font-bold mb-1 border-b-2 border-accent inline-block">A+</div>
                  <div className="text-xs font-sans uppercase tracking-wider text-white/70">Avg Grade</div>
               </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-serif text-primary flex items-center gap-3">
              <BookOpen className="text-accent translate-y-[2px]" /> My Courses
            </h2>
            
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">No active enrollments</h3>
                <p className="text-slate-500 font-sans mb-6">You aren't enrolled in any courses yet. Browse our catalog to start learning.</p>
                <button onClick={() => navigate('/courses')} className="bg-primary text-white px-6 py-3 rounded-full font-sans font-medium hover:bg-primary/90 transition-colors">
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {enrollments.map((enr, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold font-serif text-lg text-primary">Course ID: {enr.courseId}</h4>
                        <p className="font-sans text-sm text-slate-500">Status: <span className="capitalize text-emerald-600 font-medium">{enr.status}</span></p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-accent transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
             <h2 className="text-2xl font-bold font-serif text-primary">Upcoming</h2>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-50">
                   <div className="mt-1 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                     <Clock size={16} />
                   </div>
                   <div>
                     <h4 className="font-sans font-bold text-gray-900 text-sm">Mathematics Weekly Test</h4>
                     <p className="font-sans text-xs text-slate-500 mt-1">Tomorrow, 10:00 AM</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 pt-4">
                   <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <BookOpen size={16} />
                   </div>
                   <div>
                     <h4 className="font-sans font-bold text-gray-900 text-sm">Physics Concept Session</h4>
                     <p className="font-sans text-xs text-slate-500 mt-1">Friday, 02:00 PM</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
