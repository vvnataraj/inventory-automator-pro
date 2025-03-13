
/**
 * Utility functions for password management and validation
 */

/**
 * Checks the strength of a password against security requirements
 * @param password The password to check
 * @returns Object containing whether the password is strong and any errors
 */
export const checkPasswordStrength = (password: string) => {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isStrong: errors.length === 0,
    errors
  };
};
