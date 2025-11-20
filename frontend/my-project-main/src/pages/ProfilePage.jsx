import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, userAvatar } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">الملف الشخصي</h1>
            <button
              onClick={handleBackToDashboard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">الاسم الكامل</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.name || 'غير محدد'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.email || 'غير محدد'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">رقم الهاتف</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.phone || 'غير محدد'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">المدينة</h3>
                  <p className="text-lg font-medium text-gray-900">{user?.city || 'غير محدد'}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">معلومات إضافية</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {user?.bio || 'لا توجد معلومات إضافية متوفرة حالياً.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;