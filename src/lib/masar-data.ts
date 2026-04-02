export interface Camera {
  id: number;
  lat: number;
  lng: number;
  type: 'speed' | 'redlight';
  limit?: number;
  nameAr: string;
  nameEn: string;
}

export interface ParkingZone {
  id: number;
  type: 'free' | 'mawaqif' | 'noPark';
  color: string;
  coords: [number, number][];
  nameAr: string;
  nameEn: string;
}

export interface Incident {
  id: number;
  type: 'jam' | 'accident' | 'roadblock' | 'debris' | 'truck';
  lat: number;
  lng: number;
  timestamp: number;
  votes: number;
}

export const cameras: Camera[] = [
  { id: 1, lat: 26.4312, lng: 50.1021, type: 'speed', limit: 80, nameAr: 'طريق الملك فهد', nameEn: 'King Fahd Road' },
  { id: 2, lat: 26.4156, lng: 50.0934, type: 'redlight', nameAr: 'تقاطع الكورنيش', nameEn: 'Corniche Intersection' },
  { id: 3, lat: 26.4450, lng: 50.1200, type: 'speed', limit: 100, nameAr: 'طريق الخليج العربي', nameEn: 'Al Khaleej Road' },
  { id: 4, lat: 26.4000, lng: 50.0800, type: 'speed', limit: 90, nameAr: 'طريق الظهران الجبيل', nameEn: 'Dhahran-Jubail Hwy' },
  { id: 5, lat: 26.4250, lng: 50.1100, type: 'redlight', nameAr: 'شارع الأمير محمد بن فهد', nameEn: 'Prince Mohammed bin Fahd Rd' },
  { id: 6, lat: 26.4350, lng: 50.0950, type: 'speed', limit: 80, nameAr: 'طريق الملك عبدالعزيز', nameEn: 'King Abdulaziz Road' },
  { id: 7, lat: 26.4100, lng: 50.0700, type: 'speed', limit: 80, nameAr: 'حي الشاطئ', nameEn: 'Ash Shati District' },
  { id: 8, lat: 26.4500, lng: 50.1300, type: 'redlight', nameAr: 'دوار الكورنيش', nameEn: 'Corniche Roundabout' },
  { id: 9, lat: 26.3900, lng: 50.1000, type: 'speed', limit: 110, nameAr: 'طريق الرياض', nameEn: 'Riyadh Road' },
  { id: 10, lat: 26.4200, lng: 50.0600, type: 'speed', limit: 70, nameAr: 'حي الفيصلية', nameEn: 'Al Faisaliyah District' },
];

export const parkingZones: ParkingZone[] = [
  {
    id: 1,
    type: 'free',
    color: '#22c55e', // Green
    coords: [
      [26.435, 50.105],
      [26.437, 50.107],
      [26.436, 50.109],
      [26.434, 50.107],
    ],
    nameAr: 'موقف مجاني - الشاطئ',
    nameEn: 'Free Parking - Ash Shati',
  },
  {
    id: 2,
    type: 'mawaqif',
    color: '#3b82f6', // Blue
    coords: [
      [26.418, 50.092],
      [26.420, 50.094],
      [26.419, 50.096],
      [26.417, 50.094],
    ],
    nameAr: 'مواقف مدفوعة - وسط المدينة',
    nameEn: 'Mawaqif Paid - Downtown',
  },
  {
    id: 3,
    type: 'noPark',
    color: '#ef4444', // Red
    coords: [
      [26.425, 50.088],
      [26.427, 50.090],
      [26.426, 50.092],
      [26.424, 50.090],
    ],
    nameAr: 'ممنوع الوقوف - منطقة أمنية',
    nameEn: 'No Parking - Security Zone',
  },
];

export const initialIncidents: Incident[] = [
  { id: 1, type: 'jam', lat: 26.4189, lng: 50.0912, timestamp: Date.now() - 300000, votes: 5 },
  { id: 2, type: 'accident', lat: 26.4350, lng: 50.1150, timestamp: Date.now() - 600000, votes: 12 },
];

