import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaCalendarDay, FaBook, FaUser, FaSchool } from 'react-icons/fa';
import { useCalendarData } from '../hooks/useReports';
import { Card, Button } from '../components/ui';

/**
 * Component for adding personal appointments
 * مكون لإضافة المواعيد الشخصية
 */
const AddAppointmentForm = ({ onAddAppointment, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsSubmitting(true);
    try {
      const appointment = { title, date, description, type: 'personal' };
      const result = await onAddAppointment(appointment);
      if (result.success) {
        setTitle('');
        setDate('');
        setDescription('');
        onCancel();
      }
    } catch (error) {
      console.error('Failed to add appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">إضافة موعد شخصي</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="عنوان الموعد"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="وصف الموعد"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={isSubmitting || !title || !date}>
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة الموعد'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
        </div>
      </form>
    </Card>
  );
};

/**
 * Component for displaying a calendar view
 * مكون لعرض التقويم
 */
const CalendarView = ({ events, currentDate, onDateChange, onAddAppointment }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
    // Days of week in Arabic

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    // Month names in Arabic

  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو','يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  // Get days in month

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)

  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  // Get events for a specific date

  const getEventsForDate = (date) =>
    events.filter(ev => {
      const d = new Date(ev.date);
      return d.getDate() === date && d.getMonth() === month && d.getFullYear() === year;
    });
  // Generate calendar days

  const calendarDays = [];
    // Add empty cells for days before the first day of the month

  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
   // Add days of the month

  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handlePrevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const handleNextMonth = () => onDateChange(new Date(year, month + 1, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <Card className="p-6 bg-[#F9FAFB] dark:bg-gray-800 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#64C8CC] dark:text-cyan-800">{monthNames[month]} {year}</h2>
        <div className="flex gap-4 items-center">
          <button
            className="border border-[#E4E7E5] dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-[#727975] dark:text-gray-300 px-3 py-2 flex items-center gap-1"
            onClick={onAddAppointment}
          >
            إضافة موعد <FaPlus />
          </button>

          <select className="border border-[#E4E7E5] dark:border-gray-700 rounded px-2 py-1 w-28 text-[#727975] dark:text-gray-300 dark:bg-gray-700"><option>شهر</option></select>
          <select className="border border-[#E4E7E5] dark:border-gray-700 rounded px-2 py-1 w-28 text-[#727975] dark:text-gray-300 dark:bg-gray-700"><option>عام</option></select>
          <select className="border border-[#E4E7E5] dark:border-gray-700 rounded px-2 py-1 w-28 text-[#727975] dark:text-gray-300 dark:bg-gray-700"><option>ميلادي</option><option>هجري</option></select>

          <Button onClick={handleNextMonth} className="bg-[#64C8CC] dark:bg-cyan-800 text-white p-2 rounded"><FaChevronRight /></Button>
          <Button onClick={handlePrevMonth} className="bg-[#64C8CC] dark:bg-cyan-800 text-white p-2 rounded"><FaChevronLeft /></Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} className="h-24 border border-transparent"></div>;

          const dayEvents = getEventsForDate(day);
          const isLastDay = day === daysInMonth;

          return (
            <motion.div key={idx} className="h-36 border rounded-lg p-1 relative cursor-pointer"
              style={{ borderColor: '#A2A9A5', backgroundColor: isLastDay ? '#E4E7E5' : '#FFFFFF' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between mb-1 text-sm font-medium text-[#A2A9A5] dark:text-gray-400">
                <span>{daysOfWeek[idx % 7]}</span>
                <span>{day}</span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(ev => {
                  let bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
                  if (ev.type === 'holiday') bgColor = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
                  else if (ev.type === 'exam') bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
                  else if (ev.type === 'personal') bgColor = 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100';

                  return (
                    <div key={ev.id} className={`text-xs px-1 py-0.5 rounded truncate ${bgColor}`} title={ev.title}>{ev.title}</div>
                  );
                })}
                {dayEvents.length > 2 && <div className="text-xs text-gray-500 dark:text-gray-400 text-right">+{dayEvents.length - 2} المزيد</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

/**
 * Component for displaying event details in a list
 * مكون لعرض تفاصيل الأحداث في قائمة
 */
const EventList = ({ events, loading }) => {
    // Group events by date

  const groupedEvents = events.reduce((acc, ev) => {
    const dateKey = new Date(ev.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = { date: new Date(ev.date), events: [] };
    acc[dateKey].events.push(ev);
    return acc;
  }, {});
  // Sort dates

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a) - new Date(b));

  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          لا توجد أحداث
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          لم يتم العثور على أي أحداث في التقويم
        </p>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {sortedDates.map(dateKey => {
        const group = groupedEvents[dateKey];
        const date = group.date;
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        return (
          <motion.div key={dateKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className={`flex items-center gap-3 mb-4 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
              <div className="w-3 h-3 rounded-full bg-current"></div>
              <h3 className="text-lg font-bold">{date.toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</h3>
            </div>
            <div className="space-y-3">
              {group.events.map(event => {
                let Icon = FaCalendarDay;
                let bg='bg-blue-100 dark:bg-blue-900/30', border='border-blue-300 dark:border-blue-700', text='text-blue-800 dark:text-blue-200';
                if (event.type==='school_date'){Icon=FaSchool; bg='bg-green-100 dark:bg-green-900/30'; border='border-green-300 dark:border-green-700'; text='text-green-800 dark:text-green-200';}
                else if(event.type==='holiday'){Icon=FaCalendarAlt; bg='bg-red-100 dark:bg-red-900/30'; border='border-red-300 dark:border-red-700'; text='text-red-800 dark:text-red-200';}
                else if(event.type==='exam'){Icon=FaBook; bg='bg-yellow-100 dark:bg-yellow-900/30'; border='border-yellow-300 dark:border-yellow-700'; text='text-yellow-800 dark:text-yellow-200';}
                else if(event.type==='personal'){Icon=FaUser; bg='bg-purple-100 dark:bg-purple-900/30'; border='border-purple-300 dark:border-purple-700'; text='text-purple-800 dark:text-purple-200';}

                return (
                  <motion.div key={event.id} className={`border rounded-lg p-4 ${border} hover:shadow-md transition-shadow`} whileHover={{ y: -2 }}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${bg}`}><Icon className={text} /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{event.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(event.date).toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * Calendar Page Component
 * مكون صفحة التقويم
 */
const CalendarPage = () => {
   const { events, loading, addAppointment } = useCalendarData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'list'

  const handleAddAppointment = async (appointment) => {
    const result = await addAppointment(appointment);
    if (result.success) {
      setShowAddForm(false);
    }
    return result;
  };
  return (
    <div className="container mx-auto bg-[#F9FAFB] dark:bg-gray-900 min-h-screen p-4" dir="rtl">
      <h1 className="text-2xl font-normal text-gray-900 dark:text-white mb-2">أهلًا أحمد!</h1>
      <span className="text-sm text-gray-400 dark:text-gray-400 mb-6">التقويم لعرض التواريخ والفعاليَّات المهمة.</span>

      {showAddForm && <AddAppointmentForm onAddAppointment={handleAddAppointment} onCancel={()=>setShowAddForm(false)} />}

      <CalendarView
        events={events}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onAddAppointment={()=>setShowAddForm(true)}
      />

      {/* {activeView==='list' ? <EventList events={events} loading={loading} /> : null} */}
    </div>
  );
};

export default CalendarPage;
