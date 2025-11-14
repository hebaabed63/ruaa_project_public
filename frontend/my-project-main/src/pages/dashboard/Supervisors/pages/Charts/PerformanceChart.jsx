import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { useChartsData } from '../../hooks/useChartsData';
import { motion } from 'framer-motion';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceChart = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { chartsData, loading, error } = useChartsData();
  const chartRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation variants for loading states
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const data = {
    labels: chartsData.performance?.schools || [
      'الأمل', 'الفاروق', 'التميّز', 'النور', 'الفارابي',
      'ابن القيّم', 'المتميِّزون', 'الشافعي', 'الرمال',
      'ابن سينا', 'المبدعون', 'يافا'
    ],
    datasets: [
      {
        label: 'نسبة الأداء',
        data: chartsData.performance?.performanceData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#FFC4C0', '#96E2D6', '#B59F7C', '#92BFFF', '#5F5F5F',
          '#94E9B8', '#FFC4C0', '#96E2D6', '#B59F7C', '#92BFFF',
          '#5F5F5F', '#94E9B8'
        ],
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 6,
          bottomRight: 6,
        },
        borderSkipped: false,
        barThickness: 40,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          stepSize: 20,
          color: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        },
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Arial', size: 12 },
          color: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        },
      },
    },
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f9fafb' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#6b7280',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      },
      title: {
        display: true,
        text: 'أداء المصادر لأول الشهر',
        align: 'start',
        font: { size: 16, family: 'Arial', weight: 'bold' },
        color: isDarkMode ? '#ffffff' : '#000000',
      },
    },
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md w-full h-96 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <div className="w-16 h-16 border-4 border-t-[#64C8CC] border-r-[#64C8CC] border-b-[#64C8CC] border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">جاري تحميل البيانات...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md w-full h-96 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#64C8CC] text-white rounded-lg hover:bg-[#50a8aa] transition-colors"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md w-full h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3 
        className="text-gray-800 dark:text-gray-100 font-bold text-right mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        أداء المدارس حسب المعايير لهذا الشهر
      </motion.h3>
      <div className="h-[calc(100%-40px)]">
        <Bar data={data} options={options} ref={chartRef} />
      </div>
    </motion.div>
  );
};

export default PerformanceChart;