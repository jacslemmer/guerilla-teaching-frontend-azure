import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { CartItem, Quote, Customer, CreateQuoteRequest, QuoteItem } from '@guerilla-teaching/shared-types';

// Using shared types from @guerilla-teaching/shared-types for quote system

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '' // Optional company field
  });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);

  // Payment methods removed - this is now a quote request system

  useEffect(() => {
    const savedQuote = localStorage.getItem('quoteRequest');
    if (savedQuote) {
      setQuote(JSON.parse(savedQuote));
    } else {
      navigate('/shop');
    }
  }, [navigate]);

  const getSubtotal = () => {
    return quote.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    return requiredFields.every(field => customerInfo[field as keyof typeof customerInfo].trim() !== '');
  };

  const convertCartToQuoteItems = (cartItems: CartItem[]): QuoteItem[] => {
    return cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      description: 'description' in item.product ? item.product.description : '',
      price: item.product.price,
      quantity: item.quantity,
      category: 'category' in item.product ? item.product.category : undefined,
      type: 'product' as const
    }));
  };

  const submitQuote = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert quote items to quote items
      const quoteItems = convertCartToQuoteItems(quote);
      
      // Create customer object
      const customer: Customer = {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone
      };

      // Create quote request
      const quoteRequest: CreateQuoteRequest = {
        items: quoteItems,
        customer: customer,
        comments: comments.trim() || undefined
      };

      // Submit quote to backend API
      // Submitting quote request
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quote');
      }

      const result = await response.json();
      
      if (result.success && result.quote) {
        setQuoteReference(result.quote.referenceNumber);
        setQuoteSubmitted(true);
        
        // Clear quote request
        localStorage.removeItem('quoteRequest');
        setQuote([]);
        
        // Quote submitted successfully
      } else {
        throw new Error(result.message || 'Quote submission failed');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('Quote submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment handlers removed - replaced with quote submission

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setQuote(prevQuote => prevQuote.filter(item => item.product.id !== productId));
      localStorage.setItem('quoteRequest', JSON.stringify(quote.filter(item => item.product.id !== productId)));
    } else {
      setQuote(prevQuote => {
        const newQuote = prevQuote.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        localStorage.setItem('quoteRequest', JSON.stringify(newQuote));
        return newQuote;
      });
    }
  };

  const clearQuote = () => {
    setQuote([]);
    localStorage.removeItem('quoteRequest');
  };

  if (quote.length === 0 && !quoteSubmitted) {
    return (
      <div className="checkout-empty">
        <h2>Your quote request is empty</h2>
        <p>Please add some items to your quote request before requesting a quote.</p>
        <button onClick={() => navigate('/shop')}>Explore More Shop</button>
      </div>
    );
  }

  // Show quote success page if quote was submitted
  if (quoteSubmitted && quoteReference) {
    return (
      <div className="quote-success">
        <div className="container">
          <div className="success-content">
            <h1>🎉 Quote Request Submitted!</h1>
            <p>Thank you for your quote request. We've received your inquiry and will get back to you soon.</p>
            <div className="quote-details">
              <h3>Quote Reference Number</h3>
              <div className="reference-number">{quoteReference}</div>
              <p>Please save this reference number for your records.</p>
            </div>
            <div className="next-steps">
              <h3>What happens next?</h3>
              <ul>
                <li>Our team will review your quote request</li>
                <li>We'll contact you within 1-2 business days</li>
                <li>We'll discuss pricing, delivery, and any customizations</li>
                <li>Once agreed, we'll send you a service agreement via email</li>
              </ul>
            </div>
            <div className="action-buttons">
              <button onClick={() => navigate('/shop')} className="btn-primary">
                Explore More Services
              </button>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-header">
        <div className="container">
          <h1>Request a Quote</h1>
          <p>Submit your quote request and we'll get back to you with a personalized offer within 1-2 business days.</p>
        </div>
      </div>
      
      <div className="checkout-content">
        <div className="container">
          <div className="checkout-grid">
            <div className="checkout-form">
              <div className="form-section">
                <h2>Customer Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="company">Company (Optional)</label>
                    <input
                      type="text"
                      id="company"
                      value={customerInfo.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Additional Comments</h2>
                <div className="form-group">
                  <label htmlFor="comments">Special Requirements or Questions (Optional)</label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Please let us know about any special requirements, customizations, or questions you have about your quote request..."
                    rows={4}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="quote-summary">
              <h2>Quote Summary</h2>
              
              <div className="quote-items">
                {quote.map(item => (
                  <div key={item.product.id} className="quote-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Quantity: 
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                          style={{ width: '60px', marginLeft: '0.5rem' }}
                        />
                        <button onClick={() => updateQuantity(item.product.id, 0)} style={{ marginLeft: '0.5rem', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                      </p>
                    </div>
                    <div className="item-price">
                      R {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="quote-totals">
                <div className="total-row">
                  <span>Estimated Total:</span>
                  <span>R {getTotal().toFixed(2)}</span>
                </div>
                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
                  * Final pricing may vary based on customizations and requirements
                </p>
              </div>
              <button 
                className="place-quote-btn" 
                onClick={submitQuote} 
                disabled={isSubmitting || !validateForm()}
                style={{ background: '#2ecc71', borderColor: '#2ecc71' }}
              >
                {isSubmitting ? 'Submitting Quote...' : 'Submit Quote Request'}
              </button>
              <button className="clear-quote-btn" onClick={clearQuote} style={{ marginTop: '1rem', background: '#e74c3c', color: 'white' }}>
                Clear Quote Request
              </button>
              <div className="security-notice">
                <p>🔒 Your information is secure and confidential</p>
                <p>We'll contact you within 1-2 business days with a personalized quote.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 