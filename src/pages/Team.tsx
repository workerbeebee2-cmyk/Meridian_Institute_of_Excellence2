import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin } from 'lucide-react';

export default function Team() {
  const team = [
    {
      name: "Mrs. Nikunja Gogoi",
      role: "Founder",
      bio: "A natural people-person with a gift for understanding and uplifting others, Mrs. Gogoi founded Meridian to give every student the guidance she always believed they deserved.",
      image: "https://i.ibb.co/Q7s5GC0m/image.png"
    },
    {
      name: "Lt. Col. Dipankar Gogoi",
      role: "Advisor",
      bio: "Providing strategic guidance on discipline, leadership, and character building, ensuring our students develop strong moral frameworks alongside academic success.",
      image: "https://i.ibb.co/zTvHg0MM/image.png"
    },
    {
      name: "Mrs. Bhaswati Bora",
      role: "Academic Coordinator",
      bio: "Oversees curriculum implementation, student progress monitoring, and ensures that the 'Meridian Method' is executed flawlessly across all classrooms.",
      image: "https://i.ibb.co/9fRvw5y/image.png"
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background-alt">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 pt-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 font-sans text-sm font-semibold tracking-wide uppercase mb-6"
        >
          Our Leadership
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold font-serif text-primary mb-6"
        >
          The Minds Behind Meridian
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 font-sans leading-relaxed"
        >
          Our institution is guided by visionary educators and leaders who are deeply committed to student success and holistic development.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold font-serif text-primary mb-1">{member.name}</h3>
                <p className="text-accent font-sans text-sm font-semibold tracking-wider uppercase mb-4">{member.role}</p>
                <p className="text-slate-500 font-sans text-sm leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
