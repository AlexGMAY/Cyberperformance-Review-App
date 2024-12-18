import React, { useContext, useState } from 'react';
import AdminSidebar from '../components/Common/AdminSidebar';
import ClientSidebar from '../components/Common/ClientSidebar';
import AuthContext from '../context/authContext';
import ClientDashboard from '../components/Client/ClientDashboard';
import AdminDashboard from '../components/Admin/AdminDashboard';


const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');

  const handleMenuSelect = (menu) => setSelectedMenuItem(menu);  

  if (!user) return <div>Loading...</div>;  
 
  // Dynamically get the user's name
  const userName = user?.role === 'Super Admin' ? 'Admin' : user?.businessName || user?.username || 'Client';
  console.log(user.businessName);

  // Render either the admin or client sidebar and dashboard
  const Sidebar = user?.role === 'Super Admin' ? AdminSidebar : ClientSidebar;
  const DashboardContent = user?.role === 'Super Admin' ? AdminDashboard : ClientDashboard;  

  return (
    <div className="flex min-h-screen bg-gray-100">     

      <Sidebar onMenuSelect={handleMenuSelect} />

      {/* Main Content */}      
      <div className="flex-1 p-6">
        {/* Dynamic Greeting */}
        <div className='p-4 border-b border-gray-300 mb-8'>
           <h1 className="text-3xl font-bold mb-8">Welcome back, {userName}!</h1>
        </div>        
        
        {/* Render the main dashboard content */}
        <DashboardContent selectedMenuItem={selectedMenuItem} />
      </div>
    </div>
  );
};

export default DashboardPage;
