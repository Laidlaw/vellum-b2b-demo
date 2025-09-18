import { useState } from 'react';
import {
  Button,
  Popover,
  ActionList,
  InlineStack,
  Badge
} from '@shopify/polaris';
import { MenuHorizontalIcon } from '@shopify/polaris-icons';
import { executeAction } from './TableActionManager';
import type { RowActionsConfig, RowBadge, TableActionManager } from './types';

interface RowActionsProps {
  row: Record<string, unknown>;
  rowId: string;
  config: RowActionsConfig;
  badges?: RowBadge[];
  actionManager: TableActionManager;
}

export function RowActions({
  row,
  rowId,
  config,
  badges = [],
  actionManager
}: RowActionsProps) {
  const [popoverActive, setPopoverActive] = useState(false);

  if (!config.enabled) {
    return null;
  }

  // Filter available actions based on disabled conditions
  const availableActions = config.actions.filter(action =>
    !action.disabled || !action.disabled(row)
  );

  // Filter active badges
  const activeBadges = badges.filter(badge =>
    !badge.condition || badge.condition(row)
  );

  const handleActionClick = (actionConfig: typeof config.actions[0], event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when clicking action
    executeAction(actionConfig, rowId, row, actionManager);
    setPopoverActive(false);
  };

  const togglePopover = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopoverActive(!popoverActive);
  };

  if (availableActions.length === 0 && activeBadges.length === 0) {
    return null;
  }

  return (
    <InlineStack gap="200" align="end">
      {/* Row badges */}
      {activeBadges.map((badge, index) => (
        <Badge
          key={index}
          tone={badge.tone}
          size="small"
        >
          {badge.content}
        </Badge>
      ))}

      {/* Actions dropdown */}
      {availableActions.length > 0 && (
        <Popover
          active={popoverActive}
          activator={
            <Button
              size="small"
              variant="tertiary"
              icon={MenuHorizontalIcon}
              onClick={togglePopover}
              accessibilityLabel="Row actions"
            />
          }
          onClose={() => setPopoverActive(false)}
          preferredAlignment="right"
        >
          <ActionList
            items={availableActions.map(action => ({
              id: action.type,
              content: action.label,
              destructive: action.destructive,
              url: action.type === 'navigate' && action.url
                ? (typeof action.url === 'function' ? action.url(row) : action.url)
                : undefined,
              external: action.type === 'navigate',
              onAction: action.type === 'navigate' && action.url
                ? undefined // Let the ActionList handle navigation
                : (event: React.MouseEvent) => handleActionClick(action, event)
            }))}
          />
        </Popover>
      )}
    </InlineStack>
  );
}