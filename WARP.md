# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack educational platform built with **Laravel 10** (backend) and **React 19** (frontend). The system provides role-based authentication and management for educational institutions in the Gaza Strip, supporting admins, supervisors, school managers, and parents.

## Development Commands

### Backend (Laravel)

```bash
# Start development server
php artisan serve --port=8000

# Database operations
php artisan migrate                    # Run migrations
php artisan migrate:fresh              # Drop all tables and re-migrate
php artisan db:seed --class=SchoolsSeeder  # Seed schools data

# Cache management
php artisan config:cache               # Cache configuration
php artisan config:clear               # Clear config cache
php artisan cache:clear                # Clear application cache

# Testing
vendor/bin/phpunit                     # Run all tests
vendor/bin/phpunit tests/Feature       # Run feature tests
vendor/bin/phpunit tests/Unit          # Run unit tests

# Code quality
vendor/bin/pint                        # Laravel Pint code formatter
```

### Frontend (React)

```bash
# Navigate to frontend directory first
cd frontend/my-project-main

# Development
npm start                              # Start dev server (http://localhost:3000)
npm run build                          # Build for production

# Testing
npm test                               # Run tests in watch mode
npm test -- --coverage                 # Run with coverage
npm test -- --watchAll=false           # Run all tests once
npm test -- --testNamePattern="Login"  # Run specific test

# Code quality
npm run lint                           # Run ESLint
npm run lint:fix                       # Fix ESLint issues
npm run test:coverage                  # Run tests with coverage report

# Development with mock server
npm run mock-server                    # Start JSON server on port 3001
npm run dev                            # Run both mock server and React app
```

### Full Stack Development

```bash
# Terminal 1 (Backend)
php artisan serve --port=8000

# Terminal 2 (Frontend)
cd frontend/my-project-main
npm start
```

## Architecture Overview

### Backend Architecture (Laravel)

**Tech Stack**: Laravel 10.x, PHP 8.1+, MySQL, Laravel Sanctum (API authentication), Laravel Socialite (Google OAuth)

**Key Models & Database**:
- `User` (primary key: `user_id`) - Supports 4 roles: admin (0), supervisor (1), school_manager (2), parent (3)
- `School` (primary key: `school_id`) - Educational institutions with geolocation, ratings, features
- `Evaluation`, `Criterion`, `EvaluationCriterion` - School evaluation system
- `Conversation`, `Message` - Messaging system between users
- `MediaGallery` - Media management for schools

**Authentication System**:
- **Sanctum tokens**: Used for API authentication (`auth:sanctum` middleware)
- **Google OAuth**: Two flows supported:
  1. Redirect flow (`/api/auth/google` → `/api/auth/google/callback`)
  2. Client-side flow (`/api/auth/google/login` with credential token)
- **Password Reset**: Custom flow without email - goes directly from forgot-password to reset-password page
- **Role mapping**: Integer roles (0-3) mapped to string identifiers in API responses

**API Structure**:
- All API routes prefixed with `/api`
- Public routes: School listings, search, statistics
- Protected routes: User operations, logout (require `auth:sanctum`)
- CORS configured for `http://localhost:3000` and `http://localhost:8000`

**Controllers**:
- `AuthController`: Handles login, register, logout, password reset, Google OAuth
- `Api/SchoolController`: Schools CRUD, filtering, search, statistics
- `SchoolController`: Web-based school management

### Frontend Architecture (React)

**Tech Stack**: React 19.1, React Router 7.8, Formik + Yup validation, Tailwind CSS, Material-UI, Axios, TanStack Query

**Role-Based Dashboard System**:
The application implements strict role-based routing:
- `/dashboard/admin` - Admin interface (role 0)
- `/dashboard/parents` - Parent portal (role 3)
- `/dashboard/supervisor` - Supervisor interface (role 1)
- `/dashboard/school-manager` - School manager dashboard (role 2)

Each dashboard is protected by `PrivateRoute` component that checks authentication AND role permissions.

**Authentication Architecture**:
- **Context**: `AuthContext` provides global auth state with `useAuth()` hook
- **Persistence**: localStorage stores `token` and `role`
- **Loading State**: App waits for auth initialization before rendering
- **Service Layer**: `authService.js` handles all API calls with axios instance
- **Protected Routes**: `PrivateRoute` wrapper checks auth + role before access

**Key Frontend Patterns**:

1. **Form Handling**: All authentication forms use Formik + Yup
   - Validation schemas centralized in `src/utils/validationForms.jsx`
   - Arabic validation messages
   - Password confirmation, email format, min length checks

2. **API Integration**:
   - Base axios instance in `src/services/axios.js`
   - Configured with `baseURL: http://localhost:8000/api`
   - `withCredentials: true` for CORS
   - Automatic token injection via interceptors

3. **Error Handling**:
   - SweetAlert2 for user-facing errors
   - React Error Boundary for component errors
   - Axios interceptors for API error handling

4. **Styling System**:
   - Tailwind CSS with custom theme (defined in `tailwind.config.js`)
   - Bilingual fonts: Cairo (Arabic), Inter (English)
   - RTL support throughout
   - Material-UI components with custom theme

