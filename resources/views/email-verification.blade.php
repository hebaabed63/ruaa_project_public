<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>جاري التحقق من البريد الإلكتروني - منصة رؤى</title>
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
            transition: all 0.3s ease;
        }
        
        .icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }
        
        .loading .icon {
            color: #252258;
        }
        
        .success .icon {
            color: #4caf50;
        }
        
        .error .icon {
            color: #f44336;
        }
        
        h1 {
            margin-bottom: 1.5rem;
            font-size: 2rem;
        }
        
        .loading h1 {
            color: #252258;
        }
        
        .success h1 {
            color: #4caf50;
        }
        
        .error h1 {
            color: #f44336;
        }
        
        p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            color: #666;
        }
        
        .message {
            background-color: #e3f2fd;
            padding: 1rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            display: none;
        }
        
        .success .message {
            background-color: #e8f5e9;
            color: #2e7d32;
            display: block;
        }
        
        .error .message {
            background-color: #ffebee;
            color: #c62828;
            display: block;
        }
        
        .redirect-message {
            font-weight: 600;
            color: #252258;
            margin-top: 1rem;
            display: none;
        }
        
        .success .redirect-message {
            display: block;
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #252258;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
            display: none;
        }
        
        .loading .spinner {
            display: block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
            <div class="content-card loading" id="verification-card">
                <div class="spinner"></div>
                <div class="icon">📧</div>
                <h1>جاري التحقق من البريد الإلكتروني</h1>
                <p>يرجى الانتظار بينما نتحقق من صحة رابط التفعيل الخاص بك...</p>
                
                <div class="message" id="message-content">
                    <!-- Message will be dynamically inserted here -->
                </div>
                
                <p class="redirect-message">سيتم تحويلك تلقائياً إلى الصفحة الرئيسية خلال ثوانٍ...</p>
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
        // Get verification status from URL parameters
        document.addEventListener('DOMContentLoaded', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const verificationStatus = urlParams.get('email_verification');
            const message = urlParams.get('message');
            
            const card = document.getElementById('verification-card');
            const messageContent = document.getElementById('message-content');
            
            if (verificationStatus && message) {
                // Remove loading state
                card.classList.remove('loading');
                
                if (verificationStatus === 'success') {
                    // Add success state
                    card.classList.add('success');
                    messageContent.textContent = message;
                    
                    // Redirect to dashboard after 5 seconds
                    setTimeout(function() {
                        window.location.href = '/dashboard';
                    }, 5000);
                } else {
                    // Add error state
                    card.classList.add('error');
                    messageContent.textContent = message;
                }
            } else {
                // If no parameters, show loading state for a few seconds then show error
                setTimeout(function() {
                    card.classList.remove('loading');
                    card.classList.add('error');
                    messageContent.textContent = 'رابط التحقق غير صحيح أو منتهي الصلاحية';
                    messageContent.style.display = 'block';
                }, 3000);
            }
        });
    </script>
</body>
</html>