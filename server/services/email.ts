import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

// Microsoft Graph API credentials
// In a production environment, these should be in .env file
if (!process.env.MICROSOFT_TENANT_ID || !process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
  console.error('Missing required Microsoft Graph API environment variables');
}
const TENANT_ID = process.env.MICROSOFT_TENANT_ID || '';
const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'scale@sixpoint.io';

// Initialize Microsoft Graph client
const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

const graphClient = Client.initWithMiddleware({ authProvider });

/**
 * Sends an email using Microsoft Graph API
 */
export async function sendEmail({
  to,
  subject,
  body,
  isHtml = true
}: {
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
}): Promise<void> {
  try {
    const toRecipients = Array.isArray(to)
      ? to.map(email => ({ emailAddress: { address: email } }))
      : [{ emailAddress: { address: to } }];

    const message = {
      message: {
        subject,
        body: {
          contentType: isHtml ? 'HTML' : 'Text',
          content: body
        },
        toRecipients
      },
      saveToSentItems: true
    };

    await graphClient
      .api(`/users/${SENDER_EMAIL}/sendMail`)
      .post(message);

    console.log(`Email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Sends a welcome email to a newly registered user
 */
export async function sendWelcomeEmail(email: string, username: string): Promise<void> {
  const subject = 'Welcome to AKSES';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Welcome to AKSES!</h2>
      <p>Hello ${username},</p>
      <p>Thank you for registering with AKSES, the financial technology platform that manages and creates investment deals for fintechs in emerging markets.</p>
      <p>You can now access our platform and explore all the features we offer:</p>
      <ul>
        <li>AI-powered deal management</li>
        <li>Investment deal tracking</li>
        <li>Pipeline management</li>
        <li>Real-time analytics</li>
      </ul>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 5px 0 0; font-weight: bold;">The AKSES Team</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject, body });
}

/**
 * Sends a login notification email
 */
export async function sendLoginNotificationEmail(email: string, username: string): Promise<void> {
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = 'New Sign-in to Your AKSES Account';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">New Sign-in Detected</h2>
      <p>Hello ${username},</p>
      <p>We noticed a new sign-in to your AKSES account on ${formattedDate}.</p>
      <p>If this was you, no further action is required.</p>
      <p>If you didn't sign in at this time, please contact our support team immediately to secure your account.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 5px 0 0; font-weight: bold;">The AKSES Team</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject, body });
}

/**
 * Sends a password reset email with a reset token
 */
export async function sendPasswordResetEmail(email: string, username: string, token: string): Promise<void> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}&username=${encodeURIComponent(username)}`;
  
  const subject = 'Reset Your AKSES Password';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Password Reset Request</h2>
      <p>Hello ${username},</p>
      <p>We received a request to reset your AKSES account password. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>This password reset link will expire in 30 minutes.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 5px 0 0; font-weight: bold;">The AKSES Team</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject, body });
} 