**Directory Structure**:
```
src/
├── pages/
│   ├── auth/           # Login, Registration, ForgotPassword, ResetPassword
│   ├── dashboard/      # Role-specific dashboards (admin, parents, supervisor, school-manager)
│   ├── error/          # 404, 500 error pages
│   └── public/         # Landing page
├── components/
│   ├── auth/           # GoogleSignInButton, AuthLayout
│   ├── common/         # Shared dashboard components (charts, cards, tables)
│   ├── inputs/         # Form input components with validation
│   └── layout/         # Layout wrappers (MainLayout, DashboardLayout)
├── contexts/           # AuthContext, FormContext, UserContext
├── services/           # API service layer (authService, axios config)
├── utils/              # validationForms.jsx (centralized Yup schemas)
├── constants/          # Theme colors, typography
└── firebase/           # Firebase config (placeholder, not fully integrated)
```

### Integration Points

**Authentication Flow**:
1. Frontend submits credentials to `POST /api/auth/login`
2. Backend validates and returns `{ success, data: { user, token, role } }`
3. Frontend stores token in localStorage and user in AuthContext
4. Frontend redirects to role-specific dashboard
5. Subsequent API calls include token in Authorization header

**Google OAuth Flow**:
1. User clicks Google sign-in button
2. Either redirects to Google (web flow) or uses popup (client-side flow)
3. Backend receives Google credential/code
4. Backend creates/updates user with `google_id` and `avatar`
5. Backend returns Sanctum token + user data
6. Frontend handles same as normal login

**Schools API Integration**:
- Frontend can fetch schools from `/api/schools` (public endpoint)
- Supports filtering: region, city, type, level, rating
- Pagination: `?page=1&limit=10`
- Search: `/api/schools/search?q=keyword`
- Statistics: `/api/statistics/general`

## Important Development Notes

### Backend

- **Primary Keys**: Models use custom primary keys (`user_id`, `school_id`), not `id`
- **Role System**: Integer-based (0-3), mapped to strings in API responses
- **Google OAuth Setup**: Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- **CORS**: Configure `SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URL` in `.env`
- **Password Reset**: Simplified flow without email - token returned directly in API response (change for production)
- **Testing**: Uses PHPUnit with feature and unit test suites

### Frontend

- **Arabic Primary Language**: RTL layout, Arabic validation messages, Arabic content expected
- **Role-Based Access**: Always check user role matches allowed roles array before rendering protected content
- **Form Validation**: Modify schemas in `src/utils/validationForms.jsx`, not individual components
- **Demo Routes**: `/admin-demo`, `/parents-demo`, etc. exist for testing - remove in production
- **Firebase**: Configured but using placeholder values - needs real credentials for production
- **Google OAuth**: Needs `REACT_APP_GOOGLE_CLIENT_ID` in frontend `.env`
- **API Base URL**: Configure `REACT_APP_API_URL` in `.env` (defaults to `http://127.0.0.1:8000`)

### Data Models

**User Roles**:
- 0 = admin
- 1 = supervisor  
- 2 = school_manager
- 3 = parent (default for new registrations and Google OAuth)

**School Fields**:
- Geolocation: `latitude`, `longitude`
- Ratings: `rating` (decimal), `reviews_count`
- Features: `features` (JSON array), `achievements`, `certifications`
- Status: `is_active`, `is_featured`
- Contact: `phone`, `email`, `website`

### Configuration Files

**Backend `.env` must include**:
```env
DB_CONNECTION=mysql
DB_DATABASE=ruaa_project
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

**Frontend `.env` must include**:
```env
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
```

## Testing Strategy

### Backend Testing
- Feature tests for API endpoints in `tests/Feature/`
- Unit tests for models/services in `tests/Unit/`
- Run specific test: `vendor/bin/phpunit --filter=TestMethodName`

### Frontend Testing
- React Testing Library for component tests
- User event testing for interactions
- Coverage reports: `npm test -- --coverage --watchAll=false`
- Test file pattern: `*.test.js`

## Common Workflows

### Adding a New Role-Based Feature
1. Check user role in AuthContext: `const { user } = useAuth();`
2. Verify role matches requirement: `if (user.role === 0) { /* admin only */ }`
3. Update backend to include role check if needed
4. Add protected route with role validation

### Adding New API Endpoint
1. Add route in `routes/api.php`
2. Create/update controller method
3. Add validation if needed
4. Update frontend service (`authService.js` or new service file)
5. Test with Postman or curl before frontend integration

### Debugging Authentication Issues
1. Check backend: `php artisan route:list | grep auth`
2. Verify CORS: Check `config/cors.php` and `.env` SANCTUM settings
3. Check frontend axios config: `src/services/axios.js`
4. Inspect localStorage: Should have `token` and `role`
5. Check browser network tab for API responses

### Working with Google OAuth
1. Ensure Google Console has correct redirect URIs
2. Backend needs both client ID and secret
3. Frontend only needs client ID
4. Test both redirect flow and client-side flow
5. Check `google_id` and `avatar` fields are saved in database
