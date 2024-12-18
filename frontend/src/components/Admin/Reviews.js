import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    client: '',
    rating: '',
    dateRange: { startDate: '', endDate: '' },
    status: '',
  });

  // Fetch clients for the dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5520/api/admin/clients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClients(response.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  // Fetch reviews with filters
  const fetchFilteredReviews = async () => {
    try {
      const { client, rating, dateRange, status } = filters;
      const params = {
        client,
        rating,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        status,
        page: currentPage,
        limit: reviewsPerPage,
      };
      const response = await axios.get('http://localhost:5520/api/admin/reviews', {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviews(response.data || []);      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Refetch reviews whenever filters, pagination, or sorting change
  useEffect(() => {
    fetchFilteredReviews();
  }, [filters, currentPage, reviewsPerPage, searchTerm]);

  // Handle sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sortedReviews = [...reviews].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setReviews(sortedReviews);
  };

  // Paginate and filter reviews
  const filteredReviews = reviews.filter((review) =>
    review.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
    <div className="bg-gray-100">
      <h1 className="text-2xl bg-white font-bold mt-8 mb-8 border-2 border-gray-200 p-4">Review Management</h1>

      {/* Filters */}
      <div className="bg-cyan-800 p-6 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Client Filter */}
          <select
            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.businessName}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Date Range Filter */}
          <div className="flex space-x-2">
            <input
              type="date"
              className="w-1/2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
              onChange={(e) =>
                setFilters({ ...filters, dateRange: { ...filters.dateRange, startDate: e.target.value } })
              }
            />
            <input
              type="date"
              className="w-1/2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
              onChange={(e) =>
                setFilters({ ...filters, dateRange: { ...filters.dateRange, endDate: e.target.value } })
              }
            />
          </div>

          {/* Response Status Filter */}
          <select
            className="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Responded">Responded</option>
          </select>        
        </div>
        {/* Search Bar */}
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 px-4 py-2"
          placeholder="Search by Customer Name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>    

      <div className="flex justify-between items-center mb-4">
        <p className='font-semibold'>Total Customers: {filteredReviews.length}</p>
        <select
          className="p-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={reviewsPerPage}
          onChange={(e) => setReviewsPerPage(Number(e.target.value))}
        >
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
          <option value={75}>Show 75</option>
          <option value={100}>Show 100</option>
          <option value={125}>show 125</option>
          <option value={150}>Show 150</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto shadow-md">
        <table className="min-w-full bg-white border">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('customer.name')}>
                Customer {sortConfig.key === 'customer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left cursor-pointer">Review</th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('reviewRating')}>
                Rating {sortConfig.key === 'reviewRating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('reviewDate')}>
                Date {sortConfig.key === 'reviewDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left cursor-pointer">Client</th>
              <th className="p-4 text-left cursor-pointer">Status</th>
              <th className="p-4 text-left cursor-pointer">Response</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReviews.length > 0 ? (
              paginatedReviews
                .filter((review) => !filters.client || review.clientId === filters.client)
                .map((review, index) => (
                  <tr
                    key={review._id}
                    className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  >
                    <td className="py-2 px-4 border">{review.customer?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border">{review.reviewText || 'N/A'}</td>
                    <td className="py-2 px-4 border">{review.reviewRating} Stars</td>
                    <td className="py-2 px-4 border">{new Date(review.reviewDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border">{review.client?.businessName || 'N/A'}</td>
                    <td className="py-2 px-4 border">
                      <span className={`py-1 px-4 border text-center ${
                          review.response ? 'bg-green-200 text-green-800 rounded-3xl' : 'bg-yellow-200 text-yellow-800 rounded-3xl'
                        }`}
                      >
                        {review.response ? 'Responded' : 'Pending'}
                      </span>
                    </td>                  
                    <td className="py-2 px-4 border">{review.response || 'No response yet'}</td>
                  </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>        
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>        
        <button
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reviews;
