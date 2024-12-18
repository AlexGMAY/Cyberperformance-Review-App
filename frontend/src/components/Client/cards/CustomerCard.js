import React, { useState } from 'react';

function CustomerCard({ customer, onEdit, onDelete, viewFollowUpHistory }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white relative">
      <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
      <p className="text-sm text-gray-600">Email: {customer.email || 'N/A'}</p>
      <p className="text-sm text-gray-600">Phone: {customer.phoneNumber || 'N/A'}</p>
      <p className="text-sm text-gray-600">Review Status: {customer.googleReviewStatus}</p>

      {/* Follow-Up History Button */}
      <button
        onClick={() => viewFollowUpHistory(customer)}
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        View Follow-Up History
      </button>

      {/* Three-dot icon for menu */}
      <div className="absolute top-2 right-2">
        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
          &#x22EE; {/* Unicode for vertical ellipsis */}
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 py-1 w-24 bg-white rounded-md shadow-lg border border-gray-200">
            <button
              onClick={() => {
                onEdit(customer);
                setMenuOpen(false); // Close menu after clicking
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(customer._id);
                setMenuOpen(false); // Close menu after clicking
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerCard;
