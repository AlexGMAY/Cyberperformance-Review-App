import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewRequests = () => {
  const [reviewRequests, setReviewRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ status: '', clientId: '', type: '' });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [newRequest, setNewRequest] = useState({
    clientId: '',
    customerId: '',
    type: 'email',
    scheduledTime: '',
    message: '',
    reviewLink: '',
  });

  // Fetch review requests with filters
  const fetchReviewRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5520/api/admin-review-requests', {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviewRequests(response.data.data);
    } catch (err) {
      console.error('Error fetching review requests:', err);
    }
  }; 

  useEffect(() => {
    fetchReviewRequests();
  }, [filters]);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5520/api/admin/clients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch customers for the selected client
  const fetchCustomers = async (clientId) => {
    try {
      const res = await axios.get(`http://localhost:5520/api/clients/${clientId}/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Handle client selection
  const handleClientChange = (clientId) => {
    setNewRequest({ ...newRequest, clientId, customerId: '' }); // Clear customerId when client changes
    if (clientId) {
      fetchCustomers(clientId); // Fetch associated customers
    } else {
      setCustomers([]); // Clear customers if no client selected
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };  

  // Create and Update
  const handleScheduleRequest = async () => {
    try {
      // Validate request fields
      if (!newRequest.clientId || !newRequest.customerId) {
        alert('Please select both a client and a customer.');
        return;
      }
      if (!newRequest.scheduledTime || !newRequest.message) {
        alert('Please fill out all required fields.');
        return;
      }
  
      // Determine endpoint and method
      const url = editingRequestId
        ? `http://localhost:5520/api/admin-review-requests/${editingRequestId}`
        : 'http://localhost:5520/api/admin-review-requests';
      const method = editingRequestId ? 'put' : 'post';
  
      // Debugging payload
      console.log('Request Payload:', newRequest);
  
      // Send request
      await axios[method](url, newRequest, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      // Success message
      toast.success(editingRequestId ? 'Review request updated successfully!' : 'Review request scheduled successfully!');
      setShowScheduleModal(false);
  
      // Reset form and refresh data
      setNewRequest({
        clientId: '',
        customerId: '',
        type: 'email',
        scheduledTime: '',
        message: '',
        reviewLink: '',
      });
      fetchReviewRequests();
    } catch (err) {
      console.error('Error scheduling review request:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule review request. Please try again later.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl bg-white font-bold mt-8 mb-4 border-2 border-gray-200 p-4 rounded-md">
        Review Requests Management
      </h2>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <select
          name="status"
          onChange={handleFilterChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Statuses</option>
          <option value="sent">Sent</option>
          <option value="scheduled">Scheduled</option>
          <option value="failed">Failed</option>
        </select>

        <select
          name="clientId"
          onChange={handleFilterChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.businessName}
            </option>
          ))}
        </select>

        <select
          name="type"
          onChange={handleFilterChange}
          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Types</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      {/* Schedule New Request Button */}
      <button
        className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
        onClick={() => setShowScheduleModal(true)}
      >
        Schedule New Review Request
      </button>

      {/* Review Requests Table */}
      <table className="mt-4 w-full border-collapse border">
        <thead>
          <tr className="bg-cyan-600 text-white uppercase text-sm">
            <th className="px-4 p-2">Client</th>
            <th className="px-4 p-2">Customer</th>
            <th className="px-4 p-2">Type</th>
            <th className="px-4 p-2">Status</th>
            <th className="px-4 p-2">Scheduled Time</th>
          </tr>
        </thead>
        <tbody>
          {reviewRequests.map((req) => (
            <tr key={req._id}>
              <td className="border p-2">{req.client?.businessName || 'N/A'}</td>
              <td className="border p-2">{req.customer?.name || 'N/A'}</td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2">{req.status}</td>
              <td className="border p-2">{new Date(req.scheduledTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {editingRequestId ? 'Edit Review Request' : 'Schedule New Review Request'}
            </h2>

            <div className="mb-2">
              <label className="block text-sm font-medium">Client</label>
              <select
                name="clientId"
                value={newRequest.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select a Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.businessName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Customer</label>
              <select
                  name="customerId"
                  value={newRequest.customerId}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, customerId: e.target.value })
                  }
                  disabled={!newRequest.clientId} // Disable if no client selected
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select a Customer</option>
                  {(customers || []).map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
              </select>
             </div>
  
              <div className="mb-2">
                <label className="block text-sm font-medium">Type</label>
                <select
                  name="type"
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
  
              <div className="mb-2">
                <label className="block text-sm font-medium">Scheduled Time</label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={newRequest.scheduledTime}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, scheduledTime: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
  
              <div className="mb-2">
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={newRequest.message}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, message: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  rows="3"
                ></textarea>
              </div>
  
              <div className="mb-4">
                <label className="block text-sm font-medium">Review Link</label>
                <input
                  type="url"
                  name="reviewLink"
                  value={newRequest.reviewLink}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, reviewLink: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
  
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setEditingRequestId(null);
                    setNewRequest({
                      clientId: '',
                      customerId: '',
                      type: 'email',
                      scheduledTime: '',
                      message: '',
                      reviewLink: '',
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                  onClick={handleScheduleRequest}
                >
                  {editingRequestId ? 'Update' : 'Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  };
  
  export default ReviewRequests;
  