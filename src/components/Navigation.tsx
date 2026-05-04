import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { Menu, X, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, role, signOut } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img 
  src="https://i.ibb.co/84tpLBM9/MIE-LOGO-01.png" 
  alt="Meridian Logo" 
  className="w-10 h-10 rounded-full object-cover"
/>
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-none tracking-tight text-primary">
              Meridian
            </h1>
            <p className="text-xs font-sans font-medium tracking-wider uppercase text-accent">
              Institute of Excellence
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'font-sans text-sm font-medium transition-colors hover:text-accent',
                location.pathname === link.path ? 'text-accent' : 'text-slate-600'
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={role === 'admin' ? '/admin' : '/dashboard'}
                className="font-sans text-sm font-medium px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={signOut}
                className="font-sans text-sm font-medium transition-colors text-slate-600 hover:text-accent"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-sans text-sm font-medium px-5 py-2.5 rounded-full transition-all flex items-center gap-2 group bg-primary text-white hover:bg-primary/90"
            >
              Student Portal
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 -mr-2 text-primary"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <Link 
                to="/" 
                className="flex items-center gap-3 flex-1" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <img 
                  src="https://i.ibb.co/84tpLBM9/MIE-LOGO-01.png" 
                  alt="Meridian Logo" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold text-primary leading-none tracking-tight">Meridian</h1>
                  <p className="text-xs font-sans font-medium text-accent tracking-wider uppercase">Institute of Excellence</p>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-primary">
                <X size={24} />
              </button>
            </div>
            
            <nav className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-primary font-medium border-b border-gray-100 pb-4"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link
                      to={role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-sans text-center text-base font-medium px-6 py-3 rounded-full bg-primary text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="font-sans text-base font-medium px-6 py-3 rounded-full border border-gray-200 text-slate-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-sans flex items-center justify-center gap-2 text-base font-medium px-6 py-3 rounded-full bg-primary text-white"
                  >
                    Student Portal
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
