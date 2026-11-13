export const AuthMessages = {
  EMAIL_ALREADY_REGISTERED: 'This email is already registered',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_DISABLED: 'This account has been disabled',
  SCOPE_NOT_ALLOWED: 'This account is not authorized to log in here.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_VERIFICATION_TOKEN: 'Invalid verification token',
  INVALID_PASSWORD_RESET_TOKEN: 'Invalid password reset token',
  EMAIL_VERIFIED: 'Email verified',
  VERIFICATION_EMAIL_SENT: 'If an account with that email exists, a verification email has been sent',
  PASSWORD_RESET_LINK_SENT: 'If an account with that email exists, a password reset link has been sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully. Please log in.',
} as const;
