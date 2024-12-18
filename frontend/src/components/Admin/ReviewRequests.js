// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReviewRequests = () => {
//   const [reviewRequests, setReviewRequests] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [filters, setFilters] = useState({ status: '', clientId: '', type: '' });
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [editingRequestId, setEditingRequestId] = useState(null);
//   const [newRequest, setNewRequest] = useState({
//     clientId: '',
//     customerId: '',
//     type: 'email',
//     scheduledTime: '',
//     message: '',
//     reviewLink: '',
//   });
//   const [selectedClient, setSelectedClient] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');

//   const fetchReviewRequests = async () => {
//     try {
//       const response = await axios.get('http://localhost:5520/api/admin-review-requests', { params: filters });
//       setReviewRequests(response.data.data);
//     } catch (err) {
//       console.error('Error fetching review requests:', err);
//     }
//   };

//   useEffect(() => {
//     fetchReviewRequests();
//   }, [filters]);

//   // Fetch clients when the modal opens
//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const response = await axios.get('http://localhost:5520/api/admin/clients', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setClients(response.data); // Assuming the response contains an array of clients
//       } catch (err) {
//         console.error('Error fetching clients:', err);
//       }
//     };
//     fetchClients();
//   }, []);

//   // Fetch customers when a client is selected
//   const handleClientChange = async (clientId) => {
//     setSelectedClient(clientId);
//     setSelectedCustomer(''); // Reset selected customer
  
