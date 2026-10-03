import { useState } from "react";
import Camera from "./components/Camera";
import Result from "./components/Result";
import "./App.css";

const frames = [
  {
    id: 1,
    name: "Love Memory",
    image: "/frames/frame1.png",
    photoCount: 3,
  },
  {
    id: 2,
    name: "Red Classic",
    image: "/frames/frame2.png",
    photoCount: 3,
  },
  {
    id: 3,
    name: "Polka White",
    image: "/frames/frame3.png",
    photoCount: 3,
  },
  {
    id: 4,
    name: "Polka Black",
    image: "/frames/frame4.png",
    photoCount: 3,
  },
  {
    id: 5,
    name: "Vintage Flower",
    image: "/frames/frame5.png",
    photoCount: 3,
  },
  {
    id: 6,
    name: "Vintage Red",
    image: "/frames/frame6.png",
    photoCount: 3,
  },
  {
    id: 7,
    name: "Brown Rock",
    image: "/frames/frame7.png",
    photoCount: 3,
  },
  {
    id: 8,
    name: "Meow",
    image: "/frames/frame8.png",
    photoCount: 3,
  },
  {
    id: 9,
    name: "Orange Picnic",
    image: "/frames/frame9.png",
    photoCount: 3,
  },
  {
    id: 10,
    name: "Broken White",
    image: "/frames/frame10.png",
    photoCount: 3,
  },

  // ==============================
  // NEW FRAMES
  // ==============================

  {
    id: 11,
    name: "Birthday Dots",
    image: "/frames/frame11.png",
    photoCount: 3,
  },
  {
    id: 12,
    name: "Birthday Split",
    image: "/frames/frame12.png",
    photoCount: 4,
  },
  {
    id: 13,
    name: "Birthday Star",
    image: "/frames/frame13.png",
    photoCount: 1,
  },
  {
    id: 14,
    name: "Blooming",
    image: "/frames/frame14.png",
    preview: "/frames/frame14-preview.png",
    photoCount: 4,
  },
  {
    id: 15,
    name: "Birthday Letter",

    // dipakai Result.jsx
    image: "/frames/frame15.png",

    // cuma untuk tampilan pilihan frame
    preview: "/frames/frame15-preview.png",

    photoCount: 8,
  },
  {
    id: 16,
    name: "My Love Letter",

    // dipakai Result.jsx
    image: "/frames/frame16.png",

    // cuma untuk tampilan pilihan frame
    preview: "/frames/frame16-preview.png",

    photoCount: 8,
  },
  {
    id: 17,
    name: "Cream Dots",
    image: "/frames/frame17.png",
    photoCount: 3,
  },
  {
    id: 18,
    name: "Starry Blue",
    image: "/frames/frame18.png",
    photoCount: 2,
  },
  {
    id: 19,
    name: "Pastel Hearts",
    image: "/frames/frame19.png",
    photoCount: 4,
  },
  {
    id: 20,
    name: "Sweet Leather",
    image: "/frames/frame20.png",
    photoCount: 4,
  },
];

function App() {
  const [page, setPage] = useState("frames");
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [photos, setPhotos] = useState([]);

  const startPhotobooth = () => {
    if (!selectedFrame) return;

    setPhotos([]);
    setPage("camera");
  };

  const finishCamera = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    setPage("result");
  };

  const goHome = () => {
    setPhotos([]);
    setSelectedFrame(null);
    setPage("frames");
  };

  const retake = () => {
    setPhotos([]);
    setPage("camera");
  };

  if (page === "camera" && selectedFrame) {
    return (
      <Camera
        selectedFrame={selectedFrame}
        onBack={() => setPage("frames")}
        onFinish={finishCamera}
      />
    );
  }

  if (
    page === "result" &&
    selectedFrame &&
    photos.length === selectedFrame.photoCount
  ) {
    return (
      <Result
        selectedFrame={selectedFrame}
        photos={photos}
        onRetake={retake}
        onHome={goHome}
      />
    );
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="eyebrow">✦ YOUR LITTLE PHOTOBOOTH ✦</p>

        <h1>
          Capture your
          <em> favorite moments.</em>
        </h1>

        <p className="hero-description">
          Pick your favorite frame, strike a pose, and turn little moments into
          one memory.
        </p>
      </section>

      <section className="frame-section">
        <div className="section-title">
          <span>STEP 01</span>
          <h2>Choose your frame</h2>
        </div>

        <div className="frame-grid">
          {frames.map((frame) => {
            const active = selectedFrame?.id === frame.id;

            return (
              <button
                key={frame.id}
                type="button"
                className={`frame-option ${active ? "active" : ""}`}
                onClick={() => setSelectedFrame(frame)}
              >
                <div className="frame-image-wrapper">
                  <img src={frame.preview || frame.image} alt={frame.name} />

                  {active && <div className="selected-badge">✓</div>}
                </div>

                <div className="frame-option-footer">
                  <span>{frame.name}</span>

                  <span>
                    {active
                      ? "Selected"
                      : `${frame.photoCount} Photo${
                          frame.photoCount > 1 ? "s" : ""
                        }`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="start-area">
          <p>
            {selectedFrame
              ? `${selectedFrame.name} · ${selectedFrame.photoCount} photo${
                  selectedFrame.photoCount > 1 ? "s" : ""
                }`
              : "Choose one frame to continue"}
          </p>

          <button
            className="primary-button"
            disabled={!selectedFrame}
            onClick={startPhotobooth}
          >
            START PHOTOBOOTH
            <span>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
