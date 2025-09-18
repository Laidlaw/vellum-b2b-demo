import { Modal } from '@shopify/polaris';
import type { DetailModalOptions } from './types';

interface DetailModalProps {
  row: Record<string, unknown> | null;
  options: DetailModalOptions;
  onClose: () => void;
}

export function DetailModal({ row, options, onClose }: DetailModalProps) {
  if (!row || !options.enabled) {
    return null;
  }

  const title = options.title ? options.title(row) : 'Details';
  const primaryAction = options.primaryAction ? options.primaryAction(row) : null;
  const secondaryActions = options.secondaryActions ? options.secondaryActions(row) : [];

  return (
    <Modal
      open={!!row}
      onClose={onClose}
      title={title}
      size={options.size || 'large'}
      primaryAction={primaryAction || undefined}
      secondaryActions={[
        ...secondaryActions,
        {
          content: 'Close',
          onAction: onClose
        }
      ]}
    >
      <Modal.Section>
        {options.content(row)}
      </Modal.Section>
    </Modal>
  );
}