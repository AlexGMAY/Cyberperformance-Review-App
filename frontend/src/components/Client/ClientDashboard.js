import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Reviews from './Reviews';
import ReviewRequests from './ReviewRequests';
import FollowUpSettings from './FollowUpSettings';
import AccountSettings from './AccountSettings';

const ClientDashboard = ({ selectedMenuItem }) => {

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Customers':
        return <Customers />;
      case 'Reviews':
        return <Reviews />;
      case 'Review Requests':
        return <ReviewRequests />;
      case 'Follow-Ups Settings':
        return <FollowUpSettings />;
      case 'Account Settings':
        return <AccountSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default ClientDashboard;
