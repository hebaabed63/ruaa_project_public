import React, { useState, useEffect } from 'react';
import DashboardSwitcher from '../../components/common/DashboardSwitcher';
import usePageTitle from '../../hooks/usePageTitle';
import { 
  FaSchool, 
  FaExclamationTriangle, 
  FaCog,
  FaSearch,
  FaStar,
  FaHome,
  FaMapMarkerAlt,
  FaHeart,
  FaBalanceScale,
  FaUserCircle,
  FaChild,
  FaEye,
  FaPlus,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaComment,
  FaPaperPlane,
  FaReply,
  FaChartBar,
  FaCalendarAlt
} from 'react-icons/fa';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  usePageTitle('لوحة تحكم أولياء الأمور');
  
  // State for school search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filteredSchools, setFilteredSchools] = useState([]);
  
  // State for complaints
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  
  // State for ratings
  const [showNewRating, setShowNewRating] = useState(false);
  const [newRating, setNewRating] = useState({
    school: '',
    overallRating: 0,
    teachingQuality: 0,
    facilities: 0,
    communication: 0,
    review: ''
  });

  // State for comparison
  const [selectedSchoolsForComparison, setSelectedSchoolsForComparison] = useState([]);
  
  // Sample data for parent dashboard
  const statsData = [
    { title: 'الأبناء المسجلين', value: '2', change: '0', icon: FaChild, color: 'bg-purple-500' },
    { title: 'المدارس المفضلة', value: '3', change: '+1', icon: FaHeart, color: 'bg-red-500' },
    { title: 'الشكاوى المقدمة', value: '1', change: '0', icon: FaExclamationTriangle, color: 'bg-orange-500' },
    { title: 'التقييمات المقدمة', value: '4', change: '+2', icon: FaStar, color: 'bg-yellow-500' }
  ];

  // Children data
  const childrenData = [
    { id: 1, name: 'محمد أحمد', grade: 'الصف الخامس الابتدائي', school: 'مدرسة النجاح الابتدائية', performance: 'ممتاز' },
    { id: 2, name: 'فاطمة أحمد', grade: 'الصف الثاني المتوسط', school: 'مدرسة الأمل المتوسطة', performance: 'جيد جداً' }
  ];

  // Available schools data
  const schoolsData = [
    { 
      id: 1, 
      name: 'مدرسة النجاح الابتدائية', 
      location: 'الرياض - حي النرجس', 
      type: 'ابتدائي', 
      students: 450, 
      teachers: 18, 
      overallRating: 4.5,
      fees: '15000 ريال/سنة',
      distance: '2.5 كم',
      reviews: 127
    },
    { 
      id: 2, 
      name: 'مدرسة الأمل المتوسطة', 
      location: 'الرياض - حي الملقا', 
      type: 'متوسط', 
      students: 320, 
      teachers: 15, 
      overallRating: 4.2,
      fees: '18000 ريال/سنة',
      distance: '3.2 كم',
      reviews: 89
    },
    { 
      id: 3, 
      name: 'مدرسة المستقبل الثانوية', 
      location: 'الرياض - حي العليا', 
      type: 'ثانوي', 
      students: 280, 
      teachers: 20, 
      overallRating: 4.8,
      fees: '22000 ريال/سنة',
      distance: '4.1 كم',
      reviews: 156
    }
  ];

  // Additional data for enhanced functionality
  const complaintsData = [
    {
      id: 1,
      title: 'مشكلة في جودة التعليم',
      school: 'مدرسة النجاح الابتدائية',
      status: 'جديد',
      priority: 'عالية',
      date: '2024-01-20',
      description: 'أود التعبير عن قلقي حول مستوى التعليم في الفصل...'
    },
    {
      id: 2,
      title: 'استفسار حول النقل المدرسي',
      school: 'مدرسة الأمل المتوسطة',
      status: 'قيد المراجعة',
      priority: 'متوسطة',
      date: '2024-01-18',
      description: 'أحتاج لمعرفة تفاصيل النقل المدرسي للفصل القادم...'
    }
  ];

  const ratingsData = [
    {
      id: 1,
      school: 'مدرسة النجاح الابتدائية',
      overallRating: 4.5,
      teachingQuality: 4.2,
      facilities: 4.8,
      communication: 4.3,
      date: '2024-01-15',
      review: 'مدرسة ممتازة مع معلمين مؤهلين وبيئة تعليمية جيدة'
    },
    {
      id: 2,
      school: 'مدرسة الأمل المتوسطة',
      overallRating: 4.2,
      teachingQuality: 4.0,
      facilities: 4.5,
      communication: 4.0,
      date: '2024-01-10',
      review: 'مدرسة جيدة لكن تحتاج تحسين في التواصل مع الأهالي'
    }
  ];

  // Initialize filtered schools
  useEffect(() => {
    setFilteredSchools(schoolsData);
  }, [schoolsData]);

  // School Search Function
  const renderSchoolSearch = () => {
    const handleSearch = (term, type) => {
      let filtered = schoolsData;
      
      if (term) {
        filtered = filtered.filter(school => 
          school.name.includes(term) || 
          school.location.includes(term)
        );
      }
      
      if (type !== 'all') {
        filtered = filtered.filter(school => school.type === type);
      }
      
      setFilteredSchools(filtered);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">البحث عن مدارس</h1>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 space-x-reverse transition-all duration-300 shadow-md">
            <FaFilter />
            <span>فلاتر متقدم</span>
          </button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">ابحث عن مدرسة</label>
              <div className="relative">
                <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="اسم المدرسة أو الموقع..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value, filterType);
                  }}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع المدرسة</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  handleSearch(searchTerm, e.target.value);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                <option value="all">جميع المدارس</option>
                <option value="ابتدائي">ابتدائي</option>
                <option value="متوسط">متوسط</option>
                <option value="ثانوي">ثانوي</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Search Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchools.map((school) => (
            <div key={school.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{school.name}</h3>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{school.location}</span>
                    <span className="text-gray-400">•</span>
                    <span>{school.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse mb-4">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(school.overallRating) ? 'text-amber-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{school.overallRating}</span>
                    <span className="text-sm text-gray-500">({school.reviews} تقييم)</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    school.type === 'ابتدائي' ? 'bg-blue-100 text-blue-800' :
                    school.type === 'متوسط' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {school.type}
                  </span>
                  <button className="text-red-500 hover:text-red-700 transition-colors duration-300">
                    <FaHeart className="text-xl" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">الطلاب</p>
                  <p className="font-semibold text-lg">{school.students}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">المعلمين</p>
                  <p className="font-semibold text-lg">{school.teachers}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">الرسوم</p>
                  <p className="font-semibold text-lg text-green-600">{school.fees}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 space-x-reverse">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center space-x-2 space-x-reverse transition-all duration-300 shadow-sm">
                  <FaEye />
                  <span>عرض التفاصيل</span>
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 flex items-center justify-center space-x-2 space-x-reverse transition-all duration-300 shadow-sm">
                  <FaStar />
                  <span>تقييم</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSchools.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <FaSearch className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>
    );
  };

  // Complaints Function
  const renderComplaints = () => {

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">الشكاوى</h1>
          <button 
            onClick={() => setShowNewComplaint(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 flex items-center space-x-2 space-x-reverse transition-all duration-300 shadow-md"
          >
            <FaPlus />
            <span>شكوى جديدة</span>
          </button>
        </div>
        
        {/* Complaints Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الشكاوى</p>
                <p className="text-2xl font-bold text-gray-900">{complaintsData.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaExclamationTriangle className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">جديدة</p>
                <p className="text-2xl font-bold text-gray-900">{complaintsData.filter(c => c.status === 'جديد').length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaClock className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قيد المراجعة</p>
                <p className="text-2xl font-bold text-gray-900">{complaintsData.filter(c => c.status === 'قيد المراجعة').length}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <FaComment className="text-amber-500 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">تم الحل</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>
        
        {/* New Complaint Form */}
        {showNewComplaint && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">شكوى جديدة</h3>
              <button 
                onClick={() => setShowNewComplaint(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدرسة</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white">
                    <option>اختر المدرسة</option>
                    {schoolsData.map(school => (
                      <option key={school.id} value={school.name}>{school.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white">
                    <option value="منخفضة">منخفضة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="عالية">عالية</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الشكوى</label>
                <input 
                  type="text" 
                  placeholder="موضوع الشكوى..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تفاصيل الشكوى</label>
                <textarea 
                  rows="5"
                  placeholder="اشرح شكواك بالتفصيل..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:space-x-3 sm:space-x-reverse gap-3">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center space-x-2 space-x-reverse transition-all duration-300 shadow-md"
                >
                  <FaPaperPlane />
                  <span>إرسال الشكوى</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNewComplaint(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Complaints List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">شكاوى سابقة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {complaintsData.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 hover:shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{complaint.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{complaint.school}</p>
                      <p className="text-gray-700">{complaint.description}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        complaint.status === 'جديد' ? 'bg-blue-100 text-blue-800' :
                        complaint.status === 'قيد المراجعة' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        complaint.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'متوسطة' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 mb-2 sm:mb-0">{complaint.date}</span>
                    <div className="flex space-x-3 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 space-x-reverse transition-colors duration-300">
                        <FaEye className="text-base" />
                        <span>عرض</span>
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1 space-x-reverse transition-colors duration-300">
                        <FaReply className="text-base" />
                        <span>رد</span>
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
  };

  // Ratings and Evaluations Function
  const renderRatings = () => {
    const StarRating = ({ rating, setRating, readonly = false }) => {
      return (
        <div className="flex items-center space-x-1 space-x-reverse">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`cursor-pointer ${
                i < rating ? 'text-yellow-400' : 'text-gray-300'
              } ${readonly ? 'cursor-default' : 'hover:text-yellow-400'}`}
              onClick={() => !readonly && setRating(i + 1)}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">التقييمات</h1>
          <button 
            onClick={() => setShowNewRating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
          >
            <FaPlus />
            <span>تقييم جديد</span>
          </button>
        </div>
        
        {/* Rating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي التقييمات</p>
                <p className="text-2xl font-bold text-gray-900">{ratingsData.length}</p>
              </div>
              <FaStar className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط تقييماتي</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(ratingsData.reduce((acc, r) => acc + r.overallRating, 0) / ratingsData.length).toFixed(1)}
                </p>
              </div>
              <FaChartBar className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">آخر تقييم</p>
                <p className="text-2xl font-bold text-gray-900">{ratingsData[0]?.date || 'لا يوجد'}</p>
              </div>
              <FaCalendarAlt className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>
        
        {/* New Rating Form */}
        {showNewRating && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">تقييم جديد</h3>
              <button 
                onClick={() => setShowNewRating(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدرسة</label>
                <select 
                  value={newRating.school}
                  onChange={(e) => setNewRating({...newRating, school: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر المدرسة</option>
                  {schoolsData.map(school => (
                    <option key={school.id} value={school.name}>{school.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقييم العام</label>
                  <StarRating 
                    rating={newRating.overallRating} 
                    setRating={(rating) => setNewRating({...newRating, overallRating: rating})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">جودة التعليم</label>
                  <StarRating 
                    rating={newRating.teachingQuality} 
                    setRating={(rating) => setNewRating({...newRating, teachingQuality: rating})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المرافق</label>
                  <StarRating 
                    rating={newRating.facilities} 
                    setRating={(rating) => setNewRating({...newRating, facilities: rating})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التواصل</label>
                  <StarRating 
                    rating={newRating.communication} 
                    setRating={(rating) => setNewRating({...newRating, communication: rating})} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ujaعتك</label>
                <textarea 
                  rows="4"
                  value={newRating.review}
                  onChange={(e) => setNewRating({...newRating, review: e.target.value})}
                  placeholder="اكتب مراجعتك هنا..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="flex space-x-3 space-x-reverse">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                >
                  <FaPaperPlane />
                  <span>نشر التقييم</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowNewRating(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Previous Ratings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">تقييماتي السابقة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {ratingsData.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{rating.school}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">التقييم العام</p>
                          <StarRating rating={rating.overallRating} readonly={true} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">جودة التعليم</p>
                          <StarRating rating={rating.teachingQuality} readonly={true} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">المرافق</p>
                          <StarRating rating={rating.facilities} readonly={true} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">التواصل</p>
                          <StarRating rating={rating.communication} readonly={true} />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{rating.review}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-sm text-gray-500">{rating.date}</span>
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // School Comparison Function
  const renderComparison = () => {
    const toggleSchoolSelection = (school) => {
      if (selectedSchoolsForComparison.find(s => s.id === school.id)) {
        setSelectedSchoolsForComparison(selectedSchoolsForComparison.filter(s => s.id !== school.id));
      } else if (selectedSchoolsForComparison.length < 3) {
        setSelectedSchoolsForComparison([...selectedSchoolsForComparison, school]);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">مقارنة المدارس</h1>
          <p className="text-sm text-gray-600">اختر حتى 3 مدارس للمقارنة</p>
        </div>
        
        {/* School Selection */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">اختر المدارس للمقارنة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schoolsData.map((school) => (
              <div 
                key={school.id} 
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                  selectedSchoolsForComparison.find(s => s.id === school.id) 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
                onClick={() => toggleSchoolSelection(school)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{school.name}</h4>
                  {selectedSchoolsForComparison.find(s => s.id === school.id) && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1 space-x-reverse mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(school.overallRating) ? 'text-amber-400 text-sm' : 'text-gray-300 text-sm'} />
                    ))}
                  </div>
                  <span className="text-sm font-medium mr-1">{school.overallRating}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">النوع:</span> {school.type}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">الطلاب:</span> {school.students}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comparison Table */}
        {selectedSchoolsForComparison.length > 1 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h3 className="text-lg font-semibold text-white">مقارنة المدارس المختارة</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border-l border-gray-200">المعيار</th>
                    {selectedSchoolsForComparison.map((school) => (
                      <th key={school.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 min-w-[180px]">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{school.name}</span>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < Math.floor(school.overallRating) ? 'text-amber-400 text-xs' : 'text-gray-300 text-xs'} />
                            ))}
                            <span className="text-xs text-gray-600 mr-1">{school.overallRating}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">التقييم العام</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1 space-x-reverse">
                          <FaStar className="text-amber-400" />
                          <span className="font-medium">{school.overallRating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">عدد الطلاب</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center font-medium">{school.students}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">عدد المعلمين</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center font-medium">{school.teachers}</td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">الرسوم السنوية</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center font-medium text-green-600">{school.fees}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">المسافة</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center font-medium">{school.distance}</td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-200">عدد المراجعات</td>
                    {selectedSchoolsForComparison.map((school) => (
                      <td key={school.id} className="px-6 py-4 text-center font-medium">{school.reviews}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {selectedSchoolsForComparison.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <FaBalanceScale className="mx-auto text-gray-300 text-5xl mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">ابدأ المقارنة</h3>
            <p className="text-gray-500">اختر المدارس من الأعلى لبدء المقارنة</p>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.includes('+') ? 'text-green-600' : stat.change === '0' ? 'text-gray-500' : 'text-red-600'}`}>
                  {stat.change === '0' ? 'لا توجد تغييرات' : `${stat.change} هذا الشهر`}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg transform transition-transform duration-300 hover:scale-110`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Children Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h3 className="text-lg font-semibold text-white">نظرة على أطفالي</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childrenData.map((child) => (
              <div key={child.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <FaChild className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{child.name}</h4>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">المدرسة:</span>
                    <span className="font-medium text-gray-800">{child.school}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الأداء:</span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      child.performance === 'ممتاز' ? 'bg-green-100 text-green-800' :
                      child.performance === 'جيد جداً' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {child.performance}
                    </span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse">
                  <FaEye />
                  <span>عرض التفاصيل</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">إجراءات سريعة</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setActiveTab('schools')}
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-medium shadow-sm"
            >
              <FaSearch />
              <span>البحث عن مدارس</span>
            </button>
            <button 
              onClick={() => setActiveTab('complaints')}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-medium shadow-sm"
            >
              <FaExclamationTriangle />
              <span>تقديم شكوى</span>
            </button>
            <button 
              onClick={() => setActiveTab('ratings')}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-medium shadow-sm"
            >
              <FaStar />
              <span>تقييم مدرسة</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div className="flex items-start space-x-4 space-x-reverse group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FaStar className="text-blue-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">قيمت مدرسة النجاح</p>
                  <p className="text-xs text-gray-500 mt-1">منذ يومين</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 space-x-reverse group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FaExclamationTriangle className="text-orange-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">تم الرد على شكواك</p>
                  <p className="text-xs text-gray-500 mt-1">منذ 3 أيام</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 space-x-reverse group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FaHeart className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">أضفت مدرسة للمفضلة</p>
                  <p className="text-xs text-gray-500 mt-1">منذ أسبوع</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Schools */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">أعلى المدارس تقييماً</h3>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {schoolsData.slice(0, 3).map((school, index) => (
                <div key={school.id} className="flex items-center space-x-4 space-x-reverse group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <FaSchool className="text-blue-600" />
                    </div>
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{school.name}</p>
                    <div className="flex items-center space-x-1 space-x-reverse mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(school.overallRating) ? 'text-amber-400 text-xs' : 'text-gray-300 text-xs'} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 mr-1">{school.overallRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Function
  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-5">
          <h3 className="text-lg font-semibold text-gray-900">إعدادات الملف الشخصي</h3>
        </div>
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input 
                type="text" 
                defaultValue="أحمد محمد السعد"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                defaultValue="ahmed.alsaad@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input 
                type="tel" 
                defaultValue="+966501234567"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
              <select 
                defaultValue="الرياض"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
              >
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 space-x-reverse transition-all duration-300 shadow-md"
          >
            <FaEdit />
            <span>حفظ التغييرات</span>
          </button>
        </form>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-5">
          <h3 className="text-lg font-semibold text-gray-900">إعدادات الإشعارات</h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">إشعارات البريد الإلكتروني</p>
              <p className="text-sm text-gray-600">استقبال إشعارات عبر البريد الإلكتروني</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">إشعارات الرسائل النصية</p>
              <p className="text-sm text-gray-600">استقبال إشعارات عبر الرسائل النصية</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: FaHome },
    { id: 'schools', label: 'البحث عن مدارس', icon: FaSearch },
    { id: 'complaints', label: 'الشكاوى', icon: FaExclamationTriangle },
    { id: 'ratings', label: 'التقييمات', icon: FaStar },
    { id: 'comparison', label: 'مقارنة المدارس', icon: FaBalanceScale },
    { id: 'settings', label: 'الإعدادات', icon: FaCog }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">أحمد محمد السعد</h3>
              <p className="text-sm text-gray-600">ولي أمر</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">لوحة تحكم أولياء الأمور</h1>
            <p className="text-gray-600">إدارة وتتبع المدارس والتقييمات والشكاوى</p>
          </div>
          
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'schools' && renderSchoolSearch()}
          {activeTab === 'complaints' && renderComplaints()}
          {activeTab === 'ratings' && renderRatings()}
          {activeTab === 'comparison' && renderComparison()}
          {activeTab === 'settings' && renderSettings()}

        </div>
      </div>
      <DashboardSwitcher />
    </div>
  );
};

export default ParentDashboard;
