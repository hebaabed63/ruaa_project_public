import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useCalendarData } from '../hooks/useReports';
import { Card, Button } from '../components/ui';

/** مكون لإضافة موعد شخصي */
const AddAppointmentForm = ({ onAddAppointment, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'العنوان مطلوب';
    } else if (title.trim().length < 3) {
      newErrors.title = 'العنوان يجب أن يكون 3 أحرف على الأقل';
    } else if (title.trim().length > 100) {
      newErrors.title = 'العنوان يجب ألا يتجاوز 100 حرف';
    }
    
    if (!date) {
      newErrors.date = 'التاريخ مطلوب';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'التاريخ يجب أن يكون في المستقبل';
      }
    }
    
    if (description.trim().length > 500) {
      newErrors.description = 'الوصف يجب ألا يتجاوز 500 حرف';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const appointment = { title, date, description, type: 'personal' };
      const result = await onAddAppointment(appointment);
      if (result.success) {
        setTitle('');
        setDate('');
        setDescription('');
        setErrors({});
        onCancel();
      }
    } catch (error) {
      console.error('Failed to add appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error for a field when user starts typing
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (errors.date) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.date;
        return newErrors;
      });
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  return (
    <Card className="p-6 mb-6 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">إضافة موعد شخصي</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان *</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.title 
                ? "border-red-500 focus:ring-red-200" 
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
            }`}
            placeholder="عنوان الموعد"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ *</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.date 
                ? "border-red-500 focus:ring-red-200" 
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.description 
                ? "border-red-500 focus:ring-red-200" 
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
            }`}
            placeholder="وصف الموعد"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button 
            type="submit" 
            variant="outline" 
            disabled={isSubmitting || !title || !date}
          >
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة الموعد'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              onCancel();
              setErrors({});
            }}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Card>
  );
};

/** مكون عرض التقويم */
const CalendarView = ({ events, currentDate, onDateChange, onAddAppointment }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const getEventsForDate = (date) =>
    events.filter(ev => {
      const d = new Date(ev.date);
      return d.getDate() === date && d.getMonth() === month && d.getFullYear() === year;
    });

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handlePrevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const handleNextMonth = () => onDateChange(new Date(year, month + 1, 1));

  return (
    <Card className="p-6 bg-white dark:bg-gray-900 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#64C8CC] dark:text-cyan-400">{monthNames[month]} {year}</h2>
       <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
  <button
    className="border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 px-3 py-2 flex items-center gap-1"
    onClick={onAddAppointment}
  >
    إضافة موعد <FaPlus />
  </button>

  <select
    className="border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 px-3 py-1 text-sm w-full sm:w-auto"
  >
    <option value="">شهر</option>
  </select>

  <select
    className="border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 px-3 py-1 text-sm w-full sm:w-auto"
  >
    <option value="">عام</option>
  </select>

  <select
    className="border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 px-3 py-1 text-sm w-full sm:w-auto"
  >
    <option value="">ميلادي</option>
  </select>

  <Button onClick={handleNextMonth} className="bg-[#64C8CC] dark:bg-cyan-400 text-white p-2 rounded">
    <FaChevronRight />
  </Button>
  <Button onClick={handlePrevMonth} className="bg-[#64C8CC] dark:bg-cyan-400 text-white p-2 rounded">
    <FaChevronLeft />
  </Button>
</div>

      </div>

      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} className="h-36 border border-transparent"></div>;

          const dayEvents = getEventsForDate(day);
          const isLastDay = day === daysInMonth;

          return (
            <motion.div key={idx} className="min-h-[9rem] border rounded-lg p-1 relative cursor-pointer dark:border-gray-700"
              style={{ borderColor: isLastDay ? '#A2A9A5' : undefined, backgroundColor: isLastDay ? '#E4E7E5' : undefined }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                <span>{daysOfWeek[idx % 7]}</span>
                <span>{day}</span>
              </div>

              <div className="space-y-1">
                {dayEvents.map(ev => {
                  let bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
                  let textColor = 'text-current';
                  if (ev.type === 'holiday') bgColor = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
                  else if (ev.type === 'exam') bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
                  else if (ev.type === 'personal') bgColor = 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100';
                  else if (ev.type === 'custom') { bgColor = ev.bgColor; textColor = ev.textColor; }

                  return (
                    <div
                      key={ev.id}
                      className="text-xs px-2 py-1 rounded break-words whitespace-normal"
                      style={{ backgroundColor: bgColor, color: textColor }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

/** الصفحة الرئيسية للتقويم */
const CalendarPage = () => {
  const { events: originalEvents, loading, addAppointment } = useCalendarData();

  const specialEvents = [
    {
      id: 'special-1',
      title: 'لديك اجتماع مع مدير مدرسة المتميّزون',
      date: '2025-10-10',
      type: 'custom',
      bgColor: '#64C8CC',
      textColor: '#FFFFFF',
    },
    {
      id: 'special-2',
      title: 'لديك زيارة تقيميّة لمدرسة الأمل',
      date: '2025-10-26',
      type: 'custom',
      bgColor: '#FFC4C0',
      textColor: '#4CAF50',
    },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const events = [...originalEvents, ...specialEvents];

  const handleAddAppointment = async (appointment) => {
    const result = await addAppointment(appointment);
    if (result.success) setShowAddForm(false);
    return result;
  };

  return (
    <div className="container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen p-4" dir="rtl">
      <h1 className="text-2xl font-normal text-gray-900 dark:text-white mb-2">أهلًا أحمد!</h1>
      <span className="text-sm text-gray-400 dark:text-gray-400 mb-6">التقويم لعرض التواريخ والفعاليَّات المهمة.</span>

      {showAddForm && <AddAppointmentForm onAddAppointment={handleAddAppointment} onCancel={() => setShowAddForm(false)} />}

      <CalendarView
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onAddAppointment={() => setShowAddForm(true)}
      />
    </div>
  );
};

export default CalendarPage;
