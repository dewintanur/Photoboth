export function createCanvasHelpers(selectedFilter) {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);

      image.onerror = () => {
        reject(new Error(`Gagal load image: ${src}`));
      };

      image.src = src;
    });
  };
  /* =====================================================
   PHOTO FILTER
===================================================== */

  const applyPhotoFilter = (ctx) => {
    switch (selectedFilter) {
      case "bw":
        ctx.filter = "grayscale(100%)";
        break;

      case "sepia":
        ctx.filter = "sepia(85%) saturate(90%) contrast(95%)";
        break;

      case "vintage":
        ctx.filter = "sepia(35%) saturate(75%) contrast(92%) brightness(105%)";
        break;

      default:
        ctx.filter = "none";
        break;
    }
  };
  /* =====================================================
     DRAW COVER
  ===================================================== */

  const drawCover = (ctx, image, x, y, width, height) => {
    if (!image) return;

    const imageRatio = image.width / image.height;

    const slotRatio = width / height;

    let sourceX = 0;
    let sourceY = 0;

    let sourceWidth = image.width;
    let sourceHeight = image.height;

    if (imageRatio > slotRatio) {
      sourceHeight = image.height;

      sourceWidth = sourceHeight * slotRatio;

      sourceX = (image.width - sourceWidth) / 2;
    } else {
      sourceWidth = image.width;

      sourceHeight = sourceWidth / slotRatio;

      sourceY = (image.height - sourceHeight) / 2;
    }

    /* ===============================
     FILTER HANYA UNTUK FOTO
  =============================== */

    ctx.save();

    applyPhotoFilter(ctx);

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height,
    );

    ctx.restore();
  };

  /* =====================================================
     DRAW ROTATED PAPER

     INI KERTAS PUTIH PANJANG DI BELAKANG FOTO.
     DIPAKAI FRAME 15 & 16.
  ===================================================== */

  /* =====================================================
   CLEAN PHOTO STRIP
   1 strip = 1 kertas putih + 4 foto

   Dengan begini:
   - border kiri/kanan sama
   - border atas/bawah sama
   - gap antar foto sama
   - semua foto benar-benar satu garis
===================================================== */

  const drawCleanPhotoStrip = (ctx, stripPhotos, centerX, topY, rotation) => {
    const stripWidth = 202;

    const sidePadding = 11;
    const topPadding = 12;
    const bottomPadding = 14;

    const gap = 10;

    const photoWidth = stripWidth - sidePadding * 2;

    const photoHeight = 230;

    const stripHeight = topPadding + photoHeight * 4 + gap * 3 + bottomPadding;

    ctx.save();

    /* pindahkan titik canvas ke posisi strip */
    ctx.translate(centerX, topY);

    /* putar SELURUH strip sekaligus */
    ctx.rotate((rotation * Math.PI) / 180);

    /* ===============================
     KERTAS PUTIH
  =============================== */

    ctx.fillStyle = "#fffdf8";

    ctx.fillRect(-stripWidth / 2, 0, stripWidth, stripHeight);

    /* ===============================
     4 FOTO
  =============================== */

    stripPhotos.forEach((photo, index) => {
      if (!photo) return;

      const x = -stripWidth / 2 + sidePadding;

      const y = topPadding + index * (photoHeight + gap);

      drawCover(ctx, photo, x, y, photoWidth, photoHeight);
    });

    ctx.restore();
  };
  /* =====================================================
     FRAME 14 - BLOOMING

     DIPERTAHANKAN SESUAI FILE-MU.
  ===================================================== */

  const renderBlooming = (ctx, loadedPhotos) => {
    if (loadedPhotos.length < 4) {
      throw new Error("Frame 14 membutuhkan 4 foto.");
    }

    /* =========================================
       FOTO 1 - BACKGROUND ATAS
    ========================================= */

    drawCover(ctx, loadedPhotos[0], 0, 0, 1080, 675);

    /* =========================================
       FOTO 3 - BACKGROUND BAWAH
    ========================================= */

    drawCover(ctx, loadedPhotos[2], 0, 675, 1080, 675);

    /* =========================================
       FOTO 2 - KECIL ATAS
    ========================================= */

    const topX = 442;
    const topY = 207;

    const smallWidth = 195;
    const smallHeight = 262;

    ctx.fillStyle = "#f5dfdf";

    ctx.fillRect(topX - 18, topY - 18, smallWidth + 36, smallHeight + 36);

    drawCover(ctx, loadedPhotos[1], topX, topY, smallWidth, smallHeight);

    /* =========================================
       FOTO 4 - KECIL BAWAH
    ========================================= */

    const bottomX = 442;
    const bottomY = 881;

    ctx.fillStyle = "#f5dfdf";

    ctx.fillRect(bottomX - 18, bottomY - 18, smallWidth + 36, smallHeight + 36);

    drawCover(ctx, loadedPhotos[3], bottomX, bottomY, smallWidth, smallHeight);

    /* =========================================
       GARIS TENGAH
    ========================================= */

    ctx.strokeStyle = "rgba(255,255,255,0.75)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, 675);

    ctx.lineTo(1080, 675);

    ctx.stroke();

    /* =========================================
       POSTCARDS
    ========================================= */

    ctx.save();

    ctx.fillStyle = "#fff6d5";

    ctx.textAlign = "right";

    ctx.font = "italic 30px Georgia, serif";

    ctx.fillText("postcards", 990, 1180);

    ctx.restore();
  };
  /* =====================================================
   FRAME 15 & 16 - ENVELOPE

   TEMPLATE:
   gunakan template TANPA photostrip Canva.

   KODE akan membuat sendiri:
   - strip putih kiri
   - strip putih kanan
   - 4 foto per strip

   KIRI  = foto 1, 3, 5, 7
   KANAN = foto 2, 4, 6, 8
===================================================== */

  const renderEnvelope = (ctx, frame, loadedPhotos) => {
    if (loadedPhotos.length < 8) {
      throw new Error("Frame 15 dan 16 membutuhkan 8 foto.");
    }

    /* =========================================
     1. TEMPLATE DASAR
  ========================================= */

    ctx.drawImage(frame, 0, 0, 1080, 1350);

    /* =========================================
     2. PHOTO STRIP KIRI

     FOTO:
     1
     3
     5
     7

     Semua dibuat sebagai SATU strip.
  ========================================= */

    drawCleanPhotoStrip(
      ctx,

      [loadedPhotos[0], loadedPhotos[2], loadedPhotos[4], loadedPhotos[6]],

      405, // X
      105, // Y atas strip
      -7, // rotasi
    );

    /* =========================================
     3. PHOTO STRIP KANAN

     FOTO:
     2
     4
     6
     8
  ========================================= */

    drawCleanPhotoStrip(
      ctx,

      [loadedPhotos[1], loadedPhotos[3], loadedPhotos[5], loadedPhotos[7]],

      625, // X
      105, // Y atas strip
      6, // rotasi
    );

    /* =========================================
     4. DEPAN AMPLOP

     Digambar kembali supaya bagian bawah
     kedua strip terlihat masuk ke amplop.
  ========================================= */

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(245, 850);

    ctx.lineTo(540, 1035);

    ctx.lineTo(805, 850);

    ctx.lineTo(775, 1245);

    ctx.lineTo(245, 1200);

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(frame, 0, 0, 1080, 1350);

    ctx.restore();

    /* =========================================
     5. NOTE + WAX

     Tetap paling depan.
  ========================================= */

    ctx.save();

    ctx.beginPath();

    ctx.rect(650, 790, 430, 560);

    ctx.clip();

    ctx.drawImage(frame, 0, 0, 1080, 1350);

    ctx.restore();
  };


  /* =====================================================
     FRAME 21 - RIBBON STAMPS
     2 STRIP MIRING, MASING-MASING 3 FOTO
  ===================================================== */

  


