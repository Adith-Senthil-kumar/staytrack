const MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That doesn’t look like a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/missing-password': 'Please enter your password.',
};

export function authErrorMessage(code: string | undefined): string {
  return (code && MESSAGES[code]) || 'Something went wrong. Please try again.';
}
