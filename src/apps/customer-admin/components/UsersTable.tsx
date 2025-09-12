import {
  ResourceList,
  ResourceItem,
  Avatar,
  Badge,
  Text,
  InlineStack,
  BlockStack,
  Box,
  Popover,
  ActionList,
  Button,
  EmptyState,
  Filters
} from '@shopify/polaris';
import { useState } from 'react';
import {
  MenuHorizontalIcon
} from '@shopify/polaris-icons';
import type { User } from '../../../shared/types';

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  onDeleteUser: (userId: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  departmentFilter?: string;
  onDepartmentFilterChange?: (department: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

interface UserActionsProps {
  user: User;
  currentUserId?: string;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function UserActions({ user, currentUserId, onEdit, onToggleStatus, onDelete }: UserActionsProps) {
  const [popoverActive, setPopoverActive] = useState(false);
  const isCurrentUser = user.id === currentUserId;
  
  const actions = [];
  
  if (!isCurrentUser) {
    actions.push({ content: 'Edit user', onAction: onEdit });
    
    if (user.status === 'active') {
      actions.push({ content: 'Deactivate', onAction: onToggleStatus });
    } else if (user.status === 'inactive') {
      actions.push({ content: 'Activate', onAction: onToggleStatus });
    }
    
    if (actions.length > 0) {
      actions.push({ content: '-' });
    }
    actions.push({ content: 'Remove user', onAction: onDelete, destructive: true });
  } else {
    actions.push({ content: 'Edit profile', onAction: onEdit });
  }
  
  return (
    <Popover
      active={popoverActive}
      activator={
        <Button 
          variant="plain" 
          icon={MenuHorizontalIcon}
          onClick={() => setPopoverActive(!popoverActive)}
        />
      }
      onClose={() => setPopoverActive(false)}
    >
      <ActionList items={actions} />
    </Popover>
  );
}

function formatLastLogin(dateString?: Date | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return diffInHours < 1 ? 'Just now' : `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStatusBadgeTone(status: User['status']): 'success' | 'critical' | 'attention' {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'critical';
    case 'pending': return 'attention';
    default: return 'attention';
  }
}

function getUserInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function UsersTable({ 
  users, 
  loading = false,
  onEditUser, 
  onToggleUserStatus, 
  onDeleteUser,
  searchValue = '',
  onSearchChange,
  departmentFilter = 'All',
  onDepartmentFilterChange,
  statusFilter = 'All',
  onStatusFilterChange
}: UsersTableProps) {
  
  const departments = ['All', ...Array.from(new Set(users.map(u => u.department))).sort()];
  const statuses = ['All', 'Active', 'Inactive', 'Pending'];
  
  const renderUserItem = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    
    return (
      <ResourceItem
        id={user.id}
        media={
          <Avatar
            size="small"
            name={fullName}
            initials={getUserInitials(user)}
          />
        }
        accessibilityLabel={`View details for ${fullName}`}
      >
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <Text as="h3" variant="bodyMd" fontWeight="medium">
              {fullName}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {user.email}
            </Text>
            <InlineStack gap="400">
              <Text as="p" variant="bodySm">
                {user.jobTitle || user.role} • {user.department}
              </Text>
              {user.location && (
                <Text as="p" variant="bodySm" tone="subdued">
                  {user.location}
                </Text>
              )}
              <Text as="p" variant="bodySm" tone="subdued">
                Last login: {formatLastLogin(user.lastLogin)}
              </Text>
            </InlineStack>
          </BlockStack>
          
          <InlineStack gap="200" align="end">
            <Badge tone={getStatusBadgeTone(user.status)}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Badge>
            <UserActions
              user={user}
              onEdit={() => onEditUser(user.id)}
              onToggleStatus={() => onToggleUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
              onDelete={() => onDeleteUser(user.id)}
            />
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
  };
  
  if (loading) {
    return (
      <Box paddingBlock="800">
        <Text as="p" alignment="center" tone="subdued">
          Loading users...
        </Text>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box paddingBlock="800">
        <EmptyState
          heading="No users found"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Try adjusting your search or filter criteria.</p>
        </EmptyState>
      </Box>
    );
  }

  return (
    <BlockStack gap="400">
      <Filters
        queryValue={searchValue}
        queryPlaceholder="Search users..."
        onQueryChange={onSearchChange || (() => {})}
        onQueryClear={() => onSearchChange?.('')}
        filters={[]}
        onClearAll={() => {
          onSearchChange?.('');
          onDepartmentFilterChange?.('All');
          onStatusFilterChange?.('All');
        }}
      >
        <InlineStack gap="200">
          <Text as="span" variant="bodySm">Department:</Text>
          <select 
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange?.(e.target.value)}
            style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <Text as="span" variant="bodySm">Status:</Text>
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange?.(e.target.value)}
            style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </InlineStack>
      </Filters>
      
      <ResourceList
        resourceName={{ singular: 'user', plural: 'users' }}
        items={users}
        renderItem={renderUserItem}
        showHeader
        totalItemsCount={users.length}
      />
    </BlockStack>
  );
}