import React, { useState } from 'react';
import ResponsesTemplate from './ResponsesTemplate';
import GlobalTemplateList from './GlobalTemplateList';

const Templates = () => {
  const [activeTab, setActiveTab] = useState('responses');

  const tabs = [
    { id: 'responses', label: 'Global Pre-written Responses' },
    { id: 'templates', label: 'Email/SMS Templates' },    
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl bg-white font-bold mt-8 mb-4 border-2 border-gray-200 p-4 rounded-md">Manage Global Templates</h2>
      <p className='mb-8 font-sm text-gray-600'>Admin oversees and edits templates for all clients.</p>
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-1/2 py-3 text-center font-medium ${
                activeTab === tab.id ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'responses' && <ResponsesTemplate />}
          {activeTab === 'templates' && <GlobalTemplateList />}          
        </div>
      </div>
    </div>
  );
};

export default Templates;
