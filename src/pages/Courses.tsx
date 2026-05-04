import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Fetch from Firestore or use dummy data if empty for display purposes
        const snapshot = await getDocs(collection(db, 'courses'));
        if (!snapshot.empty) {
          setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          // Placeholder data for display before admin adds real courses
          setCourses([
            { id: '1', title: 'Foundation Program (Class 8-10)', description: 'Building a strong base in Mathematics and Science to prepare for board exams and future competitive tests.', subjects: ['Mathematics', 'Science', 'English'], classLevel: 'Secondary' },
            { id: '2', title: 'Pre-University Science (Class 11-12)', description: 'Rigorous coaching for Science students focusing on conceptual clarity and numerical problem solving.', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], classLevel: 'Higher Secondary' },
            { id: '3', title: 'Humanities & Arts (Class 11-12)', description: 'Comprehensive guidance for Arts students with focus on critical analysis and writing skills.', subjects: ['Political Science', 'History', 'Geography', 'Economics'], classLevel: 'Higher Secondary' }
          ]);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'courses-page');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCourses();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-16 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-6"
          >
            Academic Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 font-sans"
          >
            Discover our meticulously designed courses tailored to unlock every student's potential through our Learn, Think, Achieve philosophy.
          </motion.p>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12">
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">Loading courses...</div>
        ) : (
          <div className="grid gap-8">
            {courses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row gap-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-background-alt rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                
                <div className="flex-1">
                  <div className="text-sm font-sans font-bold text-accent mb-3 tracking-wider uppercase">{course.classLevel}</div>
                  <h2 className="text-3xl font-bold font-serif text-primary mb-4">{course.title}</h2>
                  <p className="text-slate-600 font-sans leading-relaxed mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {course.subjects?.map((sub: string) => (
                      <span key={sub} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-sans font-medium text-slate-600">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-sans font-medium hover:bg-primary/90 transition-colors">
                    Inquire Now <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="md:w-72 bg-background-alt rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-serif font-bold text-primary text-lg mb-4">Program Highlights</h3>
                  <ul className="space-y-3">
                    {['Small batch sizes', 'Weekly monitoring', 'Parent interactions', 'Expert faculty'].map((highlight, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                        <span className="font-sans text-sm text-slate-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
