import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiNavigation, FiMaximize, FiExternalLink, FiRefreshCw, FiSearch, FiX, FiStar, FiUsers, FiBook, FiGlobe } from 'react-icons/fi';
import { contactAPI } from '../../../services/apiService';

// Comprehensive Palestinian Schools Data - All Educational Areas with Directorates
const palestinianSchools = [
  // GAZA STRIP SCHOOLS - ORGANIZED BY EDUCATIONAL DIRECTORATES

  // EAST GAZA DIRECTORATE
  {
    id: 1,
    name: 'مدرسة دار الأرقم',
    englishName: 'Dar Al-Arqam School',
    coordinates: { lat: 31.5203, lng: 34.4776 },
    address: 'حي الشجاعية، غزة الشرقية',
    region: 'قطاع غزة',
    directorate: 'مديرية شرق غزة',
    directorateCode: 'east_gaza',
    city: 'غزة',
    type: 'أساسية',
    rating: 4.3,
    studentsCount: 620,
    subjects: ['التربية الإسلامية', 'العربية', 'الرياضيات'],
    description: 'مدرسة إسلامية معروفة في شرق قطاع غزة',
    phone: '+970-8-789-0123',
    established: 1990,
    features: ['مسجد', 'مكتبة إسلامية', 'قاعة محاضرات']
  },
  {
    id: 2,
    name: 'مدرسة الشجاعية الثانوية',
    englishName: 'Al-Shujayea Secondary School',
    coordinates: { lat: 31.5180, lng: 34.4820 },
    address: 'حي الشجاعية، غزة',
    region: 'قطاع غزة',
    directorate: 'مديرية شرق غزة',
    directorateCode: 'east_gaza',
    city: 'غزة',
    type: 'ثانوية',
    rating: 4.5,
    studentsCount: 580,
    subjects: ['العلوم', 'الرياضيات', 'الأدب العربي'],
    description: 'مدرسة ثانوية مرموقة في حي الشجاعية',
    phone: '+970-8-765-4321',
    established: 1985,
    features: ['مختبر علوم', 'مكتبة', 'قاعة رياضية']
  },
  {
    id: 3,
    name: 'مدرسة الزيتون الابتدائية',
    englishName: 'Al-Zeitoun Elementary School',
    coordinates: { lat: 31.4939, lng: 34.4547 },
    address: 'حي الزيتون، غزة الشرقية',
    region: 'قطاع غزة',
    directorate: 'مديرية شرق غزة',
    directorateCode: 'east_gaza',
    city: 'غزة',
    type: 'ابتدائية',
    rating: 4.2,
    studentsCount: 450,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية في حي الزيتون التاريخي',
    phone: '+970-8-234-5678',
    established: 1992,
    features: ['ملعب', 'مكتبة', 'حديقة']
  },

  // WEST GAZA DIRECTORATE
  {
    id: 4,
    name: 'مدرسة غزة الدولية',
    englishName: 'Gaza International School',
    coordinates: { lat: 31.5017, lng: 34.4668 },
    address: 'شارع الوحدة، غزة الغربية',
    region: 'قطاع غزة',
    directorate: 'مديرية غرب غزة',
    directorateCode: 'west_gaza',
    city: 'غزة',
    type: 'دولية',
    rating: 4.9,
    studentsCount: 380,
    subjects: ['البكالوريا الدولية', 'اللغات المتعددة', 'العلوم المتقدمة'],
    description: 'أكاديمية دولية رائدة في غرب قطاع غزة',
    phone: '+970-8-123-4567',
    established: 2005,
    features: ['فصول ذكية', 'مختبرات متطورة', 'مركز لغات']
  },
  {
    id: 5,
    name: 'مدرسة فلسطين الابتدائية',
    englishName: 'Palestine Elementary School',
    coordinates: { lat: 31.4900, lng: 34.4400 },
    address: 'حي الرمال، غزة الغربية',
    region: 'قطاع غزة',
    directorate: 'مديرية غرب غزة',
    directorateCode: 'west_gaza',
    city: 'غزة',
    type: 'ابتدائية',
    rating: 4.5,
    studentsCount: 520,
    subjects: ['العربية', 'الرياضيات', 'العلوم', 'التربية الوطنية'],
    description: 'مدرسة ابتدائية حديثة في حي الرمال الراقي',
    phone: '+970-8-111-2233',
    established: 2000,
    features: ['حديقة كبيرة', 'مكتبة حديثة', 'قاعة رياضية']
  },
  {
    id: 6,
    name: 'مدرسة الشهيد ياسر عرفات',
    englishName: 'Martyr Yasser Arafat School',
    coordinates: { lat: 31.4469, lng: 34.3899 },
    address: 'حي النصر، غزة الغربية',
    region: 'قطاع غزة',
    directorate: 'مديرية غرب غزة',
    directorateCode: 'west_gaza',
    city: 'غزة',
    type: 'ابتدائية',
    rating: 4.4,
    studentsCount: 480,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية تحمل اسم الرئيس الراحل',
    phone: '+970-8-901-2345',
    established: 2005,
    features: ['ملعب واسع', 'مكتبة للأطفال', 'قاعة أنشطة']
  },

  // NORTH GAZA DIRECTORATE
  {
    id: 7,
    name: 'مدرسة الشمال المختلطة',
    englishName: 'Northern Mixed School',
    coordinates: { lat: 31.5449, lng: 34.5096 },
    address: 'جباليا، شمال غزة',
    region: 'قطاع غزة',
    directorate: 'مديرية شمال غزة',
    directorateCode: 'north_gaza',
    city: 'جباليا',
    type: 'مختلطة',
    rating: 4.1,
    studentsCount: 490,
    subjects: ['اللغة الإنجليزية', 'الفنون', 'الموسيقى'],
    description: 'مدرسة مختلطة تهتم بتنمية المواهب في شمال القطاع',
    phone: '+970-8-567-8901',
    established: 2000,
    features: ['استوديو فني', 'قاعة موسيقى', 'مسرح صغير']
  },
  {
    id: 8,
    name: 'مدرسة جباليا الابتدائية',
    englishName: 'Jabalia Elementary School',
    coordinates: { lat: 31.5350, lng: 34.4950 },
    address: 'مخيم جباليا',
    region: 'قطاع غزة',
    directorate: 'مديرية شمال غزة',
    directorateCode: 'north_gaza',
    city: 'جباليا',
    type: 'ابتدائية',
    rating: 4.2,
    studentsCount: 560,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية تخدم مخيم جباليا',
    phone: '+970-8-678-9012',
    established: 1970,
    features: ['ملعب متعدد', 'مكتبة', 'حديقة']
  },
  {
    id: 9,
    name: 'مدرسة النزهة الثانوية',
    englishName: 'Al-Nuzha Secondary School',
    coordinates: { lat: 31.5300, lng: 34.5000 },
    address: 'حي النزهة، جباليا',
    region: 'قطاع غزة',
    directorate: 'مديرية شمال غزة',
    directorateCode: 'north_gaza',
    city: 'جباليا',
    type: 'ثانوية',
    rating: 4.3,
    studentsCount: 420,
    subjects: ['العلوم', 'الرياضيات', 'الأدب'],
    description: 'مدرسة ثانوية حديثة في شمال غزة',
    phone: '+970-8-999-0000',
    established: 2003,
    features: ['مختبر حديث', 'مكتبة رقمية', 'قاعة مؤتمرات']
  },
  {
    id: 10,
    name: 'مدرسة بيت حانون الثانوية',
    englishName: 'Beit Hanoun Secondary School',
    coordinates: { lat: 31.5400, lng: 34.5200 },
    address: 'بيت حانون، شمال غزة',
    region: 'قطاع غزة',
    directorate: 'مديرية شمال غزة',
    directorateCode: 'north_gaza',
    city: 'بيت حانون',
    type: 'ثانوية',
    rating: 4.0,
    studentsCount: 380,
    subjects: ['العلوم', 'الرياضيات', 'الأدب'],
    description: 'مدرسة ثانوية تخدم منطقة بيت حانون',
    phone: '+970-8-444-5555',
    established: 1995,
    features: ['مختبر علوم', 'مكتبة', 'ملعب']
  },

  // SOUTH GAZA DIRECTORATE
  {
    id: 11,
    name: 'مدرسة خان يونس الابتدائية',
    englishName: 'Khan Younis Elementary School',
    coordinates: { lat: 31.3469, lng: 34.3061 },
    address: 'حي الأمل، خان يونس',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'خان يونس',
    type: 'ابتدائية',
    rating: 4.4,
    studentsCount: 420,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية متميزة تخدم منطقة خان يونس',
    phone: '+970-8-234-5678',
    established: 1998,
    features: ['ملعب كبير', 'مكتبة', 'قاعة كمبيوتر']
  },
  {
    id: 12,
    name: 'مدرسة فلسطين الثانوية للبنات',
    englishName: 'Palestine Girls Secondary School',
    coordinates: { lat: 31.3567, lng: 34.3201 },
    address: 'وسط خان يونس',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'خان يونس',
    type: 'ثانوية',
    rating: 4.7,
    studentsCount: 390,
    subjects: ['الأدب', 'العلوم', 'الرياضيات'],
    description: 'مدرسة ثانوية للبنات معروفة بتفوق طالباتها',
    phone: '+970-8-012-3456',
    established: 1982,
    features: ['مختبر حاسوب', 'مكتبة نسائية', 'قاعة فنون']
  },
  {
    id: 13,
    name: 'مدرسة رفح الثانوية',
    englishName: 'Rafah Secondary School',
    coordinates: { lat: 31.2948, lng: 34.2501 },
    address: 'وسط رفح، قطاع غزة',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'رفح',
    type: 'ثانوية',
    rating: 4.2,
    studentsCount: 580,
    subjects: ['العلوم', 'الأدب', 'الرياضيات'],
    description: 'مدرسة ثانوية تخدم الطلاب في جنوب قطاع غزة',
    phone: '+970-8-345-6789',
    established: 1988,
    features: ['مختبر علوم', 'مكتبة كبيرة', 'ملعب رياضي']
  },
  {
    id: 14,
    name: 'مدرسة الحرية الابتدائية',
    englishName: 'Al-Hurriya Elementary School',
    coordinates: { lat: 31.2850, lng: 34.2450 },
    address: 'حي الحرية، رفح',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'رفح',
    type: 'ابتدائية',
    rating: 4.1,
    studentsCount: 380,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية في حي الحرية برفح',
    phone: '+970-8-777-8888',
    established: 1992,
    features: ['ملعب صغير', 'مكتبة', 'حديقة أطفال']
  },
  {
    id: 15,
    name: 'مدرسة دير البلح الثانوية',
    englishName: 'Deir al-Balah Secondary School',
    coordinates: { lat: 31.4167, lng: 34.3500 },
    address: 'وسط دير البلح',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'دير البلح',
    type: 'ثانوية',
    rating: 4.3,
    studentsCount: 470,
    subjects: ['العلوم الزراعية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ثانوية في وسط قطاع غزة متخصصة في العلوم الزراعية',
    phone: '+970-8-444-5555',
    established: 1985,
    features: ['مختبر زراعي', 'مكتبة', 'حديقة نباتية']
  },
  {
    id: 16,
    name: 'مدرسة الوسطى الابتدائية',
    englishName: 'Al-Wusta Elementary School',
    coordinates: { lat: 31.4100, lng: 34.3400 },
    address: 'حي الوسطى، دير البلح',
    region: 'قطاع غزة',
    directorate: 'مديرية جنوب غزة',
    directorateCode: 'south_gaza',
    city: 'دير البلح',
    type: 'ابتدائية',
    rating: 4.0,
    studentsCount: 350,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية تخدم المنطقة الوسطى في دير البلح',
    phone: '+970-8-666-7777',
    established: 1990,
    features: ['ملعب', 'مكتبة', 'حديقة']
  },

  // WEST BANK SCHOOLS
  // Ramallah Schools
  {
    id: 17,
    name: 'مدرسة الأرز الابتدائية',
    englishName: 'Al-Arz Elementary School',
    coordinates: { lat: 31.9038, lng: 35.2034 },
    address: 'شارع الأرز، المصيون، رام الله',
    region: 'الضفة الغربية',
    city: 'رام الله',
    type: 'ابتدائية',
    rating: 4.5,
    studentsCount: 450,
    subjects: ['العربية', 'الرياضيات', 'العلوم', 'التاريخ'],
    description: 'مدرسة حديثة تركز على التعليم التفاعلي والتكنولوجيا',
    phone: '+970-2-123-4567',
    established: 1995,
    features: ['مختبر حاسوب', 'مكتبة', 'ملعب رياضي']
  },
  {
    id: 18,
    name: 'مدرسة رام الله الثانوية للبنين',
    englishName: 'Ramallah Boys Secondary School',
    coordinates: { lat: 31.9000, lng: 35.2100 },
    address: 'وسط رام الله',
    region: 'الضفة الغربية',
    city: 'رام الله',
    type: 'ثانوية',
    rating: 4.6,
    studentsCount: 520,
    subjects: ['الفيزياء', 'الكيمياء', 'الرياضيات المتقدمة'],
    description: 'مدرسة ثانوية مرموقة للبنين في رام الله',
    phone: '+970-2-222-3333',
    established: 1960,
    features: ['مختبرات علمية', 'مكتبة كبيرة', 'قاعة رياضية']
  },
  {
    id: 19,
    name: 'مدرسة البيرة الأساسية',
    englishName: 'Al-Bireh Basic School',
    coordinates: { lat: 31.9100, lng: 35.2200 },
    address: 'وسط البيرة',
    region: 'الضفة الغربية',
    city: 'البيرة',
    type: 'أساسية',
    rating: 4.2,
    studentsCount: 480,
    subjects: ['العربية', 'الرياضيات', 'العلوم', 'الجغرافيا'],
    description: 'مدرسة أساسية تخدم مدينة البيرة',
    phone: '+970-2-333-4444',
    established: 1975,
    features: ['مكتبة', 'ملعب', 'قاعة أنشطة']
  },
  // Jerusalem Schools
  {
    id: 20,
    name: 'مدرسة القدس الثانوية',
    englishName: 'Al-Quds Secondary School',
    coordinates: { lat: 31.7767, lng: 35.2345 },
    address: 'البلدة القديمة، القدس',
    region: 'الضفة الغربية',
    city: 'القدس',
    type: 'ثانوية',
    rating: 4.8,
    studentsCount: 680,
    subjects: ['الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات المتقدمة'],
    description: 'مدرسة ثانوية متميزة بالعلوم والتكنولوجيا في قلب القدس',
    phone: '+970-2-234-5678',
    established: 1985,
    features: ['مختبرات علمية متطورة', 'مكتبة رقمية', 'قاعة مؤتمرات']
  },
  {
    id: 21,
    name: 'مدرسة الرشيد الثانوية',
    englishName: 'Al-Rasheed Secondary School',
    coordinates: { lat: 31.7800, lng: 35.2300 },
    address: 'البلدة القديمة، القدس',
    region: 'الضفة الغربية',
    city: 'القدس',
    type: 'ثانوية',
    rating: 4.9,
    studentsCount: 320,
    subjects: ['التاريخ المقدسي', 'الأدب العربي', 'العلوم', 'الفنون'],
    description: 'مدرسة عريقة في البلدة القديمة للقدس',
    phone: '+970-2-678-9012',
    established: 1920,
    features: ['مكتبة تاريخية', 'متحف تراثي', 'قاعة مؤتمرات']
  },
  {
    id: 22,
    name: 'مدرسة الطور الابتدائية',
    englishName: 'Mount of Olives Elementary School',
    coordinates: { lat: 31.7850, lng: 35.2450 },
    address: 'جبل الطور، القدس',
    region: 'الضفة الغربية',
    city: 'القدس',
    type: 'ابتدائية',
    rating: 4.4,
    studentsCount: 280,
    subjects: ['العربية', 'الرياضيات', 'العلوم', 'التربية الإسلامية'],
    description: 'مدرسة ابتدائية على جبل الطور المبارك',
    phone: '+970-2-555-6666',
    established: 1955,
    features: ['حديقة مطلة', 'مكتبة', 'قاعة صلاة']
  },
  // Hebron Schools
  {
    id: 23,
    name: 'مدرسة الخليل الأساسية',
    englishName: 'Hebron Basic School',
    coordinates: { lat: 31.5292, lng: 35.0936 },
    address: 'وسط البلد، الخليل',
    region: 'الضفة الغربية',
    city: 'الخليل',
    type: 'أساسية',
    rating: 4.3,
    studentsCount: 520,
    subjects: ['التربية الإسلامية', 'التاريخ الفلسطيني', 'الجغرافيا'],
    description: 'مدرسة تركز على الهوية الوطنية والثقافة الفلسطينية',
    phone: '+970-2-345-6789',
    established: 1992,
    features: ['مكتبة تراثية', 'متحف مصغر', 'حديقة نباتات محلية']
  },
  {
    id: 24,
    name: 'مدرسة الإبراهيمية',
    englishName: 'Al-Ibrahimiya School',
    coordinates: { lat: 31.5200, lng: 35.1000 },
    address: 'الحرم الإبراهيمي، الخليل',
    region: 'الضفة الغربية',
    city: 'الخليل',
    type: 'أساسية',
    rating: 4.2,
    studentsCount: 410,
    subjects: ['التربية الإسلامية', 'التاريخ', 'العربية'],
    description: 'مدرسة تقع بالقرب من الحرم الإبراهيمي الشريف',
    phone: '+970-2-789-0123',
    established: 1935,
    features: ['مكتبة إسلامية', 'قاعة تراثية', 'ملعب']
  },
  {
    id: 25,
    name: 'مدرسة دورا الثانوية',
    englishName: 'Dura Secondary School',
    coordinates: { lat: 31.5050, lng: 35.0400 },
    address: 'بلدة دورا، الخليل',
    region: 'الضفة الغربية',
    city: 'دورا',
    type: 'ثانوية',
    rating: 4.1,
    studentsCount: 450,
    subjects: ['العلوم', 'الرياضيات', 'الأدب'],
    description: 'مدرسة ثانوية تخدم بلدة دورا',
    phone: '+970-2-888-9999',
    established: 1988,
    features: ['مختبر علوم', 'مكتبة', 'ملعب كرة قدم']
  },
  // Nablus Schools
  {
    id: 26,
    name: 'مدرسة نابلس الثانوية',
    englishName: 'Nablus Secondary School',
    coordinates: { lat: 32.2211, lng: 35.2544 },
    address: 'حي الشرق، نابلس',
    region: 'الضفة الغربية',
    city: 'نابلس',
    type: 'ثانوية',
    rating: 4.6,
    studentsCount: 750,
    subjects: ['العلوم التطبيقية', 'الرياضيات', 'الفيزياء'],
    description: 'مدرسة ثانوية رائدة في شمال الضفة الغربية',
    phone: '+970-9-456-7890',
    established: 1980,
    features: ['مختبرات حديثة', 'مكتبة شاملة', 'قاعة رياضية']
  },
  {
    id: 27,
    name: 'مدرسة النجاح الابتدائية',
    englishName: 'An-Najah Elementary School',
    coordinates: { lat: 32.2150, lng: 35.2400 },
    address: 'حي النجاح، نابلس',
    region: 'الضفة الغربية',
    city: 'نابلس',
    type: 'ابتدائية',
    rating: 4.4,
    studentsCount: 380,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية بالقرب من جامعة النجاح',
    phone: '+970-9-111-2222',
    established: 1990,
    features: ['حديقة كبيرة', 'مكتبة حديثة', 'ملعب أطفال']
  },
  {
    id: 28,
    name: 'مدرسة عسكر الأساسية',
    englishName: 'Askar Basic School',
    coordinates: { lat: 32.2300, lng: 35.2600 },
    address: 'مخيم عسكر، نابلس',
    region: 'الضفة الغربية',
    city: 'نابلس',
    type: 'أساسية',
    rating: 4.0,
    studentsCount: 520,
    subjects: ['العربية', 'الرياضيات', 'العلوم', 'التاريخ'],
    description: 'مدرسة أساسية تخدم مخيم عسكر',
    phone: '+970-9-333-4444',
    established: 1975,
    features: ['مكتبة', 'ملعب', 'قاعة أنشطة']
  },
  // Jenin Schools
  {
    id: 29,
    name: 'مدرسة جنين الزراعية',
    englishName: 'Jenin Agricultural School',
    coordinates: { lat: 32.4617, lng: 35.3007 },
    address: 'منطقة الزراعة، جنين',
    region: 'الضفة الغربية',
    city: 'جنين',
    type: 'مهنية',
    rating: 4.0,
    studentsCount: 280,
    subjects: ['الزراعة', 'البيطرة', 'العلوم البيئية'],
    description: 'مدرسة متخصصة في التعليم الزراعي والمهني',
    phone: '+970-4-678-9012',
    established: 1985,
    features: ['مزرعة تعليمية', 'معامل زراعية', 'صوبات زراعية', 'مختبر بيطري']
  },
  {
    id: 30,
    name: 'مدرسة جنين الثانوية',
    englishName: 'Jenin Secondary School',
    coordinates: { lat: 32.4500, lng: 35.2900 },
    address: 'وسط جنين',
    region: 'الضفة الغربية',
    city: 'جنين',
    type: 'ثانوية',
    rating: 4.2,
    studentsCount: 400,
    subjects: ['العلوم التطبيقية', 'الرياضيات', 'الفيزياء'],
    description: 'مدرسة ثانوية تخدم مدينة جنين',
    phone: '+970-4-777-8888',
    established: 1990,
    features: ['مختبرات حديثة', 'مكتبة شاملة', 'قاعة رياضية']
  },
  {
    id: 31,
    name: 'مدرسة جنين الابتدائية',
    englishName: 'Jenin Elementary School',
    coordinates: { lat: 32.4400, lng: 35.2800 },
    address: 'حي الجنين، جنين',
    region: 'الضفة الغربية',
    city: 'جنين',
    type: 'ابتدائية',
    rating: 4.1,
    studentsCount: 350,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية تخدم حي الجنين',
    phone: '+970-4-999-0000',
    established: 1985,
    features: ['ملعب', 'مكتبة', 'حديقة أطفال']
  },
  // Bethlehem Schools
  {
    id: 32,
    name: 'مدرسة بيت لحم الأهلية',
    englishName: 'Bethlehem Private School',
    coordinates: { lat: 31.7054, lng: 35.1948 },
    address: 'شارع النجمة، بيت لحم',
    region: 'الضفة الغربية',
    city: 'بيت لحم',
    type: 'أهلية',
    rating: 4.7,
    studentsCount: 340,
    subjects: ['اللغات', 'العلوم الإنسانية', 'الفنون', 'السياحة'],
    description: 'مدرسة أهلية متميزة في مدينة بيت لحم التاريخية',
    phone: '+970-2-567-8901',
    established: 1995,
    features: ['مكتبة تاريخية', 'معرض فني', 'قاعة مؤتمرات']
  },
  {
    id: 33,
    name: 'مدرسة بيت لحم الثانوية',
    englishName: 'Bethlehem Secondary School',
    coordinates: { lat: 31.7100, lng: 35.1950 },
    address: 'وسط بيت لحم',
    region: 'الضفة الغربية',
    city: 'بيت لحم',
    type: 'ثانوية',
    rating: 4.5,
    studentsCount: 420,
    subjects: ['العلوم التطبيقية', 'الرياضيات', 'الفيزياء'],
    description: 'مدرسة ثانوية في مدينة بيت لحم التاريخية',
    phone: '+970-2-666-7777',
    established: 1985,
    features: ['مختبرات حديثة', 'مكتبة شاملة', 'قاعة رياضية']
  },
  {
    id: 34,
    name: 'مدرسة بيت لحم الابتدائية',
    englishName: 'Bethlehem Elementary School',
    coordinates: { lat: 31.7000, lng: 35.1900 },
    address: 'حي البالحات، بيت لحم',
    region: 'الضفة الغربية',
    city: 'بيت لحم',
    type: 'ابتدائية',
    rating: 4.3,
    studentsCount: 380,
    subjects: ['العربية', 'الرياضيات', 'العلوم'],
    description: 'مدرسة ابتدائية تخدم حي البالحات',
    phone: '+970-2-777-8888',
    established: 1990,
    features: ['ملعب', 'مكتبة', 'حديقة أطفال']
  }
];

const MapSection = ({ data }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showSchoolDetails, setShowSchoolDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Default map data centered on Palestine (West Bank and Gaza)
  const defaultMapData = {
    coordinates: {
      lat: 31.8, // Centered between West Bank and Gaza
      lng: 35.0
    },
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d866748.4208940891!2d34.367485!3d31.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b7dbf8fd2d0b%3A0x85eb7e9c9b6eca7b!2sPalestine!5e0!3m2!1sen!2s!4v1647887231234!5m2!1sen!2s',
    zoomLevel: 8
  };

  const mapData = data || defaultMapData;

  // Filter schools based on search term, type, region, and directorate
  const filteredSchools = useMemo(() => {
    return palestinianSchools.filter(school => {
      const matchesSearch = searchTerm === '' ||
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.directorate && school.directorate.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = activeFilter === 'all' || school.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  // School types for filtering (updated with new types)
  const schoolTypes = [
    { key: 'all', label: 'جميع المدارس', count: palestinianSchools.length },
    { key: 'ابتدائية', label: 'ابتدائية', count: palestinianSchools.filter(s => s.type === 'ابتدائية').length },
    { key: 'ثانوية', label: 'ثانوية', count: palestinianSchools.filter(s => s.type === 'ثانوية').length },
    { key: 'مختلطة', label: 'مختلطة', count: palestinianSchools.filter(s => s.type === 'مختلطة').length },
    { key: 'دولية', label: 'دولية', count: palestinianSchools.filter(s => s.type === 'دولية').length },
    { key: 'أساسية', label: 'أساسية', count: palestinianSchools.filter(s => s.type === 'أساسية').length },
    { key: 'أهلية', label: 'أهلية', count: palestinianSchools.filter(s => s.type === 'أهلية').length },
    { key: 'مهنية', label: 'مهنية', count: palestinianSchools.filter(s => s.type === 'مهنية').length }
  ];

  // Region filter options
  const regionTypes = [
    { key: 'all', label: 'جميع المناطق', count: palestinianSchools.length },
    { key: 'الضفة الغربية', label: 'الضفة الغربية', count: palestinianSchools.filter(s => s.region === 'الضفة الغربية').length },
    { key: 'قطاع غزة', label: 'قطاع غزة', count: palestinianSchools.filter(s => s.region === 'قطاع غزة').length }
  ];

  // Get user location for directions
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
    setMapError(false);
  };

  const handleMapError = () => {
    setMapError(true);
    setIsMapLoaded(false);
  };

  const openInGoogleMaps = (school = null) => {
    const coordinates = school ? school.coordinates : mapData.coordinates;
    const { lat, lng } = coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getDirections = (school = null) => {
    const coordinates = school ? school.coordinates : mapData.coordinates;
    const { lat, lng } = coordinates;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }

    window.open(url, '_blank');
  };

  const viewSchoolDetails = (school) => {
    setSelectedSchool(school);
    setShowSchoolDetails(true);
  };

  const navigateToSchoolPage = (school) => {
    alert(`سيتم الانتقال إلى صفحة مدرسة ${school.name}`);
  };

  const refreshMap = () => {
    setIsMapLoaded(false);
    setMapError(false);
    const iframe = document.getElementById('contact-map');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="px-6 py-16 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Background decorative elements */}
        <motion.div
          className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-br from-blue-200/15 to-indigo-300/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-green-200/10 to-emerald-300/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl mb-8 shadow-2xl border-4 border-white/50"
            whileHover={{ scale: 1.1, rotate: 10, y: -5 }}
            transition={{ duration: 0.4 }}
          >
            <FiMapPin className="w-10 h-10 text-white filter drop-shadow-md" />
          </motion.div>

          <motion.h2
            className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-6 drop-shadow-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            استكشف المدارس الفلسطينية 🏫
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            اعثر على أفضل المدارس في فلسطين لطفلك. تصفح وابحث عن أفضل الخيارات التعليمية في الضفة الغربية وقطاع غزة 🇵🇸
          </motion.p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="mb-12 space-y-8 bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-blue-200/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="🔍 ابحث عن مدرسة بالاسم، العنوان، المدينة أو المنطقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-5 pr-16 rounded-3xl border-3 border-blue-200/50 focus:border-green-500 focus:outline-none transition-all duration-400 text-lg bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl placeholder:text-gray-500"
              />
              <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 w-7 h-7" />

              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-300 bg-white rounded-full p-1 shadow-md"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Region Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="text-lg font-bold text-gray-700 self-center ml-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🌍 بحث بالمنطقة:</span>
            {regionTypes.map((region, index) => (
              <motion.button
                key={region.key}
                onClick={() => {
                  if (region.key === 'all') {
                    setSearchTerm('');
                  } else {
                    setSearchTerm(region.label);
                  }
                }}
                className={`
                  px-6 py-3 rounded-2xl font-bold text-base transition-all duration-400 border-2 shadow-lg
                  ${searchTerm.includes(region.label) || (region.key === 'all' && !searchTerm)
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-green-500/25 scale-105'
                    : 'bg-white/80 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50/80 hover:scale-105'
                  }
                `}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {region.label} ({region.count})
              </motion.button>
            ))}
          </div>

          {/* Directorate Filter for Gaza Schools */}
          {searchTerm.includes('قطاع غزة') && (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="text-lg font-bold text-gray-700 self-center ml-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🏢 فلتر بالمديرية:</span>
              {[
                { key: 'all_gaza', label: 'جميع مديريات غزة', search: 'قطاع غزة' },
                { key: 'east_gaza', label: 'شرق غزة', search: 'مديرية شرق غزة' },
                { key: 'west_gaza', label: 'غرب غزة', search: 'مديرية غرب غزة' },
                { key: 'north_gaza', label: 'شمال غزة', search: 'مديرية شمال غزة' },
                { key: 'south_gaza', label: 'جنوب غزة', search: 'مديرية جنوب غزة' }
              ].map((directorate, index) => (
                <motion.button
                  key={directorate.key}
                  onClick={() => setSearchTerm(directorate.search)}
                  className={`
                    px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border-2 shadow-md
                    ${searchTerm.includes(directorate.search)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-green-500/25 scale-105'
                      : 'bg-white/80 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50/80 hover:scale-105'
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {directorate.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4">
            {schoolTypes.map((type, index) => (
              <motion.button
                key={type.key}
                onClick={() => setActiveFilter(type.key)}
                className={`
                  px-8 py-4 rounded-2xl font-bold text-base transition-all duration-400 border-3 shadow-lg
                  ${
                    activeFilter === type.key
                      ? 'bg-gradient-to-r from-primary via-blue-600 to-indigo-700 text-white border-blue-600 shadow-blue-500/30 scale-105'
                      : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-blue-200/50 hover:scale-105'
                  }
                `}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {type.label} ({type.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Map View */}
        <motion.div
          className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/60 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden h-[500px] md:h-[600px] relative border-4 border-blue-200/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Enhanced Map Controls */}
          <div className="absolute top-6 right-6 z-10 flex gap-3">
            <motion.button
              onClick={refreshMap}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl hover:bg-white transition-all duration-300 border-2 border-blue-200/50"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="تحديث الخريطة"
            >
              <FiRefreshCw className="w-6 h-6 text-gray-700" />
            </motion.button>

            <motion.div
              className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-2 border-gray-200/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="text-sm font-bold text-gray-800 mb-3 text-center">🎯 دليل المناطق التعليمية</h4>
              <div className="space-y-2 text-xs">
                {/* West Bank Legend */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-sm border-2 border-white"></div>
                  <span className="text-gray-700 font-medium">الضفة الغربية</span>
                </div>

                {/* Gaza Directorates Legend */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="text-gray-600 font-semibold mb-1">📍 مديريات قطاع غزة:</div>
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm border border-white"></div>
                      <span className="text-gray-700">شرق غزة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-sm border border-white"></div>
                      <span className="text-gray-700">غرب غزة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full shadow-sm border border-white"></div>
                      <span className="text-gray-700">شمال غزة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-sm border border-white"></div>
                      <span className="text-gray-700">جنوب غزة</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Counter */}
          <div className="absolute top-6 left-6 z-10">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-bold">{filteredSchools.length} مدرسة متاحة</span>
            </motion.div>
          </div>

          {/* Loading Overlay */}
          {!isMapLoaded && !mapError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل الخريطة...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {mapError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
              <div className="text-center p-8">
                <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">فشل في تحميل الخريطة</h3>
                <p className="text-gray-500 mb-4">يرجى المحاولة مرة أخرى</p>
                <button
                  onClick={refreshMap}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}

          {/* Map Iframe */}
          <iframe
            id="contact-map"
            src={mapData.embedUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title="خريطة استكشاف المدارس الفلسطينية"
            onLoad={handleMapLoad}
            onError={handleMapError}
          />

          {/* Enhanced School Markers Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {filteredSchools.map((school, index) => {
              // Calculate marker positions based on actual coordinates
              // Gaza Strip: lng ~34.3-34.5, lat ~31.2-31.6
              // West Bank: lng ~34.8-35.6, lat ~31.3-32.5
              const isGaza = school.region === 'قطاع غزة';
              const markerTop = isGaza
                ? `${65 + (school.coordinates.lat - 31.2) * 100}%` // Gaza area
                : `${15 + (32.5 - school.coordinates.lat) * 60}%`; // West Bank area
              const markerLeft = isGaza
                ? `${10 + (school.coordinates.lng - 34.2) * 100}%` // Gaza longitude
                : `${40 + (school.coordinates.lng - 34.8) * 80}%`; // West Bank longitude

              // Determine marker color based on region and directorate
              let markerColor, shadowColor;
              if (isGaza) {
                switch (school.directorateCode) {
                  case 'east_gaza':
                    markerColor = 'bg-gradient-to-br from-green-400 to-green-600';
                    shadowColor = 'rgba(34, 197, 94, 0.4)';
                    break;
                  case 'west_gaza':
                    markerColor = 'bg-gradient-to-br from-emerald-400 to-emerald-600';
                    shadowColor = 'rgba(16, 185, 129, 0.4)';
                    break;
                  case 'north_gaza':
                    markerColor = 'bg-gradient-to-br from-teal-400 to-teal-600';
                    shadowColor = 'rgba(20, 184, 166, 0.4)';
                    break;
                  case 'south_gaza':
                    markerColor = 'bg-gradient-to-br from-cyan-400 to-cyan-600';
                    shadowColor = 'rgba(6, 182, 212, 0.4)';
                    break;
                  default:
                    markerColor = 'bg-gradient-to-br from-green-500 to-emerald-600';
                    shadowColor = 'rgba(34, 197, 94, 0.4)';
                }
              } else {
                markerColor = 'bg-gradient-to-br from-blue-500 to-indigo-600';
                shadowColor = 'rgba(59, 130, 246, 0.4)';
              }

              return (
                <motion.div
                  key={school.id}
                  className={`absolute w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center cursor-pointer pointer-events-auto transform transition-all duration-300 hover:scale-125 ${markerColor}`}
                  style={{
                    top: markerTop,
                    left: markerLeft
                  }}
                  whileHover={{
                    scale: 1.3,
                    zIndex: 50,
                    boxShadow: `0 10px 30px ${shadowColor}`
                  }}
                  onClick={() => setSelectedSchool(school)}
                  title={`${school.name} - ${school.city}, ${school.region}${school.directorate ? ` (${school.directorate})` : ''}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <FiMapPin className="w-5 h-5 text-white filter drop-shadow-md" />

                  {/* School marker tooltip */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-semibold z-20 border border-gray-200 pointer-events-none"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    <div className="text-center">
                      <div className="font-bold">{school.name}</div>
                      {school.directorate && (
                        <div className="text-gray-600 text-xs mt-1">{school.directorate}</div>
                      )}
                    </div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Animated connection lines */}
            {filteredSchools.length > 1 && (
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1 }}
              >
                {filteredSchools.slice(0, 5).map((school, index) => {
                  if (index === filteredSchools.length - 1) return null;
                  const nextSchool = filteredSchools[index + 1];
                  const isGaza1 = school.region === 'قطاع غزة';
                  const isGaza2 = nextSchool.region === 'قطاع غزة';

                  if (isGaza1 !== isGaza2) return null; // Don't connect different regions

                  return (
                    <motion.line
                      key={`line-${index}`}
                      x1={isGaza1 ? `${10 + (school.coordinates.lng - 34.2) * 100}%` : `${40 + (school.coordinates.lng - 34.8) * 80}%`}
                      y1={isGaza1 ? `${65 + (school.coordinates.lat - 31.2) * 100}%` : `${15 + (32.5 - school.coordinates.lat) * 60}%`}
                      x2={isGaza2 ? `${10 + (nextSchool.coordinates.lng - 34.2) * 100}%` : `${40 + (nextSchool.coordinates.lng - 34.8) * 80}%`}
                      y2={isGaza2 ? `${65 + (nextSchool.coordinates.lat - 31.2) * 100}%` : `${15 + (32.5 - nextSchool.coordinates.lat) * 60}%`}
                      stroke={isGaza1 ? '#10b981' : '#3b82f6'}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: index * 0.5 }}
                    />
                  );
                })}
              </motion.svg>
            )}
          </div>
        </motion.div>

        {/* Enhanced Schools List */}
        <motion.div
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {filteredSchools.map((school, index) => (
            <motion.div
              key={school.id}
              className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-blue-200/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* School card content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <motion.h4
                      className="font-bold text-gray-800 text-xl mb-2 leading-tight"
                      whileHover={{ scale: 1.02 }}
                    >
                      {school.name}
                    </motion.h4>
                    <p className="text-sm text-gray-600 mb-3 font-medium">{school.englishName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4 text-blue-500" />
                        {school.city}, {school.region}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4 text-green-500" />
                        {school.studentsCount} طالب
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-2xl border border-yellow-200">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold text-yellow-700">{school.rating}</span>
                    </div>

                    <span className={`text-xs px-3 py-1 rounded-2xl font-bold border-2 ${
                      school.region === 'قطاع غزة'
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200'
                    }`}>
                      {school.region}
                    </span>
                  </div>
                </div>

                <motion.p
                  className="text-sm text-gray-700 mb-4 leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {school.description}
                </motion.p>

                <div className="flex gap-2 mb-5 flex-wrap">
                  {school.subjects.slice(0, 2).map((subject, idx) => (
                    <span key={idx} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-3 py-2 rounded-2xl font-medium border border-blue-200">
                      {subject}
                    </span>
                  ))}
                  {school.subjects.length > 2 && (
                    <span className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 text-xs px-3 py-2 rounded-2xl font-medium border border-gray-200">
                      +{school.subjects.length - 2} أخرى
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => navigateToSchoolPage(school)}
                    className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-4 rounded-2xl text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🏫 عرض التفاصيل
                  </motion.button>

                  <motion.button
                    onClick={() => getDirections(school)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-2xl text-sm hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    title="احصل على الاتجاهات"
                  >
                    <FiNavigation className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredSchools.length === 0 && (
          <motion.div
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiBook className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">لم يتم العثور على مدارس مطابقة</h3>
            <p className="text-sm">جرب تغيير مصطلح البحث أو الفلتر</p>
          </motion.div>
        )}

        {/* Enhanced Quick Actions */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => openInGoogleMaps()}
            className="flex items-center gap-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:via-indigo-700 hover:to-purple-800 transition-all duration-400 shadow-xl hover:shadow-2xl font-bold text-lg"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiExternalLink className="w-6 h-6" />
            🗺️ فتح في خرائط جوجل
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveFilter('all');
              setSearchTerm('');
            }}
            className="flex items-center gap-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-800 transition-all duration-400 shadow-xl hover:shadow-2xl font-bold text-lg"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBook className="w-6 h-6" />
            🏫 عرض جميع المدارس
          </motion.button>
        </motion.div>

        {/* Enhanced Statistics */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {[
            { icon: FiBook, label: 'إجمالي المدارس', value: palestinianSchools.length, color: 'from-blue-500 to-indigo-600' },
            { icon: FiUsers, label: 'إجمالي الطلاب', value: palestinianSchools.reduce((sum, school) => sum + school.studentsCount, 0).toLocaleString(), color: 'from-green-500 to-emerald-600' },
            { icon: FiStar, label: 'متوسط التقييم', value: (palestinianSchools.reduce((sum, school) => sum + school.rating, 0) / palestinianSchools.length).toFixed(1), color: 'from-yellow-500 to-orange-600' },
            { icon: FiGlobe, label: 'أنواع التعليم', value: [...new Set(palestinianSchools.map(school => school.type))].length, color: 'from-purple-500 to-pink-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border-2 border-blue-200/30 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Background glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white/50 relative z-10`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-8 h-8 text-white filter drop-shadow-md" />
              </motion.div>

              <motion.h4
                className="text-3xl font-bold text-gray-800 mb-2 relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.h4>

              <p className="text-sm text-gray-700 font-medium relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* School Details Modal */}
        <AnimatePresence>
          {showSchoolDetails && selectedSchool && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchoolDetails(false)}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedSchool.name}</h3>
                      <p className="text-gray-600">{selectedSchool.englishName}</p>
                    </div>
                    <motion.button
                      onClick={() => setShowSchoolDetails(false)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">معلومات أساسية</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">النوع:</span> {selectedSchool.type}</p>
                        <p><span className="font-medium">العنوان:</span> {selectedSchool.address}</p>
                        <p><span className="font-medium">الهاتف:</span> {selectedSchool.phone}</p>
                        <p><span className="font-medium">سنة التأسيس:</span> {selectedSchool.established}</p>
                        <p><span className="font-medium">عدد الطلاب:</span> {selectedSchool.studentsCount}</p>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">التقييم:</span>
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          <span>{selectedSchool.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">الوصف</h4>
                      <p className="text-sm text-gray-600 mb-4">{selectedSchool.description}</p>

                      <h4 className="font-semibold text-gray-800 mb-3">المواد الدراسية</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSchool.subjects.map((subject, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-semibold text-gray-800 mb-3">المرافق</h4>
                      <div className="space-y-1">
                        {selectedSchool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <motion.button
                      onClick={() => navigateToSchoolPage(selectedSchool)}
                      className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      زيارة صفحة المدرسة
                    </motion.button>

                    <motion.button
                      onClick={() => getDirections(selectedSchool)}
                      className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      الاتجاهات
                    </motion.button>

                    <motion.button
                      onClick={() => openInGoogleMaps(selectedSchool)}
                      className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      خرائط جوجل
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Map Background */}
        {isMapExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMapExpanded(false)}
          />
        )}
      </div>

      {/* Additional background decorative elements */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-200/8 to-purple-300/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
          repeatType: "loop"
        }}
      />
    </div>
  );
};

export default MapSection;
