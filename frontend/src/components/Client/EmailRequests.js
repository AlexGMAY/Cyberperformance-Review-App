import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/authContext';

const EmailRequests = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

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
            axios.get('http://localhost:5520/api/review-request/templates', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5520/api/review-request/email', {
        customerId: selectedCustomerId,
        templateId: selectedTemplateId,
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Email Review Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Customer --</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Template
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Template --</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.subject}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send Review Request
        </button>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default EmailRequests;