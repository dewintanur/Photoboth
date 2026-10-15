const oldThreePhotoSlots = [
  { x: 60, y: 191, width: 480, height: 421 },
  { x: 60, y: 635, width: 480, height: 421 },
  { x: 60, y: 1079, width: 480, height: 420 },
];

const frameConfigs = {
  /* =====================================================
     FRAME 1 - 10
  ===================================================== */

  1: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  2: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  3: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  4: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  5: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  6: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  7: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  8: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  9: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  10: {
    width: 600,
    height: 1800,
    slots: oldThreePhotoSlots,
  },

  /* =====================================================
     FRAME 11
  ===================================================== */

  11: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 419, y: 111, width: 242, height: 329 },
      { x: 419, y: 507, width: 242, height: 329 },
      { x: 419, y: 906, width: 242, height: 329 },
    ],
  },

  /* =====================================================
     FRAME 12
  ===================================================== */

  12: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 172, y: 115, width: 243, height: 325 },
      { x: 172, y: 513, width: 243, height: 324 },
      { x: 172, y: 912, width: 243, height: 324 },
      { x: 595, y: 0, width: 485, height: 1350 },
    ],
  },

  /* =====================================================
     FRAME 13
  ===================================================== */

  13: {
    width: 1080,
    height: 1350,
    slots: [{ x: 540, y: 379, width: 432, height: 592 }],
  },

  /* =====================================================
     FRAME 14 - BLOOMING
     4 FOTO
  ===================================================== */

  14: {
    width: 1080,
    height: 1350,
    type: "blooming",
  },

  /* =====================================================
     FRAME 15 - ENVELOPE
     8 FOTO
  ===================================================== */

  15: {
    width: 1080,
    height: 1350,
    type: "envelope",
  },

  /* =====================================================
     FRAME 16 - ENVELOPE
     8 FOTO
  ===================================================== */

  16: {
    width: 1080,
    height: 1350,
    type: "envelope",
  },

  /* =====================================================
     FRAME 17
  ===================================================== */

  17: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 419, y: 111, width: 242, height: 329 },
      { x: 419, y: 507, width: 242, height: 329 },
      { x: 419, y: 911, width: 242, height: 325 },
    ],
  },

  /* =====================================================
     FRAME 18
  ===================================================== */

  18: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 369, y: 82, width: 342, height: 457 },
      { x: 369, y: 787, width: 342, height: 456 },
    ],
  },

  /* =====================================================
     FRAME 19
  ===================================================== */

  19: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 108, y: 159, width: 551, height: 325 },
      { x: 719, y: 159, width: 243, height: 325 },
      { x: 120, y: 835, width: 243, height: 324 },
      { x: 420, y: 835, width: 552, height: 324 },
    ],
  },

  /* =====================================================
     FRAME 20
  ===================================================== */

  20: {
    width: 1080,
    height: 1350,
    slots: [
      { x: 444, y: 130, width: 191, height: 259 },
      { x: 444, y: 407, width: 191, height: 259 },
      { x: 444, y: 684, width: 191, height: 259 },
      { x: 444, y: 961, width: 191, height: 259 },
    ],
  },
  
  // FRAME 21 - RIBBON STAMPS
  21: {
  width: 1080,
  height: 1350,
  type: "ribbonStamps",
},

 
  // =====================================
  // FRAME 22 - BROWN DOTS
  // =====================================
  22: {
    width: 1080,
    height: 1350,
    slots: [
      // Foto kecil bagian atas
      {
        x: 408,
        y: 105,
        width: 255,
        height: 340,
      },

      // Foto besar bagian bawah
      {
        x: 0,
        y: 650,
        width: 1080,
        height: 700,
      },
    ],
  },

  // =====================================
  // FRAME 23 - OLIVE DOTS
  // =====================================
  23: {
    width: 1080,
    height: 1350,
    slots: [
      // Foto kecil bagian atas
      {
        x: 410,
        y: 105,
        width: 255,
        height: 340,
      },

      // Foto besar bagian bawah
      {
        x: 0,
        y: 650,
        width: 1080,
        height: 700,
      },
    ],
  },


 
  // FRAME 24 - BLUE MEMORIES
  24: {
    width: 1080,
    height: 1350,
    slots: Array.from({ length: 4 }, (_, i) => ({
      x: 515,
      y: 125 + i * 280,
      width: 185,
      height: 265,
    })),
  },


  
  // =====================================
  // FRAME 25 - PINK GRID
  // 8 FOTO (2 KOLOM x 4 BARIS)
  // =====================================
  25: {
    width: 1080,
    height: 1350,
    slots: Array.from({ length: 8 }, (_, i) => ({
      x: 361 + (i % 2) * 187,
      y: 128 + Math.floor(i / 2) * 246,
      width: 171,
      height: 230,
    })),
  },

 


  // =====================================
  // FRAME 26 - LOVE STORY
  // 4 FOTO VERTIKAL
  // =====================================
  26: {
    width: 1080,
    height: 1350,
    slots: [
      // Foto 1 - paling atas
      {
        x: 311,
        y: 219,
        width: 168,
        height: 227,
      },

      // Foto 2
      {
        x: 311,
        y: 462,
        width: 168,
        height: 227,
      },

      // Foto 3
      {
        x: 311,
        y: 704,
        width: 168,
        height: 227,
      },

      // Foto 4 - paling bawah
      {
        x: 311,
        y: 947,
        width: 168,
        height: 227,
      },
    ],
  },

