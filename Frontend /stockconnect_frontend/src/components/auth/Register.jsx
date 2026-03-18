import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const Register = () => {
  return (
    <div className="min-h-screen flex text-slate-800 font-sans">
      {/* Left Branding Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fad059]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="StockConnect Logo" className="h-[42px] w-auto rounded-xl" />
            <span className="text-3xl font-bold tracking-tight text-white">StockConnect</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-white">
            Start your journey <br />
            <span className="text-[#fad059]">today.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Create a free account and experience the most intuitive trading platform on the market.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-medium">© 2026 StockConnect. All rights reserved.</p>
        </div>
      </div>

      {/* Right Register Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f4f7f6]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 mt-4 lg:mt-0">Create an account</h2>
            <p className="text-slate-500 font-medium">Fill in your details to get started.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="button" 
              className="w-full bg-[#fad059] hover:bg-[#e8be48] text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-md mt-8"
            >
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <NavLink to="/login" className="font-bold text-slate-900 hover:text-[#fad059] transition-colors">
              Sign in
            </NavLink>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
