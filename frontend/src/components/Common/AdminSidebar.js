import React, { useContext, useState } from 'react';
import AuthContext from '../../context/authContext';
import { FaUsers, FaClipboard, FaStar, FaChartBar, FaCog, FaEnvelope, FaSignOutAlt, FaUsersCog } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip'; // Assuming you're using a tooltip library
import logo from '../../assets/logo/Logo_white.png'

const AdminSidebar = ({onMenuSelect}) => {
  const { logout, user } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: FaChartBar, label: 'Dashboard' },
    { icon: FaUsers, label: 'Clients' },
    { icon: FaUsersCog, label: 'Customers' },
    { icon: FaStar, label: 'Reviews' },
    { icon: FaEnvelope, label: 'Review Requests' },
    { icon: FaClipboard, label: 'Templates' },
    { icon: FaCog, label: 'Platform Settings' },    
  ];

  return (
    <div
      className={`h-screen sticky top-0 bg-gray-800 text-white flex flex-col shadow-lg transition-width duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        {/* <h2 className={`font-bold text-2xl ${isCollapsed && 'hidden'}`}>Admin</h2> */}
        <img className={`w-40 ${isCollapsed && 'hidden'}`} src={logo} alt="Logo" />
        <button
          onClick={toggleSidebar}
          className="text-xl focus:outline-none"
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>
      <ul className="flex-1 space-y-4 p-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
            onClick={() => onMenuSelect(item.label)} 
            data-tooltip-id={`tooltip-${index}`} // Tooltip identifier
          >
            <item.icon className="text-lg" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
              {item.label}
            </span>
            {isCollapsed && (
              <Tooltip id={`tooltip-${index}`} content={item.label} place="right" />
            )}
          </li>
        ))}
      </ul>
      {/* Logout button */}
      {user && (
        <button
          onClick={logout}
          className={`bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center mx-5 mb-5 ${isCollapsed ? 'mb-4 mx-auto' : 'm-5'}`}
          data-tooltip-id="tooltip"
          data-tooltip-content="Logout"
        >
          <FaSignOutAlt size={20} />
          {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
        </button>
      )}
    </div>
  );
};

export default AdminSidebar;
