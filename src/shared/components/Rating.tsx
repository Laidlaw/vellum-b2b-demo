import { InlineStack, Text } from '@shopify/polaris';
import { StarFilledIcon, StarIcon } from '@shopify/polaris-icons';

interface RatingProps {
  value: number;
  maxStars?: number;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Rating({ value, maxStars = 5, showText = false }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  
  const stars = [];
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <StarFilledIcon 
        key={`full-${i}`} 
        tone="warning" 
      />
    );
  }
  
  // Add half star if needed
  if (hasHalfStar && fullStars < maxStars) {
    stars.push(
      <StarFilledIcon 
        key="half" 
        tone="warning" 
      />
    );
  }
  
  // Add empty stars
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <StarIcon 
        key={`empty-${i}`} 
        tone="subdued" 
      />
    );
  }
  
  return (
    <InlineStack gap="100" blockAlign="center">
      <InlineStack gap="025">
        {stars}
      </InlineStack>
      {showText && (
        <Text as="span" variant="bodySm" tone="subdued">
          {value.toFixed(1)}
        </Text>
      )}
    </InlineStack>
  );
}