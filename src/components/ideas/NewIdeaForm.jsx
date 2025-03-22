// src/components/ideas/NewIdeaForm.jsx
import React, { useState } from 'react';

const NewIdeaForm = ({ categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || 1,
    isAnonymous: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter an idea title');
      return;
    }
    
    onSubmit({
      ...formData,
      categoryId: parseInt(formData.categoryId)
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="new-idea-form">
      <div className="form-group">
        <label htmlFor="ideaTitle">Title <span className="required">*</span></label>
        <input
          type="text"
          id="ideaTitle"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter your idea"
          className="form-control"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="ideaDescription">Description</label>
        <textarea
          id="ideaDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide more details about your idea..."
          className="form-control"
          rows="5"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="ideaCategory">Category</label>
        <select
          id="ideaCategory"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="form-control"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-check">
        <input
          type="checkbox"
          id="ideaAnonymous"
          name="isAnonymous"
          checked={formData.isAnonymous}
          onChange={handleChange}
          className="form-check-input"
        />
        <label htmlFor="ideaAnonymous" className="form-check-label">
          Post anonymously
        </label>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Submit Idea
        </button>
      </div>
    </form>
  );
};

export default NewIdeaForm;