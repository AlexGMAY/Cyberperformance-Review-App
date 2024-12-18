import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/authContext';

const ReviewRequests = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState('');
  const [selectedSmsTemplateId, setSelectedSmsTemplateId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('email'); // Default: email
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const [customerRes, emailTemplateRes, smsTemplateRes] = await Promise.all([
            axios.get('http://localhost:5520/api/review-request/customers', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:5520/api/review-request/templates', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:5520/api/review-request/sms-templates', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setCustomers(customerRes.data);
          setEmailTemplates(emailTemplateRes.data);
          setSmsTemplates(smsTemplateRes.data);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };

      fetchData();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Define the combined endpoint
    const endpoint = 'http://localhost:5520/api/review-request';
  
    // Construct the payload
    const payload = {
      customerId: selectedCustomerId,
      templateId:
        deliveryMethod === 'email' ? selectedEmailTemplateId : selectedSmsTemplateId,
      type: deliveryMethod, // Specify whether it's "email" or "sms"
      ...(scheduleDate && { scheduleDate }), // Include scheduleDate if provided
    };
  
    try {
      // Send the request to the combined endpoint
      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Handle success response
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      // Handle error response
      console.error('Error sending review request:', err);
      setMessage('');
      setError('Failed to send review request');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Review Request Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">-- Select Customer --</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.email || customer.phoneNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Method
          </label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>

        {/* Template Selection */}
        {deliveryMethod === 'email' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Email Template
            </label>
            <select
              value={selectedEmailTemplateId}
              onChange={(e) => setSelectedEmailTemplateId(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">-- Select Template --</option>
              {emailTemplates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.subject}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select SMS Template
            </label>
            <select
              value={selectedSmsTemplateId}
              onChange={(e) => setSelectedSmsTemplateId(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">-- Select Template --</option>
              {smsTemplates.map((template) => (
                <option key={template._id} value={template._id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Schedule Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Schedule Date & Time (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Send Review Request
        </button>

        {/* Messages */}
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default ReviewRequests;
