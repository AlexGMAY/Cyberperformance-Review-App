import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailSmsSettings = () => {
  const [settings, setSettings] = useState([]);
  const [newSettings, setNewSettings] = useState({ serviceName: '', apiKey: '' });

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5520/api/config/settings',{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to fetch settings', error);
    }
  };

  const handleUpdateSetting = async () => {
    try {
      await axios.post('http://localhost:5520/api/config/settings', newSettings,{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}` },
      } );
      toast.success("API Key updated successfully!");
      fetchSettings();
    } catch (error) {
      console.error('Failed to update setting', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      <p className='mb-8 font-sm text-gray-600'>
      This feature allows the admin to configure API keys for Twilio, Postmark, and other third-party services directly from the interface.
      </p>
      <div className="mb-6">
        <select
        className="border rounded p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={newSettings.serviceName}
        onChange={(e) => setNewSettings({ ...newSettings, serviceName: e.target.value })}
        >
            <option value="" disabled>Select Service</option>
            <option value="Twilio">Twilio</option>
            <option value="Postmark">Postmark</option>
            <option value="Google API">Google API</option>
        </select>

        {newSettings.serviceName === 'Google API' ? (
        <div className="flex flex-col space-y-2 mt-2">
            <input
            type="text"
            placeholder="Enter Google Client ID"
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={newSettings.clientId || ''}
            onChange={(e) =>
                setNewSettings({ ...newSettings, clientId: e.target.value })
            }
            />
            <input
            type="text"
            placeholder="Enter Google Client Secret"
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={newSettings.clientSecret || ''}
            onChange={(e) =>
                setNewSettings({ ...newSettings, clientSecret: e.target.value })
            }
            />
        </div>
        ) : (
        <input
            type="text"
            placeholder="Enter API Key"
            className="border rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={newSettings.apiKey}
            onChange={(e) =>
            setNewSettings({ ...newSettings, apiKey: e.target.value })
            }
        />
        )}
        <button
        className="ml-2 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
        onClick={handleUpdateSetting}
        >
        Save Settings
        </button>
      </div>

      <h3 className="text-md font-medium mb-2">Existing Settings</h3>
      <table className="table-auto w-full border-collapse border border-cyan-500">
        <thead>
        <tr className='bg-cyan-600 text-white uppercase text-sm'>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">API Key(s)</th>
            <th className="px-4 py-2">Last Updated</th>
        </tr>
        </thead>
        <tbody>
        {settings.map((setting) => (
            <tr key={setting.serviceName}>
            <td className="border border-cyan-300 px-4 py-2 font-semibold">{setting.serviceName}</td>
            <td className="border border-cyan-300 px-4 py-2">
                {setting.serviceName === 'Google API' ? (
                <div>
                    <p>
                    <strong>Client ID:</strong>{' '}
                    {setting.apiKey?.clientId || <span className="text-cyan-500 italic">Using .env default</span>}
                    </p>
                    <p>
                    <strong>Client Secret:</strong>{' '}
                    {setting.apiKey?.clientSecret || <span className="text-cyan-500 italic">Using .env default</span>}
                    </p>
                </div>
                ) : (
                setting.apiKey || <span className="text-cyan-500 italic">Using .env default</span>
                )}
            </td>
            <td className="border border-cyan-300 px-4 py-2">
                {setting.updatedAt
                ? new Date(setting.updatedAt).toLocaleString()
                : <span className="text-cyan-500 italic">Default</span>}
            </td>
            </tr>
        ))}
        </tbody>
      </table>
      {/* Toast Container for popups */}
      <ToastContainer /> 
    </div>   
  );
};

export default EmailSmsSettings;
