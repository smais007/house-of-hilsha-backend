import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "../config/env.js";

/**
 * Email Utility
 * Handles sending emails using Nodemailer
 */

// Email options interface
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create reusable transporter
let transporter: Transporter | null = null;

/**
 * Initialize email transporter
 */
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send email
 * @param options Email options (to, subject, text/html)
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const transport = getTransporter();

    const mailOptions = {
      from: `"House of Hilsha" <${env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    // Don't throw error to prevent timing attacks
    // The caller should not await this function
  }
}

/**
 * Verify email transporter connection
 * Call this on startup to ensure email is configured correctly
 */
export async function verifyEmailTransporter(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log("✅ Email transporter verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email transporter verification failed:", error);
    return false;
  }
}

/**
 * Email templates
 */
export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (name: string): { subject: string; html: string; text: string } => ({
    subject: "Welcome to House of Hilsha!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${name}!</h1>
        <p>Thank you for joining House of Hilsha. We're excited to have you!</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by House of Hilsha.
        </p>
      </div>
    `,
    text: `Welcome, ${name}!\n\nThank you for joining House of Hilsha. We're excited to have you!\n\nIf you have any questions, feel free to reach out to our support team.`,
  }),

  /**
   * Password changed notification
   */
  passwordChanged: (
    name: string
  ): { subject: string; html: string; text: string } => ({
    subject: "Your Password Has Been Changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Changed</h1>
        <p>Hello ${name},</p>
        <p>Your password has been successfully changed.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by House of Hilsha.
        </p>
      </div>
    `,
    text: `Hello ${name},\n\nYour password has been successfully changed.\n\nIf you didn't make this change, please contact our support team immediately.`,
  }),
};
