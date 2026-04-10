export function resetPasswordEmailTemplate({ code }: { code: string }) {
  return {
    subject: 'Your password reset code',
    html: `
      <div>
        <h1>Password reset</h1>
        <p>Your password reset code is:</p>
        <p style="font-size: 24px; font-weight: bold;">${code}</p>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  };
}