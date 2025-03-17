import React, { useState } from 'react';

const IdeaForm = ({ onAddIdea, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: 1, // Default to Uncategorized
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      alert('Please enter an idea title');
      return;
    }
    
    // Submit the new idea
    onAddIdea({
      title: formData.title,
      description: formData.description,
      categoryId: parseInt(formData.categoryId),
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      categoryId: 1,
    });
  };

  return (
    <div className="idea-form-container">
      <h3>Add New Idea</h3>
      <form onSubmit={handleSubmit} className="idea-form">
        <div className="form-group">
          <label htmlFor="title">Idea Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your idea"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your idea in more detail"
            className="form-control"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="form-control"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Idea
        </button>
      </form>
    </div>
  );
};

export default IdeaForm;