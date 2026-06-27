import { Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { MailService } from './mail.service';

const mockSend = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

describe('MailService', () => {
  let service: MailService;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    process.env = {
      ...originalEnv,
      APP_URL: 'https://app.test',
      MAIL_FROM: 'Welmio <noreply@app.test>',
      RESEND_API_KEY: 'test-key',
    };

    mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null });

    service = new MailService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('initializes Resend with the configured API key', () => {
    expect(Resend).toHaveBeenCalledWith('test-key');
  });

  it('sends reset password emails with the one-time code template', async () => {
    await expect(
      service.sendResetPasswordCodeEmail('user@test.com', '123456'),
    ).resolves.toEqual({ id: 'email-1' });

    expect(mockSend).toHaveBeenCalledWith({
      from: 'Welmio <noreply@app.test>',
      to: ['user@test.com'],
      subject: expect.stringMatching(/reset/i),
      html: expect.stringContaining('123456'),
    });
  });

  it('returns provider data when reset password email is sent successfully', async () => {
    mockSend.mockResolvedValue({
      data: { id: 'reset-email-1' },
      error: null,
    });

    await expect(
      service.sendResetPasswordCodeEmail('user@test.com', '654321'),
    ).resolves.toEqual({ id: 'reset-email-1' });
  });

  it('throws and logs a stable application error when reset password email sending fails', async () => {
    const providerError = new Error('provider down');

    mockSend.mockResolvedValue({
      data: null,
      error: providerError,
    });

    await expect(
      service.sendResetPasswordCodeEmail('user@test.com', '123456'),
    ).rejects.toThrow('Failed to send reset password email');

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'Failed to send reset password email to user@test.com',
      providerError,
    );
  });

  it('sends account verification links with the frontend verify account path by default', async () => {
    await expect(
      service.sendEmailVerification({
        to: 'user@test.com',
        token: 'verify-token',
        fullName: 'User',
      }),
    ).resolves.toEqual({ id: 'email-1' });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Welmio <noreply@app.test>',
        to: ['user@test.com'],
        subject: expect.stringMatching(/verify/i),
        html: expect.stringContaining(
          'https://app.test/verify-account?token=verify-token',
        ),
      }),
    );
  });

  it('uses the frontend email change verification path for pending email updates', async () => {
    await expect(
      service.sendEmailVerification({
        to: 'new@test.com',
        token: 'change-token',
        templateType: 'email_change',
      }),
    ).resolves.toEqual({ id: 'email-1' });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Welmio <noreply@app.test>',
        to: ['new@test.com'],
        subject: expect.stringMatching(/email/i),
        html: expect.stringContaining(
          'https://app.test/verify-email-change?token=change-token',
        ),
      }),
    );
  });

  it('returns provider data when verification email is sent successfully', async () => {
    mockSend.mockResolvedValue({
      data: { id: 'verification-email-1' },
      error: null,
    });

    await expect(
      service.sendEmailVerification({
        to: 'user@test.com',
        token: 'verify-token',
      }),
    ).resolves.toEqual({ id: 'verification-email-1' });
  });

  it('throws and logs a stable application error when verification email sending fails', async () => {
    const providerError = new Error('provider down');

    mockSend.mockResolvedValue({
      data: null,
      error: providerError,
    });

    await expect(
      service.sendEmailVerification({
        to: 'user@test.com',
        token: 'verify-token',
      }),
    ).rejects.toThrow('Failed to send verification email');

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'Failed to send verification email to user@test.com',
      providerError,
    );
  });
});