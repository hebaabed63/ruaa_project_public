import React, { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import { useChartsData } from '../../hooks/useChartsData';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip);

const EducationStagesChart = () => {
  const { chartsData, loading, error } = useChartsData();
  const chartRef = useRef(null);

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
    labels: chartsData.educationStages?.stages || ['طلاب_ابتدائي', 'طلاب_إعدادي', 'مشتركة_ابتدائي', 'طالبات_ابتدائي'],
    datasets: [
      {
        data: chartsData.educationStages?.percentages || [0, 0, 0, 0],
        backgroundColor: ['#000000', '#2DA1DE', '#B59F7C', '#FFC4C0'],
        borderWidth: 2,     
        borderRadius: 10,    
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      datalabels: { display: false },
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
      title: {
        display: true,
        text: 'المراحل الدراسية',
        align: 'start',
        font: { size: 16, family: 'Arial', weight: 'bold' },
        color: '#374151', 
      },
    },
  };

  if (loading) {
    return (
      <motion.div 
        className="dark:text-white h-96 flex items-center justify-center"
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
        className="dark:text-white h-96 flex items-center justify-center"
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
      className="dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="font-bold text-right dark:text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        المراحل الدراسيَّة
      </motion.h2>

      <motion.div 
        className="flex items-center justify-between p-6 bg-[#F9F9FA] dark:bg-gray-700 rounded-xl shadow-md w-full h-96 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* التشارت + النسب */}
        <div className="w-1/2 flex items-center gap-8">
          {/* التشارت */}
          <motion.div 
            className="w-1/2 h-full flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Pie data={data} options={{ ...options, maintainAspectRatio: false }} ref={chartRef} />
          </motion.div>

          {/* النسب */}
          <div className="flex flex-col justify-center gap-4 text-right text-lg">
            {data.datasets[0].data.map((value, idx) => (
              <motion.span 
                key={idx} 
                className="font-semibold text-gray-700 dark:text-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                {value}%
              </motion.span>
            ))}
          </div>
        </div>

        {/* النقاط + أسماء المراحل */}
        <div className="w-1/2 flex flex-col justify-center gap-4 text-right pr-6 text-lg">
          {data.labels.map((label, idx) => (
            <motion.div 
              key={idx} 
              className="flex flex-row-reverse items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              whileHover={{ x: -5 }}
            >
              <motion.span
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: data.datasets[0].backgroundColor[idx] }}
                whileHover={{ scale: 1.2 }}
              ></motion.span>
              <span className="text-gray-700 dark:text-gray-200 font-semibold">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EducationStagesChart;