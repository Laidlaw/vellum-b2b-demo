import { useState } from 'react';
import {
  InlineStack,
  Text,
  Button,
  Popover,
  ActionList,
  Avatar,
  Box
} from '@shopify/polaris';
import {
  ChevronDownIcon,
  PersonIcon
} from '@shopify/polaris-icons';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface HorizontalNavItem {
  label: string;
  path: string;
  active?: boolean;
}

export interface CommerceTopBarProps {
  companyName: string;
  companyAddress?: Address;
  horizontalNavItems?: HorizontalNavItem[];
  currentUser: {
    name: string;
    detail: string;
    initials: string;
  };
  onNavigate: (path: string) => void;
  onUserLogout?: () => void;
}

export function CommerceTopBar({
  companyName,
  companyAddress,
  horizontalNavItems = [],
  currentUser,
  onNavigate,
  onUserLogout
}: CommerceTopBarProps) {
  const [addressPopoverActive, setAddressPopoverActive] = useState(false);
  const [userPopoverActive, setUserPopoverActive] = useState(false);

  const toggleAddressPopover = () => setAddressPopoverActive(!addressPopoverActive);
  const toggleUserPopover = () => setUserPopoverActive(!userPopoverActive);

  const addressText = companyAddress
    ? `${companyAddress.street}`
    : 'No address set';

  const userMenuActions = [
    {
      content: 'Profile settings',
      onAction: () => setUserPopoverActive(false)
    },
    {
      content: 'Help center',
      onAction: () => setUserPopoverActive(false)
    },
    {
      content: 'Sign out',
      onAction: () => {
        setUserPopoverActive(false);
        onUserLogout?.();
      }
    }
  ];

  const addressMenuActions = companyAddress ? [
    {
      content: 'Delivery Address',
      helpText: `${companyAddress.street}, ${companyAddress.city}, ${companyAddress.state} ${companyAddress.zip}`,
      onAction: () => setAddressPopoverActive(false)
    },
    {
      content: 'Change delivery address',
      onAction: () => setAddressPopoverActive(false)
    }
  ] : [
    {
      content: 'Set delivery address',
      onAction: () => setAddressPopoverActive(false)
    }
  ];

  return (
    <Box
      background="bg-surface"
      borderBlockEndWidth="025"
      borderColor="border"
      paddingInlineStart="400"
      paddingInlineEnd="400"
      paddingBlockStart="200"
      paddingBlockEnd="200"
    >
      <InlineStack align="space-between" blockAlign="center">
        {/* Left side: Company name + horizontal navigation */}
        <InlineStack gap="600" blockAlign="center">
          {/* Company Name/Logo */}
          <Text variant="headingLg" fontWeight="bold">
            {companyName}
          </Text>

          {/* Horizontal Navigation */}
          <InlineStack gap="400">
            {horizontalNavItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? 'primary' : 'plain'}
                size="medium"
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </InlineStack>
        </InlineStack>

        {/* Right side: Address + User profile */}
        <InlineStack gap="300" blockAlign="center">
          {/* Address Dropdown */}
          <Popover
            active={addressPopoverActive}
            activator={
              <Button
                variant="plain"
                size="medium"
                icon={ChevronDownIcon}
                onClick={toggleAddressPopover}
              >
                {addressText}
              </Button>
            }
            onClose={() => setAddressPopoverActive(false)}
          >
            <ActionList items={addressMenuActions} />
          </Popover>

          {/* User Profile Dropdown */}
          <Popover
            active={userPopoverActive}
            activator={
              <Button
                variant="plain"
                size="medium"
                onClick={toggleUserPopover}
              >
                <InlineStack gap="200" blockAlign="center">
                  <Avatar
                    customer
                    size="extraSmall"
                    name={currentUser.name}
                    initials={currentUser.initials}
                  />
                  <ChevronDownIcon />
                </InlineStack>
              </Button>
            }
            onClose={() => setUserPopoverActive(false)}
          >
            <ActionList items={userMenuActions} />
          </Popover>
        </InlineStack>
      </InlineStack>
    </Box>
  );
}