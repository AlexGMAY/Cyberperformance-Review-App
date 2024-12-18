import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/authContext';

const FollowUpSettings = () => {
  const { user } = useContext(AuthContext);  
  const [emailFollowUps, setEmailFollowUps] = useState(false);
  const [smsFollowUps, setSmsFollowUps] = useState(false);
  const [emailFrequency, setEmailFrequency] = useState(1);
  const [smsFrequency, setSmsFrequency] = useState(1);
  const [message, setMessage] = useState(null); // For success/error messages

  const token = localStorage.getItem('token');

  const handleSaveSettings = async () => {
    try {
      await axios.post('http://localhost:5520/api/clients/follow-up-settings', {
        emailPreferences: {
          enabled: emailFollowUps,
          followUpCount: emailFrequency,
          frequency: emailFrequency,
        },
        smsPreferences: {
          enabled: smsFollowUps,
          followUpCount: smsFrequency,
          frequency: smsFrequency,
        },
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Follow-up settings saved!');
    } catch (error) {
      console.error('Error saving follow-up settings:', error);
      setMessage('Error saving settings.');
    }
  };

  const validateForm = () => {
    if ((emailFollowUps && emailFrequency < 1) || (smsFollowUps && smsFrequency < 1)) {
      alert('Frequency must be at least 1 if follow-ups are enabled.');
      return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Follow-Up Settings</h2>
      
      <div className="space-y-4">
        {/* Email Follow-Up Settings */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailFollowUps"
            checked={emailFollowUps}
            onChange={() => setEmailFollowUps(!emailFollowUps)}
            className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="emailFollowUps" className="text-gray-700 font-medium">
            Enable Email Follow-Ups
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <label htmlFor="emailFrequency" className="text-gray-700">Email Follow-Up Frequency (days):</label>
          <input
            type="number"
            id="emailFrequency"
            value={emailFrequency}
            onChange={(e) => setEmailFrequency(Number(e.target.value))}
            disabled={!emailFollowUps}
            min="1"
            className="border border-gray-300 rounded p-2 w-24 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* SMS Follow-Up Settings */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsFollowUps"
            checked={smsFollowUps}
            onChange={() => setSmsFollowUps(!smsFollowUps)}
            className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="smsFollowUps" className="text-gray-700 font-medium">
            Enable SMS Follow-Ups
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <label htmlFor="smsFrequency" className="text-gray-700">SMS Follow-Up Frequency (days):</label>
          <input
            type="number"
            id="smsFrequency"
            value={smsFrequency}
            onChange={(e) => setSmsFrequency(Number(e.target.value))}
            disabled={!smsFollowUps}
            min="1"
            className="border border-gray-300 rounded p-2 w-24 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Display message */}
      {message && <div className="mt-4 text-blue-700 font-semibold">{message}</div>}

      <button
        onClick={() => validateForm() && handleSaveSettings()}
        className="mt-6 w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
      >
        Save Settings
      </button>
    </div>
  );
};

export default FollowUpSettings;


// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import AuthContext from '../../context/authContext';

// const FollowUpSettings = () => {
//   const { user } = useContext(AuthContext);  
//   const [emailFollowUps, setEmailFollowUps] = useState(false);
//   const [smsFollowUps, setSmsFollowUps] = useState(false);
//   const [emailFrequency, setEmailFrequency] = useState(1);
//   const [smsFrequency, setSmsFrequency] = useState(1);
//   const [emailSchedule, setEmailSchedule] = useState(['']);
//   const [smsSchedule, setSmsSchedule] = useState(['']);
//   const [message, setMessage] = useState(null); // For success/error messages

//   const token = localStorage.getItem('token');

//   const handleSaveSettings = async () => {
//     try {
//       await axios.post('http://localhost:5520/api/clients/follow-up-settings', {
//         emailPreferences: {
//           enabled: emailFollowUps,
//           followUpCount: emailFrequency,          
//         },
//         smsPreferences: {
//           enabled: smsFollowUps,
//           followUpCount: smsFrequency,          
//         },
//         followUpSchedule: {
//           email: emailSchedule,
//           sms: smsSchedule,
//         },
//       }, { headers: { Authorization: Bearer ${token} } });
//       setMessage('Follow-up settings saved!');
//     } catch (error) {
//       console.error('Error saving follow-up settings:', error);
//       setMessage('Error saving settings.');
//     }
//   };

//   const handleAddEmailSchedule = () => {
//     setEmailSchedule([...emailSchedule, '']);
//   };

//   const handleAddSmsSchedule = () => {
//     setSmsSchedule([...smsSchedule, '']);
//   };

//   const validateForm = () => {
//     if ((emailFollowUps && emailFrequency < 1) || (smsFollowUps && smsFrequency < 1)) {
//       alert('Frequency must be at least 1 if follow-ups are enabled.');
//       return false;
//     }
//     return true;
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Follow-Up Settings</h2>
      
//       <div className="space-y-4">
//         {/* Email Follow-Up Settings */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="emailFollowUps"
//             checked={emailFollowUps}
//             onChange={() => setEmailFollowUps(!emailFollowUps)}
//             className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="emailFollowUps" className="text-gray-700 font-medium">
//             Enable Email Follow-Ups
//           </label>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <label htmlFor="emailFrequency" className="text-gray-700">Number of Email Follow-Ups:</label>
//           <input
//             type="number"
//             id="emailFrequency"
//             value={emailFrequency}
//             onChange={(e) => setEmailFrequency(Number(e.target.value))}
//             disabled={!emailFollowUps}
//             min="1"
//             className="border border-gray-300 rounded p-2 w-24 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {emailFollowUps && (
//           <>
//             <label className="text-gray-700">Email Follow-Up Schedule (Dates):</label>
//             {emailSchedule.map((schedule, index) => (
//               <input
//                 key={index}
//                 type="date"
//                 value={schedule}
//                 onChange={(e) => {
//                   const newSchedule = [...emailSchedule];
//                   newSchedule[index] = e.target.value;
//                   setEmailSchedule(newSchedule);
//                 }}
//                 className="border border-gray-300 rounded p-2 mb-2 w-full"
//               />
//             ))}
//             <button
//               onClick={handleAddEmailSchedule}
//               className="bg-gray-300 text-gray-700 px-3 py-1 rounded mb-4"
//             >
//               + Add Schedule
//             </button>
//           </>
//         )}

//         {/* SMS Follow-Up Settings */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="smsFollowUps"
//             checked={smsFollowUps}
//             onChange={() => setSmsFollowUps(!smsFollowUps)}
//             className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="smsFollowUps" className="text-gray-700 font-medium">
//             Enable SMS Follow-Ups
//           </label>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <label htmlFor="smsFrequency" className="text-gray-700">Number of SMS Follow-Ups:</label>
//           <input
//             type="number"
//             id="smsFrequency"
//             value={smsFrequency}
//             onChange={(e) => setSmsFrequency(Number(e.target.value))}
//             disabled={!smsFollowUps}
//             min="1"
//             className="border border-gray-300 rounded p-2 w-24 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {smsFollowUps && (
//           <>
//             <label className="text-gray-700">SMS Follow-Up Schedule (Dates):</label>
//             {smsSchedule.map((schedule, index) => (
//               <input
//                 key={index}
//                 type="date"
//                 value={schedule}
//                 onChange={(e) => {
//                   const newSchedule = [...smsSchedule];
//                   newSchedule[index] = e.target.value;
//                   setSmsSchedule(newSchedule);
//                 }}
//                 className="border border-gray-300 rounded p-2 mb-2 w-full"
//               />
//             ))}
//             <button
//               onClick={handleAddSmsSchedule}
//               className="bg-gray-300 text-gray-700 px-3 py-1 rounded mb-4"
//             >
//               + Add Schedule
//             </button>
//           </>
//         )}
//       </div>

//       {/* Display message */}
//       {message && <div className="mt-4 text-blue-700 font-semibold">{message}</div>}

//       <button
//         onClick={() => validateForm() && handleSaveSettings()}
//         className="mt-6 w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
//       >
//         Save Settings
//       </button>
//     </div>
//   );
// };

// export default FollowUpSettings;