<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحقق من بريدك الإلكتروني - منصة رؤى</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cairo', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* Header Styles */
        header {
            background-color: #252258;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .logo {
            color: white;
            font-size: 1.8rem;
            font-weight: 700;
            text-decoration: none;
        }
        
        /* Main Content Styles */
        main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .content-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 3rem;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        
        .icon {
            font-size: 4rem;
            color: #252258;
            margin-bottom: 1.5rem;
        }
        
        h1 {
            color: #252258;
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }
        
        p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            color: #666;
        }
        
        .email-highlight {
            background-color: #e3f2fd;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
            color: #1976d2;
            display: inline-block;
            margin: 1rem 0;
        }
        
        .resend-link {
            color: #252258;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s;
        }
        
        .resend-link:hover {
            border-bottom-color: #252258;
        }
        
        /* Footer Styles */
        footer {
            background-color: #252258;
            color: white;
            text-align: center;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .copyright {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .content-card {
                padding: 2rem 1.5rem;
            }
            
            h1 {
                font-size: 1.5rem;
            }
            
            p {
                font-size: 1rem;
            }
            
            .header-content,
            .footer-content {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header>
            <div class="header-content">
                <a href="/" class="logo">منصة رؤى</a>
                <nav>
                    <!-- Navigation can be added here if needed -->
                </nav>
            </div>
        </header>

        <!-- Main Content -->
        <main>
            <div class="content-card">
                <div class="icon">✉️</div>
                <h1>تحقق من بريدك الإلكتروني</h1>
                <p>لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك والنقر على الرابط المرفق لإكمال عملية التسجيل.</p>
                
                <div class="email-highlight" id="user-email">
                    <!-- Email will be dynamically inserted here -->
                </div>
                
                <p>إذا لم تستلم الرسالة خلال بضع دقائق، يرجى التحقق من مجلد البريد العشوائي أو <a href="#" class="resend-link">إعادة إرسال الرسالة</a>.</p>
            </div>
        </main>

        <!-- Footer -->
        <footer>
            <div class="footer-content">
                <p class="copyright">© 2025 منصة رؤى. جميع الحقوق محفوظة.</p>
            </div>
        </footer>
    </div>

    <script>
        // Get email from URL parameter and display it
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');
            
            if (email) {
                document.getElementById('user-email').textContent = email;
            } else {
                // If no email parameter, show a generic message
                document.getElementById('user-email').textContent = 'بريدك الإلكتروني';
            }
        });
    </script>
</body>
</html>