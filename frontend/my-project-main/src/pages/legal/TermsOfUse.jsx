import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHome, FaFileAlt, FaGavel } from 'react-icons/fa';
import logo from '../../assets/images/LOGO1.svg';
import usePageTitle from '../../hooks/usePageTitle';

export default function TermsOfUse() {
  const { source } = useParams();
  const navigate = useNavigate();
  
  // Set page title
  usePageTitle("شروط الاستخدام");
  
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
              {/* Removed the "Terms of Use" title from header */}
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
            <h1 className="text-2xl font-bold text-gray-900">شروط الاستخدام</h1>
          </div>
          
          {/* مقدمة */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-blue-600 text-2xl ml-3" />
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                مقدمة
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              مرحبًا بك في منصة "رؤى". هذه الشروط والأحكام تحدد القواعد واللوائح لاستخدام موقعنا وخدماتنا.
            </p>
            <p className="text-gray-700 leading-relaxed">
              باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة.
            </p>
          </section>

          {/* قبول الشروط */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              قبول الشروط
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                عند تسجيلك في المنصة واستخدامك لخدماتها، فإنك تقر بأنك:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                <li>لديك الأهلية القانونية لل التعاقد</li>
                <li>تبلغ من العمر القانوني المطلوب لاستخدام المنصة</li>
                <li>توافق على الالتزام بهذه الشروط والأحكام</li>
                <li>تفهم أن استخدامك للمنصة يخضع لهذه الشروط</li>
              </ul>
            </div>
          </section>

          {/* استخدام المنصة */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              استخدام المنصة
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. التسجيل والحساب</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>يجب تقديم معلومات دقيقة ومحدثة عند التسجيل</li>
                  <li>أنت مسؤول عن الحفاظ على سرية بيانات الحساب وكلمة المرور</li>
                  <li>يُمنع مشاركة الحساب مع الآخرين</li>
                  <li>يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. السلوك المقبول</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>احترام المستخدمين الآخرين وعدم الإساءة لهم</li>
                  <li>عدم نشر محتوى مسيء أو مخالف للآداب العامة</li>
                  <li>عدم محاولة اختراق المنصة أو تجاوز قيودها الأمنية</li>
                  <li>عدم استخدام المنصة لأغراض غير قانونية</li>
                  <li>الامتثال لجميع القوانين واللوائح المعمول بها</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. القيود على الاستخدام</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                  <li>يُمنع استخدام المنصة بطريقة قد تضر أو تعطل خدماتها</li>
                  <li>يُمنع إعادة إنتاج أو توزيع محتوى المنصة دون إذن</li>
                  <li>يُمنع استخدام أدوات آلية لجمع المحتوى من المنصة</li>
                  <li>يُمنع محاولة التدخل في خدمات المستخدمين الآخرين</li>
                </ul>
              </div>
            </div>
          </section>

          {/* الملكية الفكرية */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <FaGavel className="text-blue-600 text-2xl ml-3" />
              <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
                الملكية الفكرية
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                جميع محتويات المنصة (النصوص، الصور، الشعارات، البرمجيات) محمية بحقوق الطبع والنشر والعلامات التجارية:
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">محتوى المنصة</h3>
                <p className="text-gray-700">
                  المحتوى المقدم من المنصة يُستخدم حصراً لأغراض التعليم والتطوير المهني.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">محتوى المستخدم</h3>
                <p className="text-gray-700">
                  أنت تمنح المنصة ترخيصاً غير حصري لاستخدام المحتوى الذي تقدمه ضمن المنصة.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">العلامات التجارية</h3>
                <p className="text-gray-700">
                  جميع العلامات التجارية والشعارات في المنصة ملكية حصرية لمنصة "رؤى".
                </p>
              </div>
            </div>
          </section>

          {/* الخدمات والمسؤوليات */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              الخدمات والمسؤوليات
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">خدمات المنصة</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>تقديم أدوات التقييم والتطوير المهني</li>
                  <li>الوصول إلى المحتوى التعليمي</li>
                  <li>التواصل مع المختصين في المجال التعليمي</li>
                  <li>تتبع التقدم والإنجازات</li>
                  <li>الحصول على الشهادات والتقدير</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">مسؤوليات المستخدم</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>التأكد من دقة المعلومات المقدمة</li>
                  <li>الحفاظ على سرية بيانات الحساب</li>
                  <li>الإبلاغ عن أي مخالفات أو مشاكل</li>
                  <li>احترام حقوق الملكية الفكرية</li>
                  <li>عدم استخدام المنصة بطريقة تضر بالآخرين</li>
                </ul>
              </div>
            </div>
          </section>

          {/* التعديلات والإنهاء */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              التعديلات والإنهاء
            </h2>
            
            <div className="space-y-4">
              <div className="border-r-4 border-blue-500 bg-blue-50 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">تعديل الشروط</h3>
                <p className="text-gray-700">
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات مهمة.
                </p>
              </div>

              <div className="border-r-4 border-green-500 bg-green-50 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">إنهاء الخدمة</h3>
                <p className="text-gray-700">
                  قد نوقف أو ننهي حسابك إذا كنت تنتهك هذه الشروط أو تستخدم المنصة بطريقة غير ملائمة.
                </p>
              </div>

              <div className="border-r-4 border-yellow-500 bg-yellow-50 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">التغييرات في الخدمة</h3>
                <p className="text-gray-700">
                  نحتفظ بالحق في تعديل أو إيقاف أي جزء من خدماتنا في أي وقت دون إشعار مسبق.
                </p>
              </div>
            </div>
          </section>

          {/* الحد من المسؤولية */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              الحد من المسؤولية
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                المنصة تُقدم "كما هي" دون أي ضمانات صريحة أو ضمنية:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">الضمانات</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>لا نضمن أن المنصة ستكون خالية من الأخطاء</li>
                    <li>لا نضمن أن المنصة ستكون متاحة دائماً</li>
                    <li>لا نضمن دقة المحتوى المقدم</li>
                    <li>استخدامك للمنصة يكون على مسؤوليتك الخاصة</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">المسؤولية</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>لا نتحمل المسؤولية عن أي أضرار غير مباشرة</li>
                    <li>لا نتحمل المسؤولية عن فقدان البيانات</li>
                    <li>لا نتحمل المسؤولية عن أي توقف في الخدمة</li>
                    <li>حد مسؤوليتنا يقتصر على الحد الأقصى المسموح به قانوناً</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* الخصوصية والأمان */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              الخصوصية والأمان
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية:
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">تشفير البيانات</span>
                  <span className="text-blue-600 font-medium">مفعل</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">حماية الحسابات</span>
                  <span className="text-blue-600 font-medium">متقدمة</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">مراقبة الأمان</span>
                  <span className="text-blue-600 font-medium">مستمرة</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                لمزيد من التفاصيل حول كيفية حماية بياناتك، يرجى الاطلاع على 
                <Link to="/privacy-policy" className="text-blue-600 hover:underline mx-1">سياسة الخصوصية</Link>
                الخاصة بنا.
              </p>
            </div>
          </section>

          {/* القوانين المعمول بها */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              القوانين المعمول بها
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                تخضع هذه الشروط وتُفسر وفقاً لقوانين المملكة العربية السعودية:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4">
                <li>قانون حماية البيانات الشخصية</li>
                <li>قانون مكافحة الجرائم المعلوماتية</li>
                <li>الأنظمة واللوائح التعليمية المعمول بها</li>
                <li>قوانين الملكية الفكرية</li>
                <li>أنظمة التجارة الإلكترونية</li>
              </ul>
              
              <p className="text-gray-700 leading-relaxed mt-4">
                أي نزاع ينشأ عن استخدام المنصة يخضع لاختصاص محاكم المملكة العربية السعودية.
              </p>
            </div>
          </section>

          {/* التعديلات الأخيرة */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              التعديلات الأخيرة
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. آخر تحديث تم في:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>الإصدار:</strong> 1.0
                </p>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                استمرار استخدامك للمنصة بعد أي تعديلات يعني موافقتك على الشروط المحدثة.
              </p>
            </div>
          </section>

          {/* التواصل معنا */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              التواصل معنا
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">معلومات الاتصال العامة</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>البريد الإلكتروني:</strong> terms@ruaa-education.sa</p>
                    <p><strong>الهاتف:</strong> +966 11 123 4567</p>
                    <p><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">الدعم الفني</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>البريد الإلكتروني:</strong> support@ruaa-education.sa</p>
                    <p><strong>ساعات العمل:</strong> الأحد - الخميس، 8 صباحاً - 4 مساءً</p>
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
              الإصدار: 1.0 | ساري المفعول من: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}