import React from 'react';
import { FaUser, FaStar, FaGraduationCap, FaBook } from 'react-icons/fa';

const TeachersTab = ({ school }) => {
  // بيانات وهمية للمعلمين
  const teachers = [
    {
      id: 1,
      name: 'أ. فاطمة أحمد',
      subject: 'اللغة العربية',
      experience: '8 سنوات',
      rating: 4.5,
      qualifications: ['ماجستير في اللغة العربية', 'دبلوم تربوي'],
      image: 'https://via.placeholder.com/80x80/4f46e5/ffffff?text=ف.أ'
    },
    {
      id: 2,
      name: 'أ. محمد عبدالله',
      subject: 'الرياضيات',
      experience: '12 سنة',
      rating: 4.2,
      qualifications: ['بكالوريوس رياضيات', 'دبلوم تربوي'],
      image: 'https://via.placeholder.com/80x80/059669/ffffff?text=م.ع'
    },
    {
      id: 3,
      name: 'أ. عائشة محمد',
      subject: 'العلوم',
      experience: '6 سنوات',
      rating: 4.7,
      qualifications: ['بكالوريوس كيمياء', 'ماجستير تربية'],
      image: 'https://via.placeholder.com/80x80/dc2626/ffffff?text=ع.م'
    },
    {
      id: 4,
      name: 'أ. سارة حسن',
      subject: 'اللغة الإنجليزية',
      experience: '10 سنوات',
      rating: 4.3,
      qualifications: ['بكالوريوس أدب إنجليزي', 'دبلوم تربوي'],
      image: 'https://via.placeholder.com/80x80/8b5cf6/ffffff?text=س.ح'
    },
    {
      id: 5,
      name: 'أ. خالد إبراهيم',
      subject: 'التاريخ والجغرافيا',
      experience: '15 سنة',
      rating: 4.1,
      qualifications: ['بكالوريوس تاريخ', 'ماجستير جغرافيا'],
      image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=خ.إ'
    }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#8b5cf6';
    if (rating >= 3.5) return '#10b981';
    if (rating >= 3.0) return '#f59e0b';
    if (rating >= 2.0) return '#f97316';
    return '#ef4444';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">قائمة المعلمين</h2>
        <p className="text-gray-600">يضم فريق التدريس {teachers.length} معلم ومعلمة من ذوي الخبرة والكفاءة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={teacher.image} 
                alt={teacher.name} 
                className="w-16 h-16 rounded-full object-cover border-4 border-primary-100" 
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
                <p className="text-primary-600 flex items-center gap-2">
                  <FaBook className="text-sm" />
                  {teacher.subject}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-600 flex items-center gap-2">
                <FaGraduationCap className="text-primary-500" />
                {teacher.experience} خبرة
              </p>
              
              <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                <div className="flex text-yellow-500">
                  {renderStars(teacher.rating)}
                </div>
                <span 
                  className="font-bold text-lg"
                  style={{ color: getRatingColor(teacher.rating) }}
                >
                  {teacher.rating}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">المؤهلات:</h4>
                <ul className="list-disc pr-5 space-y-1 text-sm text-gray-600">
                  {teacher.qualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersTab;