const renderRibbonStamps = (ctx, loadedPhotos) => {
  if (loadedPhotos.length < 6) {
    throw new Error("Frame 21 membutuhkan 6 foto.");
  }

  // Koordinat mengikuti frame21-preview.png
  // Ukuran template: 1080 x 1350
  //
  // points:
  // [kiri atas, kanan atas, kanan bawah, kiri bawah]

  const rightSlots = [
    {
      photoIndex: 1,
      rotation: 8,
      points: [
        [563, 244],
        [741, 270],
        [712, 512],
        [555, 492],
      ],
    },
    {
      photoIndex: 3,
      rotation: 8,
      points: [
        [574, 541],
        [702, 558],
        [674, 797],
        [594, 790],
      ],
    },
    {
      photoIndex: 5,
      rotation: 8,
      points: [
        [597, 842],
        [661, 851],
        [633, 1077],
        [619, 1081],
      ],
    },
  ];

  const leftSlots = [
    {
      photoIndex: 0,
      rotation: -7,
      points: [
        [338, 279],
        [513, 258],
        [542, 504],
        [364, 525],
      ],
    },
    {
      photoIndex: 2,
      rotation: -7,
      points: [
        [370, 570],
        [544, 549],
        [575, 798],
        [397, 817],
      ],
    },
    {
      photoIndex: 4,
      rotation: -7,
      points: [
        [402, 861],
        [576, 841],
        [606, 1088],
        [429, 1107],
      ],
    },
  ];

  const drawStampPhoto = (slot) => {
    const photo = loadedPhotos[slot.photoIndex];
    if (!photo) return;

    const { points, rotation } = slot;

    ctx.save();

    // 1. Bentuk area foto sesuai bagian dalam
    //    bingkai perangko merah.
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.closePath();

    // Foto tidak boleh keluar dari area ini.
    ctx.clip();

    // 2. Hitung titik tengah area foto.
    const centerX =
      points.reduce((sum, point) => sum + point[0], 0) / 4;

    const centerY =
      points.reduce((sum, point) => sum + point[1], 0) / 4;

    // 3. Putar foto mengikuti kemiringan perangko.
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Foto dibuat sedikit lebih besar daripada area clip,
    // supaya tidak ada celah kosong di pinggir.
    drawCover(
      ctx,
      photo,
      -125,
      -155,
      250,
      310
    );

    ctx.restore();
  };

  // Strip kanan digambar terlebih dahulu.
  rightSlots.forEach(drawStampPhoto);

  // Strip kiri digambar terakhir.
  leftSlots.forEach(drawStampPhoto);
};

