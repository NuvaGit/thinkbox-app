import React, { useState } from 'react';

const CategoryList = ({ categories, onAddCategory }) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3498db', // Default color
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    onAddCategory(newCategory);
    
    // Reset form
    setNewCategory({
      name: '',
      color: '#3498db',
    });
    setIsAddingCategory(false);
  };

  return (
    <div className="category-list">
      <div className="category-header">
        <h3>Categories</h3>
        <button 
          className="btn-add-category"
          onClick={() => setIsAddingCategory(!isAddingCategory)}
        >
          {isAddingCategory ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {isAddingCategory && (
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              placeholder="Category name"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categoryColor">Color</label>
            <input
              type="color"
              id="categoryColor"
              name="color"
              value={newCategory.color}
              onChange={handleChange}
              className="form-control color-picker"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Create Category
          </button>
        </form>
      )}

      <ul className="categories">
        {categories.map((category) => (
          <li 
            key={category.id} 
            className="category-item"
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <span className="category-color" style={{ backgroundColor: category.color }}></span>
            <span className="category-name">{category.name}</span>
            <span className="category-count">0</span> {/* Will be implemented with actual counts later */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;