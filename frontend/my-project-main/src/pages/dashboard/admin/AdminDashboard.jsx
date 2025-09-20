import React, { useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaClipboardList,
  FaHeadset,
  FaCog,
  FaChartPie,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔹 كارد Component داخلي
  const Card = ({ title, count, onClick }) => (
    <div
      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
      onClick={onClick}
    >
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
    </div>
  );

  // 🔹 السايد بار
  const Sidebar = () => {
    const menuItems = [
      { id: "overview", label: "النظرة العامة", icon: FaChartPie },
      { id: "users", label: "المستخدمون", icon: FaUsers },
      { id: "active-users", label: "المستخدمون النشيطون", icon: FaUserCheck },
      { id: "requests", label: "الطلبات المعلقة", icon: FaClipboardList },
      { id: "support", label: "الدعم الفني", icon: FaHeadset },
      { id: "settings", label: "الإعدادات", icon: FaCog },
    ];

    return (
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 text-xl font-bold text-center text-blue-600">
            لوحة التحكم
          </div>
          <nav className="flex-1 px-2 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-right transition ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="ml-3" />
                <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  };

  // 🔹 المحتوى لكل تبويب
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-6">النظرة العامة</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="إجمالي المستخدمين"
                count="1200"
                onClick={() => setActiveTab("users")}
              />
              <Card
                title="المستخدمون النشيطون"
                count="300"
                onClick={() => setActiveTab("active-users")}
              />
              <Card
                title="الطلبات المعلقة"
                count="45"
                onClick={() => setActiveTab("requests")}
              />
              <Card
                title="تذاكر الدعم"
                count="20"
                onClick={() => setActiveTab("support")}
              />
            </div>
          </div>
        );
      case "users":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">قائمة المستخدمين</h1>
            <p>هنا ستظهر قائمة جميع المستخدمين مع خيارات البحث والتصفية.</p>
          </div>
        );
      case "active-users":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">المستخدمون النشيطون</h1>
            <p>هنا ستظهر قائمة المستخدمين النشيطين فقط.</p>
          </div>
        );
      case "requests":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">الطلبات المعلقة</h1>
            <p>هنا ستظهر الطلبات التي تنتظر الموافقة.</p>
          </div>
        );
      case "support":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">الدعم الفني</h1>
            <p>هنا ستظهر تذاكر الدعم ومراسلات المستخدمين.</p>
          </div>
        );
      case "settings":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">الإعدادات</h1>
            <p>هنا يمكنك تعديل إعدادات النظام والمستخدمين.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          sidebarOpen ? "mr-64" : "mr-20"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {sidebarOpen ? "إخفاء القائمة" : "إظهار القائمة"}
        </button>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
