/**
 * CloudFlare Email Workers Implementation
 * Replaces Nodemailer with native CloudFlare email functionality
 */

// Email templates
const EMAIL_TEMPLATES = {
  quoteNotification: (quote) => ({
    subject: `New Quote Request - ${quote.referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Quote Request</h2>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Quote Details</h3>
          <p><strong>Reference Number:</strong> ${quote.referenceNumber}</p>
          <p><strong>Total Amount:</strong> ZAR ${quote.totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> ${quote.status}</p>
          <p><strong>Created:</strong> ${new Date(quote.createdAt).toLocaleString()}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${quote.customer.firstName} ${quote.customer.lastName}</p>
          <p><strong>Email:</strong> ${quote.customer.email}</p>
          <p><strong>Phone:</strong> ${quote.customer.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${quote.customer.company || 'Not provided'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Requested Items</h3>
          ${quote.items.map(item => `
            <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: ZAR ${item.price} each</p>
              <p>Subtotal: ZAR ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          `).join('')}
        </div>

        ${quote.comments ? `
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Comments</h3>
            <p>${quote.comments}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated notification from the Guerilla Teaching website.
            Please log into your admin panel to manage this quote.
          </p>
        </div>
      </div>
    `,
    text: `
New Quote Request - ${quote.referenceNumber}

Quote Details:
- Reference: ${quote.referenceNumber}
- Total: ZAR ${quote.totalAmount.toFixed(2)}
- Status: ${quote.status}
- Created: ${new Date(quote.createdAt).toLocaleString()}

Customer Information:
- Name: ${quote.customer.firstName} ${quote.customer.lastName}
- Email: ${quote.customer.email}
- Phone: ${quote.customer.phone || 'Not provided'}
- Company: ${quote.customer.company || 'Not provided'}

Requested Items:
${quote.items.map(item => `- ${item.name} (Qty: ${item.quantity}, Price: ZAR ${item.price} each)`).join('\\n')}

Total Amount: ZAR ${quote.totalAmount.toFixed(2)}

${quote.comments ? `Comments: ${quote.comments}` : ''}

This is an automated notification from the Guerilla Teaching website.
    `
  })
};

/**
 * Send email using CloudFlare Email Workers
 * Note: This is a placeholder implementation as CF Email Workers
 * is still in limited beta. In production, you would:
 * 1. Set up Email Workers in your CF dashboard
 * 2. Configure DKIM/SPF records
 * 3. Use the actual email sending API
 */
export async function sendQuoteNotification(quote, env) {
  try {
    const template = EMAIL_TEMPLATES.quoteNotification(quote);

    // TODO: Replace with actual CloudFlare Email Workers API call
    // For now, we'll log the email that would be sent
    console.log('📧 Email would be sent:', {
      to: 'admin@guerillateaching.com', // Replace with actual admin email
      from: 'noreply@guerillateaching.com',
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    // Simulate successful email sending
    return {
      success: true,
      messageId: `email-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    /*
    // Actual CloudFlare Email Workers implementation would look like:
    const emailResponse = await env.EMAIL.send({
      to: 'admin@guerillateaching.com',
      from: 'noreply@guerillateaching.com',
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    return {
      success: true,
      messageId: emailResponse.id,
      timestamp: new Date().toISOString()
    };
    */

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send customer confirmation email
 */
export async function sendCustomerConfirmation(quote, env) {
  try {
    const template = {
      subject: `Quote Confirmation - ${quote.referenceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Quote Confirmation</h2>

          <p>Dear ${quote.customer.firstName},</p>

          <p>Thank you for your quote request. We have received your request and will review it shortly.</p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Quote Details</h3>
            <p><strong>Reference Number:</strong> ${quote.referenceNumber}</p>
            <p><strong>Total Amount:</strong> ZAR ${quote.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> Pending Review</p>
          </div>

          <p>We will contact you within 1-2 business days with a response to your quote request.</p>

          <p>If you have any questions, please don't hesitate to contact us.</p>

          <p>Best regards,<br>The Guerilla Teaching Team</p>
        </div>
      `,
      text: `
Dear ${quote.customer.firstName},

Thank you for your quote request. We have received your request and will review it shortly.

Your Quote Details:
- Reference Number: ${quote.referenceNumber}
- Total Amount: ZAR ${quote.totalAmount.toFixed(2)}
- Status: Pending Review

We will contact you within 1-2 business days with a response to your quote request.

If you have any questions, please don't hesitate to contact us.

Best regards,
The Guerilla Teaching Team
      `
    };

    // TODO: Implement actual email sending
    console.log('📧 Customer confirmation email would be sent:', {
      to: quote.customer.email,
      from: 'noreply@guerillateaching.com',
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    return {
      success: true,
      messageId: `customer-email-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Customer email sending failed:', error);
    throw new Error(`Failed to send customer email: ${error.message}`);
  }
}