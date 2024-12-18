import React from 'react';

const FollowUpHistoryModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Follow-Up History for {customer.name}
        </h3>

        {/* Scrollable list of follow-up history */}
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
          <ul>
            {customer.followUpHistory.map((entry, index) => (
              <li key={index} className="py-4">
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {new Date(entry.date).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Status:</span> {entry.status}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpHistoryModal;
