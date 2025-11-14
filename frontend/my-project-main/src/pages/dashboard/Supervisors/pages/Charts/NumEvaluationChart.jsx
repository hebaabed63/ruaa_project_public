import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useChartsData } from '../../hooks/useChartsData';
import { motion } from 'framer-motion';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const NumEvaluationChart = () => {
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
    labels: chartsData.numEvaluations?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'هذا العام',
        data: chartsData.numEvaluations?.currentYear || [0, 0, 0, 0, 0, 0, 0],
        borderColor: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        backgroundColor: 'transparent',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      },
      {
        label: 'السنة الماضية',
        data: chartsData.numEvaluations?.previousYear || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#64C8CC',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#64C8CC',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
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
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: (value) => `${value / 1000}K`,
          color: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? '#8A8A8F' : '#8A8A8F',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md h-96 flex items-center justify-center"
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
        className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md h-96 flex items-center justify-center"
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
      className="bg-[#F9F9FA] dark:bg-gray-700 p-4 rounded-xl shadow-md h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.span 
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="w-3 h-3 bg-black rounded-full"
              whileHover={{ scale: 1.2 }}
            ></motion.span>
            هذه السنة
          </motion.span>
          <motion.span 
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="w-3 h-3 bg-[#64C8CC] rounded-full"
              whileHover={{ scale: 1.2 }}
            ></motion.span>
             السنة الماضية
          </motion.span>
        </div>
        <motion.h2 
          className="font-bold text-right text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          عدد التقييمات
        </motion.h2>
      </div>
      <div className="h-[calc(100%-40px)]">
        <Line data={data} options={options} ref={chartRef} />
      </div>
    </motion.div>
  );
};

export default NumEvaluationChart;