import React, { useState, useEffect } from 'react';
import axios from '../../../context/axiosConfig';

const ResponseSettingsForm = () => {
  const [responses, setResponses] = useState({
    goodReviewResponses: [],
    badReviewResponses: [],
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch existing responses to populate fields on load
    const fetchResponses = async () => {
      try {
        const { data } = await axios.get('/responses'); // Adjust the endpoint as needed
        setResponses({
          goodReviewResponses: data.client.reviewResponses.goodReviewResponses || [],
          badReviewResponses: data.client.reviewResponses.badReviewResponses || [],
        });
      } catch (error) {
        console.error("Failed to load responses:", error);
      }
    };
    fetchResponses();
  }, []);

  const handleResponseChange = (type, index, event) => {
    const updatedResponses = [...responses[type]];
    updatedResponses[index] = event.target.value;
    setResponses({ ...responses, [type]: updatedResponses });
  };

  const saveResponses = async () => {
    try {
      const response = await axios.put('/responses', responses);
      setFeedback(response.data.message || 'Responses updated successfully.');
    } catch (error) {
      setFeedback('Failed to update responses.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Pre-Written Responses</h2>

      <div className="flex space-x-4">
        {/* Good Review Responses */}
        <div className="flex-1 space-y-2">
          <h3 className="font-medium text-gray-600">Positive Review Responses</h3>
          {responses.goodReviewResponses.map((goodReview, index) => (
            <textarea
              key={index}
              name="goodReview"
              placeholder="Response for positive review"
              onChange={(e) => handleResponseChange('goodReviewResponses', index, e)}
              value={goodReview}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          ))}
        </div>

        {/* Bad Review Responses */}
        <div className="flex-1 space-y-2">
          <h3 className="font-medium text-gray-600">Negative Review Responses</h3>
          {responses.badReviewResponses.map((badReview, index) => (
            <textarea
              key={index}
              name="badReview"
              placeholder="Response for negative review"
              onChange={(e) => handleResponseChange('badReviewResponses', index, e)}
              value={badReview}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          ))}
        </div>
      </div>

      <button
        onClick={saveResponses}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        Save Changes
      </button>
      {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
    </div>
  );
};

export default ResponseSettingsForm;
