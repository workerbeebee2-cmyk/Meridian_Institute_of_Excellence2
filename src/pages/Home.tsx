import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Brain, Target, Users, BookOpen, ArrowRight, CheckCircle2, Sparkles, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  const STAGGER = 0.1;
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * STAGGER,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Apple-like spring easing
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen" ref={containerRef}>
      {/* 1. Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0], 
              scale: [1, 1.05, 0.95, 1] 
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full bg-accent/10 blur-3xl" 
          />
          <motion.div 
            animate={{ 
              rotate: [0, -15, 15, 0], 
              scale: [1, 1.1, 0.9, 1] 
            }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] md:w-[900px] h-[600px] md:h-[900px] rounded-full bg-primary/5 blur-3xl border border-primary/5" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <div className="max-w-2xl pt-10">
            <motion.div 
              custom={0} initial="hidden" animate="visible" variants={fadeUpVariants} 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 text-primary mb-10 border border-primary/10 shadow-sm backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span className="text-xs font-sans font-bold tracking-widest uppercase">Admissions Open 2026-27</span>
            </motion.div>
            
            <motion.h1 
              custom={1} initial="hidden" animate="visible" variants={fadeUpVariants} 
              className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-primary leading-[0.95] mb-8 font-serif"
            >
              Learn<br />
              Think<br />
              <span className="text-gradient">Achieve</span>
            </motion.h1>
            
            <motion.p 
              custom={2} initial="hidden" animate="visible" variants={fadeUpVariants} 
              className="text-lg md:text-2xl text-slate-500 font-sans mb-12 leading-snug tracking-tight max-w-xl"
            >
              A premium hub shaping the minds of tomorrow through concept-based learning and deep intellectual development.
            </motion.p>
            
            <motion.div 
              custom={3} initial="hidden" animate="visible" variants={fadeUpVariants} 
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link to="/courses" className="px-8 py-4 md:py-5 rounded-full bg-primary text-white font-sans font-bold hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
                Explore Courses
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="px-8 py-4 md:py-5 rounded-full bg-white text-primary font-sans font-bold hover:bg-gray-50 border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1">
                Discover Our Story
              </Link>
            </motion.div>
            
            <motion.div
              custom={4} initial="hidden" animate="visible" variants={fadeUpVariants}
              className="flex items-center gap-5"
            >
              <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center transition-all text-primary hover:bg-primary/5 hover:-translate-y-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center transition-all text-primary hover:bg-primary/5 hover:-translate-y-1">
                <Instagram size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center transition-all text-primary hover:bg-primary/5 hover:-translate-y-1">
                <Facebook size={24} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center transition-all text-primary hover:bg-primary/5 hover:-translate-y-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </motion.div>
          </div>

          
          <motion.div 
            custom={4} initial="hidden" animate="visible" variants={fadeUpVariants} 
            className="relative hidden lg:block h-[700px] w-full"
          >
            {/* Dynamic 3D-like floating cards and Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Main Hero Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="absolute z-10 w-[85%] h-[80%] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20 border-[8px] border-white"
                >
                  <img 
                    src="https://i.ibb.co/rRtpL0Nj/Bokeh.jpg" 
                    alt="Students experiencing modern education" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute top-12 right-[-20px] z-20 w-80"
                >
                  <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-white group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100/50 rounded-[1.25rem] flex items-center justify-center text-accent mb-6 group-hover:bg-accent/5 transition-colors duration-500">
                      <Sparkles size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[1.35rem] font-bold font-serif mb-3 text-primary tracking-tight">Concept-Based</h3>
                    <p className="text-sm font-sans text-slate-500/90 leading-relaxed font-medium">We focus on "how" and "why", removing rote memorization completely.</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 left-[-40px] z-30 w-80"
                >
                  <div className="bg-[#0B1627]/95 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(11,31,58,0.7)] border border-white/10 group hover:border-white/20 hover:shadow-[0_30px_60px_-15px_rgba(11,31,58,0.8)] transition-all duration-500">
                    <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-[1.25rem] flex items-center justify-center text-white mb-6 group-hover:bg-white/10 transition-colors duration-500">
                      <Target size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[1.35rem] font-bold font-serif mb-3 text-[#C8A96A] tracking-tight">Consistent Growth</h3>
                    <p className="text-sm font-sans text-slate-300/90 leading-relaxed font-medium">Regular monitoring and personalized attention ensures continuous student growth.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Teaching Model */}
      <section className="py-32 bg-primary text-white overflow-hidden relative border-t-8 border-accent">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl md:text-7xl font-bold font-serif mb-6 tracking-tight text-white">The Meridian Method</h2>
            <p className="text-white/70 font-sans text-xl md:text-2xl tracking-tight">Transforming students from passive listeners into active thinkers.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Learn", desc: "Interactive sessions with expert faculty.", icon: BookOpen },
              { step: "02", title: "Think", desc: "Critical analysis and concept mapping.", icon: Brain },
              { step: "03", title: "Practice", desc: "Rigorous testing and application.", icon: Target },
              { step: "04", title: "Achieve", desc: "Exceeding expectations and goals.", icon: Users }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
                className="relative group cursor-pointer"
              >
                <div className="bg-primary hover:bg-white border text-left border-white/10 hover:border-white rounded-[2.5rem] p-8 md:p-10 h-full transition-all duration-500 relative shadow-lg hover:shadow-2xl hover:shadow-white/10 flex flex-col justify-between overflow-hidden group/card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover/card:scale-150" />
                  <item.icon className="w-12 h-12 text-accent group-hover/card:text-primary mb-12 transform group-hover/card:-translate-y-2 transition-all duration-500 relative z-10" />
                  <div className="relative z-10">
                    <div className="text-sm font-bold font-sans text-white/20 group-hover/card:text-accent mb-2 transition-colors uppercase tracking-widest">{item.step}</div>
                    <h3 className="text-3xl font-bold font-serif text-white group-hover/card:text-primary mb-4 transition-colors">{item.title}</h3>
                    <p className="font-sans text-white/60 group-hover/card:text-slate-500 text-base md:text-lg leading-relaxed font-medium transition-colors">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-32 bg-background-alt relative rounded-b-[4rem] z-20 shadow-2xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-6 text-primary tracking-tight leading-none"
              >
                Beyond Traditional Coaching.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 font-sans text-xl mb-12 leading-relaxed"
              >
                Meridian isn't just about passing exams. We build intellectual capacity, foster cultural engagement, and prepare students for lifelong excellence.
              </motion.p>
              
              <div className="space-y-6">
                {[
                  "Small Batch Sizes for Personal Attention",
                  "Weekly Performance Monitoring",
                  "Dedicated Parent-Teacher Interactions",
                  "Cultural and Intellectual Workshops",
                  "Expert Faculty Mentorship"
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-all duration-300">
                      <CheckCircle2 size={16} className="text-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-sans font-bold text-slate-800 text-lg tracking-tight group-hover:text-primary transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { val: "15+", label: "Years of Faculty Experience", color: "bg-primary", text: "text-white" },
                { val: "1:15", label: "Teacher-Student Ratio", color: "bg-white border hover:border-accent", text: "text-primary" },
                { val: "100%", label: "Curriculum Coverage", color: "bg-accent", text: "text-primary" },
                { val: "Weekly", label: "Continuous Assessment", color: "bg-primary/5 border border-primary/10 hover:bg-primary/10", text: "text-primary" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                  className={`${stat.color} p-8 md:p-10 rounded-[2rem] aspect-square flex flex-col justify-end transition-all cursor-pointer ${i % 2 === 1 ? 'translate-y-12' : ''}`}
                >
                  <div className={`text-5xl md:text-6xl font-black font-serif mb-2 tracking-tighter ${stat.text}`}>{stat.val}</div>
                  <div className={`font-sans font-bold text-sm tracking-tight opacity-80 ${stat.text}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Courses */}
      <section className="py-40 bg-background -mt-20 pt-48">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-in slide-in-from-bottom-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-primary tracking-tight">Academic Excellence.</h2>
              <p className="text-slate-500 font-sans text-xl leading-relaxed">Comprehensive coaching focused on building uncompromising foundational knowledge.</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 font-sans font-bold text-accent hover:text-primary transition-colors text-lg group">
              View All Programs <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Foundation Program", class: "Classes 8, 9 & 10", subjects: "Maths, Science, English" },
              { title: "Pre-University Higher", class: "Classes 11 & 12 Science", subjects: "Physics, Chem, Maths, Bio" },
              { title: "Humanities Hub", class: "Classes 11 & 12 Arts", subjects: "Pol Science, History, Geo" }
            ].map((course, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-10 rounded-[2.5rem] bg-gray-50/80 backdrop-blur-xl border border-gray-100 hover:border-accent hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-sans font-black text-accent mb-6 tracking-widest uppercase">{course.class}</div>
                  <h3 className="text-3xl font-bold font-serif mb-6 text-primary tracking-tight">{course.title}</h3>
                  <p className="font-sans text-slate-500 font-bold mb-10 pb-10 border-b border-gray-200">{course.subjects}</p>
                </div>
                <Link to="/courses" className="inline-flex items-center gap-2 font-sans font-black text-primary group-hover:text-accent transition-colors mt-auto">
                  Explore curriculum <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. Meridian Cafe & BookSpace */}
      <section className="py-32 bg-background-alt overflow-hidden border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Images/Gallery part */}
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
                whileInView={{ opacity: 1, rotate: -1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-20 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] w-full"
              >
                <img 
                  src="https://i.ibb.co/Cs0tnKT6/cafe.jpg" 
                  alt="Meridian Cafe" 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 40, y: 40 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-16 -right-8 lg:-right-16 z-30 w-[60%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
              >
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
                  alt="BookSpace" 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>

            {/* Text part */}
            <div className="lg:pl-10 mt-28 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8 border border-accent/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-xs font-sans font-bold tracking-widest uppercase">Coming Soon</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-6 text-primary tracking-tight leading-tight">
                  Meridian Cafe & <br className="hidden lg:block"/> BookSpace
                </h2>
                
                <p className="text-slate-500 font-sans text-xl mb-10 leading-relaxed max-w-xl">
                  We are building a dedicated ecosystem for our students to unwind, socialize, and immerse themselves in literature outside of the classroom.
                </p>

                <ul className="space-y-8">
                  <li className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-accent group hover:bg-accent hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-serif text-primary mb-2">Artisan Cafe</h4>
                      <p className="text-slate-500 font-sans leading-relaxed">A vibrant space offering healthy refreshments and a relaxing environment for students to rest and recharge between intensive study sessions.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 text-accent group hover:bg-accent hover:text-white transition-colors duration-300">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-serif text-primary mb-2">Curated BookSpace</h4>
                      <p className="text-slate-500 font-sans leading-relaxed">An aesthetic reading lounge featuring a hand-picked collection of academic texts, classic literature, and contemporary non-fiction.</p>
                    </div>
                  </li>
                </ul>

              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. CTA */}
      <section className="relative overflow-hidden mb-12 mx-4 lg:mx-8 rounded-[3rem]">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary" />
        
        <div className="py-32 max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold font-serif text-white mb-8 tracking-tight"
          >
            Ready to start your journey?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 font-sans mb-12 max-w-2xl mx-auto tracking-tight font-medium"
          >
            Join Meridian Institute of Excellence and take the first step towards academic brilliance and holistic development.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-primary font-sans font-black text-lg hover:bg-gray-50 transition-all shadow-2xl hover:scale-105 active:scale-95">
              Enroll Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
