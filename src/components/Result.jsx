import { useEffect, useRef, useState } from "react";
import frameConfigs from "../data/frameConfigs";
import { createCanvasHelpers } from "../utils/canvasRenderer";

function Result({ selectedFrame, photos, onRetake, onHome }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("original");

  const {
    loadImage,
    drawCover,
    renderBlooming,
    renderEnvelope,
    renderRibbonStamps,
    renderPhotoTray,
    renderScrapbook,
    renderCafeMemories,
    drawDenimStar,
  } = createCanvasHelpers(selectedFilter);

  const createResult = async () => {
    try {
      setReady(false);
      setError("");

      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      const config = frameConfigs[selectedFrame.id];

      if (!config) {
        throw new Error(`Frame ${selectedFrame.id} belum punya config.`);
      }

      /* =========================================
         CANVAS SIZE
      ========================================= */

      canvas.width = config.width;

      canvas.height = config.height;

      /* =========================================
         LOAD FRAME
      ========================================= */

      const frame = await loadImage(selectedFrame.image);

      /* =========================================
         LOAD PHOTOS
      ========================================= */

      const loadedPhotos = await Promise.all(
        photos.map((photo) => loadImage(photo)),
      );

      /* =========================================
         CLEAR CANVAS
      ========================================= */

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* =================================================
         FRAME 14 - BLOOMING
      ================================================= */

      if (selectedFrame.id === 14) {
        renderBlooming(ctx, loadedPhotos);

        setReady(true);

        return;
      }

      /* =================================================
         FRAME 15 & 16 - ENVELOPE
      ================================================= */

      if (selectedFrame.id === 15 || selectedFrame.id === 16) {
        renderEnvelope(ctx, frame, loadedPhotos);

        setReady(true);

        return;
      }
      if (selectedFrame.id === 21) {
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        renderRibbonStamps(ctx, loadedPhotos);

        setReady(true);
        return;
      }

      if (selectedFrame.id === 27) {
        renderPhotoTray(ctx, frame, loadedPhotos);

        setReady(true);
        return;
      }

      // ==========================================
      // FRAME 28 - SCRAPBOOK
      // ==========================================
      if (selectedFrame.id === 28) {
        renderScrapbook(ctx, frame, loadedPhotos, config.slots);

        setReady(true);
        return;
      }

      /* =========================================
   FRAME 29 - CAFE MEMORIES
========================================= */

      if (selectedFrame.id === 29) {
        await renderCafeMemories(ctx, frame, loadedPhotos, config.slots);

        setReady(true);
        return;
      }

      if (Number(selectedFrame.id) === 31) {
        const starImage = new Image();

        starImage.onload = () => {
          drawDenimStar(ctx, starImage);
        };

        starImage.src = "/frames/bintang31.png";
      }

      /* =================================================
         FRAME NORMAL
      ================================================= */

      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

      loadedPhotos.forEach((photo, index) => {
        const slot = config.slots?.[index];

        if (!slot) {
          return;
        }

        drawCover(ctx, photo, slot.x, slot.y, slot.width, slot.height);
      });

      setReady(true);
    } catch (err) {
      console.error("CREATE RESULT ERROR:", err);

      setError(
        err?.message || "Something went wrong while creating your photo.",
      );
    }
  };

  /* =====================================================
     CREATE RESULT WHEN DATA CHANGES
  ===================================================== */

  useEffect(() => {
    if (!selectedFrame || !photos?.length) {
      return;
    }

    createResult();
  }, [selectedFrame, photos, selectedFilter]);
  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const download = () => {
    const canvas = canvasRef.current;

    if (!canvas || !ready) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `snapbooth-${selectedFrame.name
          .toLowerCase()
          .replaceAll(" ", "-")}-${Date.now()}.png`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
      },

      "image/png",

      1,
    );
  };

  /* =====================================================
     PHOTO COUNT
  ===================================================== */

  const photoCount = selectedFrame?.photoCount || photos.length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="final-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="final-header">
        <button className="text-button" onClick={onHome}>
          ← Home
        </button>

        <div className="final-logo">SNAPBOOTH</div>

        <span>
          {String(photoCount).padStart(2, "0")}

          {" / "}

          {String(photoCount).padStart(2, "0")}
        </span>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="final-container">
        {/* TITLE */}

        <div className="final-title">
          <span>✦ ALL DONE ✦</span>

          <h1>
            Your memory is
            <em> ready.</em>
          </h1>

          <p>Save it somewhere special.</p>
        </div>

        {/* GRID */}

        <div className="final-grid">
          {/* =============================================
              RESULT
          ============================================= */}

          <div className="photostrip-area">
            {/* ERROR */}

            {error && <div className="result-error">{error}</div>}

            {/* LOADING */}

            {!ready && !error && (
              <div className="result-loader">
                <div className="loader-circle" />

                <p>Creating your photo...</p>
              </div>
            )}

            {/* CANVAS */}

            <canvas
              ref={canvasRef}
              className={`result-canvas ${ready ? "show" : ""}`}
            />
          </div>

          {/* =============================================
              DOWNLOAD PANEL
          ============================================= */}

          <aside className="download-panel">
            <span className="panel-label">YOUR FRAME</span>

            <h2>{selectedFrame.name}</h2>

            <p>
              {photoCount}{" "}
              {photoCount === 1 ? "little moment" : "little moments"}, captured
              forever.
            </p>

            <div className="panel-line" />
            {/* =============================================
    FILTER
============================================= */}

            <div className="filter-section">
              <span className="filter-label">PHOTO FILTER</span>

              <div className="filter-options">
                <button
                  type="button"
                  className={`filter-button ${
                    selectedFilter === "original" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("original")}
                >
                  Original
                </button>

                <button
                  type="button"
                  className={`filter-button ${
                    selectedFilter === "bw" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("bw")}
                >
                  B&W
                </button>

                <button
                  type="button"
                  className={`filter-button ${
                    selectedFilter === "sepia" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("sepia")}
                >
                  Sepia
                </button>

                <button
                  type="button"
                  className={`filter-button ${
                    selectedFilter === "vintage" ? "active" : ""
                  }`}
                  onClick={() => setSelectedFilter("vintage")}
                >
                  Vintage
                </button>
              </div>
            </div>
            {/* DOWNLOAD */}

            <button
              className="download-main"
              onClick={download}
              disabled={!ready}
            >
              DOWNLOAD PHOTO
              <span>↓</span>
            </button>

            {/* RETAKE */}

            <button className="secondary-action" onClick={onRetake}>
              ↻ Retake photos
            </button>

            {/* CHANGE FRAME */}

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
