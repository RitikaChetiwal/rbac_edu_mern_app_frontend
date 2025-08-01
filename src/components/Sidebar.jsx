import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from App.jsx
    navigate('/'); // Optional: navigate to home (though user state change will handle this)
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col justify-between p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <a 
              href="/profile" 
              className={`block px-2 py-1 rounded transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-700'
              }`}
            >
              Profile
            </a>
          </li>
          {role === 'admin' && (
            <>
              <li>
                <a 
                  href="/users" 
                  className={`block px-2 py-1 rounded transition-colors ${
                    isActive('/users') 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  Users
                </a>
              </li>
              <li>
                <a 
                  href="/students" 
                  className={`block px-2 py-1 rounded transition-colors ${
                    isActive('/students') 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  Students
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Logout Button at Bottom */}
      <div className="pt-4 border-t border-gray-600">
        <button
          onClick={handleLogout}
          className="w-full text-left hover:bg-red-600 bg-red-500 px-2 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;