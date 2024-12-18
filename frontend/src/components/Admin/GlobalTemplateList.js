import React, { useEffect, useState } from 'react';
import { getGlobalTemplates,
    createGlobalTemplate,
    updateGlobalTemplate,
    deleteGlobalTemplate,
} from '../../services/templateService';
import GlobalTemplateForm from './components/GlobalTemplateForm';

const GlobalTemplateList = ({ onEdit }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // For editing
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await getGlobalTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching global templates:', error);
    }
  };

  // Handle adding a new template
  const handleCreate = async (templateData) => {
    try {
      await createGlobalTemplate(templateData);
      fetchTemplates();
      setShowForm(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // Handle updating an existing template
  const handleUpdate = async (templateData) => {
    try {
      await updateGlobalTemplate(templateData._id, templateData);
      fetchTemplates();
      setShowForm(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteGlobalTemplate(id);
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

   // Open the form to edit a template
   const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowForm(true);
   };

  // Open the form for creating a new template
  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen">     
      <div className="overflow-x-auto">
        {/* <GlobalTemplateForm /> */}
        {!showForm && (
            <>
              <div className="flex justify-end mb-4">
                <button
                onClick={handleNewTemplate}
                className="bg-cyan-500 text-white px-4 py-2 rounded shadow hover:bg-cyan-600"
                >
                Create New Template
                </button>
              </div>
              <table className="min-w-full bg-white border border-cyan-200 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-cyan-600 text-white uppercase text-sm">
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Content</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                        No templates available.
                        </td>
                    </tr>
                    ) : (
                    templates.map((template) => (
                        <tr key={template._id} className="border-t border-gray-200">
                        <td className="py-3 px-4">{template.type}</td>
                        <td className="py-3 px-4">{template.name}</td>
                        <td className="py-3 px-4">{template.subject || 'N/A'}</td>
                        <td className="py-3 px-4 truncate">{template.content}</td>
                        <td className="py-3 px-4 flex justify-center space-x-3">
                            <button
                            onClick={() => onEdit(handleEdit)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                            Edit
                            </button>
                            <button
                            onClick={() => handleDelete(template._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            >
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
              </table>
            </>
        )}

        {showForm && (
            <GlobalTemplateForm
            initialData={selectedTemplate}
            onSubmit={selectedTemplate ? handleUpdate : handleCreate}
            onCancel={() => setShowForm(false)}
            />
        )}
      </div>
    </div>
  );
};

export default GlobalTemplateList;
