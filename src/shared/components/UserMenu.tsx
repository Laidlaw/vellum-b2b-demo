import { useState } from 'react';
import { Button, Popover, ActionList } from '@shopify/polaris';
import { PersonIcon } from '@shopify/polaris-icons';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const menuActions = [
    {
      content: 'Account settings',
      onAction: () => {
        setIsOpen(false);
        console.log('Navigate to account settings');
      }
    },
    {
      content: 'Sign out',
      onAction: () => {
        setIsOpen(false);
        console.log('Sign out user');
      }
    }
  ];

  return (
    <Popover
      active={isOpen}
      activator={
        <Button
          onClick={toggleMenu}
          disclosure
          icon={PersonIcon}
          variant="tertiary"
        />
      }
      onClose={() => setIsOpen(false)}
    >
      <ActionList items={menuActions} />
    </Popover>
  );
}