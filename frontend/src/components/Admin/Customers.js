import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [clients, setClients] = useState([]); // For fetching client options
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    clientId: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25); // Default items per page
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchClients();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5520/api/admin/customers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5520/api/admin/clients", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing");

      if (editingCustomer) {
        await axios.put(
          `http://localhost:5520/api/customers/${editingCustomer._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Customer updated successfully!");
      } else {
        await axios.post(
          `http://localhost:5520/api/clients/${formData.clientId}/customer`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Customer added successfully!");
      }

      setFormData({ name: "", email: "", phoneNumber: "", clientId: "" });
      setEditingCustomer(null);
      setModalVisible(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      clientId: customer.client?._id || "",
    });
    setEditingCustomer(customer);
    setModalVisible(true);
  };

  // Bulk Add Customers to a specific client
  const handleFileUpload = async (file, clientId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
  
    try {
      await axios.post('http://localhost:5520/api/admin/upload-customers', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}` // Include token here
        },
      });
      toast.success('Customers uploaded successfully!');      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload customers.');
    }
  };
  
  // Delete a Customer
  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5520/api/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setCustomers(sortedCustomers);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl bg-white font-bold mt-8 mb-8 border-2 rounded-md border-gray-200 p-4">Customers Management</h1>      
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-2/3"
        />
        <button
          onClick={() => setModalVisible(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <p>Total Customers: {filteredCustomers.length}</p>
        <select
          className="p-2 border rounded shadow-sm"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
          <option value={75}>Show 75</option>
          <option value={100}>Show 100</option>
        </select>
      </div>
      <table className="w-full table-auto bg-white shadow-md rounded overflow-hidden">
        <thead>
          <tr className="bg-cyan-600 text-white uppercase text-sm">
            <th className="p-4 text-left cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => handleSort("email")}>
              Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => handleSort("phoneNumber")}>
              Phone {sortConfig.key === "phoneNumber" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => handleSort("client.businessName")}>
              Client {sortConfig.key === "client.businessName" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((customer, index) => (
            <tr key={customer._id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-4">{customer.name}</td>
              <td className="p-4">{customer.email}</td>
              <td className="p-4">{customer.phoneNumber}</td>
              <td className="p-4">{customer.client?.businessName || "N/A"}</td>
              <td className="p-4 flex space-x-2">
                <button onClick={() => handleEdit(customer)} className="text-green-500"><FaEdit /></button>
                <button onClick={() => handleDelete(customer._id)} className="text-red-500"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-2 border rounded w-full"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="p-2 border rounded w-full"
              />
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.businessName}
                  </option>
                ))}
              </select>
            </form>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setModalVisible(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
              <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK UPLOAD CUSTOMERS TO A CLIENT WITH A CSV FILE */}
      <div className="mt-8">
        <h2 className="text-2xl bg-white font-bold mt-8 mb-8 border-2 rounded-md border-gray-200 p-4">
          Bulk Upload Customers
        </h2>      
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleFileUpload(file, selectedClientId);
          }}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Choose CSV File
            </label>
            <input 
              type="file" 
              id="file"
              onChange={(e) => setFile(e.target.files[0])} 
              required 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client">
              Select Client
            </label>
            <select 
              id="client"
              onChange={(e) => setSelectedClientId(e.target.value)} 
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled selected>
                Choose a client
              </option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.businessName}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Upload
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Customers;
