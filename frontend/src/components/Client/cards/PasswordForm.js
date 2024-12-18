import React, { useState } from 'react';
import axios from '../../../context/axiosConfig';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordForm = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '', // Updated to match backend expectation
    newPassword: '',
    confirmPassword: '',
  });
  const [feedback, setFeedback] = useState('');
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setFeedback('New passwords do not match.');
      return;
    }

    try {
      // Match the backend route and ensure axiosConfig provides the token
      const response = await axios.put('/change-password', passwords);
      setFeedback(response.data.message || 'Password updated successfully.');
    } catch (error) {
      // If there's an error, show it if available, else default message
      setFeedback(error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Password</h2>
      <div className="space-y-4">
        {['oldPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
          <label className="block relative" key={index}>
            <span className="text-gray-600 font-medium">
              {field === 'oldPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
            </span>
            <input
              type={showPassword[field] ? 'text' : 'password'}
              name={field}
              onChange={handleChange}
              value={passwords[field]}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span
              onClick={() => togglePasswordVisibility(field)}
              className="absolute top-1/2 mt-3 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
        ))}
      </div>
      <button
        onClick={updatePassword}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        Save Password
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default PasswordForm;
