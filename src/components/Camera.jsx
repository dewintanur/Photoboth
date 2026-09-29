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

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");

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
      }
    } catch (error) {
      console.error(error);

      setCameraError(
        "We couldn't access your camera. Please allow camera permission and try again."
      );
    }
  };

  const stopCamera = () => {
    if (!streamRef.current) return;

    streamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    /*
      Mirror hasil foto supaya sama
      dengan yang user lihat.
    */

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

    setPhotos((previous) => [
      ...previous,
      image,
    ]);
  };

  const takePhoto = () => {
    if (
      isCounting ||
      photos.length >= 3 ||
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

  const removePhoto = (index) => {
    setPhotos((previous) =>
      previous.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  const finish = () => {
    if (photos.length !== 3) return;

    stopCamera();
    onFinish(photos);
  };

  return (
    <main className="booth-page">
      <header className="booth-header">
        <button
          className="text-button light"
          onClick={onBack}
        >
          ← Choose frame
        </button>

        <div className="booth-logo">
          SNAPBOOTH
        </div>

        <div className="photo-counter">
          {String(
            Math.min(photos.length + 1, 3)
          ).padStart(2, "0")}
          <span>/ 03</span>
        </div>
      </header>

      <section className="booth-container">
        <div className="booth-intro">
          <span>STEP 02</span>

          <h1>
            Get ready,
            <em> look cute.</em>
          </h1>

          <p>
            Three photos. Three poses.
            One little memory.
          </p>
        </div>

        <div className="camera-shell">
          {cameraError ? (
            <div className="camera-error-state">
              <div className="error-icon">
                !
              </div>

              <h3>Camera unavailable</h3>

              <p>{cameraError}</p>

              <button
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

              <div className="viewfinder">
                <span className="vf-tl" />
                <span className="vf-tr" />
                <span className="vf-bl" />
                <span className="vf-br" />
              </div>

              <div className="live-badge">
                <span />
                LIVE
              </div>

              {countdown && (
                <div className="countdown-overlay">
                  <span>{countdown}</span>
                </div>
              )}

              {photos.length === 3 &&
                !isCounting && (
                  <div className="complete-overlay">
                    <div className="complete-check">
                      ✓
                    </div>

                    <h2>
                      You look good.
                    </h2>

                    <p>
                      Your three shots are
                      ready.
                    </p>
                  </div>
                )}
            </>
          )}
        </div>

        <canvas
          ref={canvasRef}
          hidden
        />

        <div className="shots-row">
          {[0, 1, 2].map((index) => {
            const photo = photos[index];

            return (
              <div
                className="shot-wrapper"
                key={index}
              >
                <div
                  className={`shot-preview ${
                    photo ? "filled" : ""
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
                        className="remove-shot"
                        onClick={() =>
                          removePhoto(index)
                        }
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
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

        <div className="booth-actions">
          {photos.length < 3 ? (
            <button
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
                    photos.length + 1
                  }`}
            </button>
          ) : (
            <button
              className="finish-button"
              onClick={finish}
            >
              CREATE MY PHOTO
              <span>→</span>
            </button>
          )}

          {photos.length > 0 && (
            <button
              className="reset-button"
              onClick={resetPhotos}
            >
              ↻ Start over
            </button>
          )}
        </div>

        <div className="current-frame">
          <span>FRAME</span>

          <strong>
            {selectedFrame.name}
          </strong>
        </div>
      </section>
    </main>
  );
}

export default Camera;