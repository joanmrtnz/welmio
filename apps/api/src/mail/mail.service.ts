import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { resetPasswordEmailTemplate } from './templates/reset-password-email';
import { emailVerificationTemplate } from './templates/email-verification-email';
import { emailChangeVerificationTemplate } from './templates/email-change-verification-email';

type VerificationEmailTemplateType = 'email_verification' | 'email_change';

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
    templateType = 'email_verification',
  }: {
    to: string;
    token: string;
    fullName?: string;
    templateType?: VerificationEmailTemplateType;
  }) {
    const verificationUrl = this.buildVerificationUrl(token, templateType);
    const { subject, html } = this.getVerificationEmailTemplate({
      verificationUrl,
      fullName,
      templateType,
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

  private buildVerificationUrl(
    token: string,
    templateType: VerificationEmailTemplateType,
  ) {
    const appUrl = process.env.APP_URL + "/auth";

    if (!appUrl) {
      throw new Error('APP_URL is not configured');
    }

    const verificationPath =
      templateType === 'email_change' ? 'verify-email-change' : 'verify-email';

    return `${appUrl}/${verificationPath}?token=${token}`;
  }

  private getVerificationEmailTemplate({
    verificationUrl,
    fullName,
    templateType,
  }: {
    verificationUrl: string;
    fullName?: string;
    templateType: VerificationEmailTemplateType;
  }) {
    if (templateType === 'email_change') {
      return emailChangeVerificationTemplate({ verificationUrl, fullName });
    }

    return emailVerificationTemplate({ verificationUrl, fullName });
  }
}