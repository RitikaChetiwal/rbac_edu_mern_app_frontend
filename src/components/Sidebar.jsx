import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Users, 
  GraduationCap, 
  BarChart3, 
  LogOut,
  Home
} from 'lucide-react';

const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/profile', label: 'Profile', icon: User, showForAll: true },
    { path: '/users', label: 'Users', icon: Users, adminOnly: true },
    { path: '/students', label: 'Students', icon: GraduationCap, adminOnly: true },
    { path: '/chart-data', label: 'Student Stats', icon: BarChart3, adminOnly: true },
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-xs text-slate-400 capitalize">{role} Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const shouldShow = item.showForAll || (item.adminOnly && role === 'admin');
          
          if (!shouldShow) return null;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-[1.01]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive(item.path) 
                  ? 'text-white' 
                  : 'text-slate-400 group-hover:text-blue-400'
              }`} />
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </a>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <div className="flex items-center space-x-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {role === 'admin' ? 'Administrator' : 'User'}
            </p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white transition-all duration-200 hover:shadow-lg hover:transform hover:scale-[1.02] group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;