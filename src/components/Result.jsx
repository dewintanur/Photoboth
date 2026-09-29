import { useEffect, useRef, useState } from "react";

const frameConfigs = {
  1: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },

  2: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },

  3: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },

  4: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },

  5: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
  6: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
  7: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
  8: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
  9: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
  10: {
    slots: [
      {
        x: 60,
        y: 191,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 635,
        width: 480,
        height: 421,
      },
      {
        x: 60,
        y: 1079,
        width: 480,
        height: 420,
      },
    ],
  },
};

function Result({ selectedFrame, photos, onRetake, onHome }) {
  const canvasRef = useRef(null);

  const [ready, setReady] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    createResult();
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);

      image.onerror = reject;

      image.src = src;
    });
  };

  /*
   * Mirip CSS object-fit: cover.
   *
   * Foto tidak gepeng walaupun ukuran
   * slot berbeda dengan kamera.
   */
  const drawCover = (ctx, image, x, y, width, height) => {
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
  };

  const createResult = async () => {
    try {
      setReady(false);
      setError("");

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      /*
       * Semua template yang kamu kirim
       * berukuran 600 x 1800.
       */

      canvas.width = 600;
      canvas.height = 1800;

      const frame = await loadImage(selectedFrame.image);

      const loadedPhotos = await Promise.all(
        photos.map((photo) => loadImage(photo)),
      );

      const config = frameConfigs[selectedFrame.id];

      if (!config) {
        throw new Error("Frame config tidak ditemukan.");
      }

      /*
       * Bersihkan canvas.
       */

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /*
       * STEP 1
       *
       * Gambar template dahulu.
       */

      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

      /*
       * STEP 2
       *
       * Foto diletakkan DI ATAS
       * placeholder gunung.
       */

      loadedPhotos.forEach((photo, index) => {
        const slot = config.slots[index];

        if (!slot) return;

        drawCover(ctx, photo, slot.x, slot.y, slot.width, slot.height);
      });

      setReady(true);
    } catch (err) {
      console.error(err);

      setError("Something went wrong while creating your photo.");
    }
  };

  const download = () => {
    const canvas = canvasRef.current;

    if (!canvas || !ready) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `snapbooth-${Date.now()}.png`;

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(url);
      },
      "image/png",
      1,
    );
  };

  return (
    <main className="final-page">
      <header className="final-header">
        <button className="text-button" onClick={onHome}>
          ← Home
        </button>

        <div className="final-logo">SNAPBOOTH</div>

        <span>03 / 03</span>
      </header>

      <section className="final-container">
        <div className="final-title">
          <span>✦ ALL DONE ✦</span>

          <h1>
            Your memory is
            <em> ready.</em>
          </h1>

          <p>Save it somewhere special.</p>
        </div>

        <div className="final-grid">
          <div className="photostrip-area">
            {error && <div className="result-error">{error}</div>}

            {!ready && !error && (
              <div className="result-loader">
                <div className="loader-circle" />

                <p>Creating your photostrip...</p>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className={`result-canvas ${ready ? "show" : ""}`}
            />
          </div>

          <aside className="download-panel">
            <span className="panel-label">YOUR FRAME</span>

            <h2>{selectedFrame.name}</h2>

            <p>Three tiny moments, captured forever.</p>

            <div className="panel-line" />

            <button
              className="download-main"
              onClick={download}
              disabled={!ready}
            >
              DOWNLOAD PHOTO
              <span>↓</span>
            </button>

            <button className="secondary-action" onClick={onRetake}>
              ↻ Retake photos
            </button>

            <button className="secondary-action" onClick={onHome}>
              Change frame
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Result;
