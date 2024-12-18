import React, { useState, useEffect } from 'react';

function UpdateCustomerModal({ customer, onClose, refreshCustomers }) {
  const [updatedCustomer, setUpdatedCustomer] = useState({ ...customer });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUpdatedCustomer(customer);
  }, [customer]);

  // Simple validation function
  const validate = () => {
    const errors = {};

    if (!updatedCustomer.name.trim()) {
      errors.name = "Name is required";
    }
    if (!updatedCustomer.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedCustomer.email)) {
      errors.email = "Invalid email format";
    }
    if (!updatedCustomer.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(updatedCustomer.phoneNumber)) {
      errors.phoneNumber = "Phone number must be between 10-15 digits";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate inputs before submitting
    if (!validate()) return;

    try { 
      const token = localStorage.getItem('token');

      await fetch(`http://localhost:5520/api/customers/${customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCustomer),
      });
       refreshCustomers();
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4">Update Customer</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Name"
            value={updatedCustomer.name}
            onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email"
            value={updatedCustomer.email}
            onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, email: e.target.value })}
            className="w-full p-2 mb-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <input
            type="tel"
            placeholder="Phone Number"
            value={updatedCustomer.phoneNumber}
            onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, phoneNumber: e.target.value })}
            className="w-full p-2 mb-4 border rounded-md"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mb-2">{errors.phoneNumber}</p>}

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
            Update Customer
          </button>
        </form>
        <button onClick={onClose} className="text-gray-500 mt-4 hover:underline">Cancel</button>
      </div>
    </div>
  );
}

export default UpdateCustomerModal;
