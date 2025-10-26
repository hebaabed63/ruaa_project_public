/**
 * مكون اختبار الاتصال بالـ API
 * استخدم هذا المكون للتأكد من أن الربط بين الباك والفرونت يعمل
 */

import React, { useState } from 'react';
import { schoolsAPI, authAPI } from '../services/apiService';

function APITest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // اختبار جلب المدارس
  const testSchools = async () => {
    setLoading(true);
    setResult('جاري الاختبار...');
    
    try {
      const response = await schoolsAPI.getAll();
      setResult(`✅ نجح! تم جلب ${response.data.data?.length || 0} مدرسة`);
      console.log('Response:', response.data);
    } catch (error) {
      setResult(`❌ فشل: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // اختبار الاتصال بالخادم
  const testConnection = async () => {
    setLoading(true);
    setResult('جاري اختبار الاتصال...');
    
    try {
      const response = await fetch('http://localhost:8000/api/schools');
      if (response.ok) {
        setResult('✅ الاتصال بالخادم يعمل!');
      } else {
        setResult(`⚠️ الخادم يرد لكن بحالة: ${response.status}`);
      }
    } catch (error) {
      setResult('❌ لا يمكن الاتصال بالخادم. تأكد أن Laravel يعمل!');
      console.error('Connection Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧪 اختبار الاتصال بالـ API</h2>
      
      <div style={styles.buttonGroup}>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={styles.button}
        >
          اختبر الاتصال بالخادم
        </button>
        
        <button 
          onClick={testSchools} 
          disabled={loading}
          style={styles.button}
        >
          اختبر جلب المدارس
        </button>
      </div>

      {result && (
        <div style={styles.result}>
          <h3>النتيجة:</h3>
          <p>{result}</p>
        </div>
      )}

      <div style={styles.info}>
        <h3>معلومات:</h3>
        <ul>
          <li>Backend URL: {process.env.REACT_APP_API_BASE_URL}</li>
          <li>تأكد أن Laravel يعمل على: http://localhost:8000</li>
          <li>افتح Console (F12) لمزيد من التفاصيل</li>
        </ul>
      </div>
    </div>
  );
}

// Styles بسيطة
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  result: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginBottom: '20px',
    minHeight: '60px',
  },
  info: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '5px',
    fontSize: '14px',
  },
};

export default APITest;
