import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/authContext';
import axios from 'axios';
import logo from '../assets/logo/Logo_white.png'

function ReviewPage() {
  const { user } = useContext(AuthContext);
  const { clientId, customerId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Define the function to fetch client data
    const fetchClientData = async () => {      
      const clientId = user?.id || user?.clientId;  

      // Ensure clientId and customerId are available
      if (!clientId || !customerId) {
        console.error("Client ID or Customer ID is missing.");
        return;
      }
  
      try {
        // Fetch client data without Authorization header (unprotected route)
        const response = await axios.get(`http://localhost:5520/api/clients/public/${clientId}`);
        const client = response.data;
  
        // Set the client business name
        setClientData(client.businessName);  
        // Find the specific customer name within the client’s customers array
        const customer = client.customers.find(cust => cust.id === customerId);        
        setCustomerName(customer ? customer.name : 'Customer');
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };
  
    fetchClientData();
  }, [user, customerId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check that clientId and customerId are not null/undefined
    if (!clientId || !customerId) {
      setMessage('Client or Customer ID is missing');
      return;
    }    
  
    try {
      // Send review data to backend
      const response = await axios.post('http://localhost:5520/api/reviews/new', {
        client: clientId,
        customer: customerId,
        reviewText,
        reviewRating,
      });
  
      // Handle successful response
      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setMessage('Review submitted successfully.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
  
      // Show more specific error if available
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Failed to submit review. Please try again later.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-400">
      <div className="flex justify-center max-w-lg w-full bg-gray-800 rounded-lg shadow-md mb-6">
          <img src={logo} alt='Cyberperformance' className="w-80 rounded-full" />
      </div>
     
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
        {clientData && (
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, dear <span className='text-cyan-800'>{customerName} </span>! Please leave a Review for
            <span className='text-cyan-800'> {clientData}</span>
          </h1>
        )}      
       
        {message && (
          <div className="text-center text-lg text-green-500 mb-4">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reviewText" className="block text-gray-600">
              Your Feedback
            </label>
            <textarea
              id="reviewText"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="reviewRating" className="block text-gray-600">
              Rating (1 to 5)
            </label>
            <input
              type="number"
              id="reviewRating"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewPage;

