<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تمت الموافقة على حسابك في منصة رؤى</title>
</head>
<body style="font-family: 'Cairo', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #252258; margin: 0;">منصة رؤى</h1>
        </div>
        
        <div style="padding: 20px 0;">
            <h2 style="color: #333333;">مرحباً {{ $user->name }}</h2>
            
            <p style="color: #666666; line-height: 1.6;">
                نود إبلاغك أنه تم الموافقة على حسابك في منصة رؤى.
            </p>
            
            <p style="color: #666666; line-height: 1.6;">
                يمكنك الآن تسجيل الدخول من هنا:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/login') }}" 
                   style="background-color: #252258; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    تسجيل الدخول
                </a>
            </div>
            
            <p style="color: #666666; line-height: 1.6;">
                إذا كانت لديك أي استفسارات، لا تتردد في التواصل معنا.
            </p>
        </div>
        
        <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
            <p style="color: #999999; font-size: 12px;">
                &copy; 2025 منصة رؤى. جميع الحقوق محفوظة.
            </p>
        </div>
    </div>
</body>
</html>