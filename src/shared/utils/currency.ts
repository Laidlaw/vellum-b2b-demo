export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
}

export function formatNumber(
  amount: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale).format(amount);
}

export function formatDiscount(discountPercentage: number): string {
  return `${Math.round(discountPercentage * 100)}% off`;
}

export function calculateVolumePrice(
  basePrice: number,
  quantity: number,
  volumePricing: Array<{ minQuantity: number; maxQuantity?: number; pricePerUnit: number; discountPercentage?: number }>
): { pricePerUnit: number; totalPrice: number; savings?: number } {
  const applicablePrice = volumePricing.find(tier =>
    quantity >= tier.minQuantity &&
    (!tier.maxQuantity || quantity <= tier.maxQuantity)
  );

  if (applicablePrice) {
    const pricePerUnit = applicablePrice.pricePerUnit;
    const totalPrice = pricePerUnit * quantity;
    const savings = (basePrice - pricePerUnit) * quantity;

    return {
      pricePerUnit,
      totalPrice,
      savings: savings > 0 ? savings : undefined
    };
  }

  return {
    pricePerUnit: basePrice,
    totalPrice: basePrice * quantity
  };
}