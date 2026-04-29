import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogOut, Code2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel rounded-none border-t-0 border-x-0 border-b border-glass-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="text-neon-blue w-8 h-8" />
              <span className="text-xl font-bold text-gradient">NeonManage</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-300 hover:text-neon-pink transition-colors flex items-center gap-2 ml-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
