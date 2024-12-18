import React, { useState } from 'react';
import axios from '../../../context/axiosConfig';

const NotificationForm = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    notificationFrequency: 24,
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const saveNotifications = async () => {
    try {
      const response = await axios.put('/api/client/update-notifications', notifications);
      setFeedback(response.data.message || 'Notification settings updated successfully.');
    } catch (error) {
      setFeedback('Failed to update notification settings.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={notifications.emailNotifications}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-600 font-medium">Email Notifications</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="smsNotifications"
            checked={notifications.smsNotifications}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-600 font-medium">SMS Notifications</label>
        </div>
        <label className="block">
          <span className="text-gray-600 font-medium">Notification Frequency (hours)</span>
          <input
            type="number"
            name="notificationFrequency"
            min="1"
            max="168"
            onChange={handleChange}
            value={notifications.notificationFrequency}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <button
        onClick={saveNotifications}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        Save Changes
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default NotificationForm;
