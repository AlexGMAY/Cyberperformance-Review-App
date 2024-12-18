import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const api = axios.create({
    baseURL: "http://localhost:5520/api/clients",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);  // Number of employees per page

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5520/api/admin/employees");
      setFilteredEmployees(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees");
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (employee) => {
    const toastId = toast.loading("Saving employee...");
    try {
      if (employee._id) {
        await api.put(`/${employee.clientId}/employees/${employee._id}`, employee);
        toast.update(toastId, { render: "Employee updated successfully!", type: "success", isLoading: false });
      } else {
        await axios.post("http://localhost:5520/api/auth/registerEmployee", employee);
        toast.update(toastId, { render: "Employee registered successfully!", type: "success", isLoading: false });
      }
      fetchEmployees();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.update(toastId, { render: "Failed to save employee", type: "error", isLoading: false });
    }
  };  
  
  const handleDelete = async (employee, clientId) => {
    if (!employee || !clientId) {
      console.error("Employee or clientId is undefined.");
      toast.error("Unable to delete: Missing data.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/${clientId}/employees/${employee._id}`);
        toast.success("Employee deleted successfully!");
        fetchEmployees(); // Ensure fetchEmployees is properly defined and working
      } catch (err) {
        console.error("Error deleting employee:", err);
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = employees.filter(({ employees: employee, client }) => {
      const searchTarget = `${employee.name} ${employee.email} ${employee.phone} ${client?.businessName || ""}`;
      return searchTarget.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredEmployees(filtered);
  };  
  
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-8">
      <h2 className="text-2xl bg-white font-bold mt-8 mb-8 border-2 border-gray-200 p-4">Employees Management</h2>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-1/2"
        />
        <button
          onClick={() => {
            setCurrentEmployee(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Register Employee
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <strong>Total Employees: </strong>{filteredEmployees.length}
          </div>
          <table className="w-full mt-4 border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-500 text-white text-left">
              <tr>              
                <th className=" px-4 p-2">Name</th>
                <th className=" px-4 p-2">Email</th>
                <th className=" px-4 p-2">Phone</th>
                <th className=" px-4 p-2">Client</th>
                <th className=" px-4 p-2">Role</th>
                <th className=" px-4 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map(({ employees: employee, client }, index) => (
                <tr key={employee._id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border border-gray-300 px-4 p-2 font-semibold">{employee.name}</td>
                  <td className="border border-gray-300 px-4 p-2">{employee.email}</td>
                  <td className="border border-gray-300 px-4 p-2">{employee.phone}</td>
                  <td className="border border-gray-300 px-4 p-2">{client?.businessName || "N/A"}</td>
                  <td className="border border-gray-300 px-4 p-2">{employee.role || "N/A"}</td>
                  <td className="border border-gray-300 px-4 p-2">
                    <button
                      onClick={() => {
                        setCurrentEmployee(employee);
                        setShowModal(true);
                      }}
                      className="mr-2 text-green-500 hover:text-green-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(employee, client._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-between">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-pointer"
            >
              Prev
            </button>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-pointer"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <EmployeeModal
          employee={currentEmployee}
          onSave={handleAddEdit}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* <ToastContainer />  */}
    </div>
  );
};


const EmployeeModal = ({ employee, onSave, onClose }) => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState(
    employee || { name: "", email: "", password: "", phone: "", clientId: "" }
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get("/");
      setClients(data || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setClients([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Client</label>
            <select
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.businessName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Just to avoid toast errors till we figure that out */}
      <ToastContainer /> 
    </div>
  );
};

export default Employees;

