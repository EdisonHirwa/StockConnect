import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import { registerUser } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName:    '',
    email:       '',
    phoneNumber: '',
    role:        '',
    password:    '',
    confirmPassword: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.role) {
      setError('Please select a role.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        fullName:    form.fullName,
        email:       form.email,
        phoneNumber: form.phoneNumber,
        role:        form.role,
        password:    form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800 font-sans">
      {/* Left Branding Side */}
      <div
        className="hidden lg:flex w-1/2 bg-black text-white flex-col justify-between p-12 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${logo})` }}
      />

      {/* Right Register Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f4f7f6]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 mt-4 lg:mt-0">Create an account</h2>
            <p className="text-slate-500 font-medium">Fill in your details to get started.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+250 700 000 000"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors z-10" size={20} />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 pl-12 pr-10 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium cursor-pointer"
                >
                  <option value="" disabled>Select your role</option>
                  <option value="MARKET_ADMIN">Market Administrator</option>
                  <option value="TRADER">Trader</option>
                  <option value="COMPANY_REP">Company Representative</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▾</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#fad059] transition-colors" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fad059]/40 focus:border-[#fad059] transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fad059] hover:bg-[#e8be48] disabled:opacity-60 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-md mt-8"
            >
              {loading ? 'Creating account…' : <> Create Account <ArrowRight size={18} /> </>}
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
