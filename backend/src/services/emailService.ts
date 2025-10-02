import nodemailer from 'nodemailer';
import { Quote } from '@guerilla-teaching/shared-types';
import { logger } from '../utils/logger';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config?: EmailConfig) {
    // For development, use a simple transport that logs emails
    if (config) {
      // Production SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth
      });
    } else {
      // Development: create a test transport that logs emails
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  async sendQuoteNotification(quote: Quote): Promise<void> {
    try {
      const emailContent = this.generateQuoteEmailContent(quote);
      
      const mailOptions = {
        from: '"Guerilla Teaching" <noreply@guerillateaching.com>',
        to: 'jaco.lemmer@gmail.com',
        subject: `New Quote Request - ${quote.referenceNumber}`,
        html: emailContent.html,
        text: emailContent.text
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      if (result.messageId) {
        logger.info(`Quote notification email sent successfully: ${quote.referenceNumber}`);
      } else {
        logger.warn(`Email sent but no message ID returned for quote: ${quote.referenceNumber}`);
      }
      
    } catch (error) {
      logger.error('Failed to send quote notification email:', error as Error);
      // Don't throw error to prevent quote creation failure
    }
  }

  private generateQuoteEmailContent(quote: Quote): { html: string; text: string } {
    const itemsHtml = quote.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const itemsText = quote.items.map(item => 
      `${item.name} - Qty: ${item.quantity} - Price: R${item.price.toFixed(2)} - Total: R${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Quote Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
            New Quote Request
          </h1>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #7c3aed;">Quote Details</h2>
            <p><strong>Reference Number:</strong> ${quote.referenceNumber}</p>
            <p><strong>Date:</strong> ${new Date(quote.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${quote.status}</p>
          </div>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #7c3aed;">Customer Information</h2>
            <p><strong>Name:</strong> ${quote.customer.firstName} ${quote.customer.lastName}</p>
            <p><strong>Email:</strong> ${quote.customer.email}</p>
            <p><strong>Phone:</strong> ${quote.customer.phone}</p>
            ${quote.customer.company ? `<p><strong>Company:</strong> ${quote.customer.company}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #7c3aed;">Requested Services/Products</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background: #7c3aed; color: white;">
                  <th style="padding: 12px; text-align: left;">Item</th>
                  <th style="padding: 12px; text-align: center;">Quantity</th>
                  <th style="padding: 12px; text-align: right;">Unit Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2d5a2d;">Quote Summary</h3>
            <p style="font-size: 18px; font-weight: bold; margin: 0;">
              <strong>Total: R${quote.total.toFixed(2)}</strong>
            </p>
          </div>

          ${quote.comments ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">Customer Comments</h3>
              <p style="margin: 0;">${quote.comments}</p>
            </div>
          ` : ''}

          <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c5460;">Next Steps</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Review the quote details above</li>
              <li>Contact the customer at <strong>${quote.customer.phone}</strong> or <strong>${quote.customer.email}</strong></li>
              <li>Discuss requirements and finalize pricing</li>
              <li>Process payment over the phone</li>
              <li>Update quote status in the admin system</li>
            </ol>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            This is an automated notification from the Guerilla Teaching quote system.<br>
            Quote expires on: ${new Date(quote.expiresAt).toLocaleDateString()}
          </p>
        </div>
      </body>
      </html>
    `;

    const text = `
NEW QUOTE REQUEST

Quote Details:
Reference Number: ${quote.referenceNumber}
Date: ${new Date(quote.createdAt).toLocaleDateString()}
Status: ${quote.status}

Customer Information:
Name: ${quote.customer.firstName} ${quote.customer.lastName}
Email: ${quote.customer.email}
Phone: ${quote.customer.phone}
${quote.customer.company ? `Company: ${quote.customer.company}` : ''}

Requested Services/Products:
${itemsText}

Quote Summary:
Total: R${quote.total.toFixed(2)}

${quote.comments ? `Customer Comments:\n${quote.comments}\n` : ''}

Next Steps:
1. Review the quote details above
2. Contact the customer at ${quote.customer.phone} or ${quote.customer.email}
3. Discuss requirements and finalize pricing
4. Process payment over the phone
5. Update quote status in the admin system

Quote expires on: ${new Date(quote.expiresAt).toLocaleDateString()}
    `;

    return { html, text };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error('Email service connection test failed:', error as Error);
      return false;
    }
  }
}

// Create default email service instance
export const emailService = new EmailService();
