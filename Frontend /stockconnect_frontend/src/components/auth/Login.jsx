import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import logo from '../../assets/logo.jpeg';

const Login = () => {
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
            Your gateway to <br />
            <span className="text-[#fad059]">global markets.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Trade stocks, ETFs, and manage your portfolio with professional-level tools and insights, all in one place.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-medium">© 2026 StockConnect. All rights reserved.</p>
        </div>
      </div>

      {/* Right Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f4f7f6]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 mt-4 lg:mt-0">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm font-bold text-[#fad059] hover:text-[#e8be48] transition-colors">Forgot password?</a>
              </div>
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
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-md mt-8"
            >
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-bold text-slate-900 hover:text-[#fad059] transition-colors">
              Sign up
            </NavLink>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
