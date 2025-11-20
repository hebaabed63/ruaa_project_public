# Email Verification Process

This document explains how the email verification process works in the Ruaa project.

## How It Works

1. When a user registers through the normal registration process (not Google OAuth), a verification email is sent to their email address.
2. The email contains a verification link with a unique token.
3. When the user clicks the link, they are directed to the `/verify-email/{token}` route.
4. The system verifies the token and redirects the user to the email verification page (`/email-verification`) with appropriate parameters.
5. The email verification page displays the verification status to the user.
6. After successful verification, the user is automatically redirected to the homepage after 5 seconds.

## Key Components

### 1. Email Verification Routes

- `/verify-email/{token}` - For regular users
- `/verify-supervisor-email/{token}` - For supervisors and principals

### 2. Email Verification Page

- URL: `/email-verification`
- Shows loading state while verifying
- Displays success or error messages based on verification result
- Automatically redirects to homepage after successful verification

### 3. Backend Logic

Located in `app/Http/Controllers/AuthController.php`:
- `verifyEmailAndRedirect()` - Handles regular user email verification
- `verifySupervisorEmailAndRedirect()` - Handles supervisor/principal email verification

## User Experience

### Loading State
When users click the verification link, they see:
- A loading spinner
- "جاري التحقق من البريد الإلكتروني" (Verifying email)
- "يرجى الانتظار بينما نتحقق من صحة رابط التفعيل الخاص بك..." (Please wait while we verify your activation link)

### Success State
When verification is successful:
- Green checkmark icon
- "تم تفعيل حسابك بنجاح، يمكنك تسجيل الدخول الآن." (Your account has been successfully activated, you can now log in.)
- Automatic redirect to homepage after 5 seconds

### Error State
When verification fails:
- Red error icon
- Appropriate error message (e.g., "رابط التحقق غير صحيح أو منتهي الصلاحية" - Verification link is incorrect or expired)

## Testing

You can test the email verification page with these URLs:

1. Basic page: `/email-verification`
2. Success state: `/email-verification?email_verification=success&message=تم التحقق بنجاح`
3. Error state: `/email-verification?email_verification=failed&message=الرابط غير صحيح`

Run the test script: `php test_email_verification_page.php`