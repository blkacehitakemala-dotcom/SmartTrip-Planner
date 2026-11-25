import type { InterestKey, Language, TripPlan } from '../types/trip';

export interface FeaturedDestination {
  name: string;
  region: Record<Language, string>;
  highlight: Record<Language, string>;
  imageUrl: string;
  suggestedDays: number;
  suggestedInterests: InterestKey[];
}

export const QUICK_DESTINATIONS = [
  'Pulau Sabang',
  'Yogyakarta',
  'Bali',
  'Labuan Bajo',
] as const;

export const FEATURED_DESTINATIONS: FeaturedDestination[] = [
  {
    name: 'Pulau Sabang',
    region: { id: 'Aceh · Ujung Barat Nusantara', en: 'Aceh · Western Tip of Indonesia' },
    highlight: {
      id: 'Snorkeling Pulau Rubiah, Pantai Iboih & Tugu Nol Kilometer',
      en: 'Rubiah Island snorkeling, Iboih Beach & Zero Kilometer Monument',
    },
    imageUrl: '/src/assets/images/dest_pulau_sabang_1795580043189.jpg',
    suggestedDays: 3,
    suggestedInterests: ['beach_nature', 'snorkeling_diving', 'culinary'],
  },
  {
    name: 'Yogyakarta',
    region: { id: 'DIY · Warisan Budaya & Kuliner', en: 'Java · Heritage & Culinary' },
    highlight: {
      id: 'Candi Prambanan, Keraton, Malioboro & sajian gudeg autentik',
      en: 'Prambanan Temple, Royal Palace, Malioboro & authentic Javanese dining',
    },
    imageUrl: '/src/assets/images/dest_yogyakarta_1795580042781.jpg',
    suggestedDays: 3,
    suggestedInterests: ['history_culture', 'culinary', 'shopping'],
  },
  {
    name: 'Bali',
    region: { id: 'Ubud & Pesisir Selatan', en: 'Ubud & Southern Coast' },
    highlight: {
      id: 'Terasering Tegallalang, Uluwatu sunset & kafe artisan',
      en: 'Tegallalang rice terraces, Uluwatu cliffs & coastal cafes',
    },
    imageUrl: '/src/assets/images/dest_bali_1795580045387.jpg',
    suggestedDays: 4,
    suggestedInterests: ['beach_nature', 'photo_spots', 'culinary'],
  },
  {
    name: 'Labuan Bajo',
    region: { id: 'NTT · Gerbang Taman Nasional Komodo', en: 'Flores · Komodo National Park Gateway' },
    highlight: {
      id: 'Trekking Pulau Padar, Pink Beach & berlayar di perairan jernih',
      en: 'Padar Island sunrise trek, Pink Beach & island hopping',
    },
    imageUrl: '/src/assets/images/dest_labuan_bajo_1795580044134.jpg',
    suggestedDays: 3,
    suggestedInterests: ['beach_nature', 'snorkeling_diving', 'photo_spots'],
  },
];

