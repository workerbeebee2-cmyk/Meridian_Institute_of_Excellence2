import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle, School, Phone as PhoneIcon, Users, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { GoogleGenAI } from '@google/genai';
import { auth as firebaseAuth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

let aiInstance: GoogleGenAI | null = null;
const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }
  return aiInstance;
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    school: profile?.school || '',
    standard: profile?.standard || '',
    phone: profile?.phone || '',
    parentName: profile?.parentName || '',
    parentPhone: profile?.parentPhone || '',
    photo: profile?.photo || ''
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP State
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(!!profile?.phone);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Sync with profile data when modal opens
  React.useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        school: profile.school || '',
        standard: profile.standard || '',
        phone: profile.phone || '',
        parentName: profile.parentName || '',
        parentPhone: profile.parentPhone || '',
        photo: profile.photo || ''
      });
      setIsPhoneVerified(!!profile.phone);
      setVerificationError('');
      setIsOtpSent(false);
    }
  }, [isOpen, profile]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container-modal', {
        'size': 'invisible'
      });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone) return;
    setIsSendingOtp(true);
    setVerificationError('');
    try {
      setupRecaptcha();
      const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;
      const result = await signInWithPhoneNumber(firebaseAuth, formattedPhone, window.recaptchaVerifier!);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (err: any) {
      setVerificationError(err?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setIsVerifyingOtp(true);
    try {
      await confirmationResult.confirm(otp);
      setIsPhoneVerified(true);
      setIsOtpSent(false);
    } catch (err) {
      setVerificationError('Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'phone' && value !== profile?.phone) {
      setIsPhoneVerified(false);
    } else if (id === 'phone' && value === profile?.phone) {
      setIsPhoneVerified(true);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Basic validation
    if (!file.type.startsWith('image/')) {
      setVerificationError('Please select a valid image file.');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      // Convert to base64 for Gemini
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64StringWithPrefix = await base64Promise;
      const base64Data = base64StringWithPrefix.split(',')[1];
      const mimeType = file.type;

      // 2. AI Verification
      if (!process.env.GEMINI_API_KEY) {
         setVerificationError('GEMINI API Key is missing. Cannot verify photo.');
         setIsVerifying(false);
         return;
      }
      const aiClient = getAi();
      const response = await aiClient.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: "Analyze this image for a student profile system. It must be a clear headshot of a single person's face. It must look professional/educational. If it is a clear face photo, reply exactly with 'APPROVED'. If there are multiple people, no people, objects instead of faces, or any inappropriate content, reply with 'REJECTED: [Reason]'."
            }
          ]
        }
      });

      const resultText = response.text || '';
      if (resultText.includes('APPROVED')) {
        setFormData(prev => ({ ...prev, photo: base64StringWithPrefix }));
        setVerificationError('');
      } else {
        const reason = resultText.replace('REJECTED:', '').trim() || 'Not a valid face photo';
        setVerificationError(`Photo Rejected: ${reason}`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Photo verification error:', err);
      setVerificationError('AI Verification failed. Please try a different photo.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif">Edit Student Profile</h2>
                <p className="text-white/70 text-sm font-sans">Keep your information up to date</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                id="close-profile-modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Photo Upload Section */}
                <div className="md:col-span-2 flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center relative">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={64} className="text-slate-300" />
                      )}
                      
                      {isVerifying && (
                        <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white text-[10px] uppercase tracking-tighter">
                          <Loader2 size={24} className="animate-spin mb-1" />
                          Verifying...
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2 bg-[#d4a017] text-white rounded-full shadow-lg hover:brightness-110 transition-all z-20"
                      disabled={isVerifying}
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <p className="text-xs text-slate-400 mt-4 font-sans max-w-[240px] text-center">
                    Upload a clear face photo. AI will verify suitability.
                  </p>
                  {verificationError && (
                    <div className="mt-3 flex items-start gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-sans font-medium max-w-sm">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      {verificationError}
                    </div>
                  )}
                  {formData.photo && !verificationError && !isVerifying && (
                    <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-[10px] font-sans font-bold uppercase tracking-widest">
                      <CheckCircle2 size={12} /> AI Verified
                    </div>
                  )}
                </div>

                {/* Row 1: Name and Class */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                    placeholder="AB Bee"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="standard">Class / Standard</label>
                  <input
                    id="standard"
                    type="text"
                    required
                    value={formData.standard}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                    placeholder="7"
                  />
                </div>

                {/* Row 2: Age and School */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="school">School Name</label>
                  <input
                    id="school"
                    type="text"
                    required
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                    placeholder="ABCD"
                  />
                </div>

                {/* Row 3: Phone Number */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="phone">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PhoneIcon size={16} className="text-slate-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isPhoneVerified && formData.phone === profile?.phone}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm disabled:text-slate-400"
                        placeholder="9876543210"
                      />
                    </div>
                    {!isPhoneVerified && !isOtpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.phone}
                        className="px-6 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {isSendingOtp ? 'Sending...' : 'Verify'}
                      </button>
                    )}
                    {isPhoneVerified && (
                      <div className="flex items-center gap-2 text-emerald-600 px-2 group cursor-pointer" onClick={() => formData.phone === profile?.phone && setIsPhoneVerified(false)}>
                        <CheckCircle2 size={24} />
                        {formData.phone === profile?.phone && (
                          <span className="text-[10px] hidden group-hover:block font-sans">Change</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isOtpSent && !isPhoneVerified && (
                  <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-primary/5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 text-center">Verify via OTP</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-100 outline-none text-center tracking-[0.5em] font-bold"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || otp.length < 6}
                        className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {isVerifyingOtp ? <Loader2 size={18} className="animate-spin" /> : 'Confirm'}
                      </button>
                    </div>
                    <div id="recaptcha-container-modal"></div>
                  </div>
                )}

                {/* Parent Info Section */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="flex items-center gap-2 text-primary/80 text-xs font-bold font-serif border-b border-gray-100/50 pb-2 mb-5 uppercase tracking-wider">
                    <Users size={14} className="text-[#d4a017]" /> Parent Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="parentName">Parent's Name</label>
                      <input
                        id="parentName"
                        type="text"
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                        placeholder="Google Bee"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1" htmlFor="parentPhone">Parent's Phone</label>
                      <input
                        id="parentPhone"
                        type="tel"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-sans text-sm"
                        placeholder="7584563215"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-8 py-4 rounded-2xl border border-gray-200 text-slate-600 font-sans font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isVerifying || (!isPhoneVerified && formData.phone !== profile?.phone)}
                  className="flex-1 px-8 py-4 rounded-2xl bg-[#0f172a] text-white font-sans font-bold hover:bg-[#1e293b] transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 size={18} className="animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
