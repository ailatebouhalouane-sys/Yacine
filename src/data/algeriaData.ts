/**
 * Algerian Wilayas & Algiers Suburbs Data
 * Includes all 58 Wilayas and Greater Algiers (الجزائر وضواحيها) municipalities
 */

export interface LocationDetail {
  id: string;
  nameAr: string;
  nameFr: string;
  lat: number;
  lng: number;
  elevationMeters?: number;
  wilayaCode?: number;
  region?: 'center' | 'east' | 'west' | 'south';
  isSuburb?: boolean;
  parentWilaya?: string;
}

// Greater Algiers Suburbs & Districts (ضواحي وأحياء العاصمة)
export const ALGIERS_SUBURBS: LocationDetail[] = [
  {
    id: 'algiers-centre',
    nameAr: 'الجزائر الوسطى / القصبة / سيدي امحمد',
    nameFr: 'Alger Centre / Kasbah',
    lat: 36.7753,
    lng: 3.0588,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'bab-el-oued',
    nameAr: 'باب الوادي / بولوغين / رايس حميدو',
    nameFr: 'Bab El Oued / Bologhine',
    lat: 36.7917,
    lng: 3.0486,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'bouzareah',
    nameAr: 'بوزريعة / بني مسوس / الأبيار',
    nameFr: 'Bouzaréah / Béni Messous / El Biar',
    lat: 36.7867,
    lng: 3.0189,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'cheraga',
    nameAr: 'الشراقة / دالي براهيم / أولاد فايت',
    nameFr: 'Chéraga / Dely Ibrahim / Ouled Fayet',
    lat: 36.7667,
    lng: 2.9500,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'zeralda',
    nameAr: 'زرالدة / سطاوالي / سيدي عبد الله',
    nameFr: 'Zéralda / Staouéli / Sidi Abdellah',
    lat: 36.7167,
    lng: 2.8500,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'ain-benian',
    nameAr: 'عين البنيان / الحمامات',
    nameFr: 'Aïn Bénian / El Hammamet',
    lat: 36.8028,
    lng: 2.9219,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'bir-mourad-rais',
    nameAr: 'بئر مراد رايس / بئر خادم / حيدرة',
    nameFr: 'Bir Mourad Raïs / Birkhadem / Hydra',
    lat: 36.7369,
    lng: 3.0531,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'draria',
    nameAr: 'درارية / بابا حسن / العاشور / السحاولة',
    nameFr: 'Draria / Baba Hassen / El Achour',
    lat: 36.7167,
    lng: 3.0000,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'birtouta',
    nameAr: 'بئر توتة / تسالة المرجة / أولاد شبل',
    nameFr: 'Birtouta / Tessala El Merdja',
    lat: 36.6433,
    lng: 3.0033,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'kouba',
    nameAr: 'القبة / حسين داي / المقرية / بوروبة',
    nameFr: 'Kouba / Hussein Dey / Bourouba',
    lat: 36.7264,
    lng: 3.0858,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'el-harrach',
    nameAr: 'الحراش / وادي السمار / باش جراح',
    nameFr: 'El Harrach / Oued Smar / Bachdjerrah',
    lat: 36.7214,
    lng: 3.1364,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'baraki',
    nameAr: 'براقي / سيدي موسى / الكاليتوس',
    nameFr: 'Baraki / Sidi Moussa / Les Eucalyptus',
    lat: 36.6667,
    lng: 3.1000,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'dar-el-beida',
    nameAr: 'الدار البيضاء / باب الزوار / المحمدية',
    nameFr: 'Dar El Beïda / Bab Ezzouar / Mohammedia',
    lat: 36.7133,
    lng: 3.2125,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  {
    id: 'rouiba',
    nameAr: 'الرويبة / الرغاية / هراوة / برج الكيفان',
    nameFr: 'Rouïba / Reghaïa / Bordj El Kiffan',
    lat: 36.7333,
    lng: 3.2833,
    wilayaCode: 16,
    isSuburb: true,
    parentWilaya: 'الجزائر العاصمة',
  },
  // Suburbs bordering Algiers (Metropolitan belt)
  {
    id: 'boufarik-blida',
    nameAr: 'بوفاريك / الصومعة (ضواحي البليدة)',
    nameFr: 'Boufarik / Soumâa (Blida)',
    lat: 36.5744,
    lng: 2.9133,
    wilayaCode: 9,
    isSuburb: true,
    parentWilaya: 'البليدة',
  },
  {
    id: 'larbaa-meftah',
    nameAr: 'الأربعاء / مفتاح (أحواز العاصمة الجنوبية)',
    nameFr: 'Larbaâ / Meftah',
    lat: 36.5653,
    lng: 3.1558,
    wilayaCode: 9,
    isSuburb: true,
    parentWilaya: 'البليدة',
  },
  {
    id: 'boudouaou-khemis',
    nameAr: 'بودواو / خميس الخشنة (أحواز العاصمة الشرقية)',
    nameFr: 'Boudouaou / Khemis El Khechna',
    lat: 36.7289,
    lng: 3.4097,
    wilayaCode: 35,
    isSuburb: true,
    parentWilaya: 'بومرداس',
  },
  {
    id: 'kolea-fouka',
    nameAr: 'القليعة / فوكة / بواسماعيل (أحواز العاصمة الغربية)',
    nameFr: 'Koléa / Fouka / Bou Ismaïl',
    lat: 36.6381,
    lng: 2.7686,
    wilayaCode: 42,
    isSuburb: true,
    parentWilaya: 'تيبازة',
  },
];

// All 58 Wilayas of Algeria (الولايات الـ 58 كاملة)
export const ALGERIA_WILAYAS: LocationDetail[] = [
  { id: '01', wilayaCode: 1, nameAr: 'أدرار', nameFr: 'Adrar', lat: 27.8744, lng: -0.2939, region: 'south' },
  { id: '02', wilayaCode: 2, nameAr: 'الشلف', nameFr: 'Chlef', lat: 36.1653, lng: 1.3347, region: 'center' },
  { id: '03', wilayaCode: 3, nameAr: 'الأغواط', nameFr: 'Laghouat', lat: 33.8000, lng: 2.8650, region: 'south' },
  { id: '04', wilayaCode: 4, nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', lat: 35.8756, lng: 7.1136, region: 'east' },
  { id: '05', wilayaCode: 5, nameAr: 'باتنة', nameFr: 'Batna', lat: 35.5558, lng: 6.1742, region: 'east' },
  { id: '06', wilayaCode: 6, nameAr: 'بجاية', nameFr: 'Béjaïa', lat: 36.7558, lng: 5.0844, region: 'center' },
  { id: '07', wilayaCode: 7, nameAr: 'بسكرة', nameFr: 'Biskra', lat: 34.8504, lng: 5.7281, region: 'south' },
  { id: '08', wilayaCode: 8, nameAr: 'بشار', nameFr: 'Béchar', lat: 31.6167, lng: -2.2167, region: 'south' },
  { id: '09', wilayaCode: 9, nameAr: 'البليدة', nameFr: 'Blida', lat: 36.4703, lng: 2.8278, region: 'center' },
  { id: '10', wilayaCode: 10, nameAr: 'البويرة', nameFr: 'Bouira', lat: 36.3749, lng: 3.9020, region: 'center' },
  { id: '11', wilayaCode: 11, nameAr: 'تمنراست', nameFr: 'Tamanrasset', lat: 22.7850, lng: 5.5228, region: 'south' },
  { id: '12', wilayaCode: 12, nameAr: 'تبسة', nameFr: 'Tébessa', lat: 35.4042, lng: 8.1242, region: 'east' },
  { id: '13', wilayaCode: 13, nameAr: 'تلمسان', nameFr: 'Tlemcen', lat: 34.8783, lng: -1.3150, region: 'west' },
  { id: '14', wilayaCode: 14, nameAr: 'تيارت', nameFr: 'Tiaret', lat: 35.3711, lng: 1.3170, region: 'west' },
  { id: '15', wilayaCode: 15, nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', lat: 36.7119, lng: 4.0458, region: 'center' },
  { id: '16', wilayaCode: 16, nameAr: 'الجزائر العاصمة', nameFr: 'Alger', lat: 36.7538, lng: 3.0588, region: 'center' },
  { id: '17', wilayaCode: 17, nameAr: 'الجلفة', nameFr: 'Djelfa', lat: 34.6728, lng: 3.2630, region: 'center' },
  { id: '18', wilayaCode: 18, nameAr: 'جيجل', nameFr: 'Jijel', lat: 36.8206, lng: 5.7667, region: 'east' },
  { id: '19', wilayaCode: 19, nameAr: 'سطيف', nameFr: 'Sétif', lat: 36.1911, lng: 5.4137, region: 'east' },
  { id: '20', wilayaCode: 20, nameAr: 'سعيدة', nameFr: 'Saïda', lat: 34.8303, lng: 0.1517, region: 'west' },
  { id: '21', wilayaCode: 21, nameAr: 'سكيكدة', nameFr: 'Skikda', lat: 36.8762, lng: 6.9092, region: 'east' },
  { id: '22', wilayaCode: 22, nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', lat: 35.1899, lng: -0.6308, region: 'west' },
  { id: '23', wilayaCode: 23, nameAr: 'عنابة', nameFr: 'Annaba', lat: 36.9000, lng: 7.7667, region: 'east' },
  { id: '24', wilayaCode: 24, nameAr: 'قالمة', nameFr: 'Guelma', lat: 36.4622, lng: 7.4261, region: 'east' },
  { id: '25', wilayaCode: 25, nameAr: 'قسنطينة', nameFr: 'Constantine', lat: 36.3650, lng: 6.6147, region: 'east' },
  { id: '26', wilayaCode: 26, nameAr: 'المدية', nameFr: 'Médéa', lat: 36.2642, lng: 2.7539, region: 'center' },
  { id: '27', wilayaCode: 27, nameAr: 'مستغانم', nameFr: 'Mostaganem', lat: 35.9312, lng: 0.0892, region: 'west' },
  { id: '28', wilayaCode: 28, nameAr: 'المسيلة', nameFr: "M'Sila", lat: 35.7058, lng: 4.5419, region: 'center' },
  { id: '29', wilayaCode: 29, nameAr: 'معسكر', nameFr: 'Mascara', lat: 35.3967, lng: 0.1403, region: 'west' },
  { id: '30', wilayaCode: 30, nameAr: 'ورقلة', nameFr: 'Ouargla', lat: 31.9530, lng: 5.3200, region: 'south' },
  { id: '31', wilayaCode: 31, nameAr: 'وهران', nameFr: 'Oran', lat: 35.6971, lng: -0.6308, region: 'west' },
  { id: '32', wilayaCode: 32, nameAr: 'البيض', nameFr: 'El Bayadh', lat: 33.6803, lng: 1.0192, region: 'south' },
  { id: '33', wilayaCode: 33, nameAr: 'إليزي', nameFr: 'Illizi', lat: 26.5078, lng: 8.4811, region: 'south' },
  { id: '34', wilayaCode: 34, nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', lat: 36.0731, lng: 4.7611, region: 'east' },
  { id: '35', wilayaCode: 35, nameAr: 'بومرداس', nameFr: 'Boumerdès', lat: 36.7664, lng: 3.4772, region: 'center' },
  { id: '36', wilayaCode: 36, nameAr: 'الطارف', nameFr: 'El Tarf', lat: 36.7672, lng: 8.3139, region: 'east' },
  { id: '37', wilayaCode: 37, nameAr: 'تندوف', nameFr: 'Tindouf', lat: 27.6711, lng: -8.1478, region: 'south' },
  { id: '38', wilayaCode: 38, nameAr: 'تيسمسيلت', nameFr: 'Tissemsilt', lat: 35.6072, lng: 1.8108, region: 'west' },
  { id: '39', wilayaCode: 39, nameAr: 'الوادي', nameFr: 'El Oued', lat: 33.3683, lng: 6.8675, region: 'south' },
  { id: '40', wilayaCode: 40, nameAr: 'خنشلة', nameFr: 'Khenchela', lat: 35.4358, lng: 7.1433, region: 'east' },
  { id: '41', wilayaCode: 41, nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', lat: 36.2864, lng: 7.9511, region: 'east' },
  { id: '42', wilayaCode: 42, nameAr: 'تيبازة', nameFr: 'Tipaza', lat: 36.5942, lng: 2.4475, region: 'center' },
  { id: '43', wilayaCode: 43, nameAr: 'ميلة', nameFr: 'Mila', lat: 36.4503, lng: 6.2644, region: 'east' },
  { id: '44', wilayaCode: 44, nameAr: 'عين الدفلى', nameFr: 'Aïn Defla', lat: 36.2642, lng: 1.9678, region: 'center' },
  { id: '45', wilayaCode: 45, nameAr: 'النعامة', nameFr: 'Naâma', lat: 33.2667, lng: -0.3167, region: 'south' },
  { id: '46', wilayaCode: 46, nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent', lat: 35.2975, lng: -1.1403, region: 'west' },
  { id: '47', wilayaCode: 47, nameAr: 'غرداية', nameFr: 'Ghardaïa', lat: 32.4909, lng: 3.6736, region: 'south' },
  { id: '48', wilayaCode: 48, nameAr: 'غليزان', nameFr: 'Relizane', lat: 35.7372, lng: 0.5558, region: 'west' },
  { id: '49', wilayaCode: 49, nameAr: 'تيميمون', nameFr: 'Timimoun', lat: 29.2639, lng: 0.2311, region: 'south' },
  { id: '50', wilayaCode: 50, nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', lat: 21.3283, lng: 0.9542, region: 'south' },
  { id: '51', wilayaCode: 51, nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', lat: 34.4331, lng: 5.0658, region: 'south' },
  { id: '52', wilayaCode: 52, nameAr: 'بني عباس', nameFr: 'Béni Abbès', lat: 30.1333, lng: -2.1667, region: 'south' },
  { id: '53', wilayaCode: 53, nameAr: 'عين صالح', nameFr: 'In Salah', lat: 27.1936, lng: 2.4608, region: 'south' },
  { id: '54', wilayaCode: 54, nameAr: 'عين قزام', nameFr: 'In Guezzam', lat: 19.5694, lng: 5.7708, region: 'south' },
  { id: '55', wilayaCode: 55, nameAr: 'تقرت', nameFr: 'Touggourt', lat: 33.1056, lng: 6.0583, region: 'south' },
  { id: '56', wilayaCode: 56, nameAr: 'جانت', nameFr: 'Djanet', lat: 24.5539, lng: 9.4847, region: 'south' },
  { id: '57', wilayaCode: 57, nameAr: 'المغير', nameFr: "El M'Ghair", lat: 33.9500, lng: 5.9167, region: 'south' },
  { id: '58', wilayaCode: 58, nameAr: 'المنيعة', nameFr: 'El Meniaa', lat: 30.5833, lng: 2.8833, region: 'south' },
];

export const ALL_LOCATIONS: LocationDetail[] = [
  ...ALGIERS_SUBURBS,
  ...ALGERIA_WILAYAS,
];

// Helper to find closest location by GPS coordinates
export function findClosestAlgerianLocation(lat: number, lng: number): LocationDetail {
  let closest = ALL_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of ALL_LOCATIONS) {
    const dLat = (loc.lat - lat) * (Math.PI / 180);
    const dLng = (loc.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(loc.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = 6371 * c; // km

    if (d < minDistance) {
      minDistance = d;
      closest = loc;
    }
  }

  return closest;
}
