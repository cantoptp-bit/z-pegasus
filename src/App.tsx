import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Volume2, ChevronDown, Shield, MessageSquare, Phone, FileText, Globe, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PegasusBackground from './components/PegasusBackground';
import { Typewriter } from './components/Typewriter';
import { initAudio, playHover, playAccessGranted, playAccessDenied, playKeystroke } from './utils/audio';
import { SOUND_PRESETS } from './utils/soundPresets';

export default function App() {
  const [view, setView] = useState<'countdown' | 'login' | 'register' | 'traditions' | 'sound_settings'>('countdown');
  const [activeSound, setActiveSound] = useState<number>(() => {
    const saved = localStorage.getItem('pegasus_sound');
    return saved ? parseInt(saved, 10) : 22; // Default to Deep Thock
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [devProgress, setDevProgress] = useState(0);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [showLoadingContent, setShowLoadingContent] = useState(false);
  const [loadingText, setLoadingText] = useState('Establishing Connection');
  const [isEstablished, setIsEstablished] = useState(false);
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const [hudOpacity, setHudOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Fade out over the first 300px of scrolling
      const opacity = Math.max(0, 1 - window.scrollY / 300);
      setArrowOpacity(opacity);
      setHudOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fade in the loading content shortly after mount
    const showTimer = setTimeout(() => {
      setShowLoadingContent(true);
    }, 100);

    const establishedTimer = setTimeout(() => {
      setLoadingText('Connection Established');
      setIsEstablished(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setIsSiteLoading(false);
    }, 4500);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(establishedTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (view === 'countdown' && !isSiteLoading) {
      setDevProgress(0);
      let start: number | null = null;
      const duration = 12000; // Slower counting (12 seconds)
      const target = 8;
      let animationFrameId: number;
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        setDevProgress(ease * target);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      const timer = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate);
      }, 3000); // Start counting at 3 seconds
      
      return () => {
        clearTimeout(timer);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      };
    }
  }, [view, isSiteLoading]);
  useEffect(() => {
    // Set target date to April 16, 2026 (29 days from current date)
    const targetTime = new Date('2026-04-16T23:59:59Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view === 'login' || view === 'register') {
      const hasSeenWarning = localStorage.getItem('pegasus_dev_warning');
      if (!hasSeenWarning) {
        setShowWarning(true);
      }
    }
  }, [view]);

  const dismissWarning = () => {
    initAudio();
    localStorage.setItem('pegasus_dev_warning', 'true');
    setShowWarning(false);
  };

  const pad = (num: number) => String(num).padStart(2, '0');

  const scrollToProjectInfo = () => {
    playHover();
    const element = document.getElementById('project-info');
    if (element) {
      const startPosition = window.pageYOffset;
      const targetPosition = element.getBoundingClientRect().top + startPosition;
      const distance = targetPosition - startPosition;
      const duration = 1530;
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function easeInOutQuad(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen overflow-x-hidden overflow-y-auto relative scroll-smooth">
      <PegasusBackground />
      
      {/* Loading Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isSiteLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${showLoadingContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer slow spinning ring */}
            <div className={`absolute inset-0 rounded-full border-y-[1px] transition-colors duration-500 ${isEstablished ? 'border-emerald-500/50' : 'border-white/20'} animate-[spin_3s_linear_infinite]`}></div>
            {/* Middle reverse spinning ring */}
            <div className={`absolute inset-2 rounded-full border-x-[1px] transition-colors duration-500 ${isEstablished ? 'border-emerald-400/50' : 'border-white/40'} animate-[spin_2s_linear_infinite_reverse]`}></div>
            {/* Inner fast spinning ring */}
            <div className={`absolute inset-4 rounded-full border-t-[2px] transition-colors duration-500 ${isEstablished ? 'border-emerald-300/80' : 'border-white/80'} animate-[spin_1s_linear_infinite]`}></div>
            {/* Center dot */}
            <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${isEstablished ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-white animate-pulse'}`}></div>
          </div>
          <div className={`mt-8 font-mono text-[10px] tracking-[0.5em] uppercase transition-all duration-500 ${isEstablished ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-white/40 animate-pulse'}`}>
            {loadingText}
          </div>
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center relative py-12">
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className="font-serif text-xl font-light uppercase text-white tracking-[0.15em]">
                <Typewriter text="System Notice" speed={50} />
              </h2>
              <p className="text-xs text-white/60 leading-relaxed tracking-wide">
                <Typewriter text="This terminal is currently under active development. Some features, security protocols, and encrypted pathways may be incomplete or subject to change." speed={20} delay={800} />
              </p>
              <div className="pt-4">
                <button 
                  onClick={dismissWarning}
                  onMouseEnter={playHover}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main 
        className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center transition-all duration-700 ease-in-out"
      >
          <header className="text-center mb-16">
            <h1 className="font-serif text-4xl font-light uppercase text-white mb-3 tracking-[0.2em]">
              Pegasus
            </h1>
            <p className="text-[10px] tracking-[0.5em] text-white/50 uppercase">
              Elite Technology Systems
            </p>
          </header>

          <AnimatePresence mode="wait">
            {view === 'countdown' && (
              <motion.div 
                key="countdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full flex flex-col items-center space-y-8"
              >
              {/* HUD Container */}
              <div className="flex flex-col justify-center items-center w-full py-8 md:py-12 space-y-12 relative z-10 max-w-4xl mx-auto" style={{ opacity: hudOpacity }}>
                <div className="flex flex-col items-center space-y-4">
                  <h1 className="font-serif text-4xl md:text-6xl text-white font-light tracking-[0.3em] uppercase drop-shadow-lg text-center">
                    Coming Soon
                  </h1>
                </div>
                
                <div className="w-full max-w-lg space-y-6 pt-6">
                  <div className="flex flex-col items-center w-full text-xs font-mono text-white/60 uppercase tracking-[0.2em] relative">
                    <span className="mb-2">Development Status</span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3, duration: 0.8 }}
                      className="text-white text-lg font-light"
                    >
                      {Math.round(devProgress)}%
                    </motion.span>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 0.8 }}
                    className="h-2 w-full bg-white/5 relative overflow-hidden rounded-full"
                  >
                    <div 
                      className="absolute top-0 left-0 h-full transition-all duration-100 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                      style={{ 
                        width: `${devProgress}%`,
                        background: `linear-gradient(90deg, hsl(160, 100%, ${10 + (devProgress * 0.2)}%), hsl(160, 100%, ${30 + (devProgress * 0.4)}%))`
                      }}
                    ></div>
                  </motion.div>
                </div>
              </div>
              <div className="fixed bottom-4 right-4 text-white/30 font-mono text-xs">
                v1.0.0
              </div>

              {/* Authorized Override button removed */}
              </motion.div>
            )}

            {view === 'traditions' && (
              <motion.div 
                key="traditions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-8"
              >
              <div className="space-y-8 text-center py-4">
                <div className="space-y-2">
                  <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/40">I. The First Tenet</h3>
                  <p className="font-serif text-lg text-white/90 italic tracking-wide">Silence is the highest form of loyalty.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/40">II. The Second Tenet</h3>
                  <p className="font-serif text-lg text-white/90 italic tracking-wide">Excellence is not an act, but a baseline.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/40">III. The Third Tenet</h3>
                  <p className="font-serif text-lg text-white/90 italic tracking-wide">Innovation through absolute encryption.</p>
                </div>
              </div>
              
              <div className="pt-6 flex justify-center">
                <button 
                  type="button" 
                  onClick={() => setView('login')} 
                  onMouseEnter={playHover}
                  className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  Return to Terminal
                </button>
              </div>
              </motion.div>
            )}

            {view === 'login' && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[400px] space-y-8" 
                onSubmit={(e) => e.preventDefault()}
              >
              <div className="relative group">
                <label 
                  htmlFor="login-email" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Identification
                </label>
                <input 
                  type="email" 
                  id="login-email" 
                  placeholder="Username or Email" 
                  required 
                  onKeyDown={() => playKeystroke(activeSound)}
                  className="thin-input w-full py-3 text-sm placeholder:text-white/10 text-white"
                />
              </div>

              <div className="relative group">
                <label 
                  htmlFor="login-password" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Security Key
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="login-password" 
                    placeholder="••••••••" 
                    required 
                    onKeyDown={() => playKeystroke(activeSound)}
                    className="thin-input w-full py-3 pr-10 text-sm placeholder:text-white/10 text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-6 flex flex-col items-center space-y-6">
                <button 
                  type="submit" 
                  onClick={() => {
                    initAudio();
                    playAccessGranted();
                  }}
                  onMouseEnter={playHover}
                  className="group relative w-full max-w-[240px] py-4 bg-transparent overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors duration-500"></div>
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative text-[10px] uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors duration-500 font-mono">
                    Authenticate
                  </span>
                </button>
                
                <div className="flex justify-between w-full items-center text-[10px] uppercase tracking-widest text-white/30">
                  <a href="#" onMouseEnter={playHover} className="hover:text-white transition-colors">Forgot Access?</a>
                  <button type="button" onMouseEnter={playHover} onClick={() => { setView('register'); setShowPassword(false); }} className="hover:text-white transition-colors cursor-pointer">Request Entry</button>
                </div>
              </div>
              </motion.form>
            )}

            {view === 'register' && (
              <motion.form 
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[400px] space-y-6" 
                onSubmit={(e) => e.preventDefault()}
              >
              <div className="relative group">
                <label 
                  htmlFor="reg-email" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Email
                </label>
                <input 
                  type="email" 
                  id="reg-email" 
                  required 
                  onKeyDown={() => playKeystroke(activeSound)}
                  className="thin-input w-full py-2 text-sm placeholder:text-white/10 text-white"
                />
              </div>

              <div className="relative group">
                <label 
                  htmlFor="reg-display-name" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Display Name (Optional)
                </label>
                <input 
                  type="text" 
                  id="reg-display-name" 
                  placeholder="What should people call you?" 
                  onKeyDown={() => playKeystroke(activeSound)}
                  className="thin-input w-full py-2 text-sm placeholder:text-white/10 text-white"
                />
              </div>

              <div className="relative group">
                <label 
                  htmlFor="reg-username" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Username (Optional)
                </label>
                <input 
                  type="text" 
                  id="reg-username" 
                  placeholder="Leave blank for a random username" 
                  onKeyDown={() => playKeystroke(activeSound)}
                  className="thin-input w-full py-2 text-sm placeholder:text-white/10 text-white"
                />
                <p className="text-[9px] text-white/30 mt-2 tracking-wide">
                  A 4-digit tag will be added automatically to ensure uniqueness
                </p>
              </div>

              <div className="relative group">
                <label 
                  htmlFor="reg-password" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="reg-password" 
                    required 
                    onKeyDown={() => playKeystroke(activeSound)}
                    className="thin-input w-full py-2 pr-10 text-sm placeholder:text-white/10 text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="relative group">
                <label 
                  htmlFor="reg-confirm-password" 
                  className="block text-[10px] uppercase tracking-widest text-white/50 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="reg-confirm-password" 
                    required 
                    onKeyDown={() => playKeystroke(activeSound)}
                    className="thin-input w-full py-2 pr-10 text-sm placeholder:text-white/10 text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <div className="relative flex items-center justify-center w-3.5 h-3.5 mt-0.5">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    className="peer appearance-none w-3.5 h-3.5 border border-white/30 rounded-sm bg-transparent checked:bg-white cursor-pointer transition-colors"
                  />
                  <svg className="absolute w-2.5 h-2.5 pointer-events-none hidden peer-checked:block text-black" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                  </svg>
                </div>
                <label htmlFor="terms" className="text-[10px] text-white/50 tracking-wide leading-tight cursor-pointer">
                  I agree to the <a href="#" className="text-white hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-white hover:underline transition-colors">Privacy Policy</a>
                </label>
              </div>

              <div className="pt-4 flex flex-col items-center space-y-6">
                <button 
                  type="submit" 
                  onClick={() => {
                    initAudio();
                    playAccessGranted();
                  }}
                  onMouseEnter={playHover}
                  className="group relative w-full max-w-[240px] py-4 bg-transparent overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors duration-500"></div>
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative text-[10px] uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors duration-500 font-mono">
                    Initialize Entry
                  </span>
                </button>
                
                <div className="flex justify-center w-full items-center text-[10px] uppercase tracking-widest text-white/30">
                  <button type="button" onMouseEnter={playHover} onClick={() => { setView('login'); setShowPassword(false); setShowConfirmPassword(false); }} className="hover:text-white transition-colors cursor-pointer">Return to Login</button>
                </div>
              </div>
              </motion.form>
            )}
        
            {view === 'sound_settings' && (
              <motion.div 
                key="sound_settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-4xl"
              >
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl font-light uppercase text-white tracking-[0.2em] mb-4">
                Audio Interface
              </h1>
              <p className="text-xs text-white/50 tracking-widest uppercase">
                Select Haptic Feedback Profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Minimalist & Modern', 'Sci-Fi & Encrypted Terminal', 'Tactile & Mechanical'].map((category) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-emerald-400/80 border-b border-white/10 pb-2 mb-4">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {SOUND_PRESETS.filter(p => p.category === category).map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          initAudio();
                          setActiveSound(preset.id);
                          localStorage.setItem('pegasus_sound', preset.id.toString());
                          playKeystroke(preset.id);
                        }}
                        onMouseEnter={playHover}
                        className={`w-full text-left px-4 py-3 text-xs tracking-wider transition-all duration-300 border ${
                          activeSound === preset.id 
                            ? 'bg-white/10 border-white/30 text-white' 
                            : 'bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
                        }`}
                      >
                        <span className="inline-block w-6 text-white/30">{preset.id}.</span>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button 
                type="button" 
                onClick={() => setView('login')} 
                onMouseEnter={playHover}
                className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                Return to Terminal
              </button>
            </div>
              </motion.div>
            )}
          </AnimatePresence>

        <footer className="mt-12 text-center flex flex-col items-center">
          <div className="flex items-center space-x-4 text-[9px] uppercase tracking-[0.5em] text-white/20 mb-8">
            {view !== 'countdown' && (
              <>
                <button 
                  onClick={() => setView('traditions')} 
                  onMouseEnter={playHover}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Traditions
                </button>
                <span>|</span>
                <button 
                  onClick={() => setView('sound_settings')} 
                  onMouseEnter={playHover}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" /> Audio
                </button>
              </>
            )}
          </div>
          
        </footer>
      </main>
      
      <button 
        onClick={scrollToProjectInfo}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white transition-colors animate-bounce cursor-pointer p-4 z-50"
        style={{ opacity: arrowOpacity, pointerEvents: arrowOpacity < 0.1 ? 'none' : 'auto' }}
        aria-label="Scroll down for more info"
      >
        <ChevronDown className="w-12 h-12" />
      </button>
      </div>

      <section id="project-info" className="min-h-screen flex flex-col items-center justify-center py-24 relative z-10">
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent_0%,black_50%)]" />
        <div className="relative z-10 w-full max-w-7xl px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-light uppercase text-white tracking-[0.2em] mb-4">
              Project Overview
            </h2>
            <p className="text-white/60 font-mono text-xs tracking-widest uppercase max-w-2xl mx-auto leading-relaxed">
              Next-generation secure communication infrastructure designed for absolute privacy and untraceable digital interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <Shield className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">AES-256 & E2E</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Military-grade AES-256 encryption combined with true End-to-End encryption ensures your data remains completely inaccessible to third parties.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <MessageSquare className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">Encrypted IRC</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Create and join fully encrypted IRC chatrooms. Communicate securely with multiple parties without leaving a digital footprint.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <Phone className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">Secure Voice</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Crystal clear, zero-latency encrypted voice calls. Your conversations are secured at the protocol level, preventing any interception.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <FileText className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">Private Notes</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Store your most sensitive information in encrypted personal notes. Only you hold the keys to decrypt and access this data.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <Clock className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">Temp Chats</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Volatile, self-destructing temporary chats. Messages are permanently purged from all nodes once the session is terminated.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 group text-center flex flex-col items-center">
              <Globe className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-white font-serif text-2xl tracking-wider mb-4">Discovery</h3>
              <p className="text-white/60 text-base leading-relaxed">
                Navigate the secure network via the Discovery page. Find and join verified servers and communities within the encrypted ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
