import { Card, Text, InlineStack, BlockStack } from '@shopify/polaris';
import type { TableMetric } from './types';

interface TableMetricsProps {
  metrics: TableMetric[];
}

export function TableMetrics({ metrics }: TableMetricsProps) {
  if (metrics.length === 0) return null;

  return (
    <InlineStack gap="400" align="start">
      {metrics.map((metric) => (
        <Card key={metric.id} padding="400">
          <BlockStack gap="200">
            <Text variant="headingMd" as="h3" tone="subdued">
              {metric.title}
            </Text>
            <InlineStack align="space-between">
              <Text variant="heading2xl" as="p">
                {metric.value}
              </Text>
              {metric.trend && (
                <div style={{
                  color: metric.trend === 'up' ? '#00A04B' :
                         metric.trend === 'down' ? '#D72C0D' : '#6B7280'
                }}>
                  {metric.trend === 'up' && '↗️'}
                  {metric.trend === 'down' && '↘️'}
                  {metric.trend === 'neutral' && '→'}
                </div>
              )}
            </InlineStack>
            {metric.subtitle && (
              <Text variant="bodySm" tone="subdued">
                {metric.subtitle}
              </Text>
            )}
          </BlockStack>
        </Card>
      ))}
    </InlineStack>
  );
}