/* ==========================================
   FRAME 27 - PHOTO TRAY
   4 FOTO MENGIKUTI STRIP MIRING
========================================== */






/* ==========================================
   FRAME 27 - PHOTO TRAY
   4 FOTO MENGIKUTI STRIP MIRING
========================================== */


/* ==========================================
   FRAME 27 - PHOTO TRAY
   Penyesuaian posisi masing-masing foto
========================================== */

const renderPhotoTray = (ctx, frame, loadedPhotos) => {
  if (loadedPhotos.length < 4) {
    throw new Error("Frame 27 membutuhkan 4 foto.");
  }

  // Gambar template
  ctx.drawImage(frame, 0, 0, 1080, 1350);

  ctx.save();

  // Posisi dasar tetap
  ctx.translate(552, 708);

  // Rotasi mengikuti photostrip
  ctx.rotate((35 * Math.PI) / 180);

  const photoWidth = 275;
  const photoHeight = 205;
  const gap = 17;

  const totalHeight =
    photoHeight * 4 + gap * 3;

  // Penyesuaian tiap foto:
  // Foto 1 turun lebih banyak
  // Foto 2 dan 3 turun sedikit
  // Foto 4 hampir tetap, geser sedikit ke kiri
  const adjustments = [
    { x: 0, y: 24 },   // Foto 1
    { x: 0, y: 14 },   // Foto 2
    { x: 0, y: 7 },    // Foto 3
    { x: -5, y: 0 },   // Foto 4
  ];

  loadedPhotos.slice(0, 4).forEach((photo, index) => {
    const adjust = adjustments[index];

    const x =
      -photoWidth / 2 +
      adjust.x;

    const y =
      -totalHeight / 2 +
      index * (photoHeight + gap) +
      adjust.y;

    drawCover(
      ctx,
      photo,
      x,
      y,
      photoWidth,
      photoHeight
    );
  });

  ctx.restore();
};



/* ==========================================
   FRAME 28 - SCRAPBOOK
========================================== */



/* ==========================================
   FRAME 28 - SCRAPBOOK
   FOTO BESAR DI BELAKANG STRIP KANAN
========================================== */