export const translations = {
  en: {
    title: 'Masar AI',
    subtitle: 'Road Safety & Parking',
    report: 'Report Incident',
    reportAr: 'بلغ عن حادث',
    parking: 'Parking Assistant',
    parkingAr: 'مساعد المواقف',
    slowDown: 'Slow Down - Safety Camera Ahead',
    slowDownAr: 'اهدأ - كاميرا سلامة أمامك',
    meters: 'm',
    chatTitle: 'Masar Assistant',
    chatPlaceholder: 'Ask Masar...',
    jam: 'Traffic Jam',
    jamAr: 'ازدحام مروري',
    accident: 'Accident',
    accidentAr: 'حادث',
    roadblock: 'Road Block',
    roadblockAr: 'طريق مغلق',
    debris: 'Debris/Hazard',
    debrisAr: 'حطام/خطر',
    truck: 'Heavy Truck Congestion',
    truckAr: 'ازدحام شاحنات',
    close: 'Close',
    distance: 'Distance',
    speedLimit: 'Speed Limit',
    redLight: 'Red Light Camera',
    speedCamera: 'Speed Camera',
    langToggle: 'العربية',
    ai_q1: 'Where can I park near Dammam Corniche?',
    ai_q2: 'Is Prince Mohammed Road blocked?',
    ai_q3: 'General navigation help',
    ai_a1: 'There are free parking zones in Ash Shati and Mawaqif zones near the Seafront.',
    ai_a2: 'Current reports show normal flow on Prince Mohammed bin Fahd Road.',
    ai_a3: 'I can help you find parking, avoid traffic, and stay safe from cameras.',
    locationRequired: 'Location required to report',
    reportSuccess: 'Report sent successfully',
    reportFailed: 'Failed to send report',
  },
  ar: {
    title: 'مسار',
    subtitle: 'سلامة الطريق والمواقف',
    report: 'بلغ عن حادث',
    reportAr: 'Report Incident',
    parking: 'مساعد المواقف',
    parkingAr: 'Parking Assistant',
    slowDown: 'اهدأ - كاميرا سلامة أمامك',
    slowDownAr: 'Slow Down - Safety Camera Ahead',
    meters: 'متر',
    chatTitle: 'مساعد مسار',
    chatPlaceholder: 'اسأل مسار...',
    jam: 'ازدحام مروري',
    jamAr: 'Traffic Jam',
    accident: 'حادث',
    accidentAr: 'Accident',
    roadblock: 'طريق مغلق',
    roadblockAr: 'Road Block',
    debris: 'حطام/خطر',
    debrisAr: 'Debris/Hazard',
    truck: 'ازدحام شاحنات',
    truckAr: 'Heavy Truck Congestion',
    close: 'إغلاق',
    distance: 'المسافة',
    speedLimit: 'السرعة القصوى',
    redLight: 'كاميرا إشارة ضوئية',
    speedCamera: 'كاميرا سرعة',
    langToggle: 'English',
    ai_q1: 'أين يمكنني الوقوف بالقرب من كورنيش الدمام؟',
    ai_q2: 'هل طريق الأمير محمد مغلق؟',
    ai_q3: 'مساعدة عامة في التنقل',
    ai_a1: 'توجد مناطق وقوف مجانية في حي الشاطئ ومناطق مواقف بالقرب من الواجهة البحرية.',
    ai_a2: 'تظهر التقارير الحالية تدفقاً طبيعياً في طريق الأمير محمد بن فهد.',
    ai_a3: 'يمكنني مساعدتك في العثور على مواقف، وتجنب الازدحام، والبقاء آمناً من الكاميرات.',
    locationRequired: 'الموقع مطلوب لإرسال البلاغ',
    reportSuccess: 'تم إرسال البلاغ بنجاح',
    reportFailed: 'فشل في إرسال البلاغ',
  },
};

export const aiKnowledge = [
  {
    id: 'corniche-friday',
    keywords: ['corniche', 'friday', 'كورنيش', 'الجمعة'],
    question: {
      en: "How is parking at Dammam Corniche on Friday?",
      ar: "كيف هي المواقف في كورنيش الدمام يوم الجمعة؟"
    },
    response: {
      en: "Parking near the Dammam Corniche is very difficult on Friday nights. I recommend arriving before 4:00 PM or using the paid parking lots near the commercial area to save time.",
      ar: "عادة ما يكون العثور على موقف بالقرب من كورنيش الدمام صعباً جداً مساء يوم الجمعة. أنصحك بالوصول قبل الساعة 4:00 عصراً أو استخدام المواقف المدفوعة بالقرب من المنطقة التجارية."
    }
  },
  {
    id: 'mawaqif-locations',
    keywords: ['mawaqif', 'paid', 'مواقف', 'المدفوعة'],
    question: {
      en: "Where is Mawaqif active?",
      ar: "أين تعمل مواقف (المدفوعة)؟"
    },
    response: {
      en: "Mawaqif (paid parking) is currently active in the Downtown (Balad) area and near the Sheraton Hotel. Make sure to pay via the app or street kiosks to avoid fines.",
      ar: "نظام مواقف (الدفع المسبق) مفعل حالياً في منطقة وسط البلد (الدمام) وبالقرب من فندق الشيراتون. تأكد من الدفع عبر التطبيق أو الأجهزة لتجنب المخالفات."
    }
  },
  {
    id: 'prince-mohammed-congestion',
    keywords: ['prince mohammed', 'congestion', 'الأمير محمد', 'مزدحم'],
    question: {
      en: "Is Prince Mohammed Road congested?",
      ar: "هل طريق الأمير محمد مزدحم؟"
    },
    response: {
      en: "Yes, Prince Mohammed Road often experiences heavy congestion. I suggest taking King Fahd Road or Ali Ibn Abi Talib Street as faster alternative routes.",
      ar: "نعم، غالباً ما يشهد طريق الأمير محمد ازدحاماً شديداً. أقترح استخدام طريق الملك فهد أو شارع علي بن أبي طالب كطرق بديلة أسرع."
    }
  }
];
