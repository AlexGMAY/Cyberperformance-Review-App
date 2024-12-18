import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '', role: 'Support Admin' });

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get('http://localhost:5520/api/admin/admins',{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      await axios.post('http://localhost:5520/api/auth/register', newAdmin,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("New Admin registered successfully!");
      fetchAdmins();
    } catch (error) {
      console.error('Failed to add admin', error.message);
      toast.error("Failed to add admin!");
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:5520/api/admin/${id}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Admin deleted successfully!");
      fetchAdmins();
    } catch (error) {
      console.error('Failed to delete admin', error);
      toast.error("Failed to delete admin!");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Admin Management</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Username"
          className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={newAdmin.username}
          onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
        />
        <select
          className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={newAdmin.role}
          onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
        >
          <option value="Super Admin">Super Admin</option>
          <option value="Support Admin">Support Admin</option>
        </select>
        <button className="ml-2 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600" onClick={handleAddAdmin}>
          Add Admin
        </button>
      </div>

      <table className="w-full text-left border">
        <thead>
          <tr className='bg-cyan-600 text-white uppercase text-sm'>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td className="border px-4 py-2">{admin.username}</td>
              <td className="border px-4 py-2">{admin.email}</td>
              <td className="border px-4 py-2">{admin.role}</td>
              <td className="border px-4 py-2">{admin.createdAt}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteAdmin(admin._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toast Container for popups */}
      <ToastContainer /> 
    </div>
  );
};

export default AdminManagement;
