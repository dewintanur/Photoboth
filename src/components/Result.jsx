import { useEffect, useRef, useState } from "react";

/* =========================================================
   FRAME CONFIG
========================================================= */

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
    slots: [
      { x: 540, y: 379, width: 432, height: 592 },
    ],
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
};

/* =========================================================
   RESULT
========================================================= */

function Result({
  selectedFrame,
  photos,
  onRetake,
  onHome,
}) {
  const canvasRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD IMAGE
  ===================================================== */

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);

      image.onerror = () => {
        reject(
          new Error(`Gagal load image: ${src}`)
        );
      };

      image.src = src;
    });
  };

  /* =====================================================
     DRAW COVER
  ===================================================== */

  const drawCover = (
    ctx,
    image,
    x,
    y,
    width,
    height
  ) => {
    if (!image) return;

    const imageRatio =
      image.width / image.height;

    const slotRatio =
      width / height;

    let sourceX = 0;
    let sourceY = 0;

    let sourceWidth = image.width;
    let sourceHeight = image.height;

    if (imageRatio > slotRatio) {
      sourceHeight = image.height;

      sourceWidth =
        sourceHeight * slotRatio;

      sourceX =
        (image.width - sourceWidth) / 2;
    } else {
      sourceWidth = image.width;

      sourceHeight =
        sourceWidth / slotRatio;

      sourceY =
        (image.height - sourceHeight) / 2;
    }

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );
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

