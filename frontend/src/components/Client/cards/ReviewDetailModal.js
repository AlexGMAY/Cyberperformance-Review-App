import React, { useState } from 'react';
import axios from 'axios';

const ReviewDetailModal = ({ review, onClose, onRespond }) => {
  const [responseText, setResponseText] = useState(review.response || '');  
  
  
  const handleSubmitResponse = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No token found");
      return;
    }
  
    try {
      await axios.post(
        `http://localhost:5520/api/reviews/respond/${review._id}`,
        { response: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRespond();  // Refresh reviews list after response
      onClose();
    } catch (error) {
      console.error("Error responding to review:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">
          Review from {review.customer ? review.customer.name : 'Unknown Customer'}
        </h3>
        <p className="text-sm text-gray-600">{review.reviewDate}</p>
        <p className="text-gray-800 mt-2">{review.reviewText}</p>
        <p className="text-yellow-500 mt-2">Rating: {review.reviewRating}★</p>

        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Your Response:</label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            rows="4"
          ></textarea>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={onClose} className="py-2 px-4 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={handleSubmitResponse} className="py-2 px-4 bg-blue-500 text-white rounded-md">Submit Response</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
