import React, { useState, useEffect, useMemo } from 'react';
import './AdminQuotes.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminQuotes: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => [
    'Study Guides',
    'Workbooks',
    'Course Bundles',
    'Career Guidance',
    'Tutoring',
    'Digital Content'
  ], []);

  useEffect(() => {
    // Sample products data
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'IGCSE Mathematics Study Guide',
        description: 'Comprehensive study guide covering all IGCSE Mathematics topics with practice questions and solutions.',
        price: 299.99,
        originalPrice: 399.99,
        image: '/images/products/math-guide.jpg',
        category: 'Study Guides',
        inStock: true,
        featured: true,
        tags: ['IGCSE', 'Mathematics', 'Study Guide'],
        createdAt: '2025-01-15',
        updatedAt: '2025-01-15'
      },
      {
        id: '2',
        name: 'AS Level Physics Workbook',
        description: 'Interactive workbook with practical exercises and detailed explanations for AS Level Physics.',
        price: 249.99,
        image: '/images/products/physics-workbook.jpg',
        category: 'Workbooks',
        inStock: true,
        featured: true,
        tags: ['AS Level', 'Physics', 'Workbook'],
        createdAt: '2025-01-10',
        updatedAt: '2025-01-12'
      }
    ];
    setProducts(sampleProducts);
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Study Guides',
    inStock: true,
    featured: false,
    tags: ''
  });

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || undefined,
      image: newProduct.image,
      category: newProduct.category,
      inStock: newProduct.inStock,
      featured: newProduct.featured,
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: 'Study Guides',
      inStock: true,
      featured: false,
      tags: ''
    });
    setShowAddForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured,
      tags: product.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || undefined,
      image: newProduct.image,
      category: newProduct.category,
      inStock: newProduct.inStock,
      featured: newProduct.featured,
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: 'Study Guides',
      inStock: true,
      featured: false,
      tags: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-shop">
      <div className="admin-header">
        <div className="container">
          <h1>Shop Administration</h1>
          <p>Manage your product catalog and inventory</p>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="container">
          <div className="admin-controls">
            <div className="search-control">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              className="add-product-btn"
              onClick={() => {
                setEditingProduct(null);
                setShowAddForm(true);
              }}
            >
              + Add New Product
            </button>
          </div>
          
          {showAddForm && (
            <div className="product-form">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Price (R) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Original Price (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                    />
                    In Stock
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    />
                    Featured Product
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  className="save-btn"
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  disabled={!newProduct.name || !newProduct.description || newProduct.price <= 0}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: 0,
                      originalPrice: 0,
                      image: '',
                      category: 'Study Guides',
                      inStock: true,
                      featured: false,
                      tags: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.description.substring(0, 100)}...</p>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <div className="price-info">
                        <span className="current-price">R {product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="original-price">R {product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <span className={`featured-status ${product.featured ? 'featured' : 'not-featured'}`}>
                        {product.featured ? '✓' : '✗'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your search or add a new product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuotes; 