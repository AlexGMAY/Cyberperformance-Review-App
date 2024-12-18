import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResponsesTemplate = () => {
  const [goodReviewResponses, setGoodReviewResponses] = useState([]);
  const [badReviewResponses, setBadReviewResponses] = useState([]);
  

  useEffect(() => {
    // Fetch current global review responses
    axios.get('http://localhost:5520/api/responses/responsetemplates')
      .then((response) => {
        setGoodReviewResponses(response.data.goodReviewResponses || []);
        setBadReviewResponses(response.data.badReviewResponses || []);
      })
      .catch((err) => console.error('Error fetching global review responses:', err));
  }, []);

  const handleSaveResponses = () => {
    // Save the updated global responses
    axios.post('http://localhost:5520/api/responses/responsetemplates', {
      goodReviewResponses,
      badReviewResponses
    })
    .then(response => {
      console.log('Global responses updated:', response.data);
      toast.success('Global Responses updated Successfully');
    })
    .catch(err => console.error('Error saving global review responses:', err));    
  };

  const handleResponseChange = (type, index, value) => {
    if (type === 'good') {
      const updatedResponses = [...goodReviewResponses];
      updatedResponses[index] = value;
      setGoodReviewResponses(updatedResponses);
    } else {
      const updatedResponses = [...badReviewResponses];
      updatedResponses[index] = value;
      setBadReviewResponses(updatedResponses);
    }
  };

  const addNewResponse = (type) => {
    if (type === 'good') {
      setGoodReviewResponses([...goodReviewResponses, ""]);
    } else {
      setBadReviewResponses([...badReviewResponses, ""]);
    }
  };

  return (
    <div className="mx-auto mt-8">      
      <div>
        <div className='flex justify-between gap-8'>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-200 pb-4">Good Review Responses</h3>
            <div className="space-y-4">
              {goodReviewResponses.map((response, index) => (
                <textarea
                  key={index}
                  value={response}
                  onChange={(e) => handleResponseChange('good', index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Response #${index + 1}`}
                />
              ))}
              <button
                onClick={() => addNewResponse('good')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add New Good Response
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-200 pb-4">Bad Review Responses</h3>
            <div className="space-y-4">
              {badReviewResponses.map((response, index) => (
                <textarea
                  key={index}
                  value={response}
                  onChange={(e) => handleResponseChange('bad', index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`Response #${index + 1}`}
                />
              ))}
              <div className="text-right">
                <button
                  onClick={() => addNewResponse('bad')}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Add New Bad Response
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
        <button
          onClick={handleSaveResponses}
          className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600"
        >
          Save Global Responses
        </button>
      </div>
      </div> 

      
      <ToastContainer />     
    </div>
  );
};

export default ResponsesTemplate;
