import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ReviewPage from './pages/ReviewPage';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// import Header from './components/Common/Header';


const App = () => {
  return (
    <div className='App'>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/review/:clientId/:customerId" element={<ReviewPage />} />
        {/* Protecting Routes */}
        
        <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />                  
            
        </Route>
      </Routes>
    </div>
    
  );
};

export default App;
