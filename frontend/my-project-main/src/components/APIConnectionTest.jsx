import React, { useState, useEffect } from 'react';
import { schoolsAPI, authAPI, ratingsAPI, contactAPI, servicesAPI } from './services/apiService';

/**
 * مكون اختبار الاتصال بالـ API
 * API Connection Test Component
 */
function APIConnectionTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);

  // اختبار جلب المدارس
  const testSchoolsAPI = async () => {
    try {
      setLoading(true);
      const response = await schoolsAPI.getAll();
      setSchools(response.data.data || []);
      setTestResults(prev => ({
        ...prev,
        schools: { success: true, message: 'نجح جلب المدارس', count: response.data.data?.length || 0 }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        schools: { success: false, message: error.message || 'فشل جلب المدارس' }
      }));
    } finally {
      setLoading(false);
    }
  };

  // اختبار تسجيل الدخول
  const testAuthAPI = async () => {
    try {
      setLoading(true);
      // جرب تسجيل الدخول بمستخدم تجريبي
      const response = await authAPI.login({
        email: 'admin@ruaa.com',
        password: 'password'
      });

      setTestResults(prev => ({
        ...prev,
        auth: { success: true, message: 'نجح تسجيل الدخول', token: response.data.token ? 'تم الحصول على التوكن' : 'لا يوجد توكن' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        auth: { success: false, message: error.message || 'فشل تسجيل الدخول' }
      }));
    } finally {
      setLoading(false);
    }
  };

  // اختبار المستخدم الحالي
  const testCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();

      setTestResults(prev => ({
        ...prev,
        user: { success: true, message: 'نجح جلب بيانات المستخدم', user: response.data.data?.user?.name || 'غير محدد' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        user: { success: false, message: error.message || 'فشل جلب بيانات المستخدم' }
      }));
    } finally {
      setLoading(false);
    }
  };

  // تشغيل جميع الاختبارات
  const runAllTests = async () => {
    setTestResults({});
    await testSchoolsAPI();
    await testAuthAPI();
    await testCurrentUser();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🧪 اختبار الاتصال بالـ API
      </h1>

      {/* أزرار الاختبار */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={testSchoolsAPI}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          📚 اختبار المدارس
        </button>

        <button
          onClick={testAuthAPI}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          🔐 اختبار تسجيل الدخول
        </button>

        <button
          onClick={testCurrentUser}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          👤 اختبار المستخدم الحالي
        </button>

        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          🚀 تشغيل جميع الاختبارات
        </button>
      </div>

      {/* مؤشر التحميل */}
      {loading && (
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">جاري الاختبار...</p>
        </div>
      )}

      {/* نتائج الاختبارات */}
      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-4 rounded-lg border-l-4 ${
              result.success
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {result.success ? '✅' : '❌'}
              </span>
              <div>
                <h3 className="font-semibold text-lg">
                  {testName === 'schools' && '📚 اختبار المدارس'}
                  {testName === 'auth' && '🔐 اختبار المصادقة'}
                  {testName === 'user' && '👤 اختبار المستخدم'}
                </h3>
                <p className="text-gray-700">{result.message}</p>
                {result.count && (
                  <p className="text-sm text-gray-600">عدد النتائج: {result.count}</p>
                )}
                {result.token && (
                  <p className="text-sm text-gray-600">التوكن: {result.token}</p>
                )}
                {result.user && (
                  <p className="text-sm text-gray-600">المستخدم: {result.user}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* قائمة المدارس */}
      {schools.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            📚 المدارس المتاحة ({schools.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <div key={school.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{school.name}</h3>
                <p className="text-gray-600">{school.address}</p>
                <p className="text-sm text-gray-500">{school.region}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* معلومات الاتصال */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">🔗 معلومات الاتصال</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api'}</p>
          <p><strong>Frontend URL:</strong> {window.location.origin}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>
      </div>

      {/* تعليمات الاستخدام */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">📖 كيفية الاستخدام</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>1. تأكد أن Laravel يعمل على <code className="bg-gray-200 px-1 rounded">http://127.0.0.1:8000</code></p>
          <p>2. تأكد أن React يعمل على <code className="bg-gray-200 px-1 rounded">http://localhost:3000</code></p>
          <p>3. إذا فشلت الاختبارات، تحقق من ملف <code className="bg-gray-200 px-1 rounded">.env</code> في كلا المشروعين</p>
          <p>4. تأكد من أن قاعدة البيانات متصلة ومليئة بالبيانات</p>
        </div>
      </div>
    </div>
  );
}

export default APIConnectionTest;
