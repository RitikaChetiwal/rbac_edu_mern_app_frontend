// 📁 client/src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Users from './pages/Users';
import Students from './pages/Students';
import { useEffect, useState } from 'react';
import DepartmentChart from './pages/Chart';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userData'));
    setUser(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setUser(null); // Update the state to trigger re-render
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 bottom-0 z-10 w-16">
          <Sidebar role={user?.role} onLogout={handleLogout} />
        </div>

        {/* Main Content Area */}
        <div className="ml-68 flex-1 min-h-screen p-4 bg-gray-50">
          <div className="max-w-full">
            <Routes>
              <Route path="/profile" element={<Profile user={user} />} />
              {user.role === 'user' && (
                <>

                  <Route path="/students" element={<Students />} />
                  <Route path="/chart-data" element={<DepartmentChart />} />
                </>
              )}
              {/* Routes for admins AND superadmins */}
              {user.role === 'admin' && (
                <>
                  <Route path="/users" element={<Users />} />
                  <Route path="/chart-data" element={<DepartmentChart />} />
                </>
              )}

              <Route path="*" element={<Navigate to="/profile" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;