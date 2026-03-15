/**
 * Masks an IBAN for display, showing only first 4 and last 1 character
 * Example: PT50 **** **** **** **** **** 1
 */
export function maskIban(iban: string): string {
  if (!iban || iban.length < 8) return iban;
  
  // Take first 4 characters (country code + check digits)
  const firstPart = iban.substring(0, 4);
  // Take last character
  const lastPart = iban.slice(-1);
  
  // Create masked middle section with spaces every 4 characters
  return `${firstPart} **** **** **** **** **** ${lastPart}`;
}

/**
 * Formats an IBAN with spaces every 4 characters for readability
 */
export function formatIban(iban: string): string {
  if (!iban) return iban;
  
  // Remove any existing spaces
  const cleanIban = iban.replace(/\s/g, '');
  
  // Add space every 4 characters
  return cleanIban.match(/.{1,4}/g)?.join(' ') || cleanIban;
}
