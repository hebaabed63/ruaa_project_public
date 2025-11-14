import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHome, FaShieldAlt, FaUserLock } from 'react-icons/fa';
import logo from '../../assets/images/LOGO1.svg';
import usePageTitle from '../../hooks/usePageTitle';

export default function PrivacyPolicy() {
  const { source } = useParams();
  const navigate = useNavigate();
  
  // Set page title
  usePageTitle("سياسة الخصوصية");
  
  // Function to handle going back to the appropriate registration page
  const handleGoBack = () => {
    // Use browser history to go back to previous page
    navigate(-1);
  };
  
  // Determine return text based on source
  const getReturnText = () => {
    switch (source) {
      case 'supervisor':
        return 'العودة لتسجيل المشرفين';
      case 'principal':
        return 'العودة لتسجيل المدراء';
      case 'regular':
      default:
        return 'العودة للتسجيل';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="شعار منصة رؤى" className="h-10 w-auto" />
              {/* Removed the "Privacy Policy" title from header */}
            </div>
            <button 
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              <FaHome className="ml-2" />
              <span>{getReturnText()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* Title - centered at the top of the content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">سياسة الخصوصية</h1>
          </div>
          
          {/* مقدمة */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-blue-600 text-2xl ml-3" />
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                مقدمة
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              نحن في منصة "رؤى" نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. 
              هذه السياسة توضح كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام منصتنا.
            </p>
            <p className="text-gray-700 leading-relaxed">
              باستخدام خدماتنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة.
            </p>
          </section>

          {/* المعلومات التي نجمعها */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              المعلومات التي نجمعها
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. المعلومات الشخصية</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>الاسم الكامل</li>
                  <li>عنوان البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>المعلومات التعليمية (المدرسة، الصف، التخصص)</li>
                  <li>صورة الملف الشخصي (اختيارية)</li>
                  <li>تاريخ الميلاد (عند الحاجة)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. معلومات الاستخدام</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>عنوان IP الخاص بك</li>
                  <li>نوع المتصفح ونظام التشغيل</li>
                  <li>الصفحات التي تزورها على المنصة</li>
                  <li>الوقت المستغرق في كل صفحة</li>
                  <li>مصدر الإحالة إلى موقعنا</li>
                  <li>سجل الأنشطة والتفاعلات</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. معلومات تقنية</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>ملفات تعريف الارتباط (Cookies)</li>
                  <li>البيانات المخزنة محلياً</li>
                  <li>معرفات الجهاز</li>
                  <li>بيانات الموقع الجغرافي (عند الموافقة)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* كيفية جمع المعلومات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              كيفية جمع المعلومات
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">المعلومات المقدمة مباشرة</h3>
                <p className="text-gray-700">
                  عندما تقوم بالتسجيل في المنصة، ملء النماذج، أو التواصل معنا مباشرة.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">المعلومات المجمعة تلقائياً</h3>
                <p className="text-gray-700">
                  من خلال استخدامك للمنصة، نجمع بعض المعلومات تلقائياً مثل سجل التصفح والتفاعلات.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">المعلومات من أطراف ثالثة</h3>
                <p className="text-gray-700">
                  قد نحصل على معلومات من خدمات خارجية مثل Google عند استخدام تسجيل الدخول الموحد.
                </p>
              </div>
            </div>
          </section>

          {/* استخدام المعلومات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              كيفية استخدام المعلومات
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الأغراض الأساسية</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>تقديم وتطوير خدماتنا</li>
                  <li>إنشاء وإدارة حسابك</li>
                  <li>التواصل معك حول الخدمات</li>
                  <li>تخصيص تجربة الاستخدام</li>
                  <li>إرسال الإشعارات المهمة</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الأغراض الثانوية</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>تحليل وتحسين الأداء</li>
                  <li>منع الاحتيال والانتهاكات</li>
                  <li>الامتثال للقوانين</li>
                  <li>البحث والتطوير</li>
                  <li>التسويق (بموافقتك)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* مشاركة المعلومات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              مشاركة المعلومات
            </h2>
            
            <div className="space-y-4">
              <div className="border-r-4 border-red-500 bg-red-50 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا نبيع معلوماتك الشخصية</h3>
                <p className="text-gray-700">
                  نحن لا نبيع أو نؤجر أو نتاجر في معلوماتك الشخصية لأطراف ثالثة لأغراض تجارية.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">الحالات التي قد نشارك فيها المعلومات:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li><strong>مقدمو الخدمات:</strong> شركات تساعدنا في تشغيل المنصة (الاستضافة، التحليلات)</li>
                  <li><strong>الامتثال القانوني:</strong> عند طلب السلطات المختصة وفقاً للقانون</li>
                  <li><strong>حماية الحقوق:</strong> لحماية حقوقنا وحقوق المستخدمين الآخرين</li>
                  <li><strong>الموافقة:</strong> عندما تعطي موافقة صريحة لذلك</li>
                  <li><strong>نقل الملكية:</strong> في حالة بيع أو دمج الشركة</li>
                </ul>
              </div>
            </div>
          </section>

          {/* حماية البيانات */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <FaUserLock className="text-blue-600 text-2xl ml-3" />
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                حماية البيانات
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                نتخذ إجراءات أمنية متقدمة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">الحماية التقنية</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>تشفير البيانات (SSL/TLS)</li>
                    <li>جدران الحماية المتقدمة</li>
                    <li>المراقبة الأمنية المستمرة</li>
                    <li>النسخ الاحتياطي المنتظم</li>
                    <li>اختبار الاختراق الدوري</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">الحماية الإدارية</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>تقييد الوصول للموظفين</li>
                    <li>التدريب على الأمان</li>
                    <li>سياسات الأمان الصارمة</li>
                    <li>مراجعة دورية للأنظمة</li>
                    <li>الاستجابة للحوادث</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* حقوق المستخدمين */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              حقوقك في البيانات
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">الوصول والاطلاع</h3>
                  <p className="text-gray-700 text-sm">طلب نسخة من بياناتك الشخصية</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">التصحيح والتحديث</h3>
                  <p className="text-gray-700 text-sm">تحديث أو تصحيح معلوماتك</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">الحذف</h3>
                  <p className="text-gray-700 text-sm">طلب حذف بياناتك الشخصية</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">تقييد المعالجة</h3>
                  <p className="text-gray-700 text-sm">تحديد كيفية استخدام بياناتك</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">الاعتراض</h3>
                  <p className="text-gray-700 text-sm">الاعتراض على معالجة بياناتك</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">نقل البيانات</h3>
                  <p className="text-gray-700 text-sm">الحصول على بياناتك بصيغة قابلة للنقل</p>
                </div>
              </div>
            </div>
          </section>

          {/* ملفات تعريف الارتباط */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              ملفات تعريف الارتباط (Cookies)
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">ضرورية</h3>
                  <p className="text-gray-700 text-sm">مطلوبة لعمل الموقع بشكل صحيح</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">وظيفية</h3>
                  <p className="text-gray-700 text-sm">تحسين وظائف الموقع</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">تحليلية</h3>
                  <p className="text-gray-700 text-sm">فهم كيفية استخدام الموقع</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.
              </p>
            </div>
          </section>

          {/* الاحتفاظ بالبيانات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              فترة الاحتفاظ بالبيانات
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بمعلوماتك الشخصية فقط للمدة اللازمة لتحقيق الأغراض المحددة:
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">بيانات الحساب النشط</span>
                  <span className="text-blue-600 font-medium">طوال فترة النشاط</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">بيانات الحساب المحذوف</span>
                  <span className="text-blue-600 font-medium">30 يوماً</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">سجلات الأمان</span>
                  <span className="text-blue-600 font-medium">سنة واحدة</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">البيانات القانونية</span>
                  <span className="text-blue-600 font-medium">حسب القانون</span>
                </div>
              </div>
            </div>
          </section>

          {/* خصوصية الأطفال */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              خصوصية الأطفال
            </h2>
            
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                نحن ملتزمون بحماية خصوصية الأطفال. إذا كان عمر المستخدم أقل من 18 عاماً:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                <li>يجب الحصول على موافقة ولي الأمر قبل جمع أي معلومات</li>
                <li>نجمع فقط المعلومات الضرورية للخدمة التعليمية</li>
                <li>لا نشارك معلومات الأطفال مع أطراف ثالثة إلا بموافقة ولي الأمر</li>
                <li>يحق لولي الأمر مراجعة وحذف معلومات طفله في أي وقت</li>
              </ul>
            </div>
          </section>

          {/* التحديثات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              تحديثات السياسة
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. عند حدوث تغييرات مهمة:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                <li>سنرسل إشعاراً عبر البريد الإلكتروني</li>
                <li>سنعرض إشعاراً بارزاً على المنصة</li>
                <li>سنحدث تاريخ "آخر تحديث" أعلى هذه الصفحة</li>
                <li>قد نطلب موافقتك الصريحة على التغييرات المهمة</li>
              </ul>
            </div>
          </section>

          {/* التواصل معنا */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              التواصل معنا
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، يرجى التواصل معنا:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">معلومات الاتصال العامة</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>البريد الإلكتروني:</strong> privacy@ruaa-education.sa</p>
                    <p><strong>الهاتف:</strong> +966 11 123 4567</p>
                    <p><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">مسؤول حماية البيانات</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>البريد الإلكتروني:</strong> dpo@ruaa-education.sa</p>
                    <p><strong>للاستفسارات القانونية:</strong> legal@ruaa-education.sa</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* تاريخ التحديث */}
          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600 text-center">
              تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              الإصدار: 2.0 | ساري المفعول من: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}