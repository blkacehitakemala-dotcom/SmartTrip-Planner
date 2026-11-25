import type { StoryFormInput, StoryboardProject } from '../types/storyboard';

export interface QuickIdeaPreset {
  label: string;
  input: Partial<StoryFormInput>;
}

export const QUICK_IDEA_PRESETS: QuickIdeaPreset[] = [
  {
    label: 'Iklan kopi lokal kekinian',
    input: {
      topic: 'Iklan kopi susu gula aren lokal kekinian untuk pekerja kantoran yang ngantuk jam 2 siang',
      goal: 'Promosi / Jualan',
      platform: '9:16',
      duration: 30,
      visualStyle: 'Sinematik Realistis',
      tones: ['Santai & Relatable', 'Persuasif'],
    },
  },
  {
    label: 'Animasi nyamuk tengah malam',
    input: {
      topic: 'Cerita pendek animasi tentang seekor nyamuk licik yang mengganggu tidur di tengah malam',
      goal: 'Storytelling / Hiburan',
      platform: '9:16',
      duration: 30,
      visualStyle: 'Animasi 3D (Gaya Pixar)',
      tones: ['Lucu / Witty', 'Emosional / Dramatis'],
    },
  },
  {
    label: 'Tips atur keuangan Gen-Z',
    input: {
      topic: '3 cara simpel mengatur gaji pertama tanpa merasa tersiksa untuk anak muda',
      goal: 'Edukasi',
      platform: '9:16',
      duration: 60,
      visualStyle: 'Minimalis Modern',
      tones: ['Santai & Relatable', 'Profesional'],
    },
  },
];

