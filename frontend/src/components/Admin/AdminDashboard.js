import React from 'react'
import Dashboard from './Dashboard';
import Clients from './Clients';
import Customers from './Customers';
import Reviews from './Reviews';
import PlatformSettings from './PlatformSettings';
import ReviewRequests from './ReviewRequests';
import Templates from './Templates';

function AdminDashboard({ selectedMenuItem }) {
    const renderContent = () => {
        switch (selectedMenuItem) {
          case 'Dashboard':
            return <Dashboard />;
          case 'Clients':
            return <Clients />;
          case 'Customers':
            return <Customers />;
          case 'Reviews':
            return <Reviews />;
          case 'Review Requests':
            return <ReviewRequests />;
          case 'Templates':
            return <Templates />;
          case 'Platform Settings':
            return <PlatformSettings />;          
          default:
            return <Dashboard />;
        }
      };
  return (
    <div>
      {renderContent()}
    </div>
  )
}

export default AdminDashboard