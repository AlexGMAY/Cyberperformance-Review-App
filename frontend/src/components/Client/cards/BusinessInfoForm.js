import React, { useState } from 'react';
import axios from '../../../context/axiosConfig';

const BusinessInfoForm = () => {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    email: '',
    phoneNumber: '',
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
  };

  const saveBusinessInfo = async () => {
    try {
      const response = await axios.put('/business-info', businessInfo);
      setFeedback(response.data.message || 'Business information updated successfully.');
    } catch (error) {
      setFeedback('Failed to update business information.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Business Information</h2>
      <div className="space-y-4">
        <input
          name="businessName"
          placeholder="Business Name"
          onChange={handleChange}
          value={businessInfo.businessName}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={businessInfo.email}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          value={businessInfo.phoneNumber}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={saveBusinessInfo}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Save
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default BusinessInfoForm;
