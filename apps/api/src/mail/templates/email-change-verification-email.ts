export function emailChangeVerificationTemplate({
  verificationUrl,
  fullName,
}: {
  verificationUrl: string;
  fullName?: string;
}) {
  const greeting = fullName ? `Hi ${fullName},` : 'Hi,';

  return {
    subject: 'Verify your new Welmio email',
    html: `
      <div style="font-family: Arial, sans-serif; color: #073b3a; line-height: 1.5;">
        <h1 style="margin-bottom: 12px;">Verify your new email</h1>

        <p>${greeting}</p>

        <p>
          We received a request to change the email address for your Welmio account.
          Please verify this new email address to finish the change.
        </p>

        <p>
          Your current email will stay active until this new email is verified.
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
            Verify new email
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

        <p>This link expires in 1 hour.</p>

        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `,
  };
}
