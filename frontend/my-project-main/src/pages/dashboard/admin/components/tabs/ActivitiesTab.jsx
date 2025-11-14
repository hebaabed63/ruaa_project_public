import React from 'react';
import { FaCalendarCheck, FaFutbol, FaPalette, FaMicroscope } from 'react-icons/fa';

const ActivitiesTab = ({ school }) => {
  const activities = [
    { id: 1, title: 'نادي العلوم', icon: FaMicroscope, desc: 'تجارب علمية ممتعة وأنشطة بحثية' },
    { id: 2, title: 'النشاط الرياضي', icon: FaFutbol, desc: 'دوري كرة قدم وألعاب قوى' },
    { id: 3, title: 'النشاط الفني', icon: FaPalette, desc: 'رسوم تشكيلية وحصص فنية' },
    { id: 4, title: 'الأنشطة التطوعية', icon: FaCalendarCheck, desc: 'مبادرات خدمة المجتمع' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">أنشطة المدرسة</h2>
        <p className="text-gray-600">نوفر مجموعة متنوعة من الأنشطة لتنمية مواهب الطلاب</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((a, idx) => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-8 text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition">
                <Icon className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{a.title}</h3>
              <p className="text-gray-600">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesTab;
