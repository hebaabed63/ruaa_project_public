import React, { useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const criteria = [
  { key: 'educationQuality', label: 'جودة التعليم (Education Quality)', desc: 'كفاءة المعلمين، طرق التدريس، متابعة الطلاب أكاديميًا.' },
  { key: 'facilities', label: 'المرافق والخدمات (Facilities & Services)', desc: 'نظافة المدرسة، الصفوف والمختبرات، الملاعب والمكتبة والمرافق الصحية.' },
  { key: 'environment', label: 'البيئة المدرسية (School Environment)', desc: 'الانضباط والنظام، بيئة آمنة ومحفزة، تعامل الإدارة.' },
  { key: 'mentalHealth', label: 'الصحة النفسية والدعم الطلابي', desc: 'مرشد نفسي/اجتماعي، دعم للطلاب ذوي المشاكل.' },
  { key: 'communication', label: 'التواصل مع الأهالي (Parent Communication)', desc: 'سرعة تجاوب الإدارة، قنوات تواصل واضحة.' },
  { key: 'sustainability', label: 'الاستدامة والمسؤولية (Sustainability)', desc: 'المحافظة على البيئة، ترشيد استهلاك الموارد.' }
];

const getColorByRating = (r) => {
  if (r >= 4.5) return { bg: '#8b5cf6', text: '#ffffff', name: 'ممتاز' }; // بنفسجي
  if (r >= 3.5) return { bg: '#10b981', text: '#ffffff', name: 'جيد' }; // أخضر
  if (r >= 3.0) return { bg: '#f59e0b', text: '#111827', name: 'متوسط' }; // أصفر
  if (r >= 2.0) return { bg: '#f97316', text: '#111827', name: 'متوسط ضعيف' }; // برتقالي
  return { bg: '#ef4444', text: '#ffffff', name: 'ضعيف' }; // أحمر
};

const Stars = ({ value }) => (
  <div className="stars">
    {Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={`star ${i < Math.round(value) ? 'filled' : ''}`} />
    ))}
  </div>
);

const EvaluationsTab = ({ school }) => {
  const [values, setValues] = useState({
    educationQuality: 4,
    facilities: 3.5,
    environment: 4,
    mentalHealth: 3,
    communication: 4.2,
    sustainability: 3.8
  });

  const average = useMemo(() => {
    const keys = Object.keys(values);
    const sum = keys.reduce((acc, k) => acc + Number(values[k] || 0), 0);
    return (sum / keys.length).toFixed(1);
  }, [values]);

  const color = getColorByRating(Number(average));

  const handleChange = (key, newVal) => {
    setValues(v => ({ ...v, [key]: Number(newVal) }));
  };

  return (
    <div className="space-y-6">
      <div 
        className="flex items-center justify-between bg-white rounded-2xl shadow-card p-4 md:p-6"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        <div className="flex items-center gap-4">
          <div className="flex text-yellow-400 text-xl">
            <Stars value={Number(average)} />
          </div>
          <div className="text-2xl font-extrabold">{average}/5</div>
        </div>
        <div className="text-lg font-bold">التقييم العام: {color.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {criteria.map((c) => (
          <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition p-6" key={c.key}>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-800 mb-1">{c.label}</h4>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>

            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={values[c.key]}
                onChange={(e) => handleChange(c.key, e.target.value)}
                className="w-full accent-primary-600"
              />
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">{values[c.key].toFixed(1)}</span>
                <div className="flex text-yellow-400">
                  <Stars value={values[c.key]} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 text-blue-800 rounded-xl p-4">
        يمكنك تعديل السلايدر لكل معيار لتقييم المدرسة فورًا. النتيجة النهائية تتحدث مباشرة وتظهر بلونها حسب السلم المطلوب، مع نجوم صفراء ثابتة.
      </div>
    </div>
  );
};

export default EvaluationsTab;

