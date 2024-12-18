import React, { useState } from 'react';
import AdminManagement from './components/AdminManagement';
import EmailSmsSettings from './components/EmailSmsSettings';
import ErrorLogs from './components/ErrorLogs';
// import CronJobManagement from './components/CronJobManagement';


function PlatformSettings() {
  const [activeTab, setActiveTab] = useState('admins');

  const tabs = [
    { id: 'admins', label: 'Manage Admin Accounts' },
    { id: 'email_sms', label: 'Email/SMS/Google Settings' },
    // { id: 'cron_jobs', label: 'Cron Job Management' },
    { id: 'error_logs', label: 'Error Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl bg-white font-bold mt-8 mb-4 border-2 border-gray-200 p-4 rounded-md">System Configurations</h2>
      <p className='mb-8 font-sm text-gray-600'>Manage app-wide settings and configurations.</p>
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-1/3 py-3 text-center font-medium ${activeTab === tab.id ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'admins' && <AdminManagement />}
          {activeTab === 'email_sms' && <EmailSmsSettings />}
          {/* {activeTab === 'cron_jobs' && <CronJobManagement />} */}
          {activeTab === 'error_logs' && <ErrorLogs />}          
        </div>
      </div>
    </div>
  );
}

export default PlatformSettings;
