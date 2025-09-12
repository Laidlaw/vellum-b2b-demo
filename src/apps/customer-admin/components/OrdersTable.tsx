import { useState, useCallback } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Modal,
  Divider,
  Thumbnail,
  Filters,
  ChoiceList
} from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import type { Order, PaginatedResponse } from '../../../shared/types';

interface OrdersTableProps {
  companyId?: string;
}

interface OrderFilters {
  status: string[];
  queryValue: string;
}

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const statusConfig = {
    confirmed: { tone: 'success' as const, label: 'Confirmed' },
    processing: { tone: 'attention' as const, label: 'Processing' },
    shipped: { tone: 'info' as const, label: 'Shipped' },
    delivered: { tone: 'success' as const, label: 'Delivered' },
    cancelled: { tone: 'critical' as const, label: 'Cancelled' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

function PaymentStatusBadge({ status }: { status: Order['paymentStatus'] }) {
  const statusConfig = {
    paid: { tone: 'success' as const, label: 'Paid' },
    partial: { tone: 'attention' as const, label: 'Partial' },
    due: { tone: 'attention' as const, label: 'Payment Due' },
    overdue: { tone: 'critical' as const, label: 'Overdue' }
  };

  const config = statusConfig[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export default function OrdersTable({ companyId }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    status: [],
    queryValue: ''
  });

  // Fetch orders data
  const { data: ordersResponse, isLoading } = useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', companyId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      if (filters.status.length) params.append('status', filters.status.join(','));
      if (filters.queryValue) params.append('search', filters.queryValue);
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      return response.json();
    }
  });

  const orders = ordersResponse?.data || [];

  const handleOrderClick = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleFilterChange = useCallback((filters: OrderFilters) => {
    setFilters(filters);
  }, []);

  const filterControl = (
    <Filters
      queryValue={filters.queryValue}
      onQueryChange={(value) => handleFilterChange({ ...filters, queryValue: value })}
      onQueryClear={() => handleFilterChange({ ...filters, queryValue: '' })}
      onClearAll={() => handleFilterChange({ status: [], queryValue: '' })}
      filters={[
        {
          key: 'status',
          label: 'Status',
          filter: (
            <ChoiceList
              title="Order Status"
              titleHidden
              choices={[
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'Processing', value: 'processing' },
                { label: 'Shipped', value: 'shipped' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' }
              ]}
              selected={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
              allowMultiple
            />
          )
        }
      ]}
    />
  );

  if (isLoading) {
    return (
      <Card>
        <Box padding="800">
          <Text as="p" variant="bodyMd" alignment="center">Loading orders...</Text>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <BlockStack gap="400">
        {filterControl}
        
        <BlockStack gap="300">
          {orders.length === 0 ? (
            <Card>
              <Box padding="800">
                <Text as="p" variant="bodyMd" alignment="center">
                  No orders found. Try adjusting your filters.
                </Text>
              </Box>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <Box padding="400">
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="200">
                        <InlineStack gap="200" blockAlign="center">
                          <OrderStatusBadge status={order.status} />
                          {order.dateConfirmed && (
                            <Text as="p" variant="bodySm" tone="subdued">
                              {formatShortDate(order.dateConfirmed)}
                            </Text>
                          )}
                        </InlineStack>
                      </BlockStack>
                      <Button 
                        variant="plain" 
                        onClick={() => handleOrderClick(order)}
                        size="micro"
                      >
                        View details
                      </Button>
                    </InlineStack>

                    {/* Product images - first 4 items */}
                    <InlineStack gap="200">
                      {order.items.slice(0, 4).map((item, index) => (
                        <Thumbnail
                          key={index}
                          source={item.product.imageUrl}
                          alt={item.product.name}
                          size="medium"
                        />
                      ))}
                      {order.items.length > 4 && (
                        <Box
                          background="bg-surface-secondary"
                          padding="200"
                          borderRadius="100"
                          minWidth="60px"
                          minHeight="60px"
                        >
                          <Text as="p" variant="bodySm" alignment="center">
                            +{order.items.length - 4}
                          </Text>
                        </Box>
                      )}
                    </InlineStack>

                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" tone="subdued">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Order {order.orderNumber}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {order.shippingAddress.address1}
                      </Text>
                    </BlockStack>

                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="p" variant="headingMd" fontWeight="semibold">
                        {formatCurrency(order.totalAmount)}
                      </Text>
                      {order.paymentStatus === 'due' && order.paymentDueDate && (
                        <Text as="p" variant="bodySm" tone="critical">
                          ⚠️ Payment due {formatShortDate(order.paymentDueDate)}
                        </Text>
                      )}
                    </InlineStack>

                    <InlineStack gap="200">
                      {order.paymentStatus !== 'paid' && (
                        <Button variant="primary" size="medium">
                          Pay now
                        </Button>
                      )}
                      <Button variant="secondary" size="medium">
                        Buy again
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Card>
            ))
          )}
        </BlockStack>
      </BlockStack>

      {selectedOrder && (
        <Modal
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.orderNumber}`}
          size="large"
        >
          <Modal.Section>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Status</Text>
                  <OrderStatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Payment</Text>
                  <PaymentStatusBadge status={selectedOrder.paymentStatus} />
                </div>
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Total</Text>
                  <Text as="dd" variant="bodyMd">{formatCurrency(selectedOrder.totalAmount)}</Text>
                </div>
                <div>
                  <Text as="dt" variant="bodyMd" fontWeight="semibold">Order Date</Text>
                  <Text as="dd" variant="bodyMd">{formatDate(selectedOrder.dateCreated)}</Text>
                </div>
              </InlineStack>

              <Divider />

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Shipping Address</Text>
                <Text as="p" variant="bodyMd">
                  {selectedOrder.shippingAddress.company}<br />
                  {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                  {selectedOrder.shippingAddress.address1}<br />
                  {selectedOrder.shippingAddress.address2 && (
                    <>{selectedOrder.shippingAddress.address2}<br /></>
                  )}
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </Text>
              </BlockStack>

              <Divider />

              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Order Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <Card key={index} sectioned>
                    <InlineStack align="space-between" blockAlign="start">
                      <InlineStack gap="300" blockAlign="start">
                        <Thumbnail
                          source={item.product.imageUrl}
                          alt={item.product.name}
                          size="small"
                        />
                        <BlockStack gap="100">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {item.product.name}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            SKU: {item.product.sku}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        {formatCurrency(item.totalPrice)}
                      </Text>
                    </InlineStack>
                  </Card>
                ))}
              </BlockStack>
            </BlockStack>
          </Modal.Section>
          
          <Modal.Section>
            <InlineStack gap="200">
              {selectedOrder.paymentStatus !== 'paid' && (
                <Button variant="primary">
                  Pay {formatCurrency(selectedOrder.totalAmount)}
                </Button>
              )}
              <Button>
                Buy again
              </Button>
              <Button onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </InlineStack>
          </Modal.Section>
        </Modal>
      )}
    </>
  );
}