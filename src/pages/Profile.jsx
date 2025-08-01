// 📁 client/src/pages/Profile.jsx
const Profile = ({ user }) => (
  <div>
    <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
    <p>Email: {user.email}</p>
    <p>Role: {user.role}</p>
  </div>
);
export default Profile;