export function createSamplePlan(lang: Language): TripPlan {
  const isId = lang === 'id';

  const budgetItems = [
    {
      id: 'sample-b1',
      category: 'transport' as const,
      itemName: isId
        ? 'Tiket Kapal Cepat Banda Aceh – Sabang (PP)'
        : 'Express Ferry Banda Aceh – Sabang (Round Trip)',
      unitCostIdr: 200000,
      quantity: 2,
      unitLabel: isId ? 'orang' : 'people',
      notes: isId ? 'Kelas Eksekutif via Pelabuhan Ulee Lheue' : 'Executive class via Ulee Lheue Port',
    },
    {
      id: 'sample-b2',
      category: 'transport' as const,
      itemName: isId ? 'Sewa Motor & BBM Keliling Pulau' : 'Scooter Rental & Fuel',
      unitCostIdr: 120000,
      quantity: 3,
      unitLabel: isId ? 'hari' : 'days',
      notes: isId ? '1 unit motor matic + bensin' : '1 scooter + fuel for island loop',
    },
    {
      id: 'sample-b3',
      category: 'accommodation' as const,
      itemName: isId ? 'Resort / Bungalow Tepi Pantai Iboih' : 'Iboih Beachfront Bungalow',
      unitCostIdr: 650000,
      quantity: 2,
      unitLabel: isId ? 'malam' : 'nights',
      notes: isId ? '1 kamar pemandangan laut, termasuk sarapan' : '1 sea-view room with breakfast',
    },
    {
      id: 'sample-b4',
      category: 'food' as const,
      itemName: isId ? 'Kuliner Lokal & Sate Gurita Sabang' : 'Local Dining & Sabang Octopus Satay',
      unitCostIdr: 175000,
      quantity: 6,
      unitLabel: isId ? 'sesi makan' : 'meals',
      notes: isId ? 'Makan siang & malam untuk 2 orang' : 'Lunch & dinner for 2 travelers',
    },
    {
      id: 'sample-b5',
      category: 'activities' as const,
      itemName: isId ? 'Paket Snorkeling Pulau Rubiah + Perahu' : 'Rubiah Island Snorkeling Boat & Gear',
      unitCostIdr: 250000,
      quantity: 2,
      unitLabel: isId ? 'orang' : 'people',
      notes: isId ? 'Termasuk alat snorkeling, pelampung & pemandu' : 'Includes mask, fins, boat & guide',
    },
    {
      id: 'sample-b6',
      category: 'misc' as const,
      itemName: isId ? 'Oleh-oleh, Retribusi & Dana Darurat' : 'Souvenirs, Park Fees & Contingency',
      unitCostIdr: 350000,
      quantity: 1,
      unitLabel: isId ? 'paket' : 'trip',
      notes: isId ? 'Kopi Aceh, kue bakpia Sabang & tiket wisata' : 'Aceh coffee, local snacks & entry tickets',
    },
  ];

  return {
    id: `sample-sabang-${lang}`,
    destination: 'Pulau Sabang',
    days: 3,
    travelers: 2,
    style: 'standard',
    interests: ['beach_nature', 'snorkeling_diving', 'culinary'],
    language: lang,
    isSample: true,
    createdAt: new Date().toISOString(),
    summary: isId
      ? 'Perjalanan santai 3 hari menjelajahi perairan jernih Iboih dan Pulau Rubiah, menikmati senja di Tugu Nol Kilometer, serta mencicipi kuliner laut khas Sabang.'
      : 'A balanced 3-day island escape exploring the crystal-clear reefs of Iboih and Rubiah Island, catching sunset at Indonesia’s Zero Kilometer Monument, and savoring Sabang seafood.',
    localTips: isId
      ? [
          'Datang ke Pelabuhan Ulee Lheue minimal 45 menit sebelum jadwal kapal cepat karena kursi kelas eksekutif cepat terisi di akhir pekan.',
          'Siapkan uang tunai pecahan kecil; sebagian warung pantai di Iboih dan penyewa perahu snorkeling masih mengutamakan pembayaran tunai.',
          'Kenakan pakaian sopan saat berkeliling area kota Sabang dan selalu perhatikan jadwal waktu operasional warung saat Jumat siang.',
        ]
      : [
          'Arrive at Ulee Lheue Port at least 45 minutes before the express ferry departure, as executive seats sell out quickly on weekends.',
          'Carry sufficient Indonesian Rupiah cash in small bills; beachside stalls in Iboih and local boat operators rarely accept cards.',
          'Dress modestly when visiting Sabang town areas and plan around midday Friday prayer hours when many shops pause briefly.',
        ],
    itinerary: [
      {
        day: 1,
        title: isId ? 'Penyeberangan ke Sabang & Senja Nol Kilometer' : 'Ferry Crossing & Zero Kilometer Sunset',
        theme: isId ? 'Kedatangan & Eksplorasi Pesisir' : 'Arrival & Coastal Discovery',
        activities: [
          {
            id: 's-d1-1',
            time: '08:00',
            title: isId ? 'Kapal Cepat dari Ulee Lheue ke Balohan' : 'Express Ferry from Ulee Lheue to Balohan',
            location: isId ? 'Pelabuhan Balohan, Sabang' : 'Balohan Port, Sabang',
            description: isId
              ? 'Penyeberangan sekitar 45 menit melintasi Selat Malaka dilanjutkan pengambilan motor sewaan dan perjalanan menuju Pantai Iboih.'
              : '45-minute crossing across the Malacca Strait followed by scooter pickup and scenic coastal ride to Iboih Beach.',
            category: 'transport',
            estimatedCostIdr: 400000,
          },
          {
            id: 's-d1-2',
            time: '12:30',
            title: isId ? 'Makan Siang Ikan Bakar & Check-in Bungalow' : 'Grilled Seafood Lunch & Bungalow Check-in',
            location: isId ? 'Kawasan Pantai Iboih' : 'Iboih Beach Area',
            description: isId
              ? 'Menikmati ikan bakar segar hasil tangkapan nelayan setempat lalu beristirahat sejenak di bungalow tepi laut.'
              : 'Savor freshly caught grilled reef fish by the water before checking into your beachfront bungalow.',
            category: 'food',
            estimatedCostIdr: 180000,
          },
          {
            id: 's-d1-3',
            time: '16:30',
            title: isId ? 'Menikmati Sunset di Tugu Nol Kilometer' : 'Sunset at Zero Kilometer Monument',
            location: isId ? 'Tugu Nol Kilometer Indonesia' : 'Indonesia Zero Kilometer Monument',
            description: isId
              ? 'Menyaksikan matahari terbenam di ujung paling barat Indonesia sambil menikmati rujak khas dan pemandangan tebing Samudra Hindia.'
              : 'Watch the sun dip into the Indian Ocean from the westernmost point of Indonesia with coastal cliff views.',
            category: 'activities',
            estimatedCostIdr: 60000,
          },
        ],
      },
      {
        day: 2,
        title: isId ? 'Snorkeling Pulau Rubiah & Kuliner Malam' : 'Rubiah Island Snorkeling & Night Culinary',
        theme: isId ? 'Petualangan Bawah Laut' : 'Underwater Adventure',
        activities: [
          {
            id: 's-d2-1',
            time: '09:00',
            title: isId ? 'Snorkeling Taman Laut Pulau Rubiah' : 'Snorkeling at Rubiah Marine Park',
            location: isId ? 'Pulau Rubiah, Sabang' : 'Rubiah Island, Sabang',
            description: isId
              ? 'Menyeberang 10 menit dengan perahu kaca untuk melihat terumbu karang warna-warni dan ribuan ikan tropis di perairan dangkal.'
              : 'Take a 10-minute boat hop to explore vibrant coral gardens and schools of tropical reef fish in calm clear water.',
            category: 'activities',
            estimatedCostIdr: 500000,
          },
          {
            id: 's-d2-2',
            time: '14:30',
            title: isId ? 'Santai di Pantai Sumur Tiga & Benteng Anoi Itam' : 'Sumur Tiga Beach & Anoi Itam Fort',
            location: isId ? 'Pesisir Timur Pulau Weh' : 'East Coast of Weh Island',
            description: isId
              ? 'Mengunjungi pantai berpasir putih lembut serta spot foto bersejarah bekas benteng Jepang menghadap laut lepas.'
              : 'Relax along powdery white sands and stop by the hilltop Japanese WWII bunker overlooking the open sea.',
            category: 'activities',
            estimatedCostIdr: 50000,
          },
          {
            id: 's-d2-3',
            time: '19:00',
            title: isId ? 'Kuliner Sate Gurita & Kopi Sanger' : 'Octopus Satay & Aceh Sanger Coffee',
            location: isId ? 'Sabang Fair & Pusat Kota' : 'Sabang Fair & Town Center',
            description: isId
              ? 'Mencicipi sate gurita khas Sabang dengan bumbu kacang atau kuah padang ditemani segelas kopi sanger hangat.'
              : 'Try Sabang’s signature grilled octopus satay paired with authentic Aceh sanger milk coffee by the promenade.',
            category: 'food',
            estimatedCostIdr: 170000,
          },
        ],
      },
      {
        day: 3,
        title: isId ? 'Pantai Gapang, Belanja Oleh-oleh & Kembali' : 'Gapang Beach, Souvenirs & Departure',
        theme: isId ? 'Relaksasi & Kepulangan' : 'Leisure & Return',
        activities: [
          {
            id: 's-d3-1',
            time: '08:30',
            title: isId ? 'Jalan Pagi & Kopi di Pantai Gapang' : 'Morning Stroll & Coffee at Gapang Beach',
            location: isId ? 'Pantai Gapang' : 'Gapang Beach',
            description: isId
              ? 'Menikmati ketenangan pagi di teluk berair tenang sebelum berkemas untuk perjalanan pulang.'
              : 'Enjoy quiet morning waves along the sheltered bay before packing up for departure.',
            category: 'food',
            estimatedCostIdr: 90000,
          },
          {
            id: 's-d3-2',
            time: '11:30',
            title: isId ? 'Belanja Kopi Gayo & Oleh-oleh Khas Sabang' : 'Shop for Gayo Coffee & Sabang Treats',
            location: isId ? 'Jalan Perdagangan, Kota Sabang' : 'Perdagangan Street, Sabang',
            description: isId
              ? 'Membeli biji kopi Aceh, bakpia Sabang, dan kerajinan lokal sebelum menuju Pelabuhan Balohan untuk kapal sore.'
              : 'Pick up roasted Aceh coffee beans and Sabang pastries before heading to Balohan Port for the afternoon ferry.',
            category: 'misc',
            estimatedCostIdr: 250000,
          },
        ],
      },
    ],
    budgetItems,
    initialBudgetItems: budgetItems.map((item) => ({ ...item })),
    checklist: [
      {
        id: 'sc-1',
        category: 'documents',
        label: isId ? 'KTP / Paspor asli untuk pembelian tiket kapal cepat' : 'National ID / Passport for express ferry boarding',
        essential: true,
        checked: true,
      },
      {
        id: 'sc-2',
        category: 'documents',
        label: isId ? 'SIM C aktif untuk penyewaan sepeda motor' : 'Valid motorcycle license for scooter rental',
        essential: true,
        checked: false,
      },
      {
        id: 'sc-3',
        category: 'booking',
        label: isId ? 'Konfirmasi jadwal kapal cepat Ulee Lheue – Balohan' : 'Confirm Ulee Lheue – Balohan ferry departure times',
        essential: true,
        checked: false,
      },
      {
        id: 'sc-4',
        category: 'booking',
        label: isId ? 'Simpan bukti reservasi penginapan Iboih secara offline' : 'Save Iboih bungalow reservation offline',
        essential: true,
        checked: false,
      },
      {
        id: 'sc-5',
        category: 'packing',
        label: isId ? 'Dry bag, baju renang & sunblock ramah terumbu karang' : 'Dry bag, swimwear & reef-safe sunscreen',
        essential: true,
        checked: false,
      },
      {
        id: 'sc-6',
        category: 'packing',
        label: isId ? 'Uang tunai pecahan kecil & power bank' : 'Small-denomination cash & power bank',
        essential: true,
        checked: false,
      },
      {
        id: 'sc-7',
        category: 'health',
        label: isId ? 'Obat anti mabuk laut & kotak P3K ringan' : 'Seasickness tablets & basic first-aid kit',
        essential: false,
        checked: false,
      },
      {
        id: 'sc-8',
        category: 'health',
        label: isId ? 'Losion anti nyamuk untuk sore hari di area pantai' : 'Mosquito repellent for coastal evenings',
        essential: false,
        checked: false,
      },
    ],
  };
}
