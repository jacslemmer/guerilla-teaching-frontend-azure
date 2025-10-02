/**
 * Azure Function: Email Worker
 * Replaces Cloudflare Email Worker functionality
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { EmailClient, EmailMessage } from '@azure/communication-email';

interface EmailRequest {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  type: 'quote' | 'notification';
}

// Initialize email client
const getEmailClient = (): EmailClient => {
  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING not configured');
  }
  return new EmailClient(connectionString);
};

export async function emailWorker(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Email worker function triggered');

  try {
    // Validate request method
    if (request.method !== 'POST') {
      return {
        status: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse request body
    const emailRequest: EmailRequest = await request.json() as EmailRequest;

    // Validate required fields
    if (!emailRequest.to || !emailRequest.subject || !emailRequest.htmlBody) {
      return {
        status: 400,
        body: JSON.stringify({ error: 'Missing required fields: to, subject, htmlBody' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRequest.to)) {
      return {
        status: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Send email
    const emailClient = getEmailClient();
    const senderAddress = process.env.AZURE_EMAIL_SENDER_ADDRESS || 'noreply@guerillateaching.com';

    const emailMessage: EmailMessage = {
      senderAddress,
      content: {
        subject: emailRequest.subject,
        html: emailRequest.htmlBody,
        plainText: emailRequest.textBody || stripHtml(emailRequest.htmlBody),
      },
      recipients: {
        to: [{ address: emailRequest.to }],
      },
    };

    const poller = await emailClient.beginSend(emailMessage);
    const result = await poller.pollUntilDone();

    if (result.status === 'Succeeded') {
      context.log(`Email sent successfully to ${emailRequest.to}. Message ID: ${result.id}`);

      return {
        status: 200,
        body: JSON.stringify({
          success: true,
          messageId: result.id,
          recipient: emailRequest.to
        })
      };
    } else {
      context.log(`Failed to send email to ${emailRequest.to}. Status: ${result.status}`);

      return {
        status: 500,
        body: JSON.stringify({
          success: false,
          error: `Email sending failed with status: ${result.status}`,
          recipient: emailRequest.to
        })
      };
    }

  } catch (error) {
    context.log('Error in email worker function:', error);

    return {
      status: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

// Helper function to convert HTML to plain text
function stripHtml(html: string): string {
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

// Register the function
app.http('emailWorker', {
  methods: ['POST'],
  authLevel: 'function',
  handler: emailWorker
});