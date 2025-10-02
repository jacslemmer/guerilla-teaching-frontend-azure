import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '@guerilla-teaching/shared-types';
import './QuoteCart.css';

const QuoteCart: React.FC = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedQuote = localStorage.getItem('quoteRequest');
    if (savedQuote) {
      setQuote(JSON.parse(savedQuote));
    }
  }, []);

  const updateQuote = (updatedQuote: CartItem[]) => {
    setQuote(updatedQuote);
    localStorage.setItem('quoteRequest', JSON.stringify(updatedQuote));
  };

  const removeFromQuote = (productId: string) => {
    const updatedQuote = quote.filter(item => item.product.id !== productId);
    updateQuote(updatedQuote);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId);
      return;
    }

    const updatedQuote = quote.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    updateQuote(updatedQuote);
  };

  const getSubtotal = () => {
    return quote.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return quote.reduce((total, item) => total + item.quantity, 0);
  };

  const clearQuote = () => {
    updateQuote([]);
  };

  if (quote.length === 0) {
    return (
      <div className="quote-cart">
        <div className="container">
          <div className="empty-quote">
            <div className="empty-quote-content">
              <h1>Your Quote Request is Empty</h1>
              <p>You haven't added any services to your quote request yet.</p>
              <div className="empty-quote-actions">
                <Link to="/shop" className="btn btn-primary">
                  Browse Shop
                </Link>
                <Link to="/" className="btn btn-secondary">
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-cart">
      <div className="container">
        <div className="quote-header">
          <h1>Your Quote Request</h1>
          <p>Review your selected services before requesting a quote</p>
        </div>

        <div className="quote-content">
          <div className="quote-items">
            <div className="items-header">
              <h2>Selected Services ({getTotalItems()} items)</h2>
              <button onClick={clearQuote} className="clear-quote-btn">
                Clear All
              </button>
            </div>

            <div className="quote-items-list">
              {quote.map((item) => (
                <div key={item.product.id} className="quote-item">
                  <div className="item-image">
                    <img src={item.product.image} alt={item.product.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-description">
                      {item.product.description}
                    </p>
                    <div className="item-meta">
                      <span className="item-category">{item.product.category}</span>
                      {item.product.tags && (
                        <div className="item-tags">
                          {item.product.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-pricing">
                    <div className="unit-price">R{item.product.price.toFixed(2)} each</div>
                    <div className="total-price">R{(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>

                  <div className="item-actions">
                    <button 
                      onClick={() => removeFromQuote(item.product.id)}
                      className="remove-btn"
                      title="Remove from quote"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quote-summary">
            <div className="summary-card">
              <h3>Quote Summary</h3>
              
              <div className="summary-line">
                <span>Items ({getTotalItems()})</span>
                <span>R{getSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span>R{getSubtotal().toFixed(2)}</span>
              </div>

              <div className="summary-note">
                <p>This is an estimated quote. Final pricing will be confirmed during our phone consultation.</p>
              </div>

              <div className="summary-actions">
                <button 
                  onClick={() => navigate('/request-quote')}
                  className="btn btn-primary btn-large"
                >
                  Request Quote
                </button>
                
                <Link to="/shop" className="btn btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="quote-info">
              <h4>What happens next?</h4>
              <ol>
                <li>Submit your quote request with contact details</li>
                <li>Our team will review your requirements</li>
                <li>We'll contact you within 24 hours to discuss</li>
                <li>Finalize pricing and process payment over the phone</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="quote-actions">
          <Link to="/shop" className="continue-shopping">
            ← Continue Browsing Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuoteCart;


