import {
  useEffect,
  useRef,
  useState,
} from "react";

function Camera({
  selectedFrame,
  onBack,
  onFinish,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] =
    useState(false);
  const [cameraError, setCameraError] =
    useState("");

  // Jumlah foto mengikuti frame yang dipilih
  // Frame lama yang belum punya photoCount otomatis 3
  const photoCount =
    selectedFrame?.photoCount || 3;

  // ==============================
  // START CAMERA
  // ==============================

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",

            width: {
              ideal: 1280,
            },

            height: {
              ideal: 960,
            },
          },

          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "We couldn't access your camera. Please allow camera permission and try again."
      );
    }
  };

  // ==============================
  // STOP CAMERA
  // ==============================

  const stopCamera = () => {
    if (!streamRef.current) return;

    streamRef.current
      .getTracks()
      .forEach((track) => {
        track.stop();
      });

    streamRef.current = null;
  };

  // ==============================
  // CAPTURE PHOTO
  // ==============================

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      console.log("Video belum siap.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Mirror hasil foto agar sama
    // seperti preview kamera
    ctx.save();

    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    ctx.restore();

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.95
      );

    setPhotos((previousPhotos) => {
      if (
        previousPhotos.length >= photoCount
      ) {
        return previousPhotos;
      }

      return [
        ...previousPhotos,
        image,
      ];
    });
  };

  // ==============================
  // COUNTDOWN
  // ==============================

  const takePhoto = () => {
    if (
      isCounting ||
      photos.length >= photoCount ||
      cameraError
    ) {
      return;
    }

    setIsCounting(true);
    setCountdown(3);

    let number = 3;

    const timer = setInterval(() => {
      number -= 1;

      if (number > 0) {
        setCountdown(number);
        return;
      }

      clearInterval(timer);

      setCountdown(null);
      capturePhoto();
      setIsCounting(false);
    }, 1000);
  };

  // ==============================
  // REMOVE ONE PHOTO
  // ==============================

  const removePhoto = (index) => {
    if (isCounting) return;

    setPhotos((previousPhotos) =>
      previousPhotos.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };

  // ==============================
  // RESET
  // ==============================

  const resetPhotos = () => {
    if (isCounting) return;

    setPhotos([]);
    setCountdown(null);
  };

  // ==============================
  // FINISH
  // ==============================

  const finish = () => {
    if (
      photos.length !== photoCount
    ) {
      return;
    }

    stopCamera();

    onFinish(photos);
  };

  // ==============================
  // BACK
  // ==============================

  const handleBack = () => {
    stopCamera();
    onBack();
  };

  // ==============================
  // GALLERY
  // ==============================

  const handleGalleryUpload = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    const remainingSlots =
      photoCount - photos.length;

    const selectedFiles =
      files.slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      if (
        !file.type.startsWith("image/")
      ) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload = (e) => {
        setPhotos((previous) => {
          if (
            previous.length >= photoCount
          ) {
            return previous;
          }

          return [
            ...previous,
            e.target.result,
          ];
        });
      };

      reader.readAsDataURL(file);
    });

    // Biar file yang sama bisa
    // dipilih lagi
    event.target.value = "";
  };

  // ==============================
  // COUNTER
  // ==============================

  const currentNumber =
    photos.length >= photoCount
      ? photoCount
      : photos.length + 1;

  return (
    <main className="booth-page">

      {/* ==========================
          HEADER
      ========================== */}

      <header className="booth-header">
        <button
          type="button"
          className="text-button light"
          onClick={handleBack}
        >
          ← Choose frame
        </button>

        <div className="booth-logo">
          SNAPBOOTH
        </div>

        <div className="photo-counter">
          {String(
            currentNumber
          ).padStart(2, "0")}

          <span>
            /{" "}
            {String(
              photoCount
            ).padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* ==========================
          CONTENT
      ========================== */}

      <section className="booth-container">

        {/* TITLE */}

        <div className="booth-intro">
          <span>STEP 02</span>

          <h1>
            Get ready,
            <em> look cute.</em>
          </h1>

          <p>
            {photoCount}{" "}
            {photoCount === 1
              ? "photo"
              : "photos"}
            . Strike your best pose.
          </p>
        </div>

        {/* ==========================
            CAMERA + PREVIEW
        ========================== */}

        <div className="capture-layout">

          {/* CAMERA */}

          <div className="camera-shell">

            {cameraError ? (
              <div className="camera-error-state">

                <div className="error-icon">
                  !
                </div>

                <h3>
                  Camera unavailable
                </h3>

                <p>
                  {cameraError}
                </p>

                <button
                  type="button"
                  onClick={startCamera}
                  className="retry-button"
                >
                  TRY AGAIN
                </button>

              </div>
            ) : (
              <>

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />

                {/* VIEWFINDER */}

                <div className="viewfinder">
                  <span className="vf-tl" />
                  <span className="vf-tr" />
                  <span className="vf-bl" />
                  <span className="vf-br" />
                </div>

                {/* LIVE */}

                <div className="live-badge">
                  <span />
                  LIVE
                </div>

                {/* COUNTDOWN */}

                {countdown && (
                  <div className="countdown-overlay">
                    <span>
                      {countdown}
                    </span>
                  </div>
                )}

                {/* COMPLETE */}

                {photos.length ===
                  photoCount &&
                  !isCounting && (
                    <div className="complete-overlay">

                      <div className="complete-check">
                        ✓
                      </div>

                      <h2>
                        You look good.
                      </h2>

                      <p>
                        Your{" "}
                        {photoCount}{" "}
                        {photoCount === 1
                          ? "shot is"
                          : "shots are"}{" "}
                        ready.
                      </p>

                    </div>
                  )}

              </>
            )}

          </div>

          {/* ==========================
              PHOTO RESULTS
          ========================== */}

          <div className="shots-row">

            {Array.from({
              length: photoCount,
            }).map((_, index) => {

              const photo =
                photos[index];

              return (
                <div
                  className="shot-wrapper"
                  key={index}
                >

                  <div
                    className={`shot-preview ${
                      photo
                        ? "filled"
                        : ""
                    }`}
                  >

                    {photo ? (
                      <>

                        <img
                          src={photo}
                          alt={`Shot ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="remove-shot"
                          onClick={() =>
                            removePhoto(
                              index
                            )
                          }
                          aria-label={`Remove photo ${
                            index + 1
                          }`}
                        >
                          ×
                        </button>

                      </>
                    ) : (
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    )}

                  </div>

                  <p>
                    {photo
                      ? "Captured"
                      : "Waiting"}
                  </p>

                </div>
              );
            })}

          </div>
        </div>

        {/* Hidden canvas */}

        <canvas
          ref={canvasRef}
          hidden
        />

        {/* ==========================
            ACTIONS
        ========================== */}

        <div className="booth-actions">

          {photos.length <
          photoCount ? (

            <button
              type="button"
              className="shutter-button"
              disabled={
                isCounting ||
                !!cameraError
              }
              onClick={takePhoto}
            >

              <span className="shutter-icon">
                <span />
              </span>

              {isCounting
                ? "GET READY..."
                : `TAKE PHOTO ${
                    photos.length +
                    1
                  }`}

            </button>

          ) : (

            <button
              type="button"
              className="finish-button"
              onClick={finish}
            >
              CREATE MY PHOTO
              <span>→</span>
            </button>

          )}

          {/* ==========================
              GALLERY
          ========================== */}

          {photos.length <
            photoCount && (
            <>

              <button
                type="button"
                className="gallery-button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                UPLOAD FROM GALLERY
                <span>＋</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={
                  handleGalleryUpload
                }
              />

            </>
          )}

          {/* RESET */}

          {photos.length > 0 && (
            <button
              type="button"
              className="reset-button"
              onClick={resetPhotos}
              disabled={isCounting}
            >
              ↻ Start over
            </button>
          )}

        </div>

        {/* CURRENT FRAME */}

        <div className="current-frame">
          <span>FRAME</span>

          <strong>
            {selectedFrame.name}
          </strong>

          <small>
            {photoCount}{" "}
            {photoCount === 1
              ? "PHOTO"
              : "PHOTOS"}
          </small>
        </div>

      </section>
    </main>
  );
}

export default Camera;