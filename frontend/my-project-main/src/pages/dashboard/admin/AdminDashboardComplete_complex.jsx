import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaClipboardList,
  FaHeadset,
  FaCog,
  FaChartPie,
  FaSchool,
  FaExclamationTriangle,
  FaStar,
  FaFileAlt,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaDownload,
  FaBell,
  FaFilter,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaUserTie,
  FaLink,
  FaCheck,
  FaTimes,
  FaSync
} from "react-icons/fa";

import SupervisorLinksManagement from '../../admin/SupervisorLinksManagement';
import PrincipalLinksManagement from '../../admin/PrincipalLinksManagement';
import { 
  approvePendingUser, 
  rejectPendingUser, 
  getPendingUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  getAllSupportTickets,
  updateSupportTicketStatus,
  getAllComplaints,
  updateComplaintStatus,
  getAllReports,
  deleteReport,
  exportReport
} from '../../../services/adminService';
import { toast } from 'react-toastify';

const AdminDashboardComplete = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "parent",
    status: "active"
  });
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    type: "primary",
    address: "",
    phone: ""
  });
  
  // Sample data for admin dashboard
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    pendingRequests: 23,
    supportTickets: 15,
    schools: 156,
    complaints: 8
  });
  
  const [users, setUsers] = useState([
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "parent", status: "active", joinDate: "2024-01-15", lastLogin: "2024-01-20" },
    { id: 2, name: "فاطمة علي", email: "fatima@example.com", role: "supervisor", status: "active", joinDate: "2024-01-10", lastLogin: "2024-01-20" },
    { id: 3, name: "محمد سالم", email: "mohammed@example.com", role: "school_manager", status: "inactive", joinDate: "2024-01-08", lastLogin: "2024-01-18" },
    { id: 4, name: "عائشة خالد", email: "aisha@example.com", role: "parent", status: "active", joinDate: "2024-01-05", lastLogin: "2024-01-19" },
    { id: 5, name: "يوسف أحمد", email: "youssef@example.com", role: "supervisor", status: "pending", joinDate: "2024-01-03", lastLogin: "never" },
    { id: 6, name: "خالد إبراهيم", email: "khaled@example.com", role: "school_manager", status: "suspended", joinDate: "2024-01-01", lastLogin: "never" }
  ]);
  
  const [schools, setSchools] = useState([
    { id: 1, name: "مدرسة النجاح الابتدائية", type: "primary", students: 450, rating: 4.5, status: "active" },
    { id: 2, name: "مدرسة المستقبل المتوسطة", type: "middle", students: 320, rating: 4.2, status: "active" },
    { id: 3, name: "مدرسة العلم الثانوية", type: "high", students: 280, rating: 4.7, status: "active" }
  ]);
  
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, title: "مشكلة في تسجيل الدخول", user: "أحمد محمد", priority: "high", status: "open", date: "2024-01-20" },
    { id: 2, title: "طلب إضافة مدرسة جديدة", user: "فاطمة علي", priority: "medium", status: "in_progress", date: "2024-01-19" },
    { id: 3, title: "استفسار عن التقييمات", user: "محمد سالم", priority: "low", status: "resolved", date: "2024-01-18" }
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, title: "مشكلة في جودة التعليم", school: "مدرسة النجاح الابتدائية", user: "أحمد محمد", priority: "high", status: "open", date: "2024-01-20" },
    { id: 2, title: "تأخير في استلام المواد", school: "مدرسة المستقبل المتوسطة", user: "فاطمة علي", priority: "medium", status: "in_progress", date: "2024-01-19" },
    { id: 3, title: "مشكلة في المرافق", school: "مدرسة العلم الثانوية", user: "محمد سالم", priority: "low", status: "resolved", date: "2024-01-18" }
  ]);

  const [reports, setReports] = useState([
    { id: 1, title: "تقرير شهري - يناير 2024", type: "monthly", date: "2024-01-20" },
    { id: 2, title: "تحليل التقييمات", type: "detailed", date: "2024-01-18" },
    { id: 3, title: "تقرير الأداء المدرسي", type: "custom", date: "2024-01-15" }
  ]);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      const response = await getPendingUsers();
      if (response.success) {
        // Update the users state with pending users
        setUsers(prevUsers => {
          // Remove existing pending users
          const nonPendingUsers = prevUsers.filter(user => user.status !== 'pending');
          // Add fetched pending users
          return [...nonPendingUsers, ...response.data];
        });
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب المستخدمين المعلقين');
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب المستخدمين');
    }
  };

  // Function to approve pending user
  const handleApproveUser = async (userId) => {
    try {
      const response = await approvePendingUser(userId);
      if (response.success) {
        toast.success(response.message || 'تم تفعيل المستخدم بنجاح');
        // Update the user status in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        ));
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تفعيل المستخدم');
    }
  };

  // Function to reject pending user
  const handleRejectUser = async (userId) => {
    try {
      const response = await rejectPendingUser(userId);
      if (response.success) {
        toast.success(response.message || 'تم رفض المستخدم بنجاح');
        // Update the user status in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'suspended' } : user
        ));
      }
    } catch (error) {
      toast.error(error.message || 'فشل في رفض المستخدم');
    }
  };

  // Function to create a new user
  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData);
      if (response.success) {
        toast.success(response.message || 'تم إنشاء المستخدم بنجاح');
        // Add the new user to the local state
        setUsers([...users, response.data]);
        setShowAddUserModal(false);
        // Reset form
        setUserForm({
          name: "",
          email: "",
          role: "parent",
          status: "active"
        });
      }
    } catch (error) {
      toast.error(error.message || 'فشل في إنشاء المستخدم');
    }
  };

  // Function to update a user
  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await updateUser(userId, userData);
      if (response.success) {
        toast.success(response.message || 'تم تحديث المستخدم بنجاح');
        // Update the user in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...response.data } : user
        ));
        setShowEditUserModal(false);
        setEditingUser(null);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث المستخدم');
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          toast.success(response.message || 'تم حذف المستخدم بنجاح');
          // Remove the user from the local state
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error) {
        toast.error(error.message || 'فشل في حذف المستخدم');
      }
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  // Handle add user form submission
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    handleCreateUser(userForm);
  };

  // Handle edit user form submission
  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    handleUpdateUser(editingUser.id, userForm);
  };

  // Open edit user modal
  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditUserModal(true);
  };

  // Close modals
  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setUserForm({
      name: "",
      email: "",
      role: "parent",
      status: "active"
    });
  };

  const closeEditUserModal = () => {
    setShowEditUserModal(false);
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      role: "parent",
      status: "active"
    });
  };

  // Fetch all schools
  const fetchAllSchools = async () => {
    try {
      const response = await getAllSchools();
      if (response.success) {
        setSchools(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب المدارس');
    }
  };

  // Function to create a new school
  const handleCreateSchool = async (schoolData) => {
    try {
      const response = await createSchool(schoolData);
      if (response.success) {
        toast.success(response.message || 'تم إنشاء المدرسة بنجاح');
        // Add the new school to the local state
        setSchools([...schools, response.data]);
        setShowAddSchoolModal(false);
        // Reset form
        setSchoolForm({
          name: "",
          type: "primary",
          address: "",
          phone: ""
        });
      }
    } catch (error) {
      toast.error(error.message || 'فشل في إنشاء المدرسة');
    }
  };

  // Function to update a school
  const handleUpdateSchool = async (schoolId, schoolData) => {
    try {
      const response = await updateSchool(schoolId, schoolData);
      if (response.success) {
        toast.success(response.message || 'تم تحديث المدرسة بنجاح');
        // Update the school in the local state
        setSchools(schools.map(school => 
          school.id === schoolId ? { ...school, ...response.data } : school
        ));
        setShowEditSchoolModal(false);
        setEditingSchool(null);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث المدرسة');
    }
  };

  // Function to delete a school
  const handleDeleteSchool = async (schoolId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المدرسة؟')) {
      try {
        const response = await deleteSchool(schoolId);
        if (response.success) {
          toast.success(response.message || 'تم حذف المدرسة بنجاح');
          // Remove the school from the local state
          setSchools(schools.filter(school => school.id !== schoolId));
        }
      } catch (error) {
        toast.error(error.message || 'فشل في حذف المدرسة');
      }
    }
  };

  // Handle school form input changes
  const handleSchoolFormChange = (e) => {
    const { name, value } = e.target;
    setSchoolForm({
      ...schoolForm,
      [name]: value
    });
  };

  // Handle add school form submission
  const handleAddSchoolSubmit = (e) => {
    e.preventDefault();
    handleCreateSchool(schoolForm);
  };

  // Handle edit school form submission
  const handleEditSchoolSubmit = (e) => {
    e.preventDefault();
    handleUpdateSchool(editingSchool.id, schoolForm);
  };

  // Open edit school modal
  const openEditSchoolModal = (school) => {
    setEditingSchool(school);
    setSchoolForm({
      name: school.name,
      type: school.type,
      address: school.address || "",
      phone: school.phone || ""
    });
    setShowEditSchoolModal(true);
  };

  // Close school modals
  const closeAddSchoolModal = () => {
    setShowAddSchoolModal(false);
    setSchoolForm({
      name: "",
      type: "primary",
      address: "",
      phone: ""
    });
  };

  const closeEditSchoolModal = () => {
    setShowEditSchoolModal(false);
    setEditingSchool(null);
    setSchoolForm({
      name: "",
      type: "primary",
      address: "",
      phone: ""
    });
  };

  // Fetch all support tickets
  const fetchAllSupportTickets = async () => {
    try {
      const response = await getAllSupportTickets();
      if (response.success) {
        setSupportTickets(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب تذاكر الدعم');
    }
  };

  // Update support ticket status
  const handleUpdateSupportTicketStatus = async (ticketId, status) => {
    try {
      const response = await updateSupportTicketStatus(ticketId, status);
      if (response.success) {
        toast.success(response.message || 'تم تحديث حالة التذكرة بنجاح');
        // Update the ticket in the local state
        setSupportTickets(supportTickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status } : ticket
        ));
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث حالة التذكرة');
    }
  };

  // Fetch all complaints
  const fetchAllComplaints = async () => {
    try {
      const response = await getAllComplaints();
      if (response.success) {
        setComplaints(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب الشكاوى');
    }
  };

  // Update complaint status
  const handleUpdateComplaintStatus = async (complaintId, status) => {
    try {
      const response = await updateComplaintStatus(complaintId, status);
      if (response.success) {
        toast.success(response.message || 'تم تحديث حالة الشكوى بنجاح');
        // Update the complaint in the local state
        setComplaints(complaints.map(complaint => 
          complaint.id === complaintId ? { ...complaint, status } : complaint
        ));
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث حالة الشكوى');
    }
  };

  // Fetch all reports
  const fetchAllReports = async () => {
    try {
      const response = await getAllReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'فشل في جلب التقارير');
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      try {
        const response = await deleteReport(reportId);
        if (response.success) {
          toast.success(response.message || 'تم حذف التقرير بنجاح');
          // Remove the report from the local state
          setReports(reports.filter(report => report.id !== reportId));
        }
      } catch (error) {
        toast.error(error.message || 'فشل في حذف التقرير');
      }
    }
  };

  // Export report
  const handleExportReport = async (reportId) => {
    try {
      const response = await exportReport(reportId);
      // Create a download link for the exported file
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('تم تصدير التقرير بنجاح');
    } catch (error) {
      toast.error(error.message || 'فشل في تصدير التقرير');
    }
  };

  // Fetch pending users when the pending-requests tab is active
  useEffect(() => {
    if (activeTab === "pending-requests") {
      fetchPendingUsers();
    }
  }, [activeTab]);

  // Enhanced Stats Card Component
  const StatsCard = ({ title, count, icon: Icon, color, change, onClick }) => (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          {change && (
            <p className={`text-sm ${
              change.includes('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} من الشهر الماضي
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 p-4 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaChevronLeft className="text-white text-xl" />
          </button>
        </div>
        <ul className="space-y-2">
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "overview" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("overview")}>
            <FaChartPie className="mr-2" />
            نظرة عامة
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "users" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("users")}>
            <FaUsers className="mr-2" />
            المستخدمين
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "pending-requests" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("pending-requests")}>
            <FaExclamationTriangle className="mr-2" />
            الطلبات المعلقة
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "schools" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("schools")}>
            <FaSchool className="mr-2" />
            المدارس
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "support-tickets" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("support-tickets")}>
            <FaHeadset className="mr-2" />
            تذاكر الدعم
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "complaints" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("complaints")}>
            <FaExclamationTriangle className="mr-2" />
            الشكاوى
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "reports" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("reports")}>
            <FaFileAlt className="mr-2" />
            التقارير
          </li>
          <li className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${activeTab === "settings" ? 'bg-gray-700' : ''}`} onClick={() => setActiveTab("settings")}>
            <FaCog className="mr-2" />
            الإعدادات
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaChevronRight className="text-gray-800 text-xl" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard title="المستخدمين الكليين" count={stats.totalUsers} icon={FaUsers} color="bg-blue-500" change="+12%" onClick={() => setActiveTab("users")} />
          <StatsCard title="المستخدمين النشطين" count={stats.activeUsers} icon={FaUserCheck} color="bg-green-500" change="+8%" onClick={() => setActiveTab("users")} />
          <StatsCard title="الطلبات المعلقة" count={stats.pendingRequests} icon={FaExclamationTriangle} color="bg-yellow-500" change="+5%" onClick={() => setActiveTab("pending-requests")} />
          <StatsCard title="تذاكر الدعم" count={stats.supportTickets} icon={FaHeadset} color="bg-purple-500" change="+10%" onClick={() => setActiveTab("support-tickets")} />
          <StatsCard title="المدارس" count={stats.schools} icon={FaSchool} color="bg-red-500" change="+3%" onClick={() => setActiveTab("schools")} />
          <StatsCard title="الشكاوى" count={stats.complaints} icon={FaExclamationTriangle} color="bg-orange-500" change="+2%" onClick={() => setActiveTab("complaints")} />
        </div>
        <div className="mt-4">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-bold mb-4">نظرة عامة</h2>
              <p>هنا يمكنك رؤية نظرة عامة على أداء النظام.</p>
            </div>
          )}
          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-bold mb-4">المستخدمين</h2>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن مستخدم..."
                  className="border border-gray-300 p-2 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => setShowAddUserModal(true)}>
                  <FaPlus className="mr-2" />
                  إضافة مستخدم
                </button>
              </div>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">اسم المستخدم</th>
                    <th className="p-2 border-b">البريد الإلكتروني</th>
                    <th className="p-2 border-b">الدور</th>
                    <th className="p-2 border-b">الحالة</th>
                    <th className="p-2 border-b">تاريخ الانضمام</th>
                    <th className="p-2 border-b">آخر تسجيل دخول</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(user => (
                      <tr key={user.id}>
                        <td className="p-2 border-b">{user.name}</td>
                        <td className="p-2 border-b">{user.email}</td>
                        <td className="p-2 border-b">{user.role}</td>
                        <td className="p-2 border-b">{user.status}</td>
                        <td className="p-2 border-b">{user.joinDate}</td>
                        <td className="p-2 border-b">{user.lastLogin}</td>
                        <td className="p-2 border-b">
                          <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => openEditUserModal(user)}>
                            <FaEdit />
                          </button>
                          <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleDeleteUser(user.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "pending-requests" && (
            <div>
              <h2 className="text-xl font-bold mb-4">الطلبات المعلقة</h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">اسم المستخدم</th>
                    <th className="p-2 border-b">البريد الإلكتروني</th>
                    <th className="p-2 border-b">الدور</th>
                    <th className="p-2 border-b">الحالة</th>
                    <th className="p-2 border-b">تاريخ الانضمام</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => user.status === 'pending')
                    .map(user => (
                      <tr key={user.id}>
                        <td className="p-2 border-b">{user.name}</td>
                        <td className="p-2 border-b">{user.email}</td>
                        <td className="p-2 border-b">{user.role}</td>
                        <td className="p-2 border-b">{user.status}</td>
                        <td className="p-2 border-b">{user.joinDate}</td>
                        <td className="p-2 border-b">
                          <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => handleApproveUser(user.id)}>
                            <FaCheck />
                          </button>
                          <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleRejectUser(user.id)}>
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "schools" && (
            <div>
              <h2 className="text-xl font-bold mb-4">المدارس</h2>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن مدرسة..."
                  className="border border-gray-300 p-2 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={() => setShowAddSchoolModal(true)}>
                  <FaPlus className="mr-2" />
                  إضافة مدرسة
                </button>
              </div>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">اسم المدرسة</th>
                    <th className="p-2 border-b">النوع</th>
                    <th className="p-2 border-b">عدد الطلاب</th>
                    <th className="p-2 border-b">التقييم</th>
                    <th className="p-2 border-b">الحالة</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {schools
                    .filter(school => school.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(school => (
                      <tr key={school.id}>
                        <td className="p-2 border-b">{school.name}</td>
                        <td className="p-2 border-b">{school.type}</td>
                        <td className="p-2 border-b">{school.students}</td>
                        <td className="p-2 border-b">{school.rating}</td>
                        <td className="p-2 border-b">{school.status}</td>
                        <td className="p-2 border-b">
                          <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => openEditSchoolModal(school)}>
                            <FaEdit />
                          </button>
                          <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleDeleteSchool(school.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "support-tickets" && (
            <div>
              <h2 className="text-xl font-bold mb-4">تذاكر الدعم</h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">عنوان التذكرة</th>
                    <th className="p-2 border-b">المستخدم</th>
                    <th className="p-2 border-b">الاولوية</th>
                    <th className="p-2 border-b">الحالة</th>
                    <th className="p-2 border-b">التاريخ</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td className="p-2 border-b">{ticket.title}</td>
                      <td className="p-2 border-b">{ticket.user}</td>
                      <td className="p-2 border-b">{ticket.priority}</td>
                      <td className="p-2 border-b">{ticket.status}</td>
                      <td className="p-2 border-b">{ticket.date}</td>
                      <td className="p-2 border-b">
                        <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => handleUpdateSupportTicketStatus(ticket.id, 'resolved')}>
                          <FaCheck />
                        </button>
                        <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleUpdateSupportTicketStatus(ticket.id, 'closed')}>
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "complaints" && (
            <div>
              <h2 className="text-xl font-bold mb-4">الشكاوى</h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">عنوان الشكوى</th>
                    <th className="p-2 border-b">المدرسة</th>
                    <th className="p-2 border-b">المستخدم</th>
                    <th className="p-2 border-b">الاولوية</th>
                    <th className="p-2 border-b">الحالة</th>
                    <th className="p-2 border-b">التاريخ</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td className="p-2 border-b">{complaint.title}</td>
                      <td className="p-2 border-b">{complaint.school}</td>
                      <td className="p-2 border-b">{complaint.user}</td>
                      <td className="p-2 border-b">{complaint.priority}</td>
                      <td className="p-2 border-b">{complaint.status}</td>
                      <td className="p-2 border-b">{complaint.date}</td>
                      <td className="p-2 border-b">
                        <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => handleUpdateComplaintStatus(complaint.id, 'resolved')}>
                          <FaCheck />
                        </button>
                        <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleUpdateComplaintStatus(complaint.id, 'closed')}>
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "reports" && (
            <div>
              <h2 className="text-xl font-bold mb-4">التقارير</h2>
              <table className="w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 border-b">عنوان التقرير</th>
                    <th className="p-2 border-b">النوع</th>
                    <th className="p-2 border-b">التاريخ</th>
                    <th className="p-2 border-b">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td className="p-2 border-b">{report.title}</td>
                      <td className="p-2 border-b">{report.type}</td>
                      <td className="p-2 border-b">{report.date}</td>
                      <td className="p-2 border-b">
                        <button className="bg-green-500 text-white p-1 rounded-lg mr-1" onClick={() => handleExportReport(report.id)}>
                          <FaDownload />
                        </button>
                        <button className="bg-red-500 text-white p-1 rounded-lg" onClick={() => handleDeleteReport(report.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-4">الإعدادات</h2>
              <p>هنا يمكنك تخصيص إعدادات النظام.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Table Component
  const DataTable = ({ headers, data, actions }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Enhanced Sidebar
  const Sidebar = () => {
    const menuItems = [
      { id: "overview", label: "النظرة العامة", icon: FaChartPie },
      { id: "users", label: "إدارة المستخدمين", icon: FaUsers },
      { id: "supervisor-links", label: "دعوات المشرفين", icon: FaLink },
      { id: "schools", label: "إدارة المدارس", icon: FaSchool },
      { id: "complaints", label: "الشكاوى والتقييمات", icon: FaExclamationTriangle },
      { id: "support", label: "الدعم الفني", icon: FaHeadset },
      { id: "reports", label: "التقارير", icon: FaFileAlt },
      { id: "settings", label: "الإعدادات", icon: FaCog },
    ];

    return (
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ر</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900">لوحة المدير</h2>
                  <p className="text-sm text-gray-500">إدارة النظام</p>
                </div>
              )}
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-right transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="text-lg" />
                {sidebarOpen && <span className="mr-3 font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    );
  };

  // Content sections
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">النظرة العامة</h1>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                  <FaDownload />
                  <span>تصدير التقرير</span>
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <StatsCard
                title="إجمالي المستخدمين"
                count={stats.totalUsers.toLocaleString()}
                icon={FaUsers}
                color="bg-blue-500"
                change="+12%"
                onClick={() => setActiveTab("users")}
              />
              <StatsCard
                title="المستخدمون النشيطون"
                count={stats.activeUsers.toLocaleString()}
                icon={FaUserCheck}
                color="bg-green-500"
                change="+8%"
                onClick={() => setActiveTab("users")}
              />
              <StatsCard
                title="الطلبات المعلقة"
                count={stats.pendingRequests}
                icon={FaClipboardList}
                color="bg-yellow-500"
                change="-5%"
                onClick={() => setActiveTab("users")}
              />
              <StatsCard
                title="تذاكر الدعم"
                count={stats.supportTickets}
                icon={FaHeadset}
                color="bg-red-500"
                change="+3%"
                onClick={() => setActiveTab("support")}
              />
              <StatsCard
                title="المدارس"
                count={stats.schools}
                icon={FaSchool}
                color="bg-purple-500"
                change="+15%"
                onClick={() => setActiveTab("schools")}
              />
              <StatsCard
                title="الشكاوى النشطة"
                count={stats.complaints}
                icon={FaExclamationTriangle}
                color="bg-orange-500"
                change="-10%"
                onClick={() => setActiveTab("complaints")}
              />
            </div>
            
            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">المستخدمون الجدد</h3>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      عرض الكل
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUsers className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email} • {user.role}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'معلق'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 flex flex-col items-center space-y-2 transition-colors"
                    >
                      <FaPlus className="text-lg" />
                      <span className="text-sm font-medium">إضافة مستخدم</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('schools')}
                      className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 flex flex-col items-center space-y-2 transition-colors"
                    >
                      <FaSchool className="text-lg" />
                      <span className="text-sm font-medium">إدارة المدارس</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('support')}
                      className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 flex flex-col items-center space-y-2 transition-colors"
                    >
                      <FaHeadset className="text-lg" />
                      <span className="text-sm font-medium">الدعم الفني</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('reports')}
                      className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 flex flex-col items-center space-y-2 transition-colors"
                    >
                      <FaFileAlt className="text-lg" />
                      <span className="text-sm font-medium">التقارير</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
              <button 
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaPlus />
                <span>إضافة مستخدم جديد</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">جميع المستخدمين</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                      <FaSearch />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DataTable
                  headers={["اسم المستخدم", "البريد الإلكتروني", "الدور", "الحالة", "تاريخ الانضمام", "آخر تسجيل دخول"]}
                  data={users}
                  actions={true}
                />
              </div>
            </div>
          </div>
        );

      case "schools":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">إدارة المدارس</h1>
              <button 
                onClick={() => setShowAddSchoolModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaPlus />
                <span>إضافة مدرسة جديدة</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">جميع المدارس</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                      <FaSearch />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DataTable
                  headers={["اسم المدرسة", "النوع", "عدد الطلاب", "التقييم", "الحالة"]}
                  data={schools}
                  actions={true}
                />
              </div>
            </div>
          </div>
        );

      case "complaints":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الشكاوى والتقييمات</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                <FaPlus />
                <span>إضافة شكوى جديدة</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">جميع الشكاوى</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                      <FaSearch />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DataTable
                  headers={["عنوان الشكوى", "المستخدم", "الاولوية", "الحالة", "التاريخ"]}
                  data={supportTickets}
                  actions={true}
                />
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الدعم الفني</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                <FaPlus />
                <span>إنشاء تذكرة دعم جديدة</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">جميع تذاكر الدعم</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                      <FaSearch />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DataTable
                  headers={["عنوان الشكوى", "المستخدم", "الاولوية", "الحالة", "التاريخ"]}
                  data={supportTickets}
                  actions={true}
                />
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                <FaDownload />
                <span>تصدير التقرير</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">جميع التقارير</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                      <FaSearch />
                      <span>بحث</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DataTable
                  headers={["عنوان التقرير", "المستخدم", "التاريخ"]}
                  data={supportTickets}
                  actions={true}
                />
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                <FaCog />
                <span>تعديل الإعدادات</span>
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث عن مستخدم..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">جميع الأدوار</option>
                    <option value="admin">مدير</option>
                    <option value="supervisor">مشرف</option>
                    <option value="school_manager">مدير مدرسة</option>
                    <option value="parent">ولي أمر</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">جميع الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="pending">معلق</option>
                    <option value="suspended">موقوف</option>
                  </select>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2 space-x-reverse">
                    <FaFilter />
                    <span>تصفية</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدور
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التسجيل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        آخر دخول
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-800 font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="mr-3">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{
                            'admin': 'مدير',
                            'supervisor': 'مشرف',
                            'school_manager': 'مدير مدرسة',
                            'parent': 'ولي أمر'
                          }[user.role]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status === 'active' ? 'نشط' : 
                             user.status === 'pending' ? 'معلق' :
                             user.status === 'suspended' ? 'موقوف' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin === 'never' ? 'لم يدخل مطلقاً' : user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.status === 'pending' ? (
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                                title="موافقة"
                              >
                                <FaCheck className="ml-1" />
                                <span>موافقة</span>
                              </button>
                              <button
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600 hover:text-red-900 flex items-center mr-2"
                                title="رفض"
                              >
                                <FaTimes className="ml-1" />
                                <span>رفض</span>
                              </button>
                            </div>
                          ) : user.status === 'suspended' ? (
                            <span className="text-gray-500 text-xs">موقوف</span>
                          ) : (
                            <div className="flex space-x-2 space-x-reverse">
                              <button 
                                onClick={() => openEditUserModal(user)}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title="تعديل"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="حذف"
                              >
                                <FaTrash />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="عرض">
                                <FaEye />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Modals */}
            <AddUserModal />
            <EditUserModal />
          </div>
        );

      case "pending-requests":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الطلبات المعلقة</h1>
              <button 
                onClick={fetchPendingUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaSync />
                <span>تحديث</span>
              </button>
            </div>
            
            {/* Pending Requests Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي الطلبات المعلقة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => user.status === 'pending').length}
                    </p>
                  </div>
                  <FaUserTie className="text-blue-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">طلبات المشرفين</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => user.status === 'pending' && user.role === 'supervisor').length}
                    </p>
                  </div>
                  <FaUserTie className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">طلبات مديري المدارس</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(user => user.status === 'pending' && user.role === 'school_manager').length}
                    </p>
                  </div>
                  <FaSchool className="text-purple-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Pending Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">الطلبات المعلقة</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدور
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التسجيل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter(user => user.status === 'pending')
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-800 font-medium">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="mr-3">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{
                              'admin': 'مدير',
                              'supervisor': 'مشرف',
                              'school_manager': 'مدير مدرسة',
                              'parent': 'ولي أمر'
                            }[user.role]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                                title="موافقة"
                              >
                                <FaCheck className="ml-1" />
                                <span>موافقة</span>
                              </button>
                              <button
                                onClick={() => handleRejectUser(user.id)}
                                className="text-red-600 hover:text-red-900 flex items-center mr-2"
                                title="رفض"
                              >
                                <FaTimes className="ml-1" />
                                <span>رفض</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {users.filter(user => user.status === 'pending').length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          لا توجد ط
                          لبات معلقة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "supervisor-links":
        return <SupervisorLinksManagement />;

      case "principal-links":
        return <PrincipalLinksManagement />;

      case "support":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الدعم الفني</h1>
              <div className="flex space-x-2 space-x-reverse">
                <button 
                  onClick={fetchAllSupportTickets}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                >
                  <FaSync />
                  <span>تحديث</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  تصدير التذاكر
                </button>
              </div>
            </div>
            
            {/* Support Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي التذاكر</p>
                    <p className="text-2xl font-bold text-gray-900">{supportTickets.length}</p>
                  </div>
                  <FaHeadset className="text-blue-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">التذاكر المفتوحة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {supportTickets.filter(ticket => ticket.status === 'open').length}
                    </p>
                  </div>
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">قيد المعالجة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {supportTickets.filter(ticket => ticket.status === 'in_progress').length}
                    </p>
                  </div>
                  <FaClipboardList className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">تم الحل</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {supportTickets.filter(ticket => ticket.status === 'resolved').length}
                    </p>
                  </div>
                  <FaUserCheck className="text-green-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Support Tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">تذاكر الدعم الحديثة</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">بواسطة: {ticket.user} • {ticket.date}</p>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority === 'high' ? 'عالية' : ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status === 'open' ? 'مفتوح' : ticket.status === 'in_progress' ? 'قيد المعالجة' : 'تم الحل'}
                        </span>
                        <div className="flex space-x-2 space-x-reverse">
                          <select 
                            value={ticket.status}
                            onChange={(e) => handleUpdateSupportTicketStatus(ticket.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="open">مفتوح</option>
                            <option value="in_progress">قيد المعالجة</option>
                            <option value="resolved">تم الحل</option>
                          </select>
                          <button className="text-blue-600 hover:text-blue-800">
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "schools":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">إدارة المدارس</h1>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
              >
                <FaPlus />
                <span>إضافة مدرسة جديدة</span>
              </button>
            </div>
            
            {/* Schools Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي المدارس</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <FaSchool className="text-blue-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">مدارس ابتدائية</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <FaSchool className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">مدارس متوسطة</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                  </div>
                  <FaSchool className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">مدارس ثانوية</p>
                    <p className="text-2xl font-bold text-gray-900">25</p>
                  </div>
                  <FaSchool className="text-purple-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Schools Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">قائمة المدارس</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المدرسة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الطلاب</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schools.map((school) => (
                        <tr key={school.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{school.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {school.type === 'primary' ? 'ابتدائي' : 
                             school.type === 'middle' ? 'متوسط' : 'ثانوي'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.students || '0'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.rating || '0'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {school.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2 space-x-reverse">
                              <button 
                                onClick={() => openEditSchoolModal(school)}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title="تعديل"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteSchool(school.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="حذف"
                              >
                                <FaTrash />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded" title="عرض">
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case "complaints":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">الشكاوى والتقييمات</h1>
              <div className="flex space-x-2 space-x-reverse">
                <button 
                  onClick={fetchAllComplaints}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                >
                  <FaSync />
                  <span>تحديث</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                  <FaDownload />
                  <span>تصدير تقرير</span>
                </button>
              </div>
            </div>
            
            {/* Complaints Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي الشكاوى</p>
                    <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
                  </div>
                  <FaExclamationTriangle className="text-orange-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">شكاوى مفتوحة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complaints.filter(complaint => complaint.status === 'open').length}
                    </p>
                  </div>
                  <FaClock className="text-red-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">قيد المعالجة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complaints.filter(complaint => complaint.status === 'in_progress').length}
                    </p>
                  </div>
                  <FaClipboardList className="text-yellow-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">تم حلها</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {complaints.filter(complaint => complaint.status === 'resolved').length}
                    </p>
                  </div>
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Complaints List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">شكاوى حديثة</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{complaint.school} - بواسطة: {complaint.user}</p>
                          <p className="text-xs text-gray-500 mt-2">{complaint.date}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                            complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {complaint.priority === 'high' ? 'عالية' : complaint.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            complaint.status === 'open' ? 'bg-red-100 text-red-800' :
                            complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {complaint.status === 'open' ? 'جديد' : complaint.status === 'in_progress' ? 'قيد المعالجة' : 'تم الحل'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2 space-x-reverse">
                        <select 
                          value={complaint.status}
                          onChange={(e) => handleUpdateComplaintStatus(complaint.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="open">جديد</option>
                          <option value="in_progress">قيد المعالجة</option>
                          <option value="resolved">تم الحل</option>
                        </select>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">عرض</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">رد</button>
                        <button className="text-orange-600 hover:text-orange-800 text-sm">تحويل</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
              <div className="flex space-x-2 space-x-reverse">
                <button 
                  onClick={fetchAllReports}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                >
                  <FaSync />
                  <span>تحديث</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse">
                  <FaDownload />
                  <span>تصدير تقرير</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse">
                  <FaPlus />
                  <span>تقرير جديد</span>
                </button>
              </div>
            </div>
            
            {/* Reports Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">تقارير شهرية</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(report => report.type === 'monthly').length}
                    </p>
                  </div>
                  <FaFileAlt className="text-blue-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">تقارير تفصيلية</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(report => report.type === 'detailed').length}
                    </p>
                  </div>
                  <FaChartPie className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">تقارير مخصصة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reports.filter(report => report.type === 'custom').length}
                    </p>
                  </div>
                  <FaStar className="text-yellow-500 text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Reports List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">آخر التقارير</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <FaFileAlt className="text-blue-500 text-lg" />
                        <div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">تقرير شامل عن أداء المدارس والشكاوى</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-sm text-gray-500">{report.date}</span>
                        <button 
                          onClick={() => handleExportReport(report.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="تصدير"
                        >
                          <FaDownload />
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="عرض">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600 hover:text-red-800"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
            
            {/* System Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات النظام</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم النظام</label>
                    <input 
                      type="text" 
                      defaultValue="نظام إدارة المدارس - رؤانا"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">بريد النظام</label>
                    <input 
                      type="email" 
                      defaultValue="admin@ruaa.sa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">تفعيل الإشعارات</p>
                    <p className="text-sm text-gray-600">إرسال إشعارات للمستخدمين</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <button 
                  onClick={() => {
                    // In a real implementation, this would save the system settings to the backend
                    // For now, we'll just show a success message
                    toast.success('تم حفظ الإعدادات بنجاح');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
            
            {/* User Management Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المستخدمين</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">السماح بالتسجيل الجديد</p>
                    <p className="text-sm text-gray-600">تفعيل إمكانية تسجيل مستخدمين جدد</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">مراجعة الحسابات الجديدة</p>
                    <p className="text-sm text-gray-600">يتطلب موافقة المدير للحسابات الجديدة</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <button 
                  onClick={() => {
                    // In a real implementation, this would save the user management settings to the backend
                    // For now, we'll just show a success message
                    toast.success('تم حفظ إعدادات المستخدمين بنجاح');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">قريباً...</h2>
            <p className="text-gray-600 mt-2">هذا القسم قيد التطوير</p>
          </div>
        );
    }
  };

  // Add User Modal Component
  const AddUserModal = () => {
    if (!showAddUserModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إضافة مستخدم جديد</h3>
            <button 
              onClick={closeAddUserModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleAddUserSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="parent">ولي أمر</option>
                  <option value="supervisor">مشرف</option>
                  <option value="school_manager">مدير مدرسة</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  name="status"
                  value={userForm.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="pending">معلق</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={closeAddUserModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                إضافة المستخدم
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit User Modal Component
  const EditUserModal = () => {
    if (!showEditUserModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">تعديل المستخدم</h3>
            <button 
              onClick={closeEditUserModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleEditUserSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="parent">ولي أمر</option>
                  <option value="supervisor">مشرف</option>
                  <option value="school_manager">مدير مدرسة</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  name="status"
                  value={userForm.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="pending">معلق</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={closeEditUserModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add School Modal Component
  const AddSchoolModal = () => {
    if (!showAddSchoolModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إضافة مدرسة جديدة</h3>
            <button 
              onClick={closeAddSchoolModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleAddSchoolSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدرسة</label>
                <input
                  type="text"
                  name="name"
                  value={schoolForm.name}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  name="type"
                  value={schoolForm.type}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="primary">ابتدائي</option>
                  <option value="middle">متوسط</option>
                  <option value="high">ثانوي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  name="address"
                  value={schoolForm.address}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  value={schoolForm.phone}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={closeAddSchoolModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                إضافة المدرسة
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit School Modal Component
  const EditSchoolModal = () => {
    if (!showEditSchoolModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">تعديل المدرسة</h3>
            <button 
              onClick={closeEditSchoolModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleEditSchoolSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدرسة</label>
                <input
                  type="text"
                  name="name"
                  value={schoolForm.name}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  name="type"
                  value={schoolForm.type}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="primary">ابتدائي</option>
                  <option value="middle">متوسط</option>
                  <option value="high">ثانوي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  name="address"
                  value={schoolForm.address}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  value={schoolForm.phone}
                  onChange={handleSchoolFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={closeEditSchoolModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
      <div className="flex">
        <Sidebar />
        
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "mr-64" : "mr-20"
          }`}
        >
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <FaCog className="text-lg" />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-900">
                    لوحة تحكم المدير
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse">
                  <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <FaBell className="text-lg" />
                    <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">م</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">مدير النظام</p>
                      <p className="text-xs text-gray-500">admin@ruaa.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Global Modals */}
      <AddUserModal />
      <EditUserModal />
      <AddSchoolModal />
      <EditSchoolModal />
    </div>
  );
};

export default AdminDashboardComplete;

