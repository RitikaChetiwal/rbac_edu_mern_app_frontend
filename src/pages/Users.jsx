import { useEffect, useState } from 'react';
import axios from 'axios';

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
      } else {
        // Add new user
        const res = await axios.post('http://localhost:5000/users', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers([...users, res.data.user]);
      }
      closeModal();
    } catch (err) {
      console.error('Error submitting form:', err);
      alert(err.response?.data?.message || 'An error occurred');
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.message || 'Failed to delete user');
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add User
        </button>
      </div>

      {/* Search Bar */}
<div className="mb-4">
  <input
    type="text"
    placeholder="Search users by name, email, or role..."
    value={searchTerm}
    onChange={handleSearch}
    className="w-full max-w-md p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

      {/* User Table */}
      <table className="min-w-full border border-gray-200 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.fullName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 capitalize">{user.role}</td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
<div className="flex justify-between items-center mt-4">
  <div className="text-sm text-gray-600">
    Showing {users.length} of {totalUsers} users
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Previous
    </button>
    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Next
    </button>
  </div>
</div>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* User Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder={isEditMode ? "Password (leave blank to keep current)" : "Password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isEditMode}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditMode ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;