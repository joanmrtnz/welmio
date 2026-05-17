export function emailVerificationTemplate({
  verificationUrl,
  fullName,
}: {
  verificationUrl: string;
  fullName?: string;
}) {
  const greeting = fullName ? `Hi ${fullName},` : 'Hi,';

  return {
    subject: 'Verify your Welmio account',
    html: `
      <div style="font-family: Arial, sans-serif; color: #073b3a; line-height: 1.5;">
        <h1 style="margin-bottom: 12px;">Verify your email</h1>

        <p>${greeting}</p>

        <p>
          Thanks for creating your Welmio account. Please verify your email address
          to activate your account.
        </p>

        <p style="margin: 28px 0;">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #0f766e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-weight: 700;
            "
          >
            Verify email
          </a>
        </p>

        <p>
          If the button does not work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all;">
          <a href="${verificationUrl}" style="color: #0f766e;">
            ${verificationUrl}
          </a>
        </p>

        <p>This link expires in 24 hours.</p>

        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  };
}