const renderScrapbook = async (
  ctx,
  frame,
  loadedPhotos,
  slots
) => {
  if (!slots || slots.length < 4) {
    throw new Error("Slot Frame 28 belum lengkap.");
  }

  if (loadedPhotos.length < 4) {
    throw new Error("Frame 28 membutuhkan 4 foto.");
  }

  // 1. BACKGROUND SCRAPBOOK
  ctx.drawImage(frame, 0, 0, 1080, 1350);

  // Helper foto miring
  const drawRotatedPhoto = (photo, slot) => {
    if (!photo || !slot) return;

    ctx.save();

    const centerX = slot.x + slot.width / 2;
    const centerY = slot.y + slot.height / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate(
      ((slot.rotation || 0) * Math.PI) / 180
    );

    drawCover(
      ctx,
      photo,
      -slot.width / 2,
      -slot.height / 2,
      slot.width,
      slot.height
    );

    ctx.restore();
  };

  // ======================================
  // 2. FOTO BESAR - PALING BELAKANG
  // ======================================

  drawRotatedPhoto(
    loadedPhotos[0],
    slots[0]
  );

  // ======================================
  // 3. LAPISAN KERTAS PUTIH STRIP KANAN
  //    DIGAMBAR DI ATAS FOTO BESAR
  // ======================================

  ctx.save();

  // Mengikuti kemiringan strip kanan
  const stripRotation = 3 * Math.PI / 180;

  // Titik tengah strip kanan
  const stripCenterX = 760;
  const stripCenterY = 690;

  ctx.translate(
    stripCenterX,
    stripCenterY
  );

  ctx.rotate(stripRotation);

  // Kertas putih panjang:
  // menutupi ujung kanan foto besar
  // sebelum foto-foto kecil digambar
  ctx.fillStyle = "#fffdf8";

  ctx.fillRect(
    -117,
    -390,
    234,
    780
  );

  ctx.restore();

  // ======================================
  // 4. TIGA FOTO KECIL DI ATAS KERTAS
  // ======================================

  drawRotatedPhoto(
    loadedPhotos[1],
    slots[1]
  );

  drawRotatedPhoto(
    loadedPhotos[2],
    slots[2]
  );

  drawRotatedPhoto(
    loadedPhotos[3],
    slots[3]
  );

  // ======================================
  // 5. BUNGA TRANSPARAN PALING DEPAN
  // ======================================

  const bunga = await loadImage(
    "/frames/bunga28.png"
  );

  ctx.save();
  ctx.filter = "none";

  ctx.drawImage(
    bunga,
    470,
    775,
    200,
    235
  );

  ctx.restore();
};



/* ==========================================
   FRAME 29 - CAFE MEMORIES
========================================== */

const renderCafeMemories = (
  ctx,
  frame,
  loadedPhotos,
  slots
) => {
  if (!slots || slots.length < 4) {
    throw new Error("Slot Frame 29 belum lengkap.");
  }

  if (!loadedPhotos || loadedPhotos.length < 4) {
    throw new Error("Frame 29 membutuhkan 4 foto.");
  }

  // 1. Background asli, termasuk lace
  ctx.drawImage(
    frame,
    0,
    0,
    1080,
    1350
  );

  // 2. Empat foto di tengah strip
  loadedPhotos.slice(0, 4).forEach((photo, index) => {
    const slot = slots[index];

    drawCover(
      ctx,
      photo,
      slot.x,
      slot.y,
      slot.width,
      slot.height
    );
  });

  // Tidak menggambar lace29.png lagi.
  // Lace sudah menjadi bagian dari frame asli.
};





const drawDenimStar = (ctx, starImage) => {
  if (!starImage) return;

  requestAnimationFrame(() => {
    ctx.save();
    ctx.filter = "none";

    ctx.drawImage(
      starImage,
      635, // geser kiri sedikit agar tetap pas
      320, // naik 20px
      230, // tambah besar 20px
      215
    );

    ctx.restore();
  });
};


  return { loadImage, drawCover, renderBlooming, renderEnvelope, renderRibbonStamps, renderPhotoTray, renderScrapbook, renderCafeMemories, drawDenimStar };
}