//     try {
//       const response = await axios.get(`http://localhost:5520/api/customers/${clientId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Include token
//       });
//       setCustomers(response.data.data); // Populate the customers dropdown
//     } catch (error) {
//       console.error('Error fetching customers:', error.response?.data?.message || error.message);
//       setCustomers([]); // Clear the customers dropdown on error
//     }
//   };
  

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleNewRequestChange = (e) => {
//     setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
//   };

//   const handleScheduleRequest = async () => {
//     try {
//       const response = await axios.post('/api/review-requests', newRequest);
//       alert('Review request scheduled successfully!');
//       setShowScheduleModal(false);
//       fetchReviewRequests(); // Refresh list
//     } catch (err) {
//       console.error('Error scheduling review request:', err);
//       alert('Failed to schedule review request.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h2 className="text-2xl bg-white font-bold mt-8 mb-4 border-2 border-gray-200 p-4 rounded-md">Review Requests Management</h2>
//       <p className='mb-8 font-sm text-gray-600'>Text goes here...</p>

//       {/* Filters */}
//       <div className="mt-4 grid grid-cols-3 gap-4">
//         <select name="status" onChange={handleFilterChange} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
//           <option value="">All Statuses</option>
//           <option value="sent">Sent</option>
//           <option value="scheduled">Scheduled</option>
//           <option value="failed">Failed</option>
//         </select>

//         <select
//           name="clientId"
//           onChange={handleFilterChange}
//           className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//         >
//           <option value="">All Clients</option>
//           {clients.map((client) => (
//             <option key={client._id} value={client._id}>
//               {client.businessName}
//             </option>
//           ))}
//         </select>

//         <select name="type" onChange={handleFilterChange} className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
//           <option value="">All Types</option>
//           <option value="email">Email</option>
//           <option value="sms">SMS</option>
//         </select>
//       </div>

//       {/* Schedule New Request Button */}
//       <button
//         className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
//         onClick={() => setShowScheduleModal(true)}
//       >
//         Schedule New Review Request
//       </button>

//       {/* Review Requests Table */}
//       <table className="mt-4 w-full border-collapse border">
//         <thead>
//           <tr className='bg-cyan-600 text-white uppercase text-sm'>
//             <th className="px-4 p-2">Client</th>
//             <th className="px-4 p-2">Customer</th>
//             <th className="px-4 p-2">Type</th>
//             <th className="px-4 p-2">Status</th>
//             <th className="px-4 p-2">Scheduled Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reviewRequests.map((req) => (
//             <tr key={req._id}>
//               <td className="border p-2">{req.client?.businessName || 'N/A'}</td>
//               <td className="border p-2">{req.customer?.name || 'N/A'}</td>
//               <td className="border p-2">{req.type}</td>
//               <td className="border p-2">{req.status}</td>
//               <td className="border p-2">{new Date(req.scheduledTime).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Schedule Modal */}
      
//       {showScheduleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-4">
//               {editingRequestId ? 'Edit Review Request' : 'Schedule New Review Request'}
//             </h2>

//             <div className="mb-2">
//   <label className="block text-sm font-medium">Client</label>
//   <select
//     name="clientId"
//     value={newRequest.clientId}
//     onChange={(e) => {
//       handleNewRequestChange(e); // Update the newRequest state
//       handleClientChange(e.target.value); // Fetch customers for the selected client
//     }}
//     className="border p-2 rounded w-full"
//   >
//     <option value="">Select a Client</option>
//     {clients.map((client) => (
//       <option key={client._id} value={client._id}>
//         {client.businessName}
//       </option>
//     ))}
//   </select>
// </div>


//             <div className="mb-2">
//               <label className="block text-sm font-medium">Customer</label>
//               <select
//                 name="customerId"
//                 value={newRequest.customerId}
//                 onChange={handleNewRequestChange}
//                 className="border p-2 rounded w-full"
//                 disabled={!newRequest.clientId}
//               >
//                 <option value="">Select a Customer</option>
//                 {customers.map((customer) => (
//                   <option key={customer._id} value={customer._id}>
//                     {customer.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Other fields remain unchanged */}
//             <div className="mb-2">
//               <label className="block text-sm font-medium">Type</label>
//               <select
//                 name="type"
//                 value={newRequest.type}
//                 onChange={handleNewRequestChange}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="email">Email</option>
//                 <option value="sms">SMS</option>
//               </select>
//             </div>

//             <div className="mb-2">
//               <label className="block text-sm font-medium">Scheduled Time</label>
//               <input
//                 type="datetime-local"
//                 name="scheduledTime"
//                 value={newRequest.scheduledTime}
//                 onChange={handleNewRequestChange}
//                 className="border p-2 rounded w-full"
//               />
//             </div>

//             <div className="mb-2">
//               <label className="block text-sm font-medium">Message</label>
//               <textarea
//                 name="message"
//                 value={newRequest.message}
//                 onChange={handleNewRequestChange}
//                 className="border p-2 rounded w-full"
//               />
//             </div>

//             <div className="flex justify-end mt-4">
//               <button
//                 className="bg-gray-300 px-4 py-2 rounded mr-2"
//                 onClick={() => {
//                   setShowScheduleModal(false);
//                   setNewRequest({
//                     clientId: '',
//                     customerId: '',
//                     type: 'email',
//                     scheduledTime: '',
//                     message: '',
//                     reviewLink: '',
//                   });
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleScheduleRequest}
//               >
//                 {editingRequestId ? 'Update' : 'Schedule'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewRequests;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch customers based on selected client
  const handleClientChange = async (clientId) => {
    setNewRequest({ ...newRequest, clientId });
    setCustomers([]); // Clear previous customers

    if (!clientId) return;

    try {
      const response = await axios.get(`http://localhost:5520/api/customers/${clientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCustomers(response.data.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle form input changes for new request
  const handleNewRequestChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  // Schedule or update review request
  const handleScheduleRequest = async () => {
    try {
      const url = editingRequestId
        ? `http://localhost:5520/api/review-requests/${editingRequestId}`
        : 'http://localhost:5520/api/review-requests';
      const method = editingRequestId ? 'put' : 'post';

      await axios[method](url, newRequest, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert(editingRequestId ? 'Review request updated successfully!' : 'Review request scheduled successfully!');
      setShowScheduleModal(false);
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
      alert('Failed to schedule review request.');
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
                onChange={handleNewRequestChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select a Customer</option>
                  {customers.map((customer) => (
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
                  onChange={handleNewRequestChange}
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
                  onChange={handleNewRequestChange}
                  className="border p-2 rounded w-full"
                />
              </div>
  
              <div className="mb-2">
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={newRequest.message}
                  onChange={handleNewRequestChange}
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
                  onChange={handleNewRequestChange}
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
      </div>
    );
  };
  
  export default ReviewRequests;
  