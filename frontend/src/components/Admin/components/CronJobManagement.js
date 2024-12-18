import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CronJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/cron-jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching cron jobs:', error);
    }
    setLoading(false);
  };

  const handleStart = async (name) => {
    try {
      await axios.post(`/api/cron-jobs/start/${name}`);
      fetchJobs();
    } catch (error) {
      console.error(`Error starting job '${name}':`, error);
    }
  };

  const handleStop = async (name) => {
    try {
      await axios.post(`/api/cron-jobs/stop/${name}`);
      fetchJobs();
    } catch (error) {
      console.error(`Error stopping job '${name}':`, error);
    }
  };

  return (
    <div>      
      <p className='mb-8 font-sm text-gray-600'>
        The Cron Job Management feature will allow admins to monitor scheduled tasks, 
        such as review requests and error-fetching jobs. Admins should be able to view active 
        cron jobs and manually start, stop, or restart them.
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No cron jobs found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Job Name</th>
              <th className="border border-gray-300 px-4 py-2">Running</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.name}>
                <td className="border border-gray-300 px-4 py-2">{job.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {job.running ? 'Yes' : 'No'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => handleStart(job.name)}
                  >
                    Start
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleStop(job.name)}
                  >
                    Stop
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CronJobManagement;
