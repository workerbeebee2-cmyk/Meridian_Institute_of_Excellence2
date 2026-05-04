import React from 'react';
import { motion } from 'motion/react';
import { Award, Compass, Heart, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-sans text-sm font-semibold tracking-wide uppercase mb-6"
          >
            Our Story
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-serif text-primary mb-6"
          >
            Cultivating Excellence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-sans leading-relaxed"
          >
            Founded with a vision to redefine education, Meridian Institute of Excellence goes beyond textbooks to nurture critical thinkers, cultural ambassadors, and academic achievers.
          </motion.p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <Compass className="w-12 h-12 text-accent mb-8" />
            <h2 className="text-3xl font-bold font-serif mb-4 text-[#C8A96A]">Our Goal</h2>
            <p className="font-sans text-white/80 leading-relaxed text-lg">
              To be the premier institution where intellectual curiosity meets academic rigor, producing leaders who are not just successful in their careers, but also rooted in their cultural values.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background-alt border border-accent/20 p-10 md:p-14 rounded-[2.5rem]"
          >
            <Target className="w-12 h-12 text-primary mb-8" />
            <h2 className="text-3xl font-bold font-serif text-primary mb-4">Our Mission</h2>
            <p className="font-sans text-slate-600 leading-relaxed text-lg">
              To provide a holistic educational environment that emphasizes concept-based learning, individual attention, and continuous assessment, ensuring every student reaches their maximum potential.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-6">Core Values</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Lightbulb, title: "Intellectual Curiosity", desc: "We encourage questions over rote answers." },
            { icon: Award, title: "Academic Excellence", desc: "Rigorous standards and continuous improvement." },
            { icon: Heart, title: "Cultural Engagement", desc: "Staying rooted in heritage and community." }
          ].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 p-8 rounded-3xl text-center shadow-lg shadow-gray-100/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <val.icon size={28} />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary mb-3">{val.title}</h3>
              <p className="font-sans text-slate-500">{val.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Extract Target since lucide icon wasn't imported at top
function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
