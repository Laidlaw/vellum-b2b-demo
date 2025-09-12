import { useState } from "react";
import {
  Page,
  Card,
  DataTable,
  Text,
  Badge,
  Button,
  Tabs,
  Layout,
  TextField,
  Select,
  Filters,
  ChoiceList
} from "@shopify/polaris";

export default function AdminInvoices() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);

  const invoices = [
    {
      id: "INV-2024-001",
      date: "Jul 24, 2024",
      dueDate: "Aug 23, 2024",
      status: "Outstanding",
      amount: "$2,796.90",
      orderRef: "#1004"
    },
    {
      id: "INV-2024-002",
      date: "Jul 20, 2024",
      dueDate: "Aug 19, 2024",
      status: "Paid",
      amount: "$1,245.00",
      orderRef: "#1003"
    },
    {
      id: "INV-2024-003",
      date: "Jul 15, 2024",
      dueDate: "Aug 14, 2024",
      status: "Overdue",
      amount: "$599.99",
      orderRef: "#1002"
    }
  ];

  const workingCapitalAdvances = [
    {
      id: "WCA-2024-001",
      date: "Aug 1, 2024",
      amount: "$10,000.00",
      status: "Active",
      paymentDue: "Nov 1, 2024",
      interestRate: "2.5%"
    },
    {
      id: "WCA-2024-002",
      date: "Jun 1, 2024",
      amount: "$15,000.00",
      status: "Repaid",
      paymentDue: "Sep 1, 2024",
      interestRate: "2.8%"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Outstanding": { status: "attention" },
      "Paid": { status: "success" },
      "Overdue": { status: "critical" },
      "Active": { status: "info" },
      "Repaid": { status: "success" }
    };
    
    return (
      <Badge status={statusConfig[status]?.status || "info"}>
        {status}
      </Badge>
    );
  };

  const invoiceRows = invoices.map((invoice) => [
    invoice.id,
    invoice.date,
    invoice.dueDate,
    getStatusBadge(invoice.status),
    invoice.amount,
    invoice.orderRef,
    <Button size="micro">Download PDF</Button>
  ]);

  const wcaRows = workingCapitalAdvances.map((wca) => [
    wca.id,
    wca.date,
    wca.amount,
    getStatusBadge(wca.status),
    wca.paymentDue,
    wca.interestRate,
    <Button size="micro" variant={wca.status === "Active" ? "primary" : "secondary"}>
      {wca.status === "Active" ? "Make Payment" : "View Details"}
    </Button>
  ]);

  const invoiceHeadings = [
    "Invoice ID",
    "Date",
    "Due Date", 
    "Status",
    "Amount",
    "Order Ref",
    "Actions"
  ];

  const wcaHeadings = [
    "Advance ID",
    "Date",
    "Amount",
    "Status",
    "Payment Due",
    "Interest Rate",
    "Actions"
  ];

  const tabs = [
    {
      id: "invoices",
      content: "Invoice List",
      panelID: "invoices-panel"
    },
    {
      id: "working-capital",
      content: "Working Capital Advanced",
      panelID: "working-capital-panel"
    }
  ];

  const handleFiltersQueryChange = (value) => setQueryValue(value);
  const handleStatusFilterChange = (value) => setStatusFilter(value);
  const handleFiltersQueryClear = () => setQueryValue("");
  const handleFiltersClearAll = () => {
    setQueryValue("");
    setStatusFilter([]);
  };

  const filters = [
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="Invoice status"
          titleHidden
          choices={selectedTab === 0 ? [
            { label: "Outstanding", value: "outstanding" },
            { label: "Paid", value: "paid" },
            { label: "Overdue", value: "overdue" }
          ] : [
            { label: "Active", value: "active" },
            { label: "Repaid", value: "repaid" }
          ]}
          selected={statusFilter}
          onChange={handleStatusFilterChange}
          allowMultiple
        />
      ),
      shortcut: true
    }
  ];

  const appliedFilters = [];
  if (statusFilter.length > 0) {
    appliedFilters.push({
      key: "status",
      label: `Status: ${statusFilter.join(", ")}`,
      onRemove: () => setStatusFilter([])
    });
  }

  return (
    <Page
      title="Invoices"
      subtitle="Manage invoices and working capital advances"
      primaryAction={{
        content: "Request Working Capital",
        variant: "primary"
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
              fitted
            >
              <div style={{ padding: "16px" }}>
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleFiltersQueryClear}
                  onClearAll={handleFiltersClearAll}
                />
              </div>

              {selectedTab === 0 && (
                <DataTable
                  columnContentTypes={[
                    "text",
                    "text",
                    "text", 
                    "text",
                    "text",
                    "text",
                    "text"
                  ]}
                  headings={invoiceHeadings}
                  rows={invoiceRows}
                  sortable={[true, true, true, false, true, false, false]}
                  defaultSortDirection="descending"
                  initialSortColumnIndex={1}
                />
              )}

              {selectedTab === 1 && (
                <>
                  <div style={{ 
                    padding: "16px", 
                    borderBottom: "1px solid #e1e3e5",
                    background: "#f8f9fa"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <Text variant="headingMd" fontWeight="semibold">Credit Summary</Text>
                        <Text variant="bodySm" tone="subdued">Your working capital overview</Text>
                      </div>
                    </div>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                      gap: "16px" 
                    }}>
                      <div style={{ 
                        padding: "16px", 
                        background: "white", 
                        borderRadius: "6px",
                        border: "1px solid #e1e3e5"
                      }}>
                        <Text variant="bodyMd" fontWeight="semibold">Available Credit</Text>
                        <Text variant="headingLg" style={{ color: "#00a859", marginTop: "4px" }}>
                          $25,000.00
                        </Text>
                      </div>
                      <div style={{ 
                        padding: "16px", 
                        background: "white", 
                        borderRadius: "6px",
                        border: "1px solid #e1e3e5"
                      }}>
                        <Text variant="bodyMd" fontWeight="semibold">Outstanding Balance</Text>
                        <Text variant="headingLg" style={{ color: "#d72c0d", marginTop: "4px" }}>
                          $10,000.00
                        </Text>
                      </div>
                      <div style={{ 
                        padding: "16px", 
                        background: "white", 
                        borderRadius: "6px",
                        border: "1px solid #e1e3e5"
                      }}>
                        <Text variant="bodyMd" fontWeight="semibold">Credit Limit</Text>
                        <Text variant="headingLg" style={{ marginTop: "4px" }}>
                          $35,000.00
                        </Text>
                      </div>
                    </div>
                  </div>
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "text",
                      "text", 
                      "text",
                      "text",
                      "text"
                    ]}
                    headings={wcaHeadings}
                    rows={wcaRows}
                    sortable={[true, true, true, false, true, false, false]}
                    defaultSortDirection="descending"
                    initialSortColumnIndex={1}
                  />
                </>
              )}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}