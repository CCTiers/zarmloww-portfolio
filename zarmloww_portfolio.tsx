import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { 
  Code2, Terminal, Server, Layout, Database, 
  Cpu, Globe, Mail, ChevronRight, Github, ExternalLink,
  MessageSquare, Star, Clock, Shield, Zap, Settings,
  LogOut, Plus, Edit2, Trash2, Send, CheckCircle, X
} from 'lucide-react';

// --- Global Styles & Tailwind Configuration ---
// We simulate standard Tailwind configuration additions through inline styles or arbitrary values.
const neonColors = {
  blue: '#0066ff',
  cyan: '#00f3ff',
  purple: '#bd00ff',
};

// --- Context & State Management ---
const AppContext = createContext();

const initialProjects = [
  { id: 1, title: 'Nexus Bot Dashboard', desc: 'Advanced Discord bot management panel with real-time stats.', tech: ['React', 'Node.js', 'MongoDB'], link: '#', github: '#' },
  { id: 2, title: 'Aetheria Network', desc: 'Custom Minecraft network website with integrated store and forums.', tech: ['Next.js', 'Tailwind', 'Express'], link: '#', github: '#' },
  { id: 3, title: 'Cyber UI Kit', desc: 'Premium futuristic UI component library for modern web apps.', tech: ['TypeScript', 'Framer Motion'], link: '#', github: '#' },
];

const initialMessages = [];
const initialOrders = [];

const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [messages, setMessages] = useState(initialMessages);
  const [orders, setOrders] = useState(initialOrders);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      projects, setProjects,
      messages, setMessages,
      orders, setOrders,
      isAdmin, setIsAdmin,
      showToast
    }}>
      {children}
      <Toast toast={toast} />
    </AppContext.Provider>
  );
};

