import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/authContext';

const SmsRequests = ({ clientId }) => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch customers and templates on load
  useEffect(() => {
    // Only fetch data if the token is available
    if (token) {
      const fetchData = async () => {
        try {
          // Fetch customers and templates
          const [customerRes, templateRes] = await Promise.all([
            axios.get('http://localhost:5520/api/review-request/customers', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:5520/api/review-request/sms-templates', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          console.log('Fetched customers:', customerRes.data);
          console.log('Fetched templates:', templateRes.data);

          setCustomers(customerRes.data);
          setTemplates(templateRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, token]);

  // Update message preview when template or customer changes
  useEffect(() => {
    if (selectedTemplate) {
      setContent(selectedTemplate.content.replace("{customerName}", selectedCustomer?.name || ''));      
    }
  }, [selectedTemplate, selectedCustomer]);

  // Handle SMS sending or scheduling
  const handleSendSms = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedTemplate) {
      alert("Please select both a customer and a template");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5520/api/review-request/sms',{
        customerId: selectedCustomer._id,
        templateId: selectedTemplate._id,      
        scheduleDate: scheduleDate || null
      }, { headers: { Authorization: `Bearer ${token}` } });

      setMessage(response.data.message);
      setError('');
    } catch (error) {
      setMessage('');
      setError('Failed to send review request');
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">SMS Review Request</h2>
      
      {/* Customer Selection */}
      <label className="block mb-2 text-gray-600 font-medium">Select Customer</label>
      <select
        value={selectedCustomer?._id || ''}
        onChange={(e) => setSelectedCustomer(customers.find(cust => cust._id === e.target.value))}
        className="block w-full p-2 border rounded mb-4"
      >
        <option value="">-- Select Customer --</option>
        {customers.map(customer => (
          <option key={customer._id} value={customer._id}>
            {customer.name} - {customer.phoneNumber}
          </option>
        ))}
      </select>

      {/* Template Selection */}
      <label className="block mb-2 text-gray-600 font-medium">Select SMS Template</label>
      <select
        value={selectedTemplate?._id || ''}
        onChange={(e) => setSelectedTemplate(templates.find(tpl => tpl._id === e.target.value))}
        className="block w-full p-2 border rounded mb-4"
      >
        <option value="">-- Select a template --</option>
        {templates.map(template => (
          <option key={template._id} value={template._id}>
            {template.name}
          </option>
        ))}
      </select>

      {/* Custom Message Preview */}
      <label className="block mb-2 text-gray-600 font-medium">Message Preview</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
        rows="4"
        readOnly
      />

      {/* Scheduling Option */}
      <label className="block mb-2 text-gray-600 font-medium">Schedule Date & Time (optional)</label>
      <input
        type="datetime-local"
        value={scheduleDate}
        onChange={(e) => setScheduleDate(e.target.value)}
        className="block w-full p-2 border rounded mb-6"
      />

      {/* Send Button */}
      <button
        onClick={handleSendSms}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
      >
        {scheduleDate ? "Schedule SMS" : "Send SMS Now"}
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default SmsRequests;
