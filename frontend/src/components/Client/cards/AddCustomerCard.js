// AddCustomerModal.js
import React, { useState } from 'react';

const AddCustomerCard = ({ onClose, onSubmit }) => {
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phoneNumber: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  // Validate Add Customer Form
  const validateForm = () => {
    const newErrors = {};

    if (!newCustomer.name.trim()) newErrors.name = "Name is required.";
    if (newCustomer.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newCustomer.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (newCustomer.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(newCustomer.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     onSubmit(newCustomer); // Call the onSubmit prop with the new customer data
  //     setNewCustomer({ name: '', email: '', phoneNumber: '' }); // Reset the form
  //     onClose(); // Close the modal
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const responseMessage = await onSubmit(newCustomer); // Pass customer data to onSubmit prop
        setMessage({ type: 'success', text: responseMessage });
        setNewCustomer({ name: '', email: '', phoneNumber: '' }); // Reset form
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to add customer' });
      }
      onClose(); // Close modal on success
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h3 className="text-xl font-medium text-gray-700 mb-4">Add New Customer</h3>
        {message && (
          <div
            className={`alert ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} p-2 rounded-md mb-4`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={newCustomer.phoneNumber}
              onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
              className={`w-full p-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerCard;
