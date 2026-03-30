import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 animate-fade-in">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <LogOut size={28} className="text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Sign out?</h3>
          <p className="text-sm text-slate-500 font-medium">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-sm"
          >
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
