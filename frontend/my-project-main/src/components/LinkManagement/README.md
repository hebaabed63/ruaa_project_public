# Link Management Components

This directory contains unified components for managing invitation links across the Admin and Supervisor dashboards.

## Components

### UnifiedLinkManagement.jsx

A reusable component that provides consistent UI and functionality for managing invitation links and pending requests.

#### Features:
- **Link Listing**: Displays all invitation links in a consistent table format
- **Create/Edit Links**: Modal forms for creating and updating links
- **Link Actions**: Copy, edit, and delete functionality
- **Pending Requests**: Tab for managing pending user registrations
- **Approve/Reject**: Actions for handling pending requests

#### Props:
- `links`: Array of link objects to display
- `pendingRequests`: Array of pending user requests
- `loading`: Boolean indicating if data is loading
- `linkType`: String ('supervisor' or 'principal') to determine link type
- `onCreateLink`: Function to handle link creation
- `onUpdateLink`: Function to handle link updates
- `onDeleteLink`: Function to handle link deletion
- `onApproveRequest`: Function to handle request approval
- `onRejectRequest`: Function to handle request rejection
- `showPendingTab`: Boolean to show/hide pending requests tab
- `entityName`: String for supervisor entity name
- `schoolName`: String for principal school name
- `createLinkLabel`: String for create link button label
- `pendingRequestsLabel`: String for pending requests tab label
- `noLinksMessage`: String for empty links message
- `noPendingRequestsMessage`: String for empty pending requests message

## Usage

### Admin Dashboard - Supervisor Links
```jsx
<UnifiedLinkManagement
  links={supervisorLinks}
  loading={loading}
  linkType="supervisor"
  entityName="المؤسسة/المديرية"
  createLinkLabel="رابط دعوة مشرف جديد"
  pendingRequestsLabel="طلبات تسجيل مشرفين جديدة"
  noLinksMessage="لا توجد روابط دعوة للمشرفين"
  noPendingRequestsMessage="لا توجد طلبات معلقة لتسجيل مشرفين"
  onCreateLink={handleCreateSupervisorLink}
  onUpdateLink={handleUpdateSupervisorLink}
  onDeleteLink={handleDeleteSupervisorLink}
  onApproveRequest={() => {}}
  onRejectRequest={() => {}}
  showPendingTab={false}
/>
```

### Admin Dashboard - Principal Links
```jsx
<UnifiedLinkManagement
  links={principalLinks}
  loading={loading}
  linkType="principal"
  schoolName="المدرسة"
  createLinkLabel="رابط دعوة مدير مدرسة جديد"
  pendingRequestsLabel="طلبات تسجيل مدراء جديدة"
  noLinksMessage="لا توجد روابط دعوة لمدراء المدارس"
  noPendingRequestsMessage="لا توجد طلبات معلقة لتسجيل مدراء"
  onCreateLink={handleCreatePrincipalLink}
  onUpdateLink={handleUpdatePrincipalLink}
  onDeleteLink={handleDeletePrincipalLink}
  onApproveRequest={() => {}}
  onRejectRequest={() => {}}
  showPendingTab={false}
/>
```

### Supervisor Dashboard - Principal Links
```jsx
<UnifiedLinkManagement
  links={principalLinks}
  pendingRequests={pendingPrincipals}
  loading={loading}
  linkType="principal"
  schoolName="المدرسة"
  createLinkLabel="رابط دعوة مدير مدرسة جديد"
  pendingRequestsLabel="طلبات تسجيل مدراء جديدة"
  noLinksMessage="لا توجد روابط دعوة لمدراء المدارس"
  noPendingRequestsMessage="لا توجد طلبات معلقة لتسجيل مدراء"
  onCreateLink={handleCreatePrincipalLink}
  onUpdateLink={handleUpdatePrincipalLink}
  onDeleteLink={handleDeletePrincipalLink}
  onApproveRequest={handleApprovePrincipal}
  onRejectRequest={handleRejectPrincipal}
  showPendingTab={true}
/>
```