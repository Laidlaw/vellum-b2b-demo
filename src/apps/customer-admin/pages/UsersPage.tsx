import { 
  Card, 
  Page, 
  BlockStack, 
  Text, 
  Button, 
  InlineStack,
  Box,
  Tabs,
  Toast
} from '@shopify/polaris';
import { useState } from 'react';
import {
  PersonAddIcon
} from '@shopify/polaris-icons';
import { UsersTable } from '../components/UsersTable';
import { useUsers, useUserStats, useUpdateUserStatus, useDeleteUser } from '../hooks/useUsers';

// For demo purposes - in real app this would come from auth
const DEMO_COMPANY_ID = 'acme-industrial-123';

export default function UsersPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Query hooks
  const usersQuery = useUsers({
    companyId: DEMO_COMPANY_ID,
    search: searchValue,
    department: departmentFilter,
    status: selectedTab === 1 ? 'pending' : statusFilter
  });
  
  const statsQuery = useUserStats(DEMO_COMPANY_ID);
  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  
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
  
  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit user modal
  };
  
  const handleToggleUserStatus = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateStatusMutation.mutateAsync({ userId, status: newStatus });
      setToastMessage(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      setToastActive(true);
    } catch {
      setToastMessage('Failed to update user status');
      setToastActive(true);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        setToastMessage('User removed successfully');
        setToastActive(true);
      } catch {
        setToastMessage('Failed to remove user');
        setToastActive(true);
      }
    }
  };
  
  const users = usersQuery.data?.data || [];
  const stats = statsQuery.data;
  
  const toastMarkup = toastActive && (
    <Toast
      content={toastMessage}
      onDismiss={() => setToastActive(false)}
    />
  );
  
  return (
    <>
      {toastMarkup}
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
              <UsersTable
                users={users}
                loading={usersQuery.isLoading}
                onEditUser={handleEditUser}
                onToggleUserStatus={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                departmentFilter={departmentFilter}
                onDepartmentFilterChange={setDepartmentFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </Box>
          </Card>
          
          {/* Team Overview Stats */}
          {stats && (
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
                      {stats.total}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Active users
                    </Text>
                    <Text as="p" variant="headingLg" fontWeight="bold">
                      {stats.active}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Pending invites
                    </Text>
                    <Text as="p" variant="headingLg" fontWeight="bold">
                      {stats.pending}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Departments
                    </Text>
                    <Text as="p" variant="headingLg" fontWeight="bold">
                      {stats.departments}
                    </Text>
                  </Box>
                </InlineStack>
              </BlockStack>
            </Card>
          )}
        </BlockStack>
      </Page>
    </>
  );
}