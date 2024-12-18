import React from 'react';

const ReviewCard = ({ review, onSelect }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{review.customer ? review.customer.name : 'Unknown Customer'}</h3>
      <p className="text-sm text-gray-600">{review.reviewDate}</p>
      <p className="text-sm text-gray-500">{review.reviewText.slice(0, 50)}...</p>
      <p className="text-yellow-500 mt-2">Rating: {review.reviewRating}★</p>
      <button
        onClick={onSelect}
        className="text-blue-500 mt-4"
      >
        View & Respond
      </button>
    </div>
  );
};

export default ReviewCard;
