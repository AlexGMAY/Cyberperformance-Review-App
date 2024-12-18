import React, { useEffect, useState, useContext } from 'react';
import { FaChartLine, FaEnvelope, FaSms } from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../../context/authContext';


const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [clientMetrics, setClientMetrics] = useState({ responseRate: 0, emailsSent: 0, smsSent: 0 });
    const [customers, setCustomers] = useState([]);
    const [reviews, setReviews] = useState([]);  
  
    
  
    // Fetch the Client Metrics  
    useEffect(() => {
      const fetchMetrics = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        } 
        const clientId = user?.id || user?.clientId;     
    
        try {
          const response = await axios.get(`http://localhost:5520/api/clients/${clientId}/metrics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },        
          });
          console.log('Metrics Response:', response.data);
          setClientMetrics(response.data);
        } catch (error) {
          console.error('Error fetching client metrics:', error.response?.data || error.message);
        }
      };
    
      if (user) {
        fetchMetrics();
      }
    }, [user]); // Make sure clientId is set correctly 
  
    // Fetch Customers and Reviews
    useEffect(() => {
      const fetchCustomersAndReviews = async () => {
        const token = localStorage.getItem('token');
        const clientId = user?.id || user?.clientId;
  
        try {
          const customersResponse = await axios.get(`http://localhost:5520/api/clients/${clientId}/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Customers Response:', customersResponse.data);
          setCustomers(customersResponse.data);
  
          const reviewsResponse = await axios.get(`http://localhost:5520/api/clients/${clientId}/recent-reviews`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Reviews Response:', reviewsResponse.data);
          setReviews(reviewsResponse.data);
        } catch (error) {
          console.error('Error fetching customers or reviews:', error);
        }
      };
  
      fetchCustomersAndReviews();
    }, [user]);
  
    // Define the metrics to display
    const clientStats = [
      { title: 'Response Rate', value: `${clientMetrics.responseRate}%`, icon: FaChartLine },
      { title: 'Emails Sent', value: clientMetrics.emailsSent, icon: FaEnvelope },
      { title: 'SMS Sent', value: clientMetrics.smsSent, icon: FaSms },
    ];
  
    return (
      <>
        <div className="p-6 bg-gray-500 rounded shadow-md">
          <div className="grid grid-cols-3 gap-6">
            {clientStats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-md rounded-md flex items-center justify-between"
              >
                <div className="text-blue-500 text-3xl mr-4">
                  <stat.icon />
                </div>
                <div className="flex flex-col items-end">
                  <h2 className="text-lg font-semibold">{stat.title}</h2>
                  <p className="text-2xl">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-9">
        {/* Customers Table */}
        <h2 className="text-2xl font-semibold mb-4">Customers</h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-500 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-semibold">
              {customers.map((customer, index) => (
                <tr key={index} className={`border-b border-gray-200 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}>
                  <td className="py-3 px-6">{customer.name}</td>
                  <td className="py-3 px-6">{customer.email}</td>
                  <td className="py-3 px-6">{customer.phoneNumber}</td>
                  <td className="py-3 px-6">{customer.googleReviewStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Reviews Table */}
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-500 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Rating</th>
                <th className="py-3 px-6 text-left">Review</th>
                <th className="py-3 px-6 text-left">Date</th>              
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-semibold">
              {reviews.map((review, index) => (
                <tr key={index} className={`border-b border-gray-200 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}>
                  <td className="py-3 px-6">{review.customer?.name || 'Anonymous'}</td>
                  <td className="py-3 px-6">{review.reviewRating}</td>
                  <td className="py-3 px-6">{review.reviewText}</td>
                  <td className="py-3 px-6">{new Date(review.reviewDate).toLocaleDateString()}</td>                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>      
    </>
    );
  };
  
  export default Dashboard;
  