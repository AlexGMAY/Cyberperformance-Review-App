import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx"; 
import Employees from "./Employees";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    phoneNumber: "",
    reviewLink: "",
    googleReviewLink: "",
  });
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchClients();    
  }, []);

  // Fetch Clients list
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5520/api/clients", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch Client Stats
  const fetchClientStats = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5520/api/admin/${clientId}/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedClient((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching client stats:', error);
    }
  };

  const handleClientSelect = (clientId) => {
    setSelectedClient(clientId);
    fetchClientStats(clientId);
  }; 
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }
  
      const payload = {
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        phoneNumber: formData.phoneNumber,
        reviewLink: formData.reviewLink,
      };
  
      if (editingClient) {
        console.log("Updating client with ID:", editingClient._id, payload);
  
        await axios.put(
          `http://localhost:5520/api/clients/${editingClient._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }          
        );
        toast.success("Client updated successfully!");
      } else {
        console.log("Creating new client:", payload);
  
        await axios.post(
          "http://localhost:5520/api/auth/registerClient",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Client registered successfully!");
      }
  
      setFormData({
        businessName: "",
        email: "",
        password: "",
        phoneNumber: "",
        reviewLink: "",
        googleReviewLink: "",
      });
      setEditingClient(null);
      setModalVisible(false);
      fetchClients();
    } catch (error) {
      if (error.response) {
        console.error("Error saving client (API Response):", error.response.data);
      } else if (error.request) {
        console.error("Error saving client (No Response):", error.request);
      } else {
        console.error("Error saving client (Unexpected):", error.message);
      }
    }
  };
  

  const handleEdit = (client) => {
    setFormData({
      businessName: client.businessName,
      email: client.email,
      password: "",
      phoneNumber: client.phoneNumber,
      reviewLink: client.reviewLink,
      googleReviewLink: client.googleReviewLink,
    });
    setEditingClient(client);
    setModalVisible(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`http://localhost:5520/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success("Client deleted successfully!");
      fetchClients(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting client:', error.response?.data || error.message);
    }
  };

  // Activate / Deactivate Client
  const toggleClientActivation = async (clientId, isActive) => {
    console.log('Client ID:', clientId);  // Ensure the clientId is being passed correctly
  
    if (!clientId) {
      console.error("Error: Client ID is undefined");
      return;
    }
  
    const action = isActive ? 'deactivate' : 'activate'; // Toggle between activate and deactivate
    try {
      const response = await axios.patch(
        `http://localhost:5520/api/admin/${clientId}/${action}`,
        {},  // Empty body as we're only updating the "active" field
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );      
      return response.data; // Handle the response data as needed
    } catch (error) {
      console.error("Error toggling client activation:", error);
      throw error;
    }
  };
  
  
  // Function to export data as Excel
  const exportToExcel = () => {
    // Create a worksheet from the clients data
    const worksheet = XLSX.utils.json_to_sheet(clients);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    // Export the workbook to a file
    XLSX.writeFile(workbook, "Clients.xlsx");
  };
  
  // View Client Details
  const handleViewDetails = (client) => { 
    handleClientSelect(client._id);   
    setSelectedClient(client);    
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedClient(null);
  };

  const toggleModal = () => {
    setFormData({
      businessName: "",
      email: "",
      password: "",
      phoneNumber: "",
      reviewLink: "",
      googleReviewLink: "",
    });
    setEditingClient(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedClients = [...clients].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setClients(sortedClients);
  };

  const filteredClients = clients.filter((client) =>
    client.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100">
      <h1 className="text-2xl bg-white font-bold mt-8 mb-8 border-2 border-gray-200 p-4">Clients Management</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-1/2"
        />
        <div className="flex gap-2">
          {/* <button
            onClick={handleImportClients} // Define this function to handle file selection or import logic
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Import from excel
          </button> */}
          <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-6"
        >
          Export to Excel
        </button>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Register a new client
          </button>          
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto mb-20">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className=" px-4 py-2 cursor-pointer" onClick={() => handleSort("businessName")}>
                Business Name
              </th>
              <th className=" px-4 py-2 cursor-pointer" onClick={() => handleSort("email")}>
                Email
              </th>
              <th className=" px-4 py-2 cursor-pointer" onClick={() => handleSort("phoneNumber")}>
                Phone
              </th>
              <th className=" px-4 py-2">Google Review Link</th>
              <th className=" px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => (
              <tr key={client._id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="border px-4 py-2 font-semibold">{client.businessName}</td>
                <td className="border px-4 py-2">{client.email}</td>
                <td className="border px-4 py-2">{client.phoneNumber}</td>
                <td className="border px-4 py-2">{client.googleReviewLink}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetails(client)}
                    className="p-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-green-500 hover:text-green-700 ml-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="p-2 text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 flex justify-between items-center">
          <p className="text-gray-700 font-semibold">Total Clients: {filteredClients.length}</p>
          <div>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                } rounded hover:bg-blue-400`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{editingClient ? "Edit Client" : "Add Client"}</h2>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4 w-full"
            />
            {!editingClient && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="p-2 border rounded mb-4 w-full"
              />
            )}
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4 w-full"
            />
            <input
              type="text"
              name="reviewLink"
              placeholder="Review Link"
              value={formData.reviewLink}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4 w-full"
            />
            <input
              type="text"
              name="googleReviewLink"
              placeholder="Google Review Link"
              value={formData.googleReviewLink}
              onChange={handleInputChange}
              className="p-2 border rounded mb-4 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCreateOrUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {detailModalVisible && selectedClient && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-3/4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-3xl font-bold text-gray-700">{selectedClient.businessName}</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-1" style={{ maxHeight: "calc(90vh - 120px)" }}>
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={selectedClient.profilePicture || "/default-profile.png"}
                    alt={`${selectedClient.businessName} Profile`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-500">Email :</p>
                  <p className="text-sm text-gray-500">{selectedClient.email}</p>
                  <p className="text-sm font-bold text-gray-500">Status :</p>
                  <p
                    className={`text-sm mt-1 ${
                      selectedClient.active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {selectedClient.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Client Details</h3>
                  <p><strong>Phone:</strong> {selectedClient.phoneNumber}</p>
                  <p>
                    <strong>Review Link:</strong>{" "}
                    <a href={selectedClient.reviewLink} className="text-blue-500 underline">
                      {selectedClient.reviewLink}
                    </a>
                  </p>
                  <p>
                    <strong>Google Review Link:</strong>{" "}
                    <a href={selectedClient.googleReviewLink} className="text-blue-500 underline">
                      {selectedClient.googleReviewLink}
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Client Stats</h3>
                  <p><strong>Total Reviews:</strong> {selectedClient.totalReviews}</p>
                  <p><strong>Total Customers:</strong> {selectedClient.totalCustomers}</p>
                </div>
              </div>              
            </div>

            {/* Action Buttons (Fixed Footer) */}
            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={closeDetailModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  const updatedStatus = !selectedClient.active;
                  try {
                    // Toggle client status
                    await toggleClientActivation(selectedClient._id, updatedStatus);

                    // Update the selectedClient state to reflect the change in status
                    setSelectedClient((prevClient) => ({
                      ...prevClient,
                      active: updatedStatus,
                    }));

                    toast.success(`Client ${updatedStatus ? "activated" : "deactivated"} successfully!`);
                  } catch (error) {
                    toast.error("An error occurred. Please try again.");
                  }
                }}
                className={`px-4 py-2 rounded ${
                  selectedClient.active
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {selectedClient.active ? "Deactivate Client" : "Activate Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYEES TABLE */}
      <Employees />

      {/* Toast Container for popups */}
      <ToastContainer /> 
    </div>
  );
};

export default Clients;
