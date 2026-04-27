import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const Layout = () => {
  const { token, logout } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 w-full font-sans selection:bg-brand-100 selection:text-brand-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">Proj<span className="text-brand-600">Track</span></span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={logout}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