const Toast = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed bottom-10 right-10 z-50 px-6 py-4 rounded-xl backdrop-blur-md border ${
            toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
          } shadow-lg shadow-black/50 flex items-center gap-3`}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          <span className="font-medium tracking-wide">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for typing effect
const useTypingEffect = (words, typingSpeed = 100, deletingSpeed = 50, delayBetween = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentWord = words[loopNum % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetween);
        }
      }, typingSpeed);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delayBetween]);

  return text;
};

// Magnetic Button Wrapper
const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    
    const handleMouseOver = (e) => {
      if (['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('button, a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-[100] mix-blend-screen"
        style={{ x: cursorXSpring, y: cursorYSpring }}
        animate={{ scale: isHovering ? 1.5 : 1, borderColor: isHovering ? '#bd00ff' : '#00f3ff' }}
      >
        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[100] transform translate-x-3.5 translate-y-3.5"
        style={{ x: cursorX, y: cursorY }}
      />
    </>
  );
};

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.5)' : 'rgba(189, 0, 255, 0.5)';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    const render = () => {
      // Clear with dark transparent background for trail effect
      ctx.fillStyle = 'rgba(5, 5, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#03030a]">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen" />
    </div>
  );
};

const Navbar = ({ setCurrentView }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = ['Home', 'Skills', 'Services', 'Projects', 'Contact'];

  const scrollTo = (id) => {
    setCurrentView('portfolio');
    setTimeout(() => {
      const element = document.getElementById(id.toLowerCase());
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Magnetic>
          <div 
            onClick={() => scrollTo('home')}
            className="text-2xl font-bold tracking-tighter text-white cursor-pointer group"
          >
            Zarm<span className="text-cyan-400 group-hover:text-purple-400 transition-colors">loww</span>
          </div>
        </Magnetic>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Magnetic key={link}>
              <button 
                onClick={() => scrollTo(link)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            </Magnetic>
          ))}
          <Magnetic>
            <button 
              onClick={() => scrollTo('contact')}
              className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
              Hire Me
            </button>
          </Magnetic>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const typedText = useTypingEffect([
    'Full Stack Developer',
    'Discord Bot Developer',
    'Minecraft Server Developer',
    'UI Designer',
    'Backend Developer'
  ]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
          Available for new projects
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-4"
        >
          Hi, I'm Zarmloww
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-3xl font-medium text-gray-400 h-10 mb-8"
        >
          <span className="text-white">I am a </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {typedText}
          </span>
          <span className="animate-pulse">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl text-gray-400 mb-12"
        >
          Building premium digital experiences, robust backend architectures, and immersive gaming communities with enterprise-grade quality.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Magnetic>
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold tracking-wide hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,243,255,0.3)] flex items-center gap-2">
              View Portfolio <ChevronRight size={18} />
            </button>
          </Magnetic>
          <Magnetic>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold tracking-wide hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center gap-2">
              <Github size={18} /> GitHub
            </button>
          </Magnetic>
        </motion.div>

        {/* Floating elements behind text */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-xl z-[-1] hidden lg:block rotate-12"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-xl z-[-1] hidden lg:block"
        />
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: 'Projects', value: '50+' },
    { label: 'Discord Bots', value: '100+' },
    { label: 'MC Servers', value: '25+' },
    { label: 'Years Exp', value: '5+' },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechEcosystem = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set fixed internal resolution, scale via CSS for responsiveness
    canvas.width = 800;
    canvas.height = 400;

    const techs = ['React', 'Next.js', 'Node.js', 'MongoDB', 'Discord.js', 'TypeScript', 'Tailwind', 'Express', 'Java', 'Spigot'];
    const nodes = techs.map(name => ({
      name,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: 3
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw lines
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist/150})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes and text
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f3ff';
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y - 10);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] bg-black/20 rounded-3xl border border-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center my-20">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      <canvas ref={canvasRef} className="w-full h-full object-contain mix-blend-screen opacity-80" />
      <div className="absolute pointer-events-none text-center">
        <h3 className="text-3xl font-black text-white/10 uppercase tracking-[0.2em] blur-[1px]">Interactive Ecosystem</h3>
      </div>
    </div>
  );
};

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateYVal = ((mouseX / width) - 0.5) * 20; // max 20deg
    const rotateXVal = ((mouseY / height) - 0.5) * -20;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      style={{ perspective: 1000 }}
      className={`relative transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Services = () => {
  const services = [
    { icon: <Layout />, title: 'Web Development', desc: 'Premium responsive frontends and robust backends using Next.js & React.' },
    { icon: <Terminal />, title: 'Discord Bots', desc: 'Advanced custom bots with ticket systems, economy, and slash commands.' },
    { icon: <Server />, title: 'Minecraft Servers', desc: 'Custom setups, plugin configuration, and network optimization.' },
    { icon: <Code2 />, title: 'API Integration', desc: 'Seamless connection between external services and your applications.' },
  ];

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Services</span></h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, i) => (
            <TiltCard key={i} className="h-full">
              <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:border-cyan-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  {srv.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{srv.title}</h3>
                <p className="text-gray-400 leading-relaxed">{srv.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { projects } = useContext(AppContext);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Projects</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              {/* Mock Image Area */}
              <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700">
                  <Layout size={64} className="text-white" />
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tech.map(t => (
                    <span key={t} className="px-3 py-1 text-xs font-medium bg-white/10 rounded-full text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{proj.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-2">{proj.desc}</p>
                
                <div className="flex gap-4">
                  <button className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={16} /> Live Demo
                  </button>
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Github size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveChatAnimation = () => {
  const chatMessages = [
    { sender: 'Client', text: 'Hey Zarmloww, can you build a custom Discord bot with economy?', time: '10:00 AM' },
    { sender: 'Zarmloww', text: 'Absolutely. I can integrate it with MongoDB for fast data retrieval and build a web dashboard for it.', time: '10:02 AM', isSelf: true },
    { sender: 'Client', text: 'Sounds perfect! How long will it take?', time: '10:05 AM' },
    { sender: 'Zarmloww', text: 'I can have a working prototype ready in 3 days. Let\'s discuss the specific features.', time: '10:06 AM', isSelf: true },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <span className="font-semibold text-white">Live Developer Chat</span>
      </div>
      <div className="p-6 flex flex-col gap-4 h-[300px] overflow-y-auto hide-scrollbar">
        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.isSelf ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.8 }}
            className={`flex flex-col max-w-[85%] ${msg.isSelf ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={`px-4 py-2 rounded-2xl ${msg.isSelf ? 'bg-cyan-600/80 text-white rounded-tr-sm' : 'bg-white/10 text-gray-200 rounded-tl-sm'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContactSection = () => {
  const { showToast, setMessages, setOrders } = useContext(AppContext);
  const [formType, setFormType] = useState('contact'); // 'contact' or 'order'

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMsg = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      date: new Date().toLocaleString(),
      status: 'unread'
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Inquiry sent successfully! I will get back to you soon.');
    e.target.reset();
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newOrder = {
      id: Date.now(),
      name: formData.get('name'),
      service: formData.get('service'),
      budget: formData.get('budget'),
      details: formData.get('details'),
      date: new Date().toLocaleString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast('Order placed successfully! Check your email for details.');
    e.target.reset();
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        <div className="flex-1 w-full">
          <div className="mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect</span></h2>
            <p className="text-gray-400">Ready to start your next big project? Drop a message or place a service order directly.</p>
          </div>

          <div className="flex gap-4 mb-8 bg-white/5 p-1.5 rounded-xl w-fit border border-white/10">
            <button 
              onClick={() => setFormType('contact')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${formType === 'contact' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
            >
              General Inquiry
            </button>
            <button 
              onClick={() => setFormType('order')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${formType === 'order' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-white'}`}
            >
              Order Service
            </button>
          </div>

          {formType === 'contact' ? (
            <motion.form key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <input name="name" type="text" placeholder="Your Name" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
              <input name="email" type="email" placeholder="Your Email" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors" />
              <textarea name="message" placeholder="Your Message" rows={4} required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none" />
              <button type="submit" className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all">
                Send Message <Send size={18} />
              </button>
            </motion.form>
          ) : (
            <motion.form key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                <input name="name" type="text" placeholder="Full Name" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-400 transition-colors" />
                <select name="service" required className="bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-gray-300 focus:outline-none focus:border-purple-400 transition-colors appearance-none">
                  <option value="">Select Service</option>
                  <option value="Website">Website Development</option>
                  <option value="Discord">Discord Bot</option>
                  <option value="Minecraft">Minecraft Server</option>
                </select>
              </div>
              <input name="budget" type="text" placeholder="Estimated Budget ($)" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-400 transition-colors" />
              <textarea name="details" placeholder="Project Requirements..." rows={4} required className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-400 transition-colors resize-none" />
              <button type="submit" className="mt-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(189,0,255,0.3)] transition-all">
                Submit Order <Send size={18} />
              </button>
            </motion.form>
          )}
        </div>

        <div className="flex-1 w-full hidden lg:block">
          <LiveChatAnimation />
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({ setCurrentView }) => {
  const { projects, setProjects, messages, orders, setOrders, showToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('projects');

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    showToast('Project deleted');
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Order marked as ${newStatus}`);
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 pb-12 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin <span className="text-cyan-400">Panel</span></h1>
          <button 
            onClick={() => setCurrentView('portfolio')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <LogOut size={18} /> Back to Site
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          {['projects', 'messages', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <Plus size={16} /> Add New
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 text-sm font-medium text-gray-400">Title</th>
                    <th className="p-4 text-sm font-medium text-gray-400">Tech</th>
                    <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{p.title}</td>
                      <td className="p-4 text-sm text-gray-400">{p.tech.join(', ')}</td>
                      <td className="p-4 flex gap-3">
                        <button className="text-blue-400 hover:text-blue-300"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-6">Service Orders</h2>
            <div className="grid gap-4">
              {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : orders.map(o => (
                <div key={o.id} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{o.service} Order</h3>
                    <p className="text-sm text-gray-400">From: {o.name} • Budget: {o.budget}</p>
                    <p className="text-sm text-gray-500 mt-2 truncate max-w-md">{o.details}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                      {o.status}
                    </span>
                    {o.status === 'pending' && (
                      <button onClick={() => updateOrderStatus(o.id, 'completed')} className="text-sm text-cyan-400 hover:underline">Mark Completed</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-semibold mb-6">Contact Inquiries</h2>
            <div className="grid gap-4">
              {messages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : messages.map(m => (
                <div key={m.id} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{m.name} <span className="text-sm font-normal text-gray-400">&lt;{m.email}&gt;</span></h3>
                    <span className="text-xs text-gray-500">{m.date}</span>
                  </div>
                  <p className="text-gray-300 text-sm bg-black/20 p-3 rounded-lg">{m.message}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' or 'admin'

  return (
    <div className="min-h-screen bg-[#03030a] text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      <CustomCursor />
      <AnimatedBackground />

      {currentView === 'portfolio' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Navbar setCurrentView={setCurrentView} />
          <Hero />
          <Stats />
          <TechEcosystem />
          <Services />
          <Projects />
          <ContactSection />
          
          <footer className="py-8 border-t border-white/5 text-center text-sm text-gray-500 relative z-10 flex flex-col items-center justify-center gap-4">
            <p>© 2026 Zarmloww. Crafted with precision.</p>
            {/* Hidden admin trigger for demo purposes */}
            <button 
              onClick={() => setCurrentView('admin')}
              className="px-3 py-1 bg-white/5 rounded-md hover:bg-white/10 text-xs flex items-center gap-2 transition-colors border border-white/5"
            >
              <Settings size={12} /> Admin Login Simulation
            </button>
          </footer>
        </motion.div>
      ) : (
        <AdminDashboard setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default function RootApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}