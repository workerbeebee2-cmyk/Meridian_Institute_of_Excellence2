import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Events() {
  const events = [
    {
      title: "Annual Bihu Workshop",
      date: "April 10 - April 14, 2026",
      time: "03:00 PM - 06:00 PM",
      location: "Meridian Campus Grounds",
      desc: "Immerse yourself in cultural heritage. Learn traditional Bihu dance and Dhol playing from expert artists. Open to all students and family members.",
      image: "https://i.ibb.co/7Jcpv37J/Bihu.png",
      featured: true,
      isPast: true
    },
    {
      title: "Science & Innovation Fair",
      date: "May 20, 2026",
      time: "10:00 AM - 04:00 PM",
      location: "Main Auditorium",
      desc: "Our annual showcase where students present their science projects and conceptual models.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000",
      featured: false,
      isPast: false
    },
    {
      title: "Parent-Teacher Interaction Session",
      date: "June 05, 2026",
      time: "09:00 AM - 01:00 PM",
      location: "Block A Classrooms",
      desc: "A dedicated session to discuss student progress, conceptual understanding, and tailored growth plans.",
      image: "https://i.ibb.co/mV7QQGp8/image.png",
      featured: false,
      isPast: false
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold font-serif text-primary mb-6"
            >
              Events & Workshops
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 font-sans leading-relaxed"
            >
              Beyond the classroom: Discover our cultural events, intellectual workshops, and community gatherings.
            </motion.p>
          </div>
        </div>

        <div className="grid gap-12">
          {events.map((evt, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl flex flex-col ${evt.featured ? 'lg:flex-row' : 'md:flex-row'} gap-0 group ${evt.isPast ? 'grayscale opacity-75' : ''}`}
            >
              <div className={`${evt.featured ? 'lg:w-2/5' : 'md:w-1/3'} relative overflow-hidden min-h-[300px]`}>
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${evt.isPast ? '' : 'group-hover:scale-105'}`}
                  crossOrigin="anonymous"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {evt.featured && !evt.isPast && (
                    <div className="bg-accent text-white px-4 py-1 rounded-full font-sans text-xs font-bold tracking-wider uppercase shadow-md">
                      Featured Event
                    </div>
                  )}
                  {!evt.featured && !evt.isPast && (
                    <div className="bg-primary text-white px-4 py-1 rounded-full font-sans text-xs font-bold tracking-wider uppercase shadow-md">
                      Upcoming
                    </div>
                  )}
                  {evt.isPast && (
                    <div className="bg-slate-800 text-white px-4 py-1 rounded-full font-sans text-xs font-bold tracking-wider uppercase shadow-md">
                      Past Event
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`p-8 md:p-10 ${evt.featured ? 'lg:w-3/5' : 'md:w-2/3'} flex flex-col justify-center bg-white`}>
                <h3 className={`${evt.featured ? 'text-3xl' : 'text-2xl'} font-bold font-serif text-primary mb-4`}>{evt.title}</h3>
                <p className="text-slate-600 font-sans mb-8 leading-relaxed">
                  {evt.desc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 ${evt.isPast ? 'text-slate-500' : 'text-accent'}`}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-gray-900 text-sm">{evt.date}</div>
                      <div className="font-sans text-slate-500 text-sm">{evt.time}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 ${evt.isPast ? 'text-slate-500' : 'text-accent'}`}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-gray-900 text-sm">Location</div>
                      <div className="font-sans text-slate-500 text-sm">{evt.location}</div>
                    </div>
                  </div>
                </div>

                <div>
                  {!evt.isPast ? (
                    <Link to="/contact" className="inline-flex items-center gap-2 font-sans font-medium text-primary hover:text-accent transition-colors">
                      Register Interest <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-sans font-medium text-slate-500">
                      Event Concluded
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
