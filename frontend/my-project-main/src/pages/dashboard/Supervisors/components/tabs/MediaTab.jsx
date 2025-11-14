import React, { useState } from 'react';
import { FaPlay, FaExpand } from 'react-icons/fa';

const MediaTab = ({ school }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const mediaItems = [
    { id: 1, type: 'image', src: 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=صورة+1', title: 'مختبر العلوم' },
    { id: 2, type: 'image', src: 'https://via.placeholder.com/300x200/059669/ffffff?text=صورة+2', title: 'الملعب الرياضي' },
    { id: 3, type: 'video', src: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=فيديو+1', title: 'جولة في المدرسة' },
    { id: 4, type: 'image', src: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=صورة+3', title: 'المكتبة' },
    { id: 5, type: 'image', src: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=صورة+4', title: 'القاعة الرئيسية' },
    { id: 6, type: 'video', src: 'https://via.placeholder.com/300x200/10b981/ffffff?text=فيديو+2', title: 'نشاط الطلاب' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">معرض الوسائط</h2>
        <p className="text-gray-600">تجول مرئي في مرافق وأنشطة المدرسة</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map(item => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition cursor-pointer overflow-hidden" 
            onClick={() => setSelectedMedia(item)}
          >
            <div className="relative h-48">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600">
                    <FaPlay />
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2 w-8 h-8 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                <FaExpand className="text-sm" />
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
      
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-2xl max-h-full bg-white rounded-2xl overflow-hidden">
            <img 
              src={selectedMedia.src} 
              alt={selectedMedia.title} 
              className="w-full h-auto"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{selectedMedia.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTab;
