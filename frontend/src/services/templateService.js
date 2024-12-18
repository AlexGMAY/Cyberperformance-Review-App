import axios from 'axios';

const API_URL = 'http://localhost:5520/api'; // Replace with your backend URL

// Helper function to get the token
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Global Template APIs
export const getGlobalTemplates = () => 
  axios.get(`${API_URL}/templates/global`, { headers: getAuthHeader() });

export const createGlobalTemplate = (data) => 
  axios.post(`${API_URL}/templates/global`, data, { headers: getAuthHeader() });

export const updateGlobalTemplate = (id, data) => 
  axios.put(`${API_URL}/templates/global/${id}`, data, { headers: getAuthHeader() });

export const deleteGlobalTemplate = (id) => 
  axios.delete(`${API_URL}/templates/global/${id}`, { headers: getAuthHeader() });

// Client Template APIs
export const getClientTemplates = (clientId) => 
  axios.get(`${API_URL}/templates/client/${clientId}`, { headers: getAuthHeader() });

export const createOrUpdateClientTemplate = (data) => 
  axios.post(`${API_URL}/templates/client`, data, { headers: getAuthHeader() });

export const deleteClientTemplate = (id) => 
  axios.delete(`${API_URL}/templates/client/${id}`, { headers: getAuthHeader() });
