import { 
  Card, 
  Page, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Avatar,
  Badge,
  ResourceList,
  ResourceItem,
  Box,
  Popover,
  ActionList,
  Filters,
  Tabs,
  EmptyState
} from '@shopify/polaris';
import { useState } from 'react';
import {
  PersonAddIcon,
  MenuHorizontalIcon
} from '@shopify/polaris-icons';

// Mock team data - in a real app this would come from APIs
const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme-industrial.com',
    role: 'Account Administrator',
    department: 'Operations',
    status: 'active',
    lastLogin: '2024-09-11T10:30:00Z',
    joinDate: '2022-03-15',
    permissions: ['full_access', 'approve_orders', 'manage_team'],
    initials: 'SC',
    isCurrentUser: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@acme-industrial.com',
    role: 'Procurement Manager',
    department: 'Procurement',
    status: 'active',
    lastLogin: '2024-09-10T16:45:00Z',
    joinDate: '2021-07-22',
    permissions: ['create_orders', 'approve_quotes'],
    initials: 'MR'
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily.johnson@acme-industrial.com',
    role: 'Procurement Specialist',
    department: 'Procurement',
    status: 'active',
    lastLogin: '2024-09-11T09:15:00Z',
    joinDate: '2024-09-01',
    permissions: ['create_orders', 'view_quotes'],
    initials: 'EJ'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@acme-industrial.com',
    role: 'Finance Manager',
    department: 'Finance',
    status: 'active',
    lastLogin: '2024-09-09T14:20:00Z',
    joinDate: '2020-11-10',
    permissions: ['view_invoices', 'manage_payments'],
    initials: 'DK'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa.wang@acme-industrial.com',
    role: 'Operations Coordinator',
    department: 'Operations',
    status: 'inactive',
    lastLogin: '2024-08-25T11:30:00Z',
    joinDate: '2023-02-14',
    permissions: ['view_orders'],
    initials: 'LW'
  },
  {
    id: '6',
    name: 'James Thompson',
    email: 'james.thompson@acme-industrial.com',
    role: 'Warehouse Manager',
    department: 'Operations',
    status: 'pending',
    lastLogin: null,
    joinDate: '2024-09-08',
    permissions: ['view_orders'],
    initials: 'JT'
  }
];

const DEPARTMENTS = ['All', 'Operations', 'Procurement', 'Finance'];
const USER_STATUSES = ['All', 'Active', 'Inactive', 'Pending'];


function formatLastLogin(dateString: string | null) {
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

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string | null;
  joinDate: string;
  permissions: string[];
  initials: string;
  isCurrentUser?: boolean;
}

function UserActions({ user, onEdit, onDeactivate, onActivate, onDelete }: {
  user: UserData;
  onEdit: () => void;
  onDeactivate: () => void;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  
  const actions = [];
  
  if (!user.isCurrentUser) {
    actions.push({ content: 'Edit user', onAction: onEdit });
    
    if (user.status === 'active') {
      actions.push({ content: 'Deactivate', onAction: onDeactivate });
    } else {
      actions.push({ content: 'Activate', onAction: onActivate });
    }
    
    actions.push({ content: '-' });
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

export default function UsersPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const tabs = [
    {
      id: 'all-users',
      content: 'All users',
      panelID: 'all-users-panel'
    },
    {
      id: 'pending-invites',
      content: 'Pending invites',
      panelID: 'pending-invites-panel'
    }
  ];
  
  // Filter users based on search and filters
  const filteredUsers = TEAM_MEMBERS.filter(user => {
    const matchesQuery = user.name.toLowerCase().includes(queryValue.toLowerCase()) ||
                        user.email.toLowerCase().includes(queryValue.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || user.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || 
                         user.status.toLowerCase() === statusFilter.toLowerCase();
    
    if (selectedTab === 1) {
      return matchesQuery && matchesDepartment && user.status === 'pending';
    }
    
    return matchesQuery && matchesDepartment && matchesStatus;
  });
  
  const renderUserItem = (user: UserData) => {
    const { id, name, email, role, department, status, lastLogin, initials, isCurrentUser } = user;
    
    return (
      <ResourceItem
        id={id}
        media={
          <Avatar
            size="small"
            name={name}
            initials={initials}
          />
        }
        accessibilityLabel={`View details for ${name}`}
      >
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="100">
            <InlineStack gap="200" align="start">
              <Text as="h3" variant="bodyMd" fontWeight="medium">
                {name}
              </Text>
              {isCurrentUser && <Badge>You</Badge>}
            </InlineStack>
            <Text as="p" variant="bodySm" tone="subdued">
              {email}
            </Text>
            <InlineStack gap="400">
              <Text as="p" variant="bodySm">
                {role} • {department}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Last login: {formatLastLogin(lastLogin)}
              </Text>
            </InlineStack>
          </BlockStack>
          
          <InlineStack gap="200" align="end">
            <Badge 
              tone={status === 'active' ? 'success' : status === 'inactive' ? 'critical' : 'attention'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <UserActions
              user={user}
              onEdit={() => console.log('Edit user', id)}
              onDeactivate={() => console.log('Deactivate user', id)}
              onActivate={() => console.log('Activate user', id)}
              onDelete={() => console.log('Delete user', id)}
            />
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
  };
  
  const emptyStateMarkup = selectedTab === 1 ? (
    <EmptyState
      heading="No pending invites"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>All team members have accepted their invitations.</p>
    </EmptyState>
  ) : (
    <EmptyState
      heading="No users found"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Try adjusting your search or filter criteria.</p>
    </EmptyState>
  );
  
  return (
    <Page 
      title="Team members" 
      subtitle="Manage your team's access and permissions"
      primaryAction={
        <Button variant="primary" icon={PersonAddIcon}>
          Invite team member
        </Button>
      }
      secondaryActions={[
        {
          content: 'Export users',
          onAction: () => console.log('Export users')
        }
      ]}
    >
      <BlockStack gap="400">
        <Card>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
          
          <Box paddingBlockStart="400">
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Search team members..."
              onQueryChange={setQueryValue}
              onQueryClear={() => setQueryValue('')}
              filters={[]}
              onClearAll={() => {
                setQueryValue('');
                setDepartmentFilter('All');
                setStatusFilter('All');
              }}
            >
              <InlineStack gap="200">
                <Text as="span" variant="bodySm">Department:</Text>
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <Text as="span" variant="bodySm">Status:</Text>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {USER_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </InlineStack>
            </Filters>
          </Box>
          
          {filteredUsers.length === 0 ? (
            <Box paddingBlock="800">
              {emptyStateMarkup}
            </Box>
          ) : (
            <ResourceList
              resourceName={{ singular: 'user', plural: 'users' }}
              items={filteredUsers}
              renderItem={renderUserItem}
              showHeader
              totalItemsCount={filteredUsers.length}
            />
          )}
        </Card>
        
        {/* Team Overview Stats */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Team overview
            </Text>
            
            <InlineStack gap="800">
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">
                  Total team members
                </Text>
                <Text as="p" variant="headingLg" fontWeight="bold">
                  {TEAM_MEMBERS.length}
                </Text>
              </Box>
              
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">
                  Active users
                </Text>
                <Text as="p" variant="headingLg" fontWeight="bold">
                  {TEAM_MEMBERS.filter(u => u.status === 'active').length}
                </Text>
              </Box>
              
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">
                  Pending invites
                </Text>
                <Text as="p" variant="headingLg" fontWeight="bold">
                  {TEAM_MEMBERS.filter(u => u.status === 'pending').length}
                </Text>
              </Box>
              
              <Box>
                <Text as="p" variant="bodySm" tone="subdued">
                  Departments
                </Text>
                <Text as="p" variant="headingLg" fontWeight="bold">
                  {new Set(TEAM_MEMBERS.map(u => u.department)).size}
                </Text>
              </Box>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}