import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded user:", decoded); // Log the decoded user
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token'); // Clear token on error
      }
    }
    setLoading(false); // Set loading to false after attempting to decode
  }, []);

  // Login function (for both Admin and Client)
  const login = async (emailOrUsername, password) => {
    try {
      const isEmail = emailOrUsername.includes('@');

      // Determine the login URL based on the login type (Admin vs Client)
      const loginUrl = isEmail
        ? 'http://localhost:5520/api/auth/clientLogin' // Client login via email
        : 'http://localhost:5520/api/auth/login';      // Admin login via username

      // Prepare the login data depending on the login type
      const loginData = isEmail
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };

      const response = await axios.post(loginUrl, loginData);
      
      // Check the structure of the response
      console.log("Login response:", response.data);

      const token = response.data.token;

      // Check if token is present in the response
      if (!token) {
        throw new Error('Token not received from server');
      }

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Decode the token and set user data
      const decoded = jwtDecode(token);
      console.log("Decoded user:", decoded); // Ensure it contains the role
      console.log("User role:", decoded.role); // Log user role specifically
      setUser(decoded);

      return true;
    } catch (error) {
      // Enhance error handling for specific cases
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Login failed: Status Code:', error.response.status);
        console.error('Response Data:', error.response.data);
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Login failed: No response from server');
      } else {
        // Something happened in setting up the request
        console.error('Login error:', error.message);
      }
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

