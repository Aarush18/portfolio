"use client";

import { useEffect, useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

/** Chandigarh pin */
const PIN = { lat: 30.73, lng: 76.78, label: "Chandigarh" };

/** Tunables */
const SIZE = { sm: 280, md: 360, lg: 420 }; // px
const ROTATE_SPEED = 1.4; // faster spin (was ~0.6)

export default function MiniEarth() {
  const ref = useRef<GlobeMethods | null>(null);

  useEffect(() => {
    const g = ref.current;
    if (!g) return;

    // camera + controls
    g.controls().autoRotate = true;
    g.controls().autoRotateSpeed = ROTATE_SPEED;
    g.controls().enablePan = false;
    g.controls().minDistance = 140;
    g.controls().maxDistance = 520;

    // start angled on India
    g.pointOfView({ lat: PIN.lat, lng: PIN.lng, altitude: 1.8 }, 800);
  }, []);

  // responsive sizes using CSS; Globe needs explicit width/height numbers
  const w = typeof window !== "undefined"
    ? (window.innerWidth >= 1280 ? SIZE.lg : window.innerWidth >= 768 ? SIZE.md : SIZE.sm)
    : SIZE.md;

  return (
    <div
      className="
        relative rounded-3xl border border-white/10 bg-white/[0.03]
        p-3 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.25)]
        backdrop-blur
      "
    >
      {/* soft glow ring */}
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-[radial-gradient(40%_60%_at_70%_30%,rgba(167,139,250,0.18),transparent_60%),radial-gradient(30%_50%_at_30%_70%,rgba(236,72,153,0.16),transparent_60%)] blur-2xl" />

      <div
        style={{ width: w, height: w }}
        className="mx-auto"
      >
        <Globe
          ref={ref}
          width={w}
          height={w}
          backgroundColor="rgba(0,0,0,0)"   // transparent canvas
          showAtmosphere
          atmosphereColor="white"
          atmosphereAltitude={0.18}

          // stable hosted textures (no setup)
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          // (Optional) night lights: globe uses one texture; you can swap to a day-night composite if you want a terminator look.

          // pin label
          labelsData={[PIN]}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.label}
          labelSize={1.65}
          labelColor={() => "rgba(255,96,128,0.95)"}   // luminous red-ish
          labelDotRadius={0.7}
          labelAltitude={0.02}

          // aesthetics
          showGraticules={false}
          onGlobeReady={() => {
            // slight tilt so it feels dynamic
            const g = ref.current;
            if (!g) return;
            g.scene().rotation.x = -0.08;
          }}
        />
      </div>
    </div>
  );
}
