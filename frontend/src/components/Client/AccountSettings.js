import React, { useState } from 'react';
import BusinessInfoForm from './cards/BusinessInfoForm';
import PasswordForm from './cards/PasswordForm';
import NotificationForm from './cards/NotificationForm';
import GeneralSettingsForm from './cards/GeneralSettingsForm';
import PreWrittenResponsesForm from './cards/PreWrittenResponsesForm';
import ReviewLinksForm from './cards/ReviewLinksForm';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('businessInfo');

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Account Settings</h1>
      <nav className="flex space-x-4 border-b pb-2 mb-6">        
        <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'businessInfo' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('businessInfo')}
        >
          Business Info
        </button>
        <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'password' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>        
        <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'reviewLinks' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('reviewLinks')}
        >
          Review Links
        </button>
        <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'responses' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('responses')}
        >
          Pre-Written Responses
        </button>        
        {/* <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button> */}
        <button
          className={`px-4 py-2 text-md font-semibold text-gray-800 border-b-2 ${
            activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent'
          }`}
          onClick={() => setActiveTab('general')}
        >
          General Settings
        </button>
      </nav>

      <div className="p-4 bg-gray-50 rounded-lg">
        {activeTab === 'businessInfo' && <BusinessInfoForm />}
        {activeTab === 'password' && <PasswordForm />}
        {activeTab === 'reviewLinks' && <ReviewLinksForm />}        
        {activeTab === 'responses' && <PreWrittenResponsesForm />}       
        {/* {activeTab === 'notifications' && <NotificationForm />} */}
        {activeTab === 'general' && <GeneralSettingsForm />}
      </div>
    </div>
  );
};

export default AccountSettings;
