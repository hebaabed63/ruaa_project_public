import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import usePageTitle from "../../../hooks/usePageTitle";

export default function ContactPage() {
  // Set page title
  usePageTitle("تواصل معنا");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
          <p className="text-gray-600">يسعدنا تواصلك معنا لتقديم المساعدة والإجابة على استفساراتك</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaEnvelope className="text-blue-600 text-xl mt-1 ml-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">البريد الإلكتروني</h3>
                    <p className="text-gray-600">support@ruaa.edu</p>
                    <p className="text-gray-600 text-sm mt-1">رد خلال 24 ساعة</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="text-green-600 text-xl mt-1 ml-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">رقم الهاتف</h3>
                    <p className="text-gray-600">+966 123 456 789</p>
                    <p className="text-gray-600 text-sm mt-1">متاح من 9 صباحاً حتى 5 مساءً</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-purple-600 text-xl mt-1 ml-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">العنوان</h3>
                    <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
                    <p className="text-gray-600 text-sm mt-1">شارع التعليم، مبنى رقم 123</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ساعات العمل</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>الأحد - الخميس</span>
                    <span>9:00 صباحاً - 5:00 مساءً</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة</span>
                    <span>10:00 صباحاً - 2:00 مساءً</span>
                  </div>
                  <div className="flex justify-between">
                    <span>السبت</span>
                    <span>مغلق</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">إرسال رسالة</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل اسمك"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل موضوع الرسالة"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب رسالتك هنا"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}