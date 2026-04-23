import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Globe, BarChart3, ChevronRight, Activity, Users, Zap, UserPlus, Wallet, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#fad059] selection:text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <img src={logo} alt="StockConnect Logo" className="h-10 w-auto rounded-xl group-hover:scale-105 transition-transform duration-300" />
            <span className="hidden sm:block text-xl font-bold tracking-tight text-white">StockConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#market" className="hover:text-white transition-colors">Market</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-white hover:text-[#fad059] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-bold bg-[#fad059] text-slate-900 px-5 py-2.5 rounded-xl hover:bg-[#e8be48] transition-all shadow-[0_0_20px_rgba(250,208,89,0.3)] hover:shadow-[0_0_30px_rgba(250,208,89,0.5)]">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fad059]/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[#fad059]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fad059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fad059]"></span>
              </span>
              Live Market Data Active
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Trade Rwanda's <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fad059] to-amber-200">
                Future Today
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed">
              Experience the next generation of digital trading. Connect to the Rwanda Stock Exchange with real-time analytics, secure execution, and seamless portfolio management.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-[#fad059] text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e8be48] transition-all shadow-[0_0_20px_rgba(250,208,89,0.3)] hover:shadow-[0_0_30px_rgba(250,208,89,0.5)] w-full sm:w-auto">
                Start Trading Now
                <ChevronRight size={20} />
              </Link>
              <a href="#features" className="flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto">
                Explore Features
              </a>
            </motion.div>
          </motion.div>
          
          {/* Abstract Dashboard Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden md:block"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full aspect-square max-w-lg mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-[2rem] border border-white/10 shadow-2xl transform rotate-3 scale-105 transition-transform hover:rotate-6 duration-500"></div>
              <div className="absolute inset-0 bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400 font-medium">Total Portfolio Value</div>
                      <div className="text-3xl font-black text-white mt-1">RWF 14,250,000</div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg text-sm font-bold">
                      <TrendingUp size={16} /> +5.2%
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-800/50 border border-white/5 relative overflow-hidden">
                    {/* Abstract Chart Line */}
                    <svg className="absolute bottom-0 w-full h-24 text-[#fad059] opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <motion.path 
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 1 }}
                        d="M0,100 L0,80 Q20,60 40,70 T80,30 T100,20 L100,100 Z" fill="currentColor" 
                      />
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                        d="M0,80 Q20,60 40,70 T80,30 T100,20" fill="none" stroke="currentColor" strokeWidth="2" 
                      />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 font-medium">Bank of Kigali (BK)</div>
                      <div className="text-lg font-bold text-white mt-1">RWF 270</div>
                    </div>
                    <div className="bg-slate-800/50 border border-white/5 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 font-medium">Bralirwa (BLR)</div>
                      <div className="text-lg font-bold text-white mt-1">RWF 180</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">11+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">Listed Companies</div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">RWF 136B</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">Market Cap</div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">24/7</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">System Uptime</div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#fad059]">0%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-2 uppercase tracking-wider">Trading Fees</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Built for Modern Traders</h2>
            <p className="text-slate-400 text-lg">Everything you need to analyze, execute, and manage your investments in the Rwandan market, all in one powerful platform.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeUpVariant} className="bg-slate-800/40 border border-white/10 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 bg-[#fad059]/10 text-[#fad059] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Execution</h3>
              <p className="text-slate-400 leading-relaxed">Experience millisecond latency with our advanced matching engine. See live order books and execute trades instantly.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-slate-800/40 border border-white/10 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Bank-Grade Security</h3>
              <p className="text-slate-400 leading-relaxed">Your assets and data are protected by enterprise-level encryption and rigorous security protocols.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="bg-slate-800/40 border border-white/10 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Make informed decisions with comprehensive charting tools, market depth visualization, and portfolio performance tracking.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        {/* Subtle background lines */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fad059]/10 text-[#fad059] text-sm font-bold tracking-wide uppercase mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Start Trading in 3 Steps</h2>
            <p className="text-slate-400 text-lg">We've removed the complexity. Get onboarded and start building your portfolio in minutes.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#fad059] to-transparent animate-[shimmer_3s_infinite] opacity-50"></div>
            </div>

            {/* Step 1 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-2 border-white/10 rounded-3xl flex items-center justify-center relative z-10 group-hover:-translate-y-2 group-hover:border-[#fad059]/50 group-hover:shadow-[0_0_30px_rgba(250,208,89,0.2)] transition-all duration-300">
                <div className="absolute inset-0 bg-[#fad059]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <UserPlus size={36} className="text-slate-400 group-hover:text-[#fad059] transition-colors duration-300" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#fad059] text-slate-900 font-bold rounded-full flex items-center justify-center border-4 border-slate-900">1</div>
              </div>
              <div className="text-center mt-8 group-hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">Sign up securely and complete our rapid KYC process to unlock your trader profile.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-2 border-white/10 rounded-3xl flex items-center justify-center relative z-10 group-hover:-translate-y-2 group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 md:delay-100">
                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Wallet size={36} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center border-4 border-slate-900">2</div>
              </div>
              <div className="text-center mt-8 group-hover:-translate-y-1 transition-transform duration-300 md:delay-100">
                <h3 className="text-xl font-bold text-white mb-3">Fund Wallet</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">Deposit funds instantly using local payment methods like Mobile Money or Bank Transfer.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeUpVariant} className="relative group">
              <div className="w-24 h-24 mx-auto bg-slate-800 border-2 border-white/10 rounded-3xl flex items-center justify-center relative z-10 group-hover:-translate-y-2 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 md:delay-200">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ArrowRightLeft size={36} className="text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white font-bold rounded-full flex items-center justify-center border-4 border-slate-900">3</div>
              </div>
              <div className="text-center mt-8 group-hover:-translate-y-1 transition-transform duration-300 md:delay-200">
                <h3 className="text-xl font-bold text-white mb-3">Trade & Grow</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">Buy shares, monitor your portfolio growth, and sell when the market hits your target.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-32 px-6 relative flex justify-center overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#fad059]/10 rounded-[100%] blur-[80px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-10 md:p-16 text-center shadow-2xl overflow-hidden group hover:border-white/20 transition-colors duration-500"
        >
          {/* Subtle animated gradient sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]"></div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Ready to enter the market?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of traders who are already building their wealth on Rwanda's most advanced digital exchange.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="relative w-full sm:w-auto justify-center overflow-hidden inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1 group/btn">
              <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                Create Your Free Account
                <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-[100%] group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all w-full sm:w-auto">
              Sign In to Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-900 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group">
            <img src={logo} alt="StockConnect Logo" className="h-8 w-auto rounded-lg group-hover:scale-105 transition-transform duration-300" />
            <span className="text-lg font-bold tracking-tight text-white">StockConnect</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} StockConnect Rwanda. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