const drawCleanPhotoStrip = (
  ctx,
  stripPhotos,
  centerX,
  topY,
  rotation
) => {
  const stripWidth = 202;

  const sidePadding = 11;
  const topPadding = 12;
  const bottomPadding = 14;

  const gap = 10;

  const photoWidth =
    stripWidth - sidePadding * 2;

  const photoHeight = 230;

  const stripHeight =
    topPadding +
    photoHeight * 4 +
    gap * 3 +
    bottomPadding;

  ctx.save();

  /* pindahkan titik canvas ke posisi strip */
  ctx.translate(centerX, topY);

  /* putar SELURUH strip sekaligus */
  ctx.rotate(
    (rotation * Math.PI) / 180
  );

  /* ===============================
     KERTAS PUTIH
  =============================== */

  ctx.fillStyle = "#fffdf8";

  ctx.fillRect(
    -stripWidth / 2,
    0,
    stripWidth,
    stripHeight
  );

  /* ===============================
     4 FOTO
  =============================== */

  stripPhotos.forEach((photo, index) => {
    if (!photo) return;

    const x =
      -stripWidth / 2 +
      sidePadding;

    const y =
      topPadding +
      index *
        (photoHeight + gap);

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
  /* =====================================================
     FRAME 14 - BLOOMING

     DIPERTAHANKAN SESUAI FILE-MU.
  ===================================================== */

  const renderBlooming = (
    ctx,
    loadedPhotos
  ) => {
    if (loadedPhotos.length < 4) {
      throw new Error(
        "Frame 14 membutuhkan 4 foto."
      );
    }

    /* =========================================
       FOTO 1 - BACKGROUND ATAS
    ========================================= */

    drawCover(
      ctx,
      loadedPhotos[0],
      0,
      0,
      1080,
      675
    );

    /* =========================================
       FOTO 3 - BACKGROUND BAWAH
    ========================================= */

    drawCover(
      ctx,
      loadedPhotos[2],
      0,
      675,
      1080,
      675
    );

    /* =========================================
       FOTO 2 - KECIL ATAS
    ========================================= */

    const topX = 442;
    const topY = 207;

    const smallWidth = 195;
    const smallHeight = 262;

    ctx.fillStyle = "#f5dfdf";

    ctx.fillRect(
      topX - 18,
      topY - 18,
      smallWidth + 36,
      smallHeight + 36
    );

    drawCover(
      ctx,
      loadedPhotos[1],
      topX,
      topY,
      smallWidth,
      smallHeight
    );

    /* =========================================
       FOTO 4 - KECIL BAWAH
    ========================================= */

    const bottomX = 442;
    const bottomY = 881;

    ctx.fillStyle = "#f5dfdf";

    ctx.fillRect(
      bottomX - 18,
      bottomY - 18,
      smallWidth + 36,
      smallHeight + 36
    );

    drawCover(
      ctx,
      loadedPhotos[3],
      bottomX,
      bottomY,
      smallWidth,
      smallHeight
    );

    /* =========================================
       GARIS TENGAH
    ========================================= */

    ctx.strokeStyle =
      "rgba(255,255,255,0.75)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
      0,
      675
    );

    ctx.lineTo(
      1080,
      675
    );

    ctx.stroke();

    /* =========================================
       POSTCARDS
    ========================================= */

    ctx.save();

    ctx.fillStyle = "#fff6d5";

    ctx.textAlign = "right";

    ctx.font =
      "italic 30px Georgia, serif";

    ctx.fillText(
      "postcards",
      990,
      1180
    );

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

const renderEnvelope = (
  ctx,
  frame,
  loadedPhotos
) => {
  if (loadedPhotos.length < 8) {
    throw new Error(
      "Frame 15 dan 16 membutuhkan 8 foto."
    );
  }

  /* =========================================
     1. TEMPLATE DASAR
  ========================================= */

  ctx.drawImage(
    frame,
    0,
    0,
    1080,
    1350
  );

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

    [
      loadedPhotos[0],
      loadedPhotos[2],
      loadedPhotos[4],
      loadedPhotos[6],
    ],

    405,  // X
    105,  // Y atas strip
    -7    // rotasi
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

    [
      loadedPhotos[1],
      loadedPhotos[3],
      loadedPhotos[5],
      loadedPhotos[7],
    ],

    625, // X
    105, // Y atas strip
    6    // rotasi
  );

  /* =========================================
     4. DEPAN AMPLOP

     Digambar kembali supaya bagian bawah
     kedua strip terlihat masuk ke amplop.
  ========================================= */

  ctx.save();

  ctx.beginPath();

  ctx.moveTo(
    245,
    850
  );

  ctx.lineTo(
    540,
    1035
  );

  ctx.lineTo(
    805,
    850
  );

  ctx.lineTo(
    775,
    1245
  );

  ctx.lineTo(
    245,
    1200
  );

  ctx.closePath();

  ctx.clip();

  ctx.drawImage(
    frame,
    0,
    0,
    1080,
    1350
  );

  ctx.restore();

  /* =========================================
     5. NOTE + WAX

     Tetap paling depan.
  ========================================= */

  ctx.save();

  ctx.beginPath();

  ctx.rect(
    650,
    790,
    430,
    560
  );

  ctx.clip();

  ctx.drawImage(
    frame,
    0,
    0,
    1080,
    1350
  );

  ctx.restore();
};

  /* =====================================================
     CREATE RESULT
  ===================================================== */

  const createResult = async () => {
    try {
      setReady(false);
      setError("");

      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx =
        canvas.getContext("2d");

      const config =
        frameConfigs[
          selectedFrame.id
        ];

      if (!config) {
        throw new Error(
          `Frame ${selectedFrame.id} belum punya config.`
        );
      }

      /* =========================================
         CANVAS SIZE
      ========================================= */

      canvas.width =
        config.width;

      canvas.height =
        config.height;

      /* =========================================
         LOAD FRAME
      ========================================= */

      const frame =
        await loadImage(
          selectedFrame.image
        );

      /* =========================================
         LOAD PHOTOS
      ========================================= */

      const loadedPhotos =
        await Promise.all(
          photos.map(
            (photo) =>
              loadImage(photo)
          )
        );

      /* =========================================
         CLEAR CANVAS
      ========================================= */

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      /* =================================================
         FRAME 14 - BLOOMING
      ================================================= */

      if (
        selectedFrame.id === 14
      ) {
        renderBlooming(
          ctx,
          loadedPhotos
        );

        setReady(true);

        return;
      }

      /* =================================================
         FRAME 15 & 16 - ENVELOPE
      ================================================= */

      if (
        selectedFrame.id === 15 ||
        selectedFrame.id === 16
      ) {
        renderEnvelope(
          ctx,
          frame,
          loadedPhotos
        );

        setReady(true);

        return;
      }

      /* =================================================
         FRAME NORMAL
      ================================================= */

      ctx.drawImage(
        frame,
        0,
        0,
        canvas.width,
        canvas.height
      );

      loadedPhotos.forEach(
        (photo, index) => {
          const slot =
            config.slots?.[index];

          if (!slot) {
            return;
          }

          drawCover(
            ctx,
            photo,
            slot.x,
            slot.y,
            slot.width,
            slot.height
          );
        }
      );

      setReady(true);
    } catch (err) {
      console.error(
        "CREATE RESULT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while creating your photo."
      );
    }
  };

  /* =====================================================
     CREATE RESULT WHEN DATA CHANGES
  ===================================================== */

  useEffect(() => {
    if (
      !selectedFrame ||
      !photos?.length
    ) {
      return;
    }

    createResult();
  }, [selectedFrame, photos]);

  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const download = () => {
    const canvas =
      canvasRef.current;

    if (
      !canvas ||
      !ready
    ) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `snapbooth-${selectedFrame.name
            .toLowerCase()
            .replaceAll(
              " ",
              "-"
            )}-${Date.now()}.png`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          url
        );
      },

      "image/png",

      1
    );
  };

  /* =====================================================
     PHOTO COUNT
  ===================================================== */

  const photoCount =
    selectedFrame?.photoCount ||
    photos.length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="final-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="final-header">

        <button
          className="text-button"
          onClick={onHome}
        >
          ← Home
        </button>

        <div className="final-logo">
          SNAPBOOTH
        </div>

        <span>
          {String(
            photoCount
          ).padStart(
            2,
            "0"
          )}

          {" / "}

          {String(
            photoCount
          ).padStart(
            2,
            "0"
          )}
        </span>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="final-container">

        {/* TITLE */}

        <div className="final-title">

          <span>
            ✦ ALL DONE ✦
          </span>

          <h1>
            Your memory is
            <em> ready.</em>
          </h1>

          <p>
            Save it somewhere special.
          </p>

        </div>

        {/* GRID */}

        <div className="final-grid">

          {/* =============================================
              RESULT
          ============================================= */}

          <div className="photostrip-area">

            {/* ERROR */}

            {error && (
              <div className="result-error">
                {error}
              </div>
            )}

            {/* LOADING */}

            {!ready &&
              !error && (
                <div className="result-loader">

                  <div className="loader-circle" />

                  <p>
                    Creating your photo...
                  </p>

                </div>
              )}

            {/* CANVAS */}

            <canvas
              ref={canvasRef}
              className={`result-canvas ${
                ready
                  ? "show"
                  : ""
              }`}
            />

          </div>

          {/* =============================================
              DOWNLOAD PANEL
          ============================================= */}

          <aside className="download-panel">

            <span className="panel-label">
              YOUR FRAME
            </span>

            <h2>
              {selectedFrame.name}
            </h2>

            <p>
              {photoCount}{" "}

              {photoCount === 1
                ? "little moment"
                : "little moments"}

              , captured forever.
            </p>

            <div className="panel-line" />

            {/* DOWNLOAD */}

            <button
              className="download-main"
              onClick={download}
              disabled={!ready}
            >
              DOWNLOAD PHOTO

              <span>
                ↓
              </span>
            </button>

            {/* RETAKE */}

            <button
              className="secondary-action"
              onClick={onRetake}
            >
              ↻ Retake photos
            </button>

            {/* CHANGE FRAME */}

            <button
              className="secondary-action"
              onClick={onHome}
            >
              Change frame
            </button>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Result;