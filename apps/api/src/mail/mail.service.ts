import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { resetPasswordEmailTemplate } from './templates/reset-password-email';
import { emailVerificationTemplate } from './templates/email-verification-email';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendResetPasswordCodeEmail(to: string, code: string) {
    const { subject, html } = resetPasswordEmailTemplate({ code });

    const { data, error } = await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: [to],
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Failed to send reset password email to ${to}`, error);
      throw new Error('Failed to send reset password email');
    }

    return data;
  }

  async sendEmailVerification({
    to,
    token,
    fullName,
  }: {
    to: string;
    token: string;
    fullName?: string;
  }) {
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    const { subject, html } = emailVerificationTemplate({
      verificationUrl,
      fullName,
    });

    const { data, error } = await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: [to],
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw new Error('Failed to send verification email');
    }

    return data;
  }
}