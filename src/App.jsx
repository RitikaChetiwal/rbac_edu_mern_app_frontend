// 📁 client/src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Users from './pages/Users';
import Students from './pages/Students';
import { useEffect, useState } from 'react';

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
      <div className="flex">
        <Sidebar role={user?.role} onLogout={handleLogout} />
        <div className="p-4 flex-1">
          <Routes>
            <Route path="/profile" element={<Profile user={user} />} />
            {user.role === 'admin' && (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/students" element={<Students />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/profile" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;