# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Commands
- `npm start` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm test -- --coverage` - Run tests with coverage report
- `npm test -- --watchAll=false` - Run all tests once

### Development Workflow
- `npm test -- --testNamePattern="Login"` - Run specific test suites
- `npm run build && serve -s build` - Test production build locally

## Project Architecture

This is a React-based educational platform with role-based authentication supporting multiple user types (admin, parent, supervisor, school-manager). The application is built with Create React App and uses modern React patterns.

### Key Architecture Patterns

**Role-Based Dashboard System**: The application routes users to different dashboards based on their authenticated role:
- `/dashboard/admin` - Administrative interface with user management, analytics, and system settings
- `/dashboard/parents` - Parent portal for student monitoring
- `/dashboard/supervisor` - Educational supervisor interface 
- `/dashboard/school-manager` - School management dashboard

**Authentication Flow**: Uses React Context (`AuthContext`) for state management with localStorage persistence. Authentication tokens and user roles are stored locally and checked on app initialization.

**Protected Routes**: Implements `PrivateRoute` component that wraps protected dashboard routes, checking both authentication status and role permissions before allowing access.

### Technology Stack

**Frontend Framework**: React 19.1.0 with React Router 7.8.1 for routing
**Styling**: Tailwind CSS with custom theme colors and bilingual font support (Inter for English, Cairo for Arabic)
**Form Management**: Formik with Yup validation schemas for all authentication forms
**Authentication**: Firebase integration (configured but using demo tokens currently)
**UI Components**: Material-UI with custom styling, React Icons, Heroicons
**Charts**: Recharts for dashboard analytics
**Notifications**: SweetAlert2 with react-hot-toast for user feedback

### Directory Structure

**Pages Structure**:
- `src/pages/auth/` - Authentication pages (Login, Registration, Password Reset)
- `src/pages/dashboard/{role}/` - Role-specific dashboard components
- `src/pages/error/` - Error pages (404, 500)
- `src/pages/public/` - Public pages (Landing page)

**Component Organization**:
- `src/components/layout/` - Layout components (AuthLayout, DashboardLayout, MainLayout)
- `src/components/inputs/` - Form input components with validation
- `src/components/common/` - Shared dashboard components (charts, tables, etc.)

**Configuration & Utilities**:
- `src/contexts/` - React Context providers (AuthContext, FormContext, UserContext)  
- `src/utils/validationForms.jsx` - Centralized Yup validation schemas
- `src/firebase/firebaseConfig.jsx` - Firebase configuration
- `src/constants/` - Theme colors and typography constants

### Bilingual Support

The application supports Arabic as the primary language with RTL layout considerations. Validation messages, UI text, and form labels are in Arabic. The Tailwind config includes Arabic font family (Cairo) alongside English (Inter).

### Testing Strategy

Uses React Testing Library with Jest. Test files follow the `*.test.js` pattern. The setup includes:
- `@testing-library/react` for component testing
- `@testing-library/user-event` for interaction testing  
- `@testing-library/jest-dom` for custom matchers

### State Management

**Authentication**: React Context pattern for global auth state
**Form State**: Formik for complex form state and validation
**Local State**: useState for component-level state management
**Persistence**: localStorage for auth token and user role persistence

### Demo/Development Features

The codebase includes demo routes for testing dashboards without authentication:
- `/admin-demo`, `/parents-demo`, `/supervisor-demo`, `/school-manager-demo`

These should be removed in production builds.

### Firebase Integration

Firebase is configured for authentication but currently using demo tokens. The configuration in `src/firebase/firebaseConfig.jsx` uses placeholder values that need to be replaced with actual Firebase project credentials.

## Important Development Notes

- The application expects Arabic content and RTL layout in many components
- Role-based routing is strictly enforced - ensure user roles match the allowed roles array
- Form validation is centralized in `src/utils/validationForms.jsx` - modify schemas there for validation changes
- The authentication flow currently uses demo tokens - integrate with actual Firebase auth for production
- CSS classes use Tailwind with custom theme colors defined in tailwind.config.js
- Chart components use Recharts - data should follow the expected format for proper rendering
