import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReviewCard from './cards/ReviewCard';
import ReviewDetailModal from './cards/ReviewDetailModal';
import ResponseStatistics from './cards/ResponseStatistics';
import AuthContext from '../../context/authContext';

const Reviews = ({ clientId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseStats, setResponseStats] = useState({ total: 0, responded: 0, breakdown: {} });
  const [page, setPage] = useState(1);  
  const [sortOption, setSortOption] = useState("date"); // "date", "rating", "status"
  const [filterOption, setFilterOption] = useState("all"); // "all", "responded", "notResponded", "rating_5", etc.

  const pageSize = 10; // Number of reviews per page

  // Get All the Reviews
  const fetchReviews = async () => {
    const token = localStorage.getItem('token');
    const clientId = user?.id || user?.clientId;
  
    if (!token || !clientId) {
      console.error("No token or client ID found");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5520/api/clients/${clientId}/reviews`, {
        params: {
          page,
          sort: sortOption,
          filter: filterOption,
          limit: pageSize,
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
      //setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return { reviews: [] }; // Fallback to an empty array on error
    }
  };

  // Get Responses Statistics
  const fetchResponseStats = async () => {
    const token = localStorage.getItem('token');
    const clientId = user?.id || user?.clientId;
  
    if (!token || !clientId) {
      console.error("No token or client ID found");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5520/api/clients/reviews/stats/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponseStats(response.data);
    } catch (error) {
      console.error("Error fetching response stats:", error);
    }
  };
  

  
  useEffect(() => {
    //setLoading(true); // Start loading
    const fetchData = async () => {
      const data = await fetchReviews(); // Await the fetch
      setReviews(data.reviews || []); // Now set the reviews from data
      //setLoading(false); // End loading
    };
    fetchData();
    fetchResponseStats();
  }, [page, sortOption, filterOption]);
  

  const handleSelectReview = (review) => {
    setSelectedReview(review);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review Management</h2>

      {/* Response Statistics */}
      <ResponseStatistics stats={responseStats} />

      {/* Sorting and Filtering Options */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div>
          <label className="text-gray-700">Sort by: </label>
          <select
            className="ml-2 border border-gray-300 rounded p-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="status">Response Status</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700">Filter: </label>
          <select
            className="ml-2 border border-gray-300 rounded p-2"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All Reviews</option>
            <option value="responded">Responded</option>
            <option value="notResponded">Not Responded</option>
            <option value="rating_5">5 Stars</option>
            <option value="rating_4">4 Stars</option>
            <option value="rating_3">3 Stars</option>
            <option value="rating_2">2 Stars</option>
            <option value="rating_1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review List with Pagination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">        
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onSelect={() => handleSelectReview(review)}
            />
          ))
        ) : (
          <p className="text-2xl font-semibold text-gray-800">No reviews found.</p> // Provide feedback when there are no reviews
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="py-2 px-4 bg-gray-300 rounded-md"
          >
            Previous
          </button>
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          className="py-2 px-4 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>

      {/* Review Detail and Respond Modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onRespond={fetchReviews} // Refresh list after responding
        />
      )}
    </div>
  );
};

export default Reviews;