export function createSampleStoryboardProject(): StoryboardProject {
  return {
    id: 'sample-kopi-senja-30s',
    isSample: true,
    createdAt: new Date().toISOString(),
    input: {
      topic: 'Iklan kopi susu gula aren lokal kekinian untuk pekerja kantoran yang ngantuk jam 2 siang',
      goal: 'Promosi / Jualan',
      platform: '9:16',
      duration: 30,
      visualStyle: 'Sinematik Realistis',
      tones: ['Santai & Relatable', 'Persuasif'],
    },
    overview: {
      title: 'Kopi Senja: Penyelamat Fokus Jam 2 Siang',
      hook_opening:
        'Baru jam dua siang tapi mata sudah 5 watt sementara deadline masih ngantri?',
      target_audience:
        'Pekerja kantoran, freelancer, dan kreator usia 22–35 tahun yang butuh booster fokus harian dengan rasa creamy autentik.',
      music_mood_recommendation:
        'Lo-fi Hip-Hop Upbeat (100–110 BPM) dengan ketukan snare crisp dan transisi bass hangat.',
    },
    scenes: [
      {
        scene_number: 1,
        timecode: '00:00 - 00:05',
        shot_type: 'Close-Up',
        visual_description_id:
          'Seorang pekerja muda di depan laptop mulai menguap lebar, layar monitor memantul di kacamatanya, jam dinding digital di latar menunjukkan pukul 14:05 dengan pencahayaan kantor agak redup.',
        ai_visual_prompt_en:
          'Cinematic close-up of a tired young Indonesian office worker yawning in front of a glowing laptop screen at 2 PM, subtle cool fluorescent office lighting, shallow depth of field, 35mm lens, hyper-realistic commercial film aesthetic, vertical 9:16 aspect ratio --ar 9:16',
        voiceover_dialogue:
          'Baru jam dua siang, tapi mata udah lima watt padahal deadline masih ngantri?',
        audio_sfx: 'Suara ketikan keyboard melambat + efek jam berdetak pelan',
      },
      {
        scene_number: 2,
        timecode: '00:05 - 00:11',
        shot_type: 'Extreme Close-Up (Macro)',
        visual_description_id:
          'Transisi cepat ke gelas bening berisi es batu kristal. Espresso kental pekat dituang perlahan bertemu pusaran susu segar dan sirup gula aren karamel dalam gerakan slow-motion.',
        ai_visual_prompt_en:
          'Macro slow-motion shot of rich dark espresso pouring over crystal clear ice cubes and swirling into creamy milk and golden palm sugar syrup in a minimalist clear cup, warm golden rim lighting, condensation droplets, luxury beverage commercial, 8k photorealistic, vertical 9:16 aspect ratio --ar 9:16',
        voiceover_dialogue:
          'Jangan paksain fokus tanpa bahan bakar. Kenalin Kopi Senja Gula Aren!',
        audio_sfx: 'Suara es batu berdenting tajam + tuangan espresso + whoosh transisi',
      },
      {
        scene_number: 3,
        timecode: '00:11 - 00:18',
        shot_type: 'Medium Shot',
        visual_description_id:
          'Tangan mengambil gelas Kopi Senja yang berembun dingin, lalu sang pekerja menyeruputnya. Seketika pencahayaan ruangan berubah lebih hangat dan cerah, ekspresinya langsung segar.',
        ai_visual_prompt_en:
          'Medium shot of a young Indonesian creative sipping an iced palm sugar latte at a clean modern desk, warm sunlit window glow suddenly brightening the room, genuine refreshed smile, cinematic color grading, Sony FX3 50mm f/1.4, vertical 9:16 aspect ratio --ar 9:16',
        voiceover_dialogue:
          'Diracik dari seratus persen biji Arabika lokal pilihan dan gula aren organik—creamy, wangi, dan tetap ramah di lambung.',
        audio_sfx: 'Suara seruputan halus + beat lo-fi ceria mulai mengalun penuh',
      },
      {
        scene_number: 4,
        timecode: '00:18 - 00:24',
        shot_type: 'POV / Dynamic Tracking',
        visual_description_id:
          'Tampilan sudut pandang orang pertama mengetik cepat dengan penuh semangat, daftar tugas di layar satu per satu tercentang selesai, gelas Kopi Senja berdiri estetik di sebelah laptop.',
        ai_visual_prompt_en:
          'Dynamic first-person POV shot of hands typing energetically on a sleek laptop next to an aesthetic iced coffee cup with condensation on a wooden desk, warm afternoon sunbeams, crisp cinematic realism, shallow depth of field, vertical 9:16 aspect ratio --ar 9:16',
        voiceover_dialogue:
          'Sekali teguk, ide langsung ngalir dan kerjaan kelar sebelum jam pulang!',
        audio_sfx: 'Suara notifikasi centang sukses + ritme musik makin energetik',
      },
      {
        scene_number: 5,
        timecode: '00:24 - 00:30',
        shot_type: 'Hero Product Shot',
        visual_description_id:
          'Dua gelas Kopi Senja Gula Aren tertata rapi di atas meja kayu berlatar biji kopi sangrai dengan teks promo muncul bersih di bagian atas layar.',
        ai_visual_prompt_en:
          'Hero commercial product photography of two aesthetic iced palm sugar lattes on a warm oak tabletop surrounded by roasted Arabica coffee beans, dramatic soft studio lighting with clean negative space at top for text overlay, 8k photorealistic, vertical 9:16 aspect ratio --ar 9:16',
        voiceover_dialogue:
          'Lagi ada promo beli dua hemat tiga puluh persen hari ini. Klik keranjang kuning sekarang!',
        audio_sfx: 'Efek chime penutup yang renyah + musik fade out rapi',
      },
    ],
    social_copy: {
      aida_caption: {
        attention:
          'Jam 2 siang selalu jadi musuh terbesar produktivitas? Mata berat, tapi kerjaan masih menggunung!',
        interest:
          'Kopi Senja Gula Aren diracik khusus dari 100% biji Arabika lokal pilihan yang dipadukan dengan susu segar dan gula aren organik asli—aromanya bold tanpa bikin perih di lambung.',
        desire:
          'Bayangkan satu tegukan dingin creamy yang langsung mengembalikan fokusmu, bikin ide kembali lancar, dan semua tugas beres tepat waktu tanpa lembur.',
        action:
          'Nikmati promo Beli 2 Hemat 30% khusus pemesanan hari ini! Klik tautan di bio atau pesan langsung lewat aplikasi ojek online favoritmu sekarang.',
      },
      seo_keywords: [
        'kopi susu gula aren',
        'kopi lokal kekinian',
        'rekomendasi es kopi susu',
        'kopi ramah di lambung',
        'promo kopi harian',
      ],
      hashtags: [
        '#KopiLokal',
        '#KopiSusuGulaAren',
        '#EsKopiSusu',
        '#TemanKerja',
        '#KopiKekinian',
        '#ArabikaIndonesia',
        '#ProduktifSetiapHari',
        '#PromoKopi',
        '#PecintaKopi',
      ],
    },
  };
}
