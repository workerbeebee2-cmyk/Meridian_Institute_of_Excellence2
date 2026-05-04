import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BookOpen, Clock, Award, ChevronRight, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProfileModal from '../components/ProfileModal';

export default function Dashboard() {
  const { user, profile, loading, role } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
              <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                Welcome to Meridian Institute of Excellence, <span className="text-accent">{profile?.name?.split(' ')[0] || 'Student'}</span>!
              </h1>
              <p className="text-white/80 font-sans text-lg max-w-md">
                We are thrilled to have you here. Your journey towards academic mastery and conceptual depth continues today.
              </p>
            </div>
            <div className="flex md:justify-end gap-4">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
                  <div className="text-3xl font-bold mb-1">{enrollments.length}</div>
                  <div className="text-xs font-sans uppercase tracking-wider text-white/70">Active Courses</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
                  <div className="text-3xl font-bold mb-1 border-b-2 border-accent inline-block">A+</div>
                  <div className="text-xs font-sans uppercase tracking-wider text-white/70">Avg Grade</div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold font-serif text-primary flex items-center gap-3 mb-6">
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
            </section>
          </div>

          {/* Sidebar - Student Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-primary flex items-center gap-3">
               Student Profile
            </h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 border-4 border-white shadow-sm overflow-hidden">
                  {profile?.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold font-serif">{profile?.name?.charAt(0).toUpperCase() || 'S'}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-primary font-serif">{profile?.name || 'Student Name'}</h3>
                <p className="text-slate-500 font-sans text-sm">{role === 'student' ? 'Student' : 'Admin'}</p>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-50">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300 mb-1">Email Address</p>
                  <p className="font-sans font-medium text-slate-800 break-all text-sm">{profile?.email || user?.email}</p>
                </div>
                {profile?.school && (
                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300 mb-1">School</p>
                    <p className="font-sans font-medium text-slate-800 text-sm">{profile.school}</p>
                  </div>
                )}
                {profile?.standard && (
                  <div className="pb-4 border-b border-gray-50">
                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300 mb-1">Class</p>
                    <p className="font-sans font-medium text-slate-800 text-sm">{profile.standard}</p>
                  </div>
                )}
                <div className="pt-2">
                   <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-full py-3 rounded-full border border-primary/20 text-primary font-sans text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                   >
                     Edit Profile
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
