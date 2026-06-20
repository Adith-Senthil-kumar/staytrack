import { authErrorMessage } from '../../lib/auth/firebaseErrors';

test('maps known Firebase auth codes to friendly messages', () => {
  expect(authErrorMessage('auth/invalid-email')).toBe('That doesn’t look like a valid email address.');
  expect(authErrorMessage('auth/invalid-credential')).toBe('Incorrect email or password.');
  expect(authErrorMessage('auth/wrong-password')).toBe('Incorrect email or password.');
  expect(authErrorMessage('auth/user-not-found')).toBe('Incorrect email or password.');
  expect(authErrorMessage('auth/too-many-requests')).toBe('Too many attempts. Try again in a few minutes.');
  expect(authErrorMessage('auth/network-request-failed')).toBe('Network error. Check your connection and try again.');
});
test('falls back to a generic message for unknown codes', () => {
  expect(authErrorMessage('auth/something-weird')).toBe('Something went wrong. Please try again.');
  expect(authErrorMessage(undefined)).toBe('Something went wrong. Please try again.');
});
