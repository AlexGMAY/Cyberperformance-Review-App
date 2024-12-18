import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const metricsResponse = await axios.get('http://localhost:5520/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const activityResponse = await axios.get('http://localhost:5520/api/admin/activity-feed', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Combine and format recentCustomers and recentReviews for the activity feed
        const recentCustomers = activityResponse.data.recentCustomers.map((customer) =>
          formatCustomerActivity(customer)
        );
        const recentReviews = activityResponse.data.recentReviews.map((review) =>
          formatReviewActivity(review)
        );

        // Update the activity feed with both customer and review data
        setMetrics(metricsResponse.data);
        setActivityFeed([...recentCustomers, ...recentReviews]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="p-6 bg-cyan-800 rounded shadow-md">
        {/* Metrics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Clients" value={metrics.totalClients} icon={UserGroupIcon} />
          <MetricCard title="Active Clients" value={metrics.activeClients} icon={HandThumbUpIcon} />
          <MetricCard title="Inactive Clients" value={metrics.inactiveClients} icon={HandThumbDownIcon} />
          <MetricCard title="Total Customers" value={metrics.totalCustomers} icon={ClipboardDocumentCheckIcon} />
          <MetricCard title="Total Reviews" value={metrics.totalReviews} icon={StarIcon} />
          <MetricCard title="Positive Reviews" value={metrics.positiveReviews} icon={HandThumbUpIcon} />
          <MetricCard title="Negative Reviews" value={metrics.negativeReviews} icon={HandThumbDownIcon} />
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-8 border-b-2 border-gray-300 pb-2">Activity Feed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recent Customers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Recent Customers</h3>
            {activityFeed
              .filter((activity) => activity.type === 'customer')
              .slice(0, 10) // Display only 10 recent customers
              .map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
          </div>

          {/* Recent Reviews */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Recent Reviews</h3>
            {activityFeed
              .filter((activity) => activity.type === 'review')
              .slice(0, 10) // Display only 10 recent reviews
              .map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// MetricCard Component
const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between">
    <div className="text-cyan-600">
      <Icon className="w-10 h-10" />
    </div>
    <div className="text-right">
      <h3 className="text-cyan-600 font-medium">{title}</h3>
      <p className="text-2xl font-semibold text-indigo-600">{value}</p>
    </div>
  </div>
);

// ActivityItem Component
const ActivityItem = ({ activity }) => (
  <div className="p-4 bg-white shadow-md rounded-lg">
    <p className="text-gray-700">{activity.description}</p>
  </div>
);

// Helper Functions
const formatCustomerActivity = (customer) => {
  const { name, email, client, createdAt } = customer;
  const clientName = client?.businessName || 'Unknown Business';
  const createdDate = createdAt ? new Date(createdAt).toLocaleString() : 'Unknown Date';

  return {
    type: 'customer',
    description: `${name} - ${email} was added as a customer for ${clientName} on ${createdDate}.`,
  };
};

const formatReviewActivity = (review) => {
  const { customer, client, reviewText, reviewDate } = review;
  const customerName = customer?.name || 'Unknown Customer';
  const clientName = client?.businessName || 'Unknown Business';
  const createdDate = reviewDate ? new Date(reviewDate).toLocaleString() : 'Unknown Date';

  return {
    type: 'review',
    description: `${customerName} left a new review: "${reviewText}" for ${clientName} on ${createdDate}.`,
  };
};

export default Dashboard;

