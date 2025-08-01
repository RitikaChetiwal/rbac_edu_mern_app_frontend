// import { useState } from 'react';
// import axios from 'axios';

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const res = await axios.post('http://localhost:5000/users/login', { 
//         email, 
//         password 
//       });
      
//       localStorage.setItem('userData', JSON.stringify(res.data.user));
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-sm mx-auto mt-10">
//       <form onSubmit={handleLogin}>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <input 
//           type="email" 
//           placeholder="Email" 
//           value={email}
//           onChange={(e) => setEmail(e.target.value)} 
//           className="border w-full mb-2 p-2 rounded"
//           required
//         />
        
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password}
//           onChange={(e) => setPassword(e.target.value)} 
//           className="border w-full mb-2 p-2 rounded"
//           required
//         />
        
//         <button 
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;



import { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Fixed: Changed from /users/login to /api/auth/login
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <form onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="border w-full mb-2 p-2 rounded"
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="border w-full mb-2 p-2 rounded"
          required
        />
        
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;