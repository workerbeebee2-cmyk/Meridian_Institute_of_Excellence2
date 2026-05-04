import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: Date.now()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contacts');
      setStatus('error');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background-alt">
      <div className="bg-primary pt-16 pb-32 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 font-sans"
          >
            Have questions about our academic programs or admissions? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20">
        <div className="grid lg:grid-cols-5 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
          >
            <h3 className="text-2xl font-bold font-serif text-primary mb-8">Contact Information</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-bold font-sans text-gray-900 mb-1">Our Location</h4>
                  <p className="font-sans text-slate-500">Kahilipara, Guwahati,<br/>Assam, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Phone className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-bold font-sans text-gray-900 mb-1">Phone</h4>
                  <p className="font-sans text-slate-500">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Mail className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="font-bold font-sans text-gray-900 mb-1">Email</h4>
                  <p className="font-sans text-slate-500">info@meridianexcellence.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
               <h4 className="font-bold font-sans text-gray-900 mb-4">Visiting Hours</h4>
               <p className="font-sans text-slate-500 flex justify-between mb-2"><span>Monday - Saturday:</span> <span>09:00 AM - 06:00 PM</span></p>
               <p className="font-sans text-slate-500 flex justify-between"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
          >
            <h3 className="text-2xl font-bold font-serif text-primary mb-8">Send us a message</h3>
            
            {status === 'success' ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100 font-sans">
                <h4 className="font-bold mb-2">Message Sent Successfully!</h4>
                <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium font-sans text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50/50 font-sans transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50/50 font-sans transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium font-sans text-gray-700 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-gray-50/50 font-sans transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-sans font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {status === 'submitting' ? 'Sending...' : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 font-sans text-sm mt-2 text-center">Failed to send message. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>

        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-[400px]"
        >
          <iframe 
            src="https://maps.google.com/maps?q=26.139016834015536,91.77242172910984&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Meridian Institute Location"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
