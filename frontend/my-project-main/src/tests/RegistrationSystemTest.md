# Dynamic Registration System Test Plan

## Overview
The dynamic registration system supports multiple user types through a single page with different configurations and token-based invitations.

## Test Scenarios

### 1. General Registration (No Token)
**URL**: `/register`
**Expected Behavior**:
- Shows basic registration form
- Fields: Full Name, Email, Password, Confirm Password
- Title: "إنشاء حساب"
- Icon: FaUser
- Includes Google Sign-In option

**Test Steps**:
1. Navigate to `/register`
2. Verify form fields and UI elements
3. Test form validation
4. Test successful registration

### 2. Supervisor Registration (Token-Based)
**URL**: `/register/token123?type=supervisor`
**Expected Behavior**:
- Shows supervisor-specific registration form
- Fields: Full Name, Email, Phone, City, Password, Confirm Password
- Title: "تسجيل مشرف جديد"
- Icon: FaUserTie
- Token validation message displayed
- No Google Sign-In option

**Test Steps**:
1. Navigate to URL with valid token
2. Verify supervisor-specific fields appear
3. Test token validation
4. Test form submission with supervisor data

### 3. School Manager Registration (Token-Based)
**URL**: `/register/token456?type=school_manager`
**Expected Behavior**:
- Shows school manager registration form
- Fields: Full Name, Email, Phone, School Name, School Type, City, Password, Confirm Password
- Title: "تسجيل مدير مدرسة"
- Icon: FaSchool
- School type dropdown with options

**Test Steps**:
1. Navigate to URL with token
2. Verify school-specific fields (school name, type)
3. Test dropdown functionality
4. Test form validation and submission

### 4. Parent Registration (Token-Based)
**URL**: `/register/token789?type=parent`
**Expected Behavior**:
- Shows parent registration form
- Fields: Full Name, Email, Phone, National ID, City, Password, Confirm Password
- Title: "تسجيل ولي أمر"
- Icon: FaUsers

### 5. Student Registration (Token-Based)
**URL**: `/register/token012?type=student`
**Expected Behavior**:
- Shows student registration form
- Fields: Full Name, Email, Phone, Student ID, Grade, Password, Confirm Password
- Title: "تسجيل طالب"
- Icon: FaChild
- Grade dropdown with educational levels

## Error Handling Tests

### 1. Invalid Token
**URL**: `/register/invalid_token?type=supervisor`
**Expected Behavior**:
- Error message: "رابط التسجيل منتهي الصلاحية أو غير صالح"
- Link to return to login page

### 2. Expired Token
**URL**: `/register/expired_token?type=school_manager`
**Expected Behavior**:
- Error message about expired token
- Graceful fallback to login

### 3. Invalid User Type
**URL**: `/register/token123?type=invalid_type`
**Expected Behavior**:
- Falls back to general registration
- No token validation performed

## Form Validation Tests

### Required Field Validation
- All user types: Full Name, Email, Password, Confirm Password
- Supervisor: Phone, City
- School Manager: Phone, School Name, School Type, City
- Parent: Phone, National ID, City
- Student: Phone, Student ID, Grade

### Email Validation
- Valid email format required
- Unique email validation (backend)

### Password Validation
- Minimum length requirements
- Password confirmation match

### Submit Button State
- Disabled when required fields empty
- Disabled during submission
- Shows loading spinner

## API Integration Tests

### Registration Submission
- Correct data format sent to backend
- User type included in submission
- Token data attached when applicable
- Proper error handling for API failures

### Token Validation
- Token existence check
- Token expiration validation
- Role authorization check

## UI/UX Tests

### Responsive Design
- Mobile compatibility
- Tablet compatibility
- Desktop layout

### RTL Support
- Arabic text rendering
- Right-to-left layout
- Icon positioning

### Accessibility
- Proper form labels
- Keyboard navigation
- Screen reader compatibility

## Success Flow Tests

### Successful Registration
- Success message display
- Automatic redirect to login
- 2.5 second delay before redirect

### Different Success Messages
- General: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول"
- Role-specific: "تم تسجيل [role] بنجاح! يمكنك الآن تسجيل الدخول"