import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  MapPin, 
  Luggage, 
  BarChart3, 
  Coins, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();

  const navItems = [
    { id: 'countries', label: 'Countries', icon: Compass, badge: '6 Dest' },
    { id: 'places', label: 'Top Places & Transit', icon: MapPin },
    { id: 'trips', label: 'My Trip History', icon: Luggage, requiresAuth: true },
    { id: 'analytics', label: 'Analytics & Budget', icon: BarChart3 },
    { id: 'tools', label: 'Currency & Weather', icon: Coins }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('countries')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-white bg-clip-text text-transparent">
                GlobalGuide
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-sky-400/80">
                Tourist & Transit Explorer
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded-md ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Auth / User Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setActiveTab('trips')}
                  className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-sky-500/50 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover border border-sky-400/40"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-100 leading-tight">{user.fullName || user.username}</p>
                    <p className="text-[10px] text-sky-400 font-medium">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={loginAsDemo}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 px-3 py-2 rounded-xl transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Demo User</span>
                </button>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-800/80 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
