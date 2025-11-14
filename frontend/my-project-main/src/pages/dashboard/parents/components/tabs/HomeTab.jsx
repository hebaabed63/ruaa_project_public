import React from 'react';
import { FaMedal, FaBullseye, FaTrophy, FaMapMarkerAlt } from 'react-icons/fa';

const HomeTab = ({ school }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3"><FaBullseye className="text-primary-500" /> عن المدرسة</h3>
          <p className="text-gray-600 leading-relaxed mb-4">{school.description}</p>
          <div className="flex items-center gap-2 text-gray-700 mb-4"><FaMapMarkerAlt className="text-primary-500" /> {school.location}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <span className="block text-gray-600">الطلاب</span>
              <strong className="text-2xl text-primary-700">{school.studentsCount}</strong>
            </div>
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <span className="block text-gray-600">المعلمين</span>
              <strong className="text-2xl text-primary-700">{school.teachersCount}</strong>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3"><FaBullseye className="text-primary-500" /> الرؤية</h3>
          <p className="text-gray-600 leading-relaxed">{school.vision}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3"><FaMedal className="text-primary-500" /> الرسالة</h3>
          <p className="text-gray-600 leading-relaxed">{school.mission}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6 md:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-3"><FaTrophy className="text-yellow-500" /> الإنجازات</h3>
          <ul className="list-disc pr-6 space-y-2 text-gray-700">
            {school.achievements?.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
