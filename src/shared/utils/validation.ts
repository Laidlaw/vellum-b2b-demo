export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
}

export function isValidZipCode(zipCode: string, country: string = 'US'): boolean {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/
  };

  const pattern = patterns[country as keyof typeof patterns];
  return pattern ? pattern.test(zipCode) : zipCode.length >= 3;
}

export function validateQuantity(quantity: number | string): { isValid: boolean; error?: string } {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

  if (isNaN(num)) {
    return { isValid: false, error: 'Quantity must be a number' };
  }

  if (num < 1) {
    return { isValid: false, error: 'Quantity must be at least 1' };
  }

  if (num > 10000) {
    return { isValid: false, error: 'Quantity cannot exceed 10,000' };
  }

  return { isValid: true };
}

export function validatePrice(price: number | string): { isValid: boolean; error?: string } {
  const num = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(num)) {
    return { isValid: false, error: 'Price must be a number' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }

  if (num > 1000000) {
    return { isValid: false, error: 'Price cannot exceed $1,000,000' };
  }

  return { isValid: true };
}

export function validateRequired(value: string | undefined | null): { isValid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'This field is required' };
  }

  return { isValid: true };
}

export function validateAddress(address: {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const requiredValidation = validateRequired(address.firstName);
  if (!requiredValidation.isValid) errors.firstName = requiredValidation.error!;

  const lastNameValidation = validateRequired(address.lastName);
  if (!lastNameValidation.isValid) errors.lastName = lastNameValidation.error!;

  const address1Validation = validateRequired(address.address1);
  if (!address1Validation.isValid) errors.address1 = address1Validation.error!;

  const cityValidation = validateRequired(address.city);
  if (!cityValidation.isValid) errors.city = cityValidation.error!;

  const stateValidation = validateRequired(address.state);
  if (!stateValidation.isValid) errors.state = stateValidation.error!;

  const zipValidation = validateRequired(address.zipCode);
  if (!zipValidation.isValid) {
    errors.zipCode = zipValidation.error!;
  } else if (!isValidZipCode(address.zipCode, address.country)) {
    errors.zipCode = 'Invalid zip code format';
  }

  const countryValidation = validateRequired(address.country);
  if (!countryValidation.isValid) errors.country = countryValidation.error!;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function generateSKU(prefix: string = 'SKU'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}