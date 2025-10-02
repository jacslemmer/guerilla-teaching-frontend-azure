/**
 * Azure Communication Services Email Service
 * Replaces Cloudflare Email Workers with Azure Communication Services
 */

import { EmailClient, EmailMessage } from '@azure/communication-email';

interface EmailServiceInterface {
  sendQuoteEmail: (to: string, subject: string, htmlBody: string, textBody?: string) => Promise<boolean>;
  sendNotificationEmail: (to: string, subject: string, htmlBody: string, textBody?: string) => Promise<boolean>;
  healthCheck: () => Promise<boolean>;
}

class AzureEmailService implements EmailServiceInterface {
  private emailClient: EmailClient;
  private senderAddress: string;

  constructor() {
    const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    this.senderAddress = process.env.AZURE_EMAIL_SENDER_ADDRESS || 'noreply@guerillateaching.com';

    if (!connectionString) {
      throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING environment variable is required');
    }

    this.emailClient = new EmailClient(connectionString);
  }

  async sendQuoteEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<boolean> {
    return this.sendEmail(to, subject, htmlBody, textBody);
  }

  async sendNotificationEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<boolean> {
    return this.sendEmail(to, subject, htmlBody, textBody);
  }

  private async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<boolean> {
    try {
      const emailMessage: EmailMessage = {
        senderAddress: this.senderAddress,
        content: {
          subject: subject,
          html: htmlBody,
          plainText: textBody || this.stripHtml(htmlBody),
        },
        recipients: {
          to: [{ address: to }],
        },
      };

      const poller = await this.emailClient.beginSend(emailMessage);
      const result = await poller.pollUntilDone();

      if (result.status === 'Succeeded') {
        console.log(`Email sent successfully to ${to}. Message ID: ${result.id}`);
        return true;
      } else {
        console.error(`Failed to send email to ${to}. Status: ${result.status}`);
        return false;
      }
    } catch (error) {
      console.error('Failed to send email via Azure Communication Services:', error);
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Send a test email to a non-existent domain to check if the service is available
      // This will fail at the email validation stage but confirm the service is reachable
      const testMessage: EmailMessage = {
        senderAddress: this.senderAddress,
        content: {
          subject: 'Health Check',
          plainText: 'This is a health check email',
        },
        recipients: {
          to: [{ address: 'healthcheck@example-non-existent-domain.com' }],
        },
      };

      try {
        await this.emailClient.beginSend(testMessage);
        return true;
      } catch (error: any) {
        // If it's a validation error, the service is working
        if (error.message && error.message.includes('invalid')) {
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Azure Communication Services health check failed:', error);
      return false;
    }
  }

  private stripHtml(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim();
  }
}

// Email template functions (migrated from Cloudflare Workers)
export const generateQuoteEmailHtml = (
  customerName: string,
  referenceNumber: string,
  items: any[],
  total: number,
  currency: string = 'USD'
): string => {
  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currency} ${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${currency} ${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Quote Request Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2c3e50; margin: 0;">Guerilla Teaching</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Quote Request Confirmation</p>
      </div>

      <p>Dear ${customerName},</p>

      <p>Thank you for your interest in our courses. We have received your quote request and will review it shortly.</p>

      <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Quote Details</h3>
        <p><strong>Reference Number:</strong> ${referenceNumber}</p>

        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px 8px; border-bottom: 2px solid #ddd; text-align: left;">Course</th>
              <th style="padding: 12px 8px; border-bottom: 2px solid #ddd; text-align: center;">Quantity</th>
              <th style="padding: 12px 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 12px 8px; border-bottom: 2px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 12px 8px; border-top: 2px solid #ddd; text-align: right;">Total:</td>
              <td style="padding: 12px 8px; border-top: 2px solid #ddd; text-align: right;">${currency} ${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p>We will review your request and contact you within 24 hours with a formal quote and next steps.</p>

      <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p>Best regards,<br>The Guerilla Teaching Team</p>
        <p>
          Email: info@guerillateaching.com<br>
          Website: www.guerillateaching.com
        </p>
      </div>
    </body>
    </html>
  `;
};

export const generateNotificationEmailHtml = (
  customerName: string,
  customerEmail: string,
  referenceNumber: string,
  items: any[],
  total: number,
  currency: string = 'USD'
): string => {
  const itemList = items
    .map((item) => `• ${item.name} (Qty: ${item.quantity}) - ${currency} ${(item.quantity * item.price).toFixed(2)}`)
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Quote Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #2c3e50; margin: 0;">New Quote Request</h1>
        <p style="margin: 5px 0 0 0; color: #666;">Admin Notification</p>
      </div>

      <p>A new quote request has been submitted:</p>

      <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Customer Details</h3>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Reference:</strong> ${referenceNumber}</p>

        <h3 style="color: #2c3e50;">Requested Items</h3>
        <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${itemList}</pre>

        <p><strong>Total Amount:</strong> ${currency} ${total.toFixed(2)}</p>
      </div>

      <p>Please review and respond to this quote request within 24 hours.</p>
    </body>
    </html>
  `;
};

// Create a singleton instance
let emailService: AzureEmailService | null = null;

export const getAzureEmailService = (): AzureEmailService => {
  if (!emailService) {
    emailService = new AzureEmailService();
  }
  return emailService;
};

export default AzureEmailService;