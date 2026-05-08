import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Shield, Mail, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { SEO } from '../components/SEO';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetmode, setIsResetmode] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      // 1. Sign In
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Check authorizedAdmin collection
      const { doc, getDoc, setDoc } = await import('firebase/firestore');
      const authAdminRef = doc(db, 'authorizedAdmin', user.email || '');
      const authAdminSnap = await getDoc(authAdminRef);

      if (!authAdminSnap.exists()) {
        // Not authorized
        await signOut(auth);
        setError('You are not authorized to access this portal.');
        setLoading(false);
        return;
      }

      // Ensure they have an admin profile in 'users' collection so AuthContext loads them properly
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || userSnap.data().role !== 'admin') {
        await setDoc(userRef, {
          email: user.email,
          role: 'admin',
          name: 'Administrator',
          createdAt: Date.now()
        }, { merge: true });
      }

      // 3. Complete and redirect
      window.location.href = '/admin-dashboard';

    } catch (err: any) {
      console.error(err);
      setError('Access Denied. Invalid credentials.');
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and a valid password.');
      return;
    }
    setError('');
    setMsg('');
    setLoading(true);

    try {
      // 1. Check if email is in whitelist BEFORE creating user
      const { doc, getDoc, setDoc } = await import('firebase/firestore');
      const authAdminRef = doc(db, 'authorizedAdmin', email);
      const authAdminSnap = await getDoc(authAdminRef);

      if (!authAdminSnap.exists()) {
        setError('You are not authorized to create an admin account.');
        setLoading(false);
        return;
      }

      // 2. Authorized - create account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Create admin profile in users collection
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        role: 'admin',
        name: 'Administrator',
        createdAt: Date.now()
      });

      // 4. Redirect
      window.location.href = '/admin-dashboard';

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Account already exists. Please login or reset password.');
      } else {
        setError('Failed to setup account: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }
    setError('');
    setMsg('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg('Password reset email sent. Please check your inbox.');
      setIsResetmode(false);
    } catch (err) {
      setError('Failed to send reset email. Verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <SEO title="Admin Login" description="Secure admin access portal." />
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-primary pt-8 pb-6 px-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-white/70 text-sm font-sans">Secure access for authorized personnel only</p>
          </div>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-sans rounded-xl flex gap-3 items-start border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          {msg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-sans rounded-xl flex gap-3 items-start border border-green-100">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p>{msg}</p>
            </div>
          )}

          {!isResetmode && !isSetupMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium font-sans text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="admin@meridian.edu"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium font-sans text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-sans font-medium hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetmode(true);
                    setError('');
                    setMsg('');
                  }}
                  className="text-sm font-sans text-slate-500 hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(true);
                    setError('');
                    setMsg('');
                  }}
                  className="text-sm font-sans text-slate-500 hover:text-primary transition-colors"
                >
                  First time? Setup Account
                </button>
              </div>
            </form>
          ) : isSetupMode ? (
            <form onSubmit={handleSetup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium font-sans text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="admin@meridian.edu"
                  />
                </div>
                <p className="text-xs text-slate-500 font-sans ml-1 pt-1">
                  Must match an authorized email.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-sans text-slate-700 ml-1">Create Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(false);
                    setError('');
                    setMsg('');
                  }}
                  className="flex-1 py-3 border border-gray-200 text-slate-600 rounded-xl font-sans font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-sans font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium font-sans text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="admin@meridian.edu"
                  />
                </div>
                <p className="text-xs text-slate-500 font-sans ml-1 pt-1">
                  We'll send a link to reset your password.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetmode(false);
                    setError('');
                    setMsg('');
                  }}
                  className="flex-1 py-3 border border-gray-200 text-slate-600 rounded-xl font-sans font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-sans font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
