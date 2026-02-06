export const welcomeEmail = (firstName: string): string => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to Job Portal</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9f9f9; }
      .footer { text-align: center; padding: 20px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Job Portal!</h1>
      </div>
      <div class="content">
        <p>Hello ${firstName},</p>
        <p>Thank you for registering on our Job Portal. Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse job listings</li>
          <li>Apply for positions</li>
          <li>Manage your profile</li>
        </ul>
        <p>We're excited to have you join our community!</p>
      </div>
      <div class="footer">
        <p>Best regards,<br>Job Portal Team</p>
      </div>
    </div>
  </body>
  </html>
`;

export const passwordResetEmail = (resetUrl: string): string => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #f44336; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9f9f9; }
      .button { background: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link expires in 1 hour.</p>
      </div>
      <div class="footer">
        <p>Job Portal Team</p>
      </div>
    </div>
  </body>
  </html>
`;

export const passwordChangedEmail = (): string => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Password Changed</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9f9f9; }
      .footer { text-align: center; padding: 20px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Changed Successfully</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Your password has been successfully changed.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>For security reasons, we recommend:</p>
        <ul>
          <li>Using a strong password</li>
          <li>Not sharing your password with anyone</li>
          <li>Enabling two-factor authentication if available</li>
        </ul>
      </div>
      <div class="footer">
        <p>Best regards,<br>Job Portal Team</p>
      </div>
    </div>
  </body>
  </html>
`;