// =====================================
// FRAME 27 - PHOTO TRAY
// 4 FOTO DALAM SATU STRIP MIRING
// =====================================
27: {
  width: 1080,
  height: 1350,
  type: "photoTray",
},

  

/* =====================================
   FRAME 28 - SCRAPBOOK
===================================== */
28: {
  width: 1080,
  height: 1350,
  type: "scrapbook",

  slots: [
    // FOTO 1 - BESAR KIRI
    // Lebih panjang ke bawah sedikit
    // dan sisi kanan masuk ke belakang strip
    {
      x: 199,
      y: 398,
      width: 475,
      height: 468,
      rotation: -3,
    },

    // FOTO 2 - KECIL ATAS
    {
      x: 675,
      y: 326,
      width: 191,
      height: 223,
      rotation: 3,
    },

    // FOTO 3 - KECIL TENGAH
    {
      x: 660,
      y: 566,
      width: 191,
      height: 223,
      rotation: 3,
    },

    // FOTO 4 - KECIL BAWAH
    {
      x: 645,
      y: 802,
      width: 191,
      height: 223,
      rotation: 3,
    },
  ],
},


/* =====================================
   FRAME 29 - CAFE MEMORIES
   4 FOTO VERTIKAL
===================================== */

/* =====================================
   FRAME 29 - CAFE MEMORIES
===================================== */
29: {
  width: 1080,
  height: 1350,
  type: "cafeMemories",

  slots: [
    {
      x: 445,
      y: 130,
      width: 192,
      height: 259,
    },
    {
      x: 445,
      y: 408,
      width: 192,
      height: 258,
    },
    {
      x: 445,
      y: 685,
      width: 192,
      height: 258,
    },
    {
      x: 445,
      y: 961,
      width: 192,
      height: 259,
    },
  ],
},



/* =====================================
   FRAME 30 - PHOTO DIARY
   12 FOTO (3 BARIS × 4 KOLOM)
   UKURAN FOTO TIDAK SERAGAM
===================================== */
30: {
  width: 1080,
  height: 1350,

  slots: [
    // =========================
    // BARIS 1 - FOTO 1, 2, 3, 4
    // =========================

    // Foto 1 - terpotong sisi kiri frame
    {
      x: -95,
      y: 116,
      width: 457,
      height: 270,
    },

    // Foto 2 - lebih sempit
    {
      x: 372,
      y: 116,
      width: 269,
      height: 270,
    },

    // Foto 3 - sedikit lebih lebar
    {
      x: 651,
      y: 116,
      width: 285,
      height: 270,
    },

    // Foto 4 - terpotong sisi kanan frame
    {
      x: 946,
      y: 116,
      width: 320,
      height: 270,
    },

    // =========================
    // BARIS 2 - FOTO 5, 6, 7, 8
    // =========================

    // Foto 5 - terpotong sisi kiri
    {
      x: -220,
      y: 540,
      width: 336,
      height: 270,
    },

    // Foto 6 - paling lebar
    {
      x: 126,
      y: 540,
      width: 377,
      height: 270,
    },

    // Foto 7
    {
      x: 513,
      y: 540,
      width: 270,
      height: 270,
    },

    // Foto 8
    {
      x: 793,
      y: 540,
      width: 285,
      height: 270,
    },

    // =========================
    // BARIS 3 - FOTO 9, 10, 11, 12
    // =========================

    // Foto 9
    {
      x: 0,
      y: 965,
      width: 309,
      height: 270,
    },

    // Foto 10
    {
      x: 319,
      y: 965,
      width: 269,
      height: 270,
    },

    // Foto 11
    {
      x: 598,
      y: 965,
      width: 285,
      height: 270,
    },

    // Foto 12 - terpotong sisi kanan
    {
      x: 893,
      y: 965,
      width: 300,
      height: 270,
    },
  ],
},


// FRAME 31 - DENIM STARS
31: {
  width: 1080,
  height: 1350,
  slots: [
    {
      x: 325,       // sebelumnya 335, geser sisi kiri 10 px
      y: 395,       // sebelumnya 410, naik 15 px
      width: 430,   // sebelumnya 420, lebih lebar ke kiri
      height: 565,  // sebelumnya 550, lebih panjang ke atas
    },
  ],
},

};

export default frameConfigs;
