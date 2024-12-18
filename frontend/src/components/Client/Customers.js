import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/authContext';
import CustomerCard from './cards/CustomerCard';
import UpdateCustomerModal from './cards/UpdateCustomerModal';
import AddCustomerCard from './cards/AddCustomerCard';
import FollowUpHistoryModal from './cards/FollowUpHistoryModal';

const Customers = ({ clientId }) => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phoneNumber: '' });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  // Fetch customers for the specified client
  const fetchCustomers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return;
    } 
    const clientId = user?.id || user?.clientId;
    try {
      const response = await axios.get(`http://localhost:5520/api/customers/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Customers Response:', response.data);
      setCustomers(response.data);      
    } catch (error) {
      console.error("Error fetching customers:", error.response?.data || error.message);
    }
  };

  // Add a new customer
  const handleAddCustomer = async (newCustomer) => {
    const token = localStorage.getItem('token');
    const clientId = user?.id || user?.clientId;
  
    if (!token || !clientId) {
      setMessage({ type: 'error', text: 'No token or client ID found' });
      return;
    }  
    try {
      const response = await axios.post(`http://localhost:5520/api/clients/${clientId}/customer`, newCustomer, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers([...customers, response.data]);
      setNewCustomer({ name: '', email: '', phoneNumber: '' });
      setShowModal(false);
      setMessage({ type: 'success', text: 'Customer added successfully!' });
      await fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error.response?.data || error.message);
      setMessage({ type: 'error', text: error.response?.data.message || 'Failed to add customer' });
    }
  };
  
  // Edit Customer Modal
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowUpdateModal(true);
    setShowFollowUpModal(false);
  };

  // Delete Customer
  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5520/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchCustomers(); // Refresh customer list after deletion
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // View follow-up history for a selected customer
  const viewFollowUpHistory = (customer) => {
    setSelectedCustomer(customer);
    setShowFollowUpModal(true);  // Open the follow-up modal specifically
    setShowUpdateModal(false);   // Ensure update modal is closed
  };

  // Search Customer by Name or Email
  const filteredCustomers = customers.filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );    

  // Apply pagination to the filtered customers list
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

   // Pagination navigation  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Management</h2>

      
      <div className="flex items-center mb-4 justify-between">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border w-80 rounded p-2"
        />
        {/* Button to open the Add Customer Modal */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4  rounded-md font-semibold hover:bg-blue-600"
        >
          Add New Customer
        </button>
      </div>

      {showModal && <AddCustomerCard onSubmit={handleAddCustomer} setMessage={setMessage} onClose={() => setShowModal(false)} errors={errors} />}

      
      {/* Customer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCustomers.map((customer) => (
          <CustomerCard
            key={customer._id}
            customer={customer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            viewFollowUpHistory={viewFollowUpHistory}
          />
        ))}
        {/* Conditionally render Update and Follow-Up Modals */}
        {showUpdateModal && selectedCustomer && (
          <UpdateCustomerModal
            customer={selectedCustomer}
            onClose={() => setShowUpdateModal(false)}
            refreshCustomers={fetchCustomers}
          />
        )}
        {showFollowUpModal && selectedCustomer && (
          <FollowUpHistoryModal
            customer={selectedCustomer}
            onClose={() => setShowFollowUpModal(false)}
          />
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`py-2 px-4 rounded ${
              i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>      
    </div>
  );
};

export default Customers;