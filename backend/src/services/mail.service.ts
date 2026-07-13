import nodemailer, { type Transporter } from "nodemailer";
import { NODE_ENV } from "../configs/constant";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] || character);
}

class MailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass || !Number.isInteger(port)) {
      throw new Error("SMTP is not configured");
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    return this.transporter;
  }

  async sendPasswordReset(to: string, fullName: string, resetUrl: string): Promise<void> {
    if (NODE_ENV === "test" && !process.env.SMTP_HOST) return;

    const safeName = escapeHtml(fullName);
    const safeResetUrl = escapeHtml(resetUrl);
    await this.getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject: "Reset your Edu Global password",
      text: `Hello ${fullName},\n\nUse this link to reset your password: ${resetUrl}\n\nThis link expires in one hour. If you did not request it, you can ignore this email.`,
      html: `<p>Hello ${safeName},</p><p>Use the link below to reset your Edu Global password. It expires in one hour.</p><p><a href="${safeResetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
  }
}

export const mailService = new MailService();
