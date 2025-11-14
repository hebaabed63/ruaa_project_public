import React, { useState, useEffect } from 'react';
import { getDashboardStats, fetchUsers, fetchSchools, fetchReports, fetchInvitations } from '../services/adminApiService';

const TestAdminAPI = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test dashboard stats
      results.dashboardStats = await getDashboardStats();
    } catch (error) {
      results.dashboardStats = { error: error.message };
    }

    try {
      // Test users fetch
      results.users = await fetchUsers();
    } catch (error) {
      results.users = { error: error.message };
    }

    try {
      // Test schools fetch
      results.schools = await fetchSchools();
    } catch (error) {
      results.schools = { error: error.message };
    }

    try {
      // Test reports fetch
      results.reports = await fetchReports();
    } catch (error) {
      results.reports = { error: error.message };
    }

    try {
      // Test invitations fetch
      results.invitations = await fetchInvitations();
    } catch (error) {
      results.invitations = { error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Test Admin API Connections</h2>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>

      <div className="space-y-4">
        {Object.entries(testResults).map(([key, result]) => (
          <div key={key} className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{key}</h3>
            {result.error ? (
              <div className="text-red-500">Error: {result.error}</div>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAdminAPI;