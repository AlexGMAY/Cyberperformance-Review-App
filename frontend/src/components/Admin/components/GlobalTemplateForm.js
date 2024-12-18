import React, { useState, useEffect } from 'react';

const GlobalTemplateForm = ({ selectedTemplate, onSubmit, onCancel }) => {
  const [templateData, setTemplateData] = useState({
    type: 'sms', // Default to 'sms'
    name: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    if (selectedTemplate) {
      setTemplateData({
        type: selectedTemplate.type,
        name: selectedTemplate.name,
        subject: selectedTemplate.subject || '',
        content: selectedTemplate.content,
      });
    }
  }, [selectedTemplate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(templateData);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {selectedTemplate ? 'Edit Template' : 'Create New Template'}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        {/* Template Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-gray-700 font-medium mb-2"
          >
            Template Type
          </label>
          <select
            id="type"
            name="type"
            value={templateData.type}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Template Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Template Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={templateData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Subject (Email Only) */}
        {templateData.type === 'email' && (
          <div>
            <label
              htmlFor="subject"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={templateData.subject}
              onChange={handleChange}
              required={templateData.type === 'email'}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )}

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            {templateData.type === 'email' ? 'Email Content' : 'SMS Content'}
          </label>
          <textarea
            id="content"
            name="content"
            value={templateData.content}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows="5"
            maxLength={templateData.type === 'sms' ? 250 : undefined} // SMS limit
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalTemplateForm;
