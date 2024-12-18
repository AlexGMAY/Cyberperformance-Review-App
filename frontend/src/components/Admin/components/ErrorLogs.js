import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5520/api/errorlogs/',{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLogs(data);      
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
    setLoading(false);
  };

  const clearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all error logs?')) {
      try {
        await axios.delete('http://localhost:5520/api/errorlogs/clear',{
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Error Logs deleted successfully!");
        fetchLogs();
      } catch (error) {
        console.error('Error clearing logs:', error);
      }
    }
  };

  return (
    <div>
      <p className='mb-8 font-sm text-gray-600'>
       The Error Logs feature will display logs of API call failures, system errors, or unhandled exceptions.
      </p>
      <button
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={clearLogs}
      >
        Clear All Logs
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No error logs found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-cyan-300">
          <thead>
            <tr className='bg-cyan-600 text-white uppercase text-sm'>
              <th className="px-4 py-2">Service Name</th>
              <th className="px-4 py-2">Error Message</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="border border-gray-300 px-4 py-2">{log.serviceName}</td>
                <td className="border border-gray-300 px-4 py-2">{log.errorMessage}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <details>
                    <summary>View Stack Trace</summary>
                    <pre className="bg-gray-100 p-2 rounded text-xs">{log.stackTrace}</pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Toast Container for popups */}
      <ToastContainer /> 
    </div>
  );
};

export default ErrorLogs;
