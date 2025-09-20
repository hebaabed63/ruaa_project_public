import React from 'react';
import { toast } from '../utils/toastManager';

const TestToast = () => {
  const testToasts = () => {
    toast.success("هذا اختبار للتنبيه الناجح!");
    
    setTimeout(() => {
      toast.error("هذا اختبار للتنبيه الخطأ!");
    }, 1000);
    
    setTimeout(() => {
      toast.warning("هذا اختبار لتنبيه التحذير!");
    }, 2000);
    
    setTimeout(() => {
      toast.info("هذا اختبار للتنبيه المعلوماتي!");
    }, 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">اختبار نظام التنبيهات</h2>
      <button
        onClick={testToasts}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        اختبار التنبيهات
      </button>
      
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">معلومات النظام:</h3>
        <ul className="text-sm">
          <li>✅ تم تحديث AuthController</li>
          <li>✅ تم إنشاء نظام Toast notifications</li>
          <li>✅ تم تحديث صفحة التسجيل</li>
          <li>✅ تم تحديث صفحة تسجيل الدخول</li>
          <li>✅ تم تحديث صفحات استعادة كلمة المرور</li>
          <li>✅ تم إضافة routes للمدارس</li>
        </ul>
      </div>
    </div>
  );
};

export default TestToast;
