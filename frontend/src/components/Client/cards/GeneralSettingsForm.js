import React, { useState } from 'react';
import axios from '../../../context/axiosConfig';

const GeneralSettingsForm = () => {
  const [generalSettings, setGeneralSettings] = useState({
    profilePicture: '',
    timeZone: 'UTC',
    language: 'en',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const saveSettings = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }
      formData.append('timeZone', generalSettings.timeZone);
      formData.append('language', generalSettings.language);

      const response = await axios.put('/general', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFeedback(response.data.message || 'General settings updated successfully.');
    } catch (error) {
      setFeedback('Failed to update general settings.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">General Settings</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-600 font-medium">Profile Picture</span>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-600 font-medium">Time Zone</span>
          <input
            type="text"
            name="timeZone"
            onChange={handleChange}
            value={generalSettings.timeZone}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-600 font-medium">Language</span>
          <input
            type="text"
            name="language"
            onChange={handleChange}
            value={generalSettings.language}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </label>
      </div>
      <button
        onClick={saveSettings}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        Save Changes
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default GeneralSettingsForm;
