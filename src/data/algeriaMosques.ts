/**
 * Major Mosques in Algeria, Algiers, and its suburbs
 * With accurate coordinates, districts, and prayer details
 */

export interface MosqueDetail {
  id: string;
  nameAr: string;
  nameFr: string;
  districtAr: string;
  wilayaNameAr: string;
  wilayaCode: number;
  lat: number;
  lng: number;
  distanceKm?: number;
  capacity?: number;
  isHistoric?: boolean;
  isSuburbAlgiers?: boolean;
  jumuahTime: string;
  iqamaMinutes: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  features: string[];
}

export const ALGERIA_MOSQUES: MosqueDetail[] = [
  // --- GREATER ALGIERS & SUBURBS (الجزائر وضواحيها) ---
  {
    id: 'djamaa-el-djazair',
    nameAr: 'جامع الجزائر الأعظم',
    nameFr: 'Djamaâ El-Djazaïr (Grande Mosquée d’Alger)',
    districtAr: 'المحمدية / الحراش (العاصمة)',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7344,
    lng: 3.1417,
    capacity: 120000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['ثالث أكبر مسجد في العالم', 'أطول مئذنة في العالم (265م)', 'مكتبة كبرى', 'موقف سيارات شاسع', 'متحف إسلامي'],
  },
  {
    id: 'ketchaoua',
    nameAr: 'مسجد كتشاوة التاريخي',
    nameFr: 'Mosquée Ketchaoua',
    districtAr: 'القصبة السفلى / الجزائر الوسطى',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7850,
    lng: 3.0617,
    capacity: 8000,
    isHistoric: true,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['معلم تاريخي عالمي (يونسكو)', 'طراز عثماني وموريسكي', 'حلقات تحفيظ القرآن'],
  },
  {
    id: 'el-djamaa-el-kebir',
    nameAr: 'الجامع الكبير بالجزائر العاصمة',
    nameFr: 'Grande Mosquée d’Alger (Al-Kabir)',
    districtAr: 'ساحة الشهداء / القصبة',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7858,
    lng: 3.0642,
    capacity: 5000,
    isHistoric: true,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['أقدم مسجد بالعاصمة (بناه يوسف بن تاشفين المرابطي 1097م)', 'منبر أثري نادر'],
  },
  {
    id: 'el-djedid',
    nameAr: 'الجامع الجديد (جامع الحوتة)',
    nameFr: 'Mosquée Al-Djedid',
    districtAr: 'ساحة الشهداء / الواجهة البحرية',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7844,
    lng: 3.0631,
    capacity: 4000,
    isHistoric: true,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['عمارة عثمانية سنة 1660م', 'إطلالة مباشرة على الميناء'],
  },
  {
    id: 'mosque-el-oumma',
    nameAr: 'مسجد الأمة',
    nameFr: 'Mosquée El Oumma',
    districtAr: 'بولوغين / باب الوادي',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7981,
    lng: 3.0478,
    capacity: 3500,
    isHistoric: true,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['مسجد تاريخي لجمعية العلماء المسلمين', 'مدرسة قرآنية نشطة'],
  },
  {
    id: 'mosque-el-qods-hydra',
    nameAr: 'مسجد القدس',
    nameFr: 'Mosquée Al-Qods Hydra',
    districtAr: 'حيدرة / بن عكنون',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7456,
    lng: 3.0389,
    capacity: 5000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['موقف سيارات', 'مصلى نساء مستقل', 'دروس دينية أسبوعية'],
  },
  {
    id: 'mosque-el-nour-cheraga',
    nameAr: 'مسجد النور',
    nameFr: 'Mosquée En-Nour Chéraga',
    districtAr: 'الشراقة / دالي براهيم',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7689,
    lng: 2.9567,
    capacity: 4500,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['جامع رئيسي بضاحية الشراقة', 'مدرسة تحفيظ القرآن'],
  },
  {
    id: 'mosque-el-fath-rouiba',
    nameAr: 'مسجد الفتح بالرويبة',
    nameFr: 'Mosquée El Fath Rouïba',
    districtAr: 'الرويبة / الرغاية (الضاحية الشرقية)',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7350,
    lng: 3.2867,
    capacity: 6000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['أكبر مساجد الضاحية الصناعية بالرويبة', 'مواقف سيارات فسيحة'],
  },
  {
    id: 'mosque-el-ihsan-zeralda',
    nameAr: 'مسجد الإحسان بزرالدة',
    nameFr: 'Mosquée Al-Ihsan Zéralda',
    districtAr: 'زرالدة / سطاوالي / سيدي عبد الله',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7156,
    lng: 2.8533,
    capacity: 4000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['موقع استراتيجي بالساحل الغربي', 'مصلى نسائي مجهز'],
  },
  {
    id: 'mosque-el-wafa-kouba',
    nameAr: 'مسجد الوفاء بالعهد',
    nameFr: 'Mosquée Wafa Bil Ahd Kouba',
    districtAr: 'القبة / بئر خادم',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7233,
    lng: 3.0789,
    capacity: 5000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['مركز علمي وقرآني متميز', 'خطبة جمعة مميزة'],
  },
  {
    id: 'mosque-el-salam-dar-el-beida',
    nameAr: 'مسجد السلام',
    nameFr: 'Mosquée Es-Salam Dar El Beïda',
    districtAr: 'الدار البيضاء / باب الزوار',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7125,
    lng: 3.2108,
    capacity: 4200,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['قريب من مطار الجزائر الدولي', 'سهولة الوصول من الطريق السريع'],
  },
  {
    id: 'mosque-baraki-ahmed-hamani',
    nameAr: 'مسجد الشيخ أحمد حماني',
    nameFr: 'Mosquée Cheikh Ahmed Hamani Baraki',
    districtAr: 'براقي / سيدي موسى',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.6689,
    lng: 3.0989,
    capacity: 5500,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['منارة إشعاع ديني بالضاحية الجنوبية', 'مكتبة إسلامية'],
  },
  {
    id: 'mosque-bouzareah-ben-haddad',
    nameAr: 'مسجد بن حداد',
    nameFr: 'Mosquée Ben Haddad Bouzaréah',
    districtAr: 'بوزريعة / الأبيار',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7878,
    lng: 3.0222,
    capacity: 3800,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['إطلالة بانورامية على خليج الجزائر', 'مدرسة نموذجية للقرآن'],
  },
  {
    id: 'mosque-draria-khulafa',
    nameAr: 'مسجد الخلفاء الراشدين',
    nameFr: 'Mosquée Khulafa Rachidoun Draria',
    districtAr: 'درارية / بابا حسن',
    wilayaNameAr: 'الجزائر العاصمة',
    wilayaCode: 16,
    lat: 36.7189,
    lng: 2.9989,
    capacity: 4000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['مسجد فسيح حديث البناء', 'تهيئة مريحة للمصلين'],
  },
  // --- SUBURBAN METROPOLITAN BELT (البليدة، تيبازة، بومرداس) ---
  {
    id: 'mosque-el-kawthar-blida',
    nameAr: 'مسجد الكوثر الكبير بالبليدة',
    nameFr: 'Grande Mosquée Al-Kawthar Blida',
    districtAr: 'وسط مدينة البليدة (مدينة الورود)',
    wilayaNameAr: 'البليدة',
    wilayaCode: 9,
    lat: 36.4717,
    lng: 2.8317,
    capacity: 10000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['أكبر صرح ديني في متيجة', 'ساحة فسيحة وحدائق'],
  },
  {
    id: 'mosque-kolea-tipaza',
    nameAr: 'مسجد سيدي علي مبارك بالقليعة',
    nameFr: 'Mosquée Sidi Ali M’Barek Koléa',
    districtAr: 'القليعة / فوكة (تيبازة - أحواز العاصمة)',
    wilayaNameAr: 'تيبازة',
    wilayaCode: 42,
    lat: 36.6378,
    lng: 2.7667,
    capacity: 5000,
    isHistoric: true,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['عمارة أندلسية أصيلة', 'زاوية تاريخية عريقة'],
  },
  {
    id: 'mosque-boumerdes-el-nour',
    nameAr: 'مسجد عمر بن الخطاب ببومرداس',
    nameFr: 'Mosquée Omar Ibn Al-Khattab Boumerdès',
    districtAr: 'بومرداس / بودواو (الواجهة الشرقية)',
    wilayaNameAr: 'بومرداس',
    wilayaCode: 35,
    lat: 36.7633,
    lng: 3.4733,
    capacity: 6000,
    isHistoric: false,
    isSuburbAlgiers: true,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['مسجد الولاية الرئيسي', 'قريب من الجامعة والواجهة البحرية'],
  },
  // --- MAJOR HISTORIC MOSQUES OF ALGERIA ---
  {
    id: 'mosque-emir-abdelkader-constantine',
    nameAr: 'مسجد الأمير عبد القادر بقسنطينة',
    nameFr: 'Mosquée Émir Abdelkader Constantine',
    districtAr: 'قسنطينة (عاصمة الشرق الجزائري)',
    wilayaNameAr: 'قسنطينة',
    wilayaCode: 25,
    lat: 36.3533,
    lng: 6.6067,
    capacity: 15000,
    isHistoric: false,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['تحفة معمارية إسلامية', 'جامعة العلوم الإسلامية التابعة له', 'مئذنتان بارتفاع 107م'],
  },
  {
    id: 'mosque-ben-badis-oran',
    nameAr: 'مسجد الإمام عبد الحميد بن باديس بوهران',
    nameFr: 'Mosquée Abdelhamid Ben Badis Oran',
    districtAr: 'حي جمال الدين / وهران الباهية',
    wilayaNameAr: 'وهران',
    wilayaCode: 31,
    lat: 35.6989,
    lng: -0.6122,
    capacity: 25000,
    isHistoric: false,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['ثاني أكبر مسجد في الجزائر', 'مئذنة مكسوة بالزليج الأندلسي بارتفاع 104م', 'مركز ثقافي فخم'],
  },
  {
    id: 'mosque-sidi-boumediene-tlemcen',
    nameAr: 'مسجد سيدي بومدين التاريخي بتلمسان',
    nameFr: 'Mosquée Sidi Boumediene Tlemcen',
    districtAr: 'العباد / تلمسان',
    wilayaNameAr: 'تلمسان',
    wilayaCode: 13,
    lat: 34.8822,
    lng: -1.2989,
    capacity: 3000,
    isHistoric: true,
    isSuburbAlgiers: false,
    jumuahTime: '13:00',
    iqamaMinutes: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
    features: ['تحفة الفن المريني الأندلسي (سنة 1339م)', 'مدرسة قرآنية وحمام أثري'],
  },
];

/**
 * Calculate distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Format distance nicely in Arabic (متر أو كم)
 */
export function formatDistanceAr(distKm: number): string {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} متر`;
  }
  return `${distKm} كم`;
}
