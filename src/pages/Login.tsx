import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { BookOpen, UserCircle, Mail, Lock, Phone, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, role, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extra signup fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [school, setSchool] = useState('');
  const [standard, setStandard] = useState('');
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // OTP Verification state
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cleanup recaptcha on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number first.');
      return;
    }
    
    setError('');
    setIsSendingOtp(true);
    try {
      setupRecaptcha();
      // Ensure phone number is in E.164 format. If not, we might need a country code.
      // For this app, let's assume Indian numbers (+91) if no plus sign
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (err: any) {
      console.error('Error sending OTP', err);
      setError(err?.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    
    setError('');
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otp);
      setIsPhoneVerified(true);
      setIsOtpSent(false);
    } catch (err: any) {
      console.error('Error verifying OTP', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'student') {
        navigate('/dashboard');
      }
    }
  }, [user, role, loading, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    // If on signup tab, validate fields first
    if (!isLogin) {
      if (!name || !age || !school || !standard || !phone) {
        setError('Please fill in all required fields before continuing with Google.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const { isNewUser } = await signInWithGoogle({
        name, age, school, standard, phone, parentName, parentPhone
      });

      if (isNewUser) {
        setIsLogin(false);
        setError('Google account not found. Please complete your registration below to join Meridian.');
        if (auth.currentUser?.displayName && !name) {
          setName(auth.currentUser.displayName);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Google Sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!isPhoneVerified) {
          setError('Please verify your phone number with OTP first.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, {
          name, age, school, standard, phone, parentName, parentPhone
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in Firebase Console. Please contact an admin.');
      } else {
        setError(err?.message || 'Authentication failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-alt p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 relative z-10 my-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-serif text-primary font-bold text-center">
            {isLogin ? 'Student Portal' : 'Create Account'}
          </h2>
          <p className="text-slate-500 font-sans mt-2 text-center text-sm">
            {isLogin 
              ? 'Sign in to access your dashboard, courses, and progress.' 
              : 'Join Meridian to unlock your potential.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-sans rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
          {!isLogin && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCircle size={18} className="text-slate-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  required={!isLogin}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                  placeholder="Age"
                />
              </div>

              <div>
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="standard">Class / Standard</label>
                <input
                  id="standard"
                  type="text"
                  required={!isLogin}
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                  placeholder="Ex: Class 10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="school">School Name</label>
                <input
                  id="school"
                  type="text"
                  required={!isLogin}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                  placeholder="Enter your school name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="phone">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required={!isLogin}
                      disabled={isPhoneVerified}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm disabled:bg-slate-50 disabled:text-slate-400"
                      placeholder="Your contact number"
                    />
                  </div>
                  {!isPhoneVerified && !isOtpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || !phone}
                      className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}
                  {isPhoneVerified && (
                    <div className="flex items-center gap-2 text-emerald-600 px-4">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
              </div>

              {isOtpSent && !isPhoneVerified && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-primary/10"
                >
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-3 text-center">Enter Verification Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="flex-1 px-5 py-3 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none text-center tracking-[0.5em] font-bold text-lg"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otp.length < 6}
                      className="px-8 py-3 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    >
                      {isVerifyingOtp ? <Loader2 size={20} className="animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsOtpSent(false)}
                    className="w-full text-center text-xs text-slate-400 mt-3 hover:text-primary transition-colors"
                  >
                    Change phone number
                  </button>
                </motion.div>
              )}

              {/* Hidden container for ReCAPTCHA */}
              <div id="recaptcha-container"></div>

              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">Parent Information (Optional)</h3>
              </div>

              <div>
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="parentName">Parent's Name</label>
                <input
                  id="parentName"
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                  placeholder="Father/Mother name"
                />
              </div>

              <div>
                <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="parentPhone">Parent's Phone</label>
                <input
                  id="parentPhone"
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                  placeholder="Emergency contact"
                />
              </div>
            </div>
          )}

          <div className={!isLogin ? 'md:col-span-2' : ''}>
            <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                placeholder="Ex. student@example.com"
              />
            </div>
          </div>
          
          <div className={!isLogin ? 'md:col-span-2' : ''}>
            <label className="block text-sm py-1 font-medium text-slate-700 mb-1 ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-primary text-white font-sans font-semibold hover:bg-primary/90 transition-all shadow-md mt-6 disabled:opacity-70"
          >
            {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute border-t border-gray-200 w-full" />
          <div className="bg-white px-4 relative text-sm text-slate-400 font-sans">or</div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-full font-sans font-medium hover:bg-gray-50 transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.27-4.74 3.27-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm font-sans font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
