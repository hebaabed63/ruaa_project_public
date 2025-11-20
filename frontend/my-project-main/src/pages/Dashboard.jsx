import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, userAvatar, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to landing page
  useEffect(() => {
    if (userRole) {
      navigate('/', { replace: true });
    }
  }, [userRole, navigate]);

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  // Don't render anything while redirecting
  if (userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحويلك إلى الصفحة الرئيسية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            <button
              onClick={handleGoToProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              الملف الشخصي
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-200">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                مرحباً بك، {user?.name || 'المستخدم'}!
              </h2>
              <p className="text-gray-600 mt-2">
                لقد تم تفعيل حسابك بنجاح. يمكنك الآن الوصول إلى جميع ميزات النظام.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">الملف الشخصي</h3>
              <p className="text-gray-700 mb-4">
                عرض وتعديل معلوماتك الشخصية وإعدادات الحساب.
              </p>
              <button
                onClick={handleGoToProfile}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                الذهاب إلى الملف الشخصي →
              </button>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-green-800 mb-2">الإشعارات</h3>
              <p className="text-gray-700 mb-4">
                عرض الإشعارات والتحديثات الخاصة بحسابك.
              </p>
              <button className="text-green-600 hover:text-green-800 font-medium">
                عرض الإشعارات →
              </button>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="text-lg font-medium text-purple-800 mb-2">المساعدة</h3>
              <p className="text-gray-700 mb-4">
                الوصول إلى مركز المساعدة ودليل المستخدم.
              </p>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                مركز المساعدة →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;