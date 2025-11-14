import React, { useState, useEffect } from 'react';
import * as supervisorAPI from './services/supervisorApi';

const TestSupervisorAPI = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (testName, status, data = null, error = null) => {
    setTestResults(prev => [...prev, {
      testName,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Fetch profile
      try {
        addResult('Fetch Profile', 'running');
        const profile = await supervisorAPI.fetchSupervisorProfile();
        addResult('Fetch Profile', 'success', profile);
      } catch (error) {
        addResult('Fetch Profile', 'failed', null, error.message);
      }

      // Test 2: Fetch schools
      try {
        addResult('Fetch Schools', 'running');
        const schools = await supervisorAPI.fetchSupervisorSchools();
        addResult('Fetch Schools', 'success', schools);
      } catch (error) {
        addResult('Fetch Schools', 'failed', null, error.message);
      }

      // Test 3: Fetch dashboard stats
      try {
        addResult('Fetch Dashboard Stats', 'running');
        const stats = await supervisorAPI.getDashboardStats();
        addResult('Fetch Dashboard Stats', 'success', stats);
      } catch (error) {
        addResult('Fetch Dashboard Stats', 'failed', null, error.message);
      }

      // Test 4: Fetch reports
      try {
        addResult('Fetch Reports', 'running');
        const reports = await supervisorAPI.fetchSupervisorReports();
        addResult('Fetch Reports', 'success', reports);
      } catch (error) {
        addResult('Fetch Reports', 'failed', null, error.message);
      }

      // Test 5: Fetch invitations
      try {
        addResult('Fetch Invitations', 'running');
        const invitations = await supervisorAPI.fetchSupervisorInvitations();
        addResult('Fetch Invitations', 'success', invitations);
      } catch (error) {
        addResult('Fetch Invitations', 'failed', null, error.message);
      }

      // Test 6: Fetch notifications
      try {
        addResult('Fetch Notifications', 'running');
        const notifications = await supervisorAPI.fetchSupervisorNotifications();
        addResult('Fetch Notifications', 'success', notifications);
      } catch (error) {
        addResult('Fetch Notifications', 'failed', null, error.message);
      }

    } catch (error) {
      addResult('Overall Test', 'error', null, error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">اختبار واجهة برمجة التطبيقات للمشرف</h1>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'جاري التشغيل...' : 'إعادة التشغيل'}
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-right">الاختبار</th>
              <th className="py-2 px-4 text-right">الحالة</th>
              <th className="py-2 px-4 text-right">البيانات</th>
              <th className="py-2 px-4 text-right">الخطأ</th>
              <th className="py-2 px-4 text-right">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-4 border-b">{result.testName}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    result.status === 'success' ? 'bg-green-100 text-green-800' :
                    result.status === 'failed' ? 'bg-red-100 text-red-800' :
                    result.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status === 'success' ? 'ناجح' :
                     result.status === 'failed' ? 'فشل' :
                     result.status === 'running' ? 'قيد التشغيل' :
                     result.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  {result.data && (
                    <details>
                      <summary className="cursor-pointer text-blue-600">عرض البيانات</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-red-600">
                  {result.error && (
                    <details>
                      <summary className="cursor-pointer">عرض الخطأ</summary>
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                        {result.error}
                      </pre>
                    </details>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{result.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestSupervisorAPI;