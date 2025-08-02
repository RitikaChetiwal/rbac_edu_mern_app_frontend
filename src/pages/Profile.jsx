// // 📁 client/src/pages/Profile.jsx
// const Profile = ({ user }) => (
//   <div>
//     <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
//     <p>Email: {user.email}</p>
//     <p>Role: {user.role}</p>
//   </div>
// );
// export default Profile;

import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  MapPin,
  Edit3,
  Camera
} from 'lucide-react';

const Profile = ({ user }) => {
  // Mock additional user data for demonstration
  const userDetails = {
    ...user,
    joinDate: 'January 2024',
    location: 'New York, USA',
    lastLogin: '2 hours ago',
    avatar: null // Could be user.avatar if available
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'from-red-500 to-pink-500';
      case 'teacher':
        return 'from-blue-500 to-cyan-500';
      case 'student':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Cover Background */}
              <div className={`h-32 bg-gradient-to-r ${getRoleColor(user.role)} relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg">
                      <div className={`w-full h-full bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center`}>
                        <User className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white   mb-4">{userDetails.fullName}</h2>
                        <p className="text-sm text-black-500 ">Last active {userDetails.lastLogin}</p>
                      </div>
                      <button className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-600">{userDetails.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Role</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeStyle(userDetails.role)}`}>
                          {userDetails.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Member Since</p>
                        <p className="text-sm text-gray-600">{userDetails.joinDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{userDetails.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Profile</p>
                    <p className="text-sm text-gray-500">Update your information</p>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Security Settings</p>
                    <p className="text-sm text-gray-500">Manage your password</p>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-500">Control your privacy</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[85%]"></div>
                </div>
                
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Login Streak</span>
                    <span className="font-medium text-green-600">12 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Account Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;