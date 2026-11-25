import type {
  BudgetCategory,
  ChecklistCategory,
  InterestKey,
  Language,
  TravelStyle,
} from '../types/trip';

export interface Translations {
  appName: string;
  savedPlansBtn: string;
  heroTitle: string;
  heroSubtitle: string;
  form: {
    destinationLabel: string;
    destinationPlaceholder: string;
    quickFillLabel: string;
    durationLabel: string;
    daysUnit: string;
    travelersLabel: string;
    travelersUnit: string;
    styleLabel: string;
    interestsLabel: string;
    interestsOptional: string;
    generateBtn: string;
    generatingBtn: string;
  };
  styles: Record<TravelStyle, { label: string; desc: string }>;
  interests: Record<InterestKey, string>;
  emptyState: {
    heading: string;
    subheading: string;
    quickSelectHint: string;
    previewSampleBtn: string;
    useDestination: string;
  };
  loading: {
    title: string;
    subtitle: string;
  };
  error: {
    title: string;
    retryBtn: string;
    fallbackMsg: string;
  };
  summary: {
    totalEstimate: string;
    perPerson: string;
    perDay: string;
    localTipsTitle: string;
    daysLabel: string;
    travelersLabel: string;
    sampleNotice: string;
    exchangeRateNote: string;
  };
  toolbar: {
    savePlan: string;
    saved: string;
    copyWhatsApp: string;
    copied: string;
    downloadCsv: string;
    printPdf: string;
  };
  tabs: {
    itinerary: string;
    budget: string;
    checklist: string;
  };
  itinerary: {
    allDays: string;
    dayPrefix: string;
    estimatedCost: string;
    freeEntry: string;
    activitiesCount: string;
  };
  budget: {
    title: string;
    subtitle: string;
    resetBtn: string;
    categoryBreakdown: string;
    colItem: string;
    colCategory: string;
    colQty: string;
    colUnitCost: string;
    colSubtotal: string;
    addItemHeading: string;
    itemNamePlaceholder: string;
    unitLabelPlaceholder: string;
    addBtn: string;
    deleteItemAria: string;
    totalRow: string;
    categories: Record<BudgetCategory, string>;
  };
  checklist: {
    title: string;
    subtitle: string;
    completedOf: string;
    essentialTag: string;
    addPlaceholder: string;
    addBtn: string;
    deleteAria: string;
    categories: Record<ChecklistCategory, string>;
  };
  drawer: {
    title: string;
    subtitle: string;
    closeAria: string;
    emptyTitle: string;
    emptySubtitle: string;
    loadBtn: string;
    deleteBtn: string;
    savedOn: string;
  };
  footer: {
    disclaimer: string;
    ctaLabel: string;
  };
  chat: {
    openButtonAria: string;
    openButtonLabel: string;
    title: string;
    subtitleDefault: string;
    contextPrefix: string;
    settingsAria: string;
    resetAria: string;
    closeAria: string;
    welcomeMessage: string;
    inputPlaceholder: string;
    sendAria: string;
    sending: string;
    settingsHeading: string;
    serverConfiguredNote: string;
    webhookUrlLabel: string;
    webhookUrlPlaceholder: string;
    webhookHint: string;
    saveWebhookBtn: string;
    clearWebhookBtn: string;
    savedWebhookMsg: string;
    invalidUrlMsg: string;
    setupRequiredBanner: string;
    openSettingsBtn: string;
    payloadNote: string;
    quickPromptsDefault: string[];
    quickPromptsWithTrip: string[];
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    appName: 'SmartTrip Planner',
    savedPlansBtn: 'Rencana Tersimpan',
    heroTitle: 'Rencanakan Perjalanan & Hitung Anggaran Lebih Cerdas',
    heroSubtitle:
      'Susun itinerary harian yang terstruktur, hitung rincian biaya secara real-time, dan siapkan checklist keberangkatan dalam hitungan detik.',
    form: {
      destinationLabel: 'Destinasi Wisata',
      destinationPlaceholder: 'Contoh: Pulau Sabang, Bali, Yogyakarta',
      quickFillLabel: 'Destinasi populer:',
      durationLabel: 'Durasi Liburan',
      daysUnit: 'Hari',
      travelersLabel: 'Jumlah Peserta',
      travelersUnit: 'Orang',
      styleLabel: 'Gaya Liburan',
      interestsLabel: 'Minat Khusus',
      interestsOptional: 'Pilih satu atau lebih',
      generateBtn: 'Buat Rencana Perjalanan',
      generatingBtn: 'Menyusun Rencana...',
    },
    styles: {
      backpacker: { label: 'Backpacker / Hemat', desc: 'Penginapan ekonomis & kuliner lokal' },
      standard: { label: 'Standar / Nyaman', desc: 'Hotel nyaman & transportasi praktis' },
      luxury: { label: 'Mewah / Eksklusif', desc: 'Resor pilihan & layanan privat' },
    },
    interests: {
      culinary: 'Kuliner',
      beach_nature: 'Pantai & Alam',
      history_culture: 'Sejarah & Budaya',
      shopping: 'Belanja',
      photo_spots: 'Spot Foto',
      snorkeling_diving: 'Snorkeling/Diving',
    },
    emptyState: {
      heading: 'Mulai dari Destinasi Pilihan Nusantara',
      subheading:
        'Pilih salah satu destinasi unggulan di bawah untuk mengisi formulir otomatis, atau ketik kota maupun negara tujuan Anda di atas.',
      quickSelectHint: 'Klik kartu untuk memilih destinasi',
      previewSampleBtn: 'Lihat Contoh Rencana (Pulau Sabang)',
      useDestination: 'Pilih Destinasi',
    },
    loading: {
      title: 'Menyusun Itinerary & Rincian Anggaran...',
      subtitle: 'AI sedang merangkai jadwal harian, estimasi biaya lokal, dan checklist persiapan Anda.',
    },
    error: {
      title: 'Gagal Menyusun Rencana',
      retryBtn: 'Coba Lagi',
      fallbackMsg: 'Terjadi kendala saat menghubungi server. Silakan coba kembali.',
    },
    summary: {
      totalEstimate: 'Total Estimasi Biaya',
      perPerson: 'Biaya per Orang',
      perDay: 'Rata-rata per Hari',
      localTipsTitle: '3 Tips Lokal Penting',
      daysLabel: 'Hari',
      travelersLabel: 'Peserta',
      sampleNotice: 'Contoh rencana interaktif — klik Buat Rencana Perjalanan untuk menyusun versi AI kustom.',
      exchangeRateNote: 'Kurs 1 USD = Rp 16.000',
    },
    toolbar: {
      savePlan: 'Simpan Rencana',
      saved: 'Tersimpan',
      copyWhatsApp: 'Salin ke WhatsApp',
      copied: 'Tersalin!',
      downloadCsv: 'Download CSV',
      printPdf: 'Cetak / Simpan PDF',
    },
    tabs: {
      itinerary: 'Itinerary Harian',
      budget: 'Rincian Anggaran',
      checklist: 'Checklist Persiapan',
    },
    itinerary: {
      allDays: 'Semua Hari',
      dayPrefix: 'Hari',
      estimatedCost: 'Estimasi biaya',
      freeEntry: 'Gratis / fleksibel',
      activitiesCount: 'aktivitas',
    },
    budget: {
      title: 'Kalkulator Anggaran Real-Time',
      subtitle: 'Ubah jumlah atau harga satuan untuk menyesuaikan total anggaran perjalanan secara langsung.',
      resetBtn: 'Kembalikan Estimasi Awal',
      categoryBreakdown: 'Proporsi Kategori Biaya',
      colItem: 'Komponen Biaya',
      colCategory: 'Kategori',
      colQty: 'Jumlah',
      colUnitCost: 'Biaya Satuan',
      colSubtotal: 'Subtotal',
      addItemHeading: 'Tambah Item Biaya Baru',
      itemNamePlaceholder: 'Contoh: Sewa kamera underwater',
      unitLabelPlaceholder: 'Satuan (hari/orang)',
      addBtn: 'Tambah Item',
      deleteItemAria: 'Hapus item biaya',
      totalRow: 'Total Anggaran Keseluruhan',
      categories: {
        transport: 'Transportasi',
        accommodation: 'Akomodasi',
        food: 'Kuliner & Makan',
        activities: 'Aktivitas & Tiket',
        misc: 'Lainnya & Darurat',
      },
    },
    checklist: {
      title: 'Checklist Persiapan Keberangkatan',
      subtitle: 'Tandai item yang sudah siap agar tidak ada barang atau dokumen penting yang tertinggal.',
      completedOf: 'selesai',
      essentialTag: 'Wajib',
      addPlaceholder: 'Tambah item persiapan baru...',
      addBtn: 'Tambah',
      deleteAria: 'Hapus item checklist',
      categories: {
        documents: 'Dokumen & Identitas',
        booking: 'Pemesanan & Tiket',
        packing: 'Perlengkapan & Pakaian',
        health: 'Kesehatan & Keamanan',
      },
    },
    drawer: {
      title: 'Rencana Tersimpan',
      subtitle: 'Riwayat rencana perjalanan yang tersimpan di perangkat ini.',
      closeAria: 'Tutup panel rencana tersimpan',
      emptyTitle: 'Belum ada rencana tersimpan',
      emptySubtitle: 'Susun perjalanan lalu klik "Simpan Rencana" untuk menyimpannya di sini.',
      loadBtn: 'Buka',
      deleteBtn: 'Hapus',
      savedOn: 'Disimpan',
    },
    footer: {
      disclaimer: 'Estimasi biaya dihasilkan oleh AI dan dapat berubah sewaktu-waktu.',
      ctaLabel: 'Dapatkan Panduan Lengkap / Konsultasi Trip',
    },
    chat: {
      openButtonAria: 'Buka Asisten Chat n8n',
      openButtonLabel: 'Tanya Trip',
      title: 'Asisten SmartTrip',
      subtitleDefault: 'Terhubung dengan Webhook n8n',
      contextPrefix: 'Konteks aktif',
      settingsAria: 'Pengaturan Webhook n8n',
      resetAria: 'Mulai ulang percakapan',
      closeAria: 'Tutup chatbox',
      welcomeMessage:
        'Halo! Saya terhubung dengan workflow n8n Anda. Tanyakan rekomendasi destinasi, tips hemat anggaran, atau konsultasi itinerary yang sedang Anda susun.',
      inputPlaceholder: 'Tulis pertanyaan perjalanan Anda...',
      sendAria: 'Kirim pesan',
      sending: 'Menghubungi n8n...',
      settingsHeading: 'Konfigurasi Webhook n8n',
      serverConfiguredNote:
        'Webhook n8n sudah terhubung melalui konfigurasi server (N8N_WEBHOOK_URL).',
      webhookUrlLabel: 'URL Webhook n8n (HTTPS)',
      webhookUrlPlaceholder: 'https://instance-anda.app.n8n.cloud/webhook/smarttrip',
      webhookHint:
        'Gunakan URL Production atau Test Webhook (HTTPS) dari node Webhook / Chat Trigger di n8n.',
      saveWebhookBtn: 'Simpan URL',
      clearWebhookBtn: 'Hapus',
      savedWebhookMsg: 'URL Webhook tersimpan.',
      invalidUrlMsg: 'Masukkan URL HTTPS yang valid (contoh: https://...)',
      setupRequiredBanner: 'URL Webhook n8n belum diatur. Atur URL untuk mulai mengirim pesan.',
      openSettingsBtn: 'Atur Webhook',
      payloadNote: 'Payload POST: chatInput, message, sessionId, language, currency, tripContext',
      quickPromptsDefault: [
        'Rekomendasi destinasi 3 hari di Indonesia',
        'Tips hemat anggaran liburan keluarga',
        'Rekomendasi kuliner wajib coba di Yogyakarta',
      ],
      quickPromptsWithTrip: [
        'Rekomendasi kuliner lokal terbaik di {destination}',
        'Cara menghemat biaya transportasi di {destination}',
        'Ada saran tambahan untuk itinerary {destination} ini?',
      ],
    },
  },
  en: {
    appName: 'SmartTrip Planner',
    savedPlansBtn: 'Saved Plans',
    heroTitle: 'Plan Smarter Trips & Calculate Budgets in Real Time',
    heroSubtitle:
      'Build structured day-by-day itineraries, adjust trip expenses live, and check off departure essentials in seconds.',
    form: {
      destinationLabel: 'Travel Destination',
      destinationPlaceholder: 'e.g., Pulau Sabang, Bali, Yogyakarta',
      quickFillLabel: 'Popular destinations:',
      durationLabel: 'Trip Duration',
      daysUnit: 'Days',
      travelersLabel: 'Travelers',
      travelersUnit: 'People',
      styleLabel: 'Travel Style',
      interestsLabel: 'Special Interests',
      interestsOptional: 'Select one or more',
      generateBtn: 'Generate Trip Plan',
      generatingBtn: 'Building Plan...',
    },
    styles: {
      backpacker: { label: 'Backpacker / Budget', desc: 'Economical stays & street food' },
      standard: { label: 'Standard / Comfort', desc: 'Comfortable hotels & easy transit' },
      luxury: { label: 'Luxury / Exclusive', desc: 'Boutique resorts & private service' },
    },
    interests: {
      culinary: 'Culinary',
      beach_nature: 'Beach & Nature',
      history_culture: 'History & Culture',
      shopping: 'Shopping',
      photo_spots: 'Photo Spots',
      snorkeling_diving: 'Snorkeling/Diving',
    },
    emptyState: {
      heading: 'Start with Iconic Destinations',
      subheading:
        'Pick a featured destination below to pre-fill the planner, or enter any city or island you want to explore above.',
      quickSelectHint: 'Click a card to select destination',
      previewSampleBtn: 'Preview Sample Plan (Pulau Sabang)',
      useDestination: 'Select Destination',
    },
    loading: {
      title: 'Crafting Your Itinerary & Budget...',
      subtitle: 'AI is assembling your daily schedule, local cost estimates, and departure checklist.',
    },
    error: {
      title: 'Unable to Generate Plan',
      retryBtn: 'Try Again',
      fallbackMsg: 'Something went wrong while contacting the server. Please try again.',
    },
    summary: {
      totalEstimate: 'Total Estimated Cost',
      perPerson: 'Cost per Person',
      perDay: 'Average per Day',
      localTipsTitle: '3 Essential Local Tips',
      daysLabel: 'Days',
      travelersLabel: 'Travelers',
      sampleNotice: 'Interactive sample plan — click Generate Trip Plan to build a custom AI itinerary.',
      exchangeRateNote: 'Rate 1 USD = Rp 16,000',
    },
    toolbar: {
      savePlan: 'Save Plan',
      saved: 'Saved',
      copyWhatsApp: 'Copy for WhatsApp',
      copied: 'Copied!',
      downloadCsv: 'Download CSV',
      printPdf: 'Print / Save PDF',
    },
    tabs: {
      itinerary: 'Daily Itinerary',
      budget: 'Budget Breakdown',
      checklist: 'Preparation Checklist',
    },
    itinerary: {
      allDays: 'All Days',
      dayPrefix: 'Day',
      estimatedCost: 'Est. cost',
      freeEntry: 'Free / flexible',
      activitiesCount: 'activities',
    },
    budget: {
      title: 'Real-Time Budget Calculator',
      subtitle: 'Edit quantities or unit costs below to recalculate your total and per-person budget instantly.',
      resetBtn: 'Reset to Initial Estimate',
      categoryBreakdown: 'Cost Category Distribution',
      colItem: 'Expense Item',
      colCategory: 'Category',
      colQty: 'Qty',
      colUnitCost: 'Unit Cost',
      colSubtotal: 'Subtotal',
      addItemHeading: 'Add Custom Expense',
      itemNamePlaceholder: 'e.g., Underwater camera rental',
      unitLabelPlaceholder: 'Unit (day/person)',
      addBtn: 'Add Item',
      deleteItemAria: 'Delete expense item',
      totalRow: 'Total Estimated Budget',
      categories: {
        transport: 'Transportation',
        accommodation: 'Accommodation',
        food: 'Food & Dining',
        activities: 'Activities & Tickets',
        misc: 'Misc & Contingency',
      },
    },
    checklist: {
      title: 'Departure Preparation Checklist',
      subtitle: 'Track essential bookings, documents, and gear before your trip begins.',
      completedOf: 'completed',
      essentialTag: 'Essential',
      addPlaceholder: 'Add a custom preparation item...',
      addBtn: 'Add',
      deleteAria: 'Delete checklist item',
      categories: {
        documents: 'Documents & ID',
        booking: 'Bookings & Tickets',
        packing: 'Packing & Gear',
        health: 'Health & Safety',
      },
    },
    drawer: {
      title: 'Saved Plans',
      subtitle: 'Your saved travel itineraries stored on this device.',
      closeAria: 'Close saved plans drawer',
      emptyTitle: 'No saved plans yet',
      emptySubtitle: 'Generate a trip plan and click "Save Plan" to keep it here for quick access.',
      loadBtn: 'Open',
      deleteBtn: 'Delete',
      savedOn: 'Saved',
    },
    footer: {
      disclaimer: 'Cost estimates are generated by AI and may change at any time.',
      ctaLabel: 'Get Complete Guide / Trip Consultation',
    },
    chat: {
      openButtonAria: 'Open n8n Chat Assistant',
      openButtonLabel: 'Trip Chat',
      title: 'SmartTrip Assistant',
      subtitleDefault: 'Powered by n8n Webhook',
      contextPrefix: 'Active context',
      settingsAria: 'n8n Webhook Settings',
      resetAria: 'Reset conversation',
      closeAria: 'Close chatbox',
      welcomeMessage:
        'Hi! I connect directly to your n8n workflow. Ask for destination ideas, budget-saving tips, or tailored advice on your active trip plan.',
      inputPlaceholder: 'Ask anything about your trip...',
      sendAria: 'Send message',
      sending: 'Waiting for n8n...',
      settingsHeading: 'n8n Webhook Configuration',
      serverConfiguredNote:
        'Your n8n webhook is connected via server configuration (N8N_WEBHOOK_URL).',
      webhookUrlLabel: 'n8n Webhook URL (HTTPS)',
      webhookUrlPlaceholder: 'https://your-instance.app.n8n.cloud/webhook/smarttrip',
      webhookHint:
        'Paste your public HTTPS Production or Test Webhook URL from an n8n Webhook or Chat Trigger node.',
      saveWebhookBtn: 'Save URL',
      clearWebhookBtn: 'Clear',
      savedWebhookMsg: 'Webhook URL saved.',
      invalidUrlMsg: 'Enter a valid HTTPS URL (e.g. https://...)',
      setupRequiredBanner: 'n8n Webhook URL is not set yet. Configure it to start chatting.',
      openSettingsBtn: 'Set Webhook',
      payloadNote: 'POST payload: chatInput, message, sessionId, language, currency, tripContext',
      quickPromptsDefault: [
        'Recommend a 3-day island getaway in Indonesia',
        'Tips to reduce group travel accommodation costs',
        'Best street food spots to try in Yogyakarta',
      ],
      quickPromptsWithTrip: [
        'Best local food spots to visit in {destination}',
        'How can we optimize transport costs in {destination}?',
        'Any extra tips to improve this {destination} itinerary?',
      ],
    },
  },
};
