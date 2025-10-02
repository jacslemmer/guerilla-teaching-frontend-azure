import React, { useState, useEffect, useCallback } from 'react';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
  orderData?: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  orderData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const initializePayment = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError('');

      // Initialize payment based on method
      const response = await fetch(`/api/payment/${paymentMethod}/${orderData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const paymentData = await response.json();
      setPaymentForm(paymentData);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, orderData, onPaymentError]);

  useEffect(() => {
    if (isOpen && paymentMethod) {
      initializePayment();
    }
  }, [isOpen, paymentMethod, initializePayment]);

  const handlePaymentSubmit = async (formData: any) => {
    try {
      setIsProcessing(true);
      setError('');

      // Process payment
      const response = await fetch(`/api/payment/${paymentMethod}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.id,
          paymentData: formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onPaymentSuccess(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'paygate':
        return <PayGateForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />;
      case 'payfast':
        return <PayFastForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />;
      case 'stripe':
        return <StripeForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />;
      case 'paypal':
        return <PayPalForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />;
      default:
        return <div>Unsupported payment method</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <div className="payment-modal-branding">
            <h2>Guerilla Teaching</h2>
            <p>Secure Payment</p>
          </div>
          <button className="payment-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="payment-modal-content">
          <div className="payment-security-badge">
            <span className="security-icon">🔒</span>
            <span>Secure Payment Powered by {getPaymentMethodName(paymentMethod)}</span>
          </div>

          <div className="order-summary-mini">
            <h3>Order Summary</h3>
            <div className="order-items-mini">
              {orderData.items?.map((item: any, index: number) => (
                <div key={index} className="order-item-mini">
                  <span>{item.product.name}</span>
                  <span>R {item.product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total-mini">
              <strong>Total: R {orderData.total.toFixed(2)}</strong>
            </div>
          </div>

          {error && (
            <div className="payment-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {isProcessing && !paymentForm ? (
            <div className="payment-loading">
              <div className="loading-spinner"></div>
              <p>Initializing payment...</p>
            </div>
          ) : (
            <div className="payment-form-container">
              {renderPaymentForm()}
            </div>
          )}
        </div>

        <div className="payment-modal-footer">
          <div className="payment-security-info">
            <p>🔒 Your payment information is encrypted and secure</p>
            <p>✅ Protected by SSL encryption</p>
            <p>🛡️ PCI DSS compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment method specific form components
const PayGateForm: React.FC<{ onSubmit: (data: any) => void; isProcessing: boolean }> = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Expiry Month</label>
          <select
            value={formData.expiryMonth}
            onChange={(e) => setFormData({...formData, expiryMonth: e.target.value})}
            required
          >
            <option value="">MM</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={String(i+1).padStart(2, '0')}>
                {String(i+1).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Expiry Year</label>
          <select
            value={formData.expiryYear}
            onChange={(e) => setFormData({...formData, expiryYear: e.target.value})}
            required
          >
            <option value="">YYYY</option>
            {Array.from({length: 10}, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => setFormData({...formData, cvv: e.target.value})}
            placeholder="123"
            maxLength={4}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
          placeholder="As it appears on card"
          required
        />
      </div>
      
      <button type="submit" className="payment-submit-btn" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Securely'}
      </button>
    </form>
  );
};

const PayFastForm: React.FC<{ onSubmit: (data: any) => void; isProcessing: boolean }> = ({ onSubmit, isProcessing }) => {
  return (
    <div className="payment-form">
      <div className="payfast-info">
        <h4>PayFast Payment</h4>
        <p>You will be redirected to PayFast to complete your payment securely.</p>
        <button 
          type="button" 
          className="payment-submit-btn"
          onClick={() => onSubmit({})}
          disabled={isProcessing}
        >
          {isProcessing ? 'Redirecting...' : 'Continue to PayFast'}
        </button>
      </div>
    </div>
  );
};

const StripeForm: React.FC<{ onSubmit: (data: any) => void; isProcessing: boolean }> = ({ onSubmit, isProcessing }) => {
  return (
    <div className="payment-form">
      <div className="stripe-info">
        <h4>Stripe Payment</h4>
        <p>Secure payment powered by Stripe</p>
        <button 
          type="button" 
          className="payment-submit-btn"
          onClick={() => onSubmit({})}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </div>
  );
};

const PayPalForm: React.FC<{ onSubmit: (data: any) => void; isProcessing: boolean }> = ({ onSubmit, isProcessing }) => {
  return (
    <div className="payment-form">
      <div className="paypal-info">
        <h4>PayPal Payment</h4>
        <p>Pay securely with your PayPal account</p>
        <button 
          type="button" 
          className="payment-submit-btn paypal-btn"
          onClick={() => onSubmit({})}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay with PayPal'}
        </button>
      </div>
    </div>
  );
};

const getPaymentMethodName = (method: string): string => {
  switch (method) {
    case 'paygate': return 'PayGate';
    case 'payfast': return 'PayFast';
    case 'stripe': return 'Stripe';
    case 'paypal': return 'PayPal';
    default: return 'Secure Gateway';
  }
};

export default PaymentModal; 