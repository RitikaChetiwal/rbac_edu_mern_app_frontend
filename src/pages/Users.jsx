import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  User,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async (page = 1, search = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/users/paginated?page=${page}&limit=7&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
      setTotalUsers(res.data.pagination.totalUsers);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }
  };

  const showNotification = (message, type = 'success') => {
  const id = Date.now();
  const newNotification = {
    id,
    message,
    type, // 'success', 'error', 'warning', 'info'
    timestamp: new Date()
  };
  
  setNotifications(prev => [...prev, newNotification]);
  
  // Auto remove notification after 5 seconds
  setTimeout(() => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, 5000);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isEditMode) {
      // Update user
      const res = await axios.put(`http://localhost:5000/users/${editingUserId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => user._id === editingUserId ? res.data.user : user));
      showNotification(`User "${formData.fullName}" updated successfully!`, 'success');
    } else {
      // Add new user
      const res = await axios.post('http://localhost:5000/users', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, res.data.user]);
      showNotification(`User "${formData.fullName}" added successfully!`, 'success');
    }
    closeModal();
  } catch (err) {
    console.error('Error submitting form:', err);
    const errorMessage = err.response?.data?.message || 'An error occurred';
    showNotification(errorMessage, 'error');
  }
};

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditingUserId(user._id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '', // Leave password empty for edit
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
  const userToDelete = users.find(user => user._id === userId);
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userId));
      showNotification(`User "${userToDelete?.fullName}" deleted successfully!`, 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      showNotification(errorMessage, 'error');
    }
  }
};


  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({ fullName: '', email: '', password: '', role: 'user' });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingUserId(null);
    setFormData({ fullName: '', email: '', password: '', role: 'user' });
    setIsModalOpen(true);
  };

  // Add search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  };

  // Add pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderNotifications = () => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>;
      case 'error':
        return <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
          <X className="w-3 h-3 text-white" />
        </div>;
      case 'warning':
        return <div className="w-5 h-5 rounded-full bg-yellow-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>;
      case 'info':
        return <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">i</span>
        </div>;
      default:
        return <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>;
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getNotificationColors(notification.type)}`}
          style={{
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs mt-1 opacity-75">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {renderNotifications()}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600">Manage system users and their roles</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Page</p>
                  <p className="text-2xl font-bold text-gray-900">{currentPage} of {totalPages}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Showing</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>User</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-semibold">{users.length}</span> of <span className="font-semibold">{totalUsers}</span> users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditMode ? 'Edit User' : 'Add New User'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required={!isEditMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Modal Footer */}
                <div className="flex space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-[1.02]"
                  >
                    {isEditMode ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;