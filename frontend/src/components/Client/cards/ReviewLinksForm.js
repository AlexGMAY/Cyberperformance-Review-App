import React, { useState } from 'react';
import axios from '../../../context/axiosConfig';

const ReviewLinksForm = () => {
  const [links, setLinks] = useState({ googleReviewLink: '', reviewLink: '' });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const saveLinks = async () => {
    try {
      const response = await axios.put('/review-links', links);
      setFeedback(response.data.message || 'Review links updated successfully.');
    } catch (error) {
      setFeedback('Failed to update review links.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Review Links</h2>
      <div className="space-y-4">
        <input
          name="googleReviewLink"
          placeholder="Google Review Link"
          onChange={handleChange}
          value={links.googleReviewLink}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          name="reviewLink"
          placeholder="Review Link"
          onChange={handleChange}
          value={links.reviewLink}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={saveLinks}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Save
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default ReviewLinksForm;
