// components/NoiseOverlay.jsx
export default function NoiseOverlay() {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.25,
        }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noise" x="0" y="0" width="1" height="1">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.3"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#noise)"
          />
        </svg>
      </div>
    );
  }
  