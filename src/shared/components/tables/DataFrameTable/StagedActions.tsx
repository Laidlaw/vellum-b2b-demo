import { useState } from 'react';
import {
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Badge,
  List,
  Modal,
  Box,
  Divider
} from '@shopify/polaris';
import { AlertTriangleIcon, CheckIcon } from '@shopify/polaris-icons';
import { summarizeStagedActions } from '../../../utils/table';
import type { StagedAction } from './types';

interface StagedActionsProps {
  stagedActions: StagedAction[];
  onExecuteAll: () => void;
  onClearAll: () => void;
  onRemoveAction: (actionId: string) => void;
  loading?: boolean;
}

export function StagedActions({
  stagedActions,
  onExecuteAll,
  onClearAll,
  onRemoveAction,
  loading = false
}: StagedActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (stagedActions.length === 0) {
    return null;
  }

  const summary = summarizeStagedActions(stagedActions);

  const handleExecuteClick = () => {
    if (summary.hasDestructiveActions) {
      setShowConfirmModal(true);
    } else {
      onExecuteAll();
    }
  };

  const handleConfirmExecute = () => {
    setShowConfirmModal(false);
    onExecuteAll();
  };

  return (
    <>
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="start">
            <BlockStack gap="200">
              <InlineStack gap="300" blockAlign="center">
                <Text as="h3" variant="headingSm" fontWeight="semibold">
                  Staged Actions
                </Text>
                <Badge tone="info">
                  {summary.totalActions} action{summary.totalActions === 1 ? '' : 's'}
                </Badge>
                <Badge tone="attention">
                  {summary.affectedRowCount} row{summary.affectedRowCount === 1 ? '' : 's'} affected
                </Badge>
                {summary.hasDestructiveActions && (
                  <Badge tone="critical" icon={AlertTriangleIcon}>
                    Contains destructive actions
                  </Badge>
                )}
              </InlineStack>
              <Text as="p" variant="bodySm" tone="subdued">
                Review and execute pending actions
              </Text>
            </BlockStack>

            <InlineStack gap="200">
              <Button
                size="small"
                onClick={onClearAll}
                disabled={loading}
              >
                Clear All
              </Button>
              <Button
                size="small"
                variant="primary"
                icon={CheckIcon}
                onClick={handleExecuteClick}
                loading={loading}
                tone={summary.hasDestructiveActions ? 'critical' : undefined}
              >
                Execute All
              </Button>
            </InlineStack>
          </InlineStack>

          <Divider />

          <BlockStack gap="300">
            <Text as="h4" variant="bodyMd" fontWeight="medium">
              Actions by Type:
            </Text>
            <List>
              {Object.entries(summary.actionsByType).map(([actionType, count]) => (
                <List.Item key={actionType}>
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" variant="bodySm">
                      {actionType}: {count} action{count === 1 ? '' : 's'}
                    </Text>
                    <Button
                      size="micro"
                      variant="tertiary"
                      onClick={() => onRemoveAction(actionType)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </InlineStack>
                </List.Item>
              ))}
            </List>
          </BlockStack>
        </BlockStack>
      </Card>

      {/* Confirmation Modal for Destructive Actions */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Destructive Actions"
        primaryAction={{
          content: 'Execute Actions',
          destructive: true,
          onAction: handleConfirmExecute
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowConfirmModal(false)
          }
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Box>
              <Text as="p" variant="bodyMd">
                You are about to execute {summary.totalActions} action{summary.totalActions === 1 ? '' : 's'}
                affecting {summary.affectedRowCount} row{summary.affectedRowCount === 1 ? '' : 's'}.
              </Text>
            </Box>

            <Box padding="300" background="bg-critical-subdued" borderRadius="200">
              <InlineStack gap="200" blockAlign="start">
                <AlertTriangleIcon />
                <Text as="p" variant="bodyMd" fontWeight="medium">
                  Some of these actions are destructive and cannot be undone.
                </Text>
              </InlineStack>
            </Box>

            <BlockStack gap="200">
              <Text as="h4" variant="bodyMd" fontWeight="medium">
                Actions to be executed:
              </Text>
              <List>
                {Object.entries(summary.actionsByType).map(([actionType, count]) => (
                  <List.Item key={actionType}>
                    {actionType}: {count} action{count === 1 ? '' : 's'}
                  </List.Item>
                ))}
              </List>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}