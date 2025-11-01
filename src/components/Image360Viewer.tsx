import React, { useEffect, useRef, useState } from "react";

interface Image360ViewerProps {
  images: string[];
}

const Image360Viewer: React.FC<Image360ViewerProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [mode, setMode] = useState<"EXTERIOR" | "OPEN" | "INTERIOR">("EXTERIOR");

  const autoRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pointer dragging state
  const dragging = useRef(false);
  const lastX = useRef(0);
  const leftover = useRef(0); // accumulate small moves so frames don't skip jitterily
  const sensitivity = 6; // px per frame step (lower = more sensitive)

  // Helpers
  const nextImage = () => setIndex((p) => (p + 1) % images.length);
  const prevImage = () => setIndex((p) => (p - 1 + images.length) % images.length);

  // Auto rotate effect
  useEffect(() => {
    if (isAutoRotate) {
      if (autoRef.current) window.clearInterval(autoRef.current);
      autoRef.current = window.setInterval(() => {
        setIndex((p) => (p + 1) % images.length);
      }, 80);
    } else {
      if (autoRef.current) {
        window.clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
    };
  }, [isAutoRotate, images.length]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIsAutoRotate(false);
        prevImage();
      } else if (e.key === "ArrowRight") {
        setIsAutoRotate(false);
        nextImage();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsAutoRotate((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // POINTER event handlers (works for mouse + touch + pen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (ev: PointerEvent) => {
      ev.preventDefault();
      dragging.current = true;
      lastX.current = ev.clientX;
      leftover.current = 0;
      // stop auto rotate when user starts interacting
      setIsAutoRotate(false);
      (ev.target as Element).setPointerCapture(ev.pointerId);
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - lastX.current;
      lastX.current = ev.clientX;

      // accumulate dx into leftover to allow sub-threshold smooth movement
      leftover.current += dx;

      // convert leftover into frame steps
      const steps = Math.trunc(leftover.current / sensitivity);
      if (steps !== 0) {
        // positive steps => move right (next frames)
        if (steps > 0) {
          // advance that many frames (modulo)
          setIndex((p) => {
            let n = p + steps;
            n = ((n % images.length) + images.length) % images.length;
            return n;
          });
        } else {
          setIndex((p) => {
            let n = p + steps;
            n = ((n % images.length) + images.length) % images.length;
            return n;
          });
        }
        // remove the consumed amount from leftover
        leftover.current -= steps * sensitivity;
      }
    };

    const onPointerUpOrCancel = (ev: PointerEvent) => {
      dragging.current = false;
      leftover.current = 0;
      try {
        (ev.target as Element).releasePointerCapture(ev.pointerId);
      } catch {
        // ignore if not captured
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUpOrCancel);
    window.addEventListener("pointercancel", onPointerUpOrCancel);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUpOrCancel);
      window.removeEventListener("pointercancel", onPointerUpOrCancel);
    };
  }, [images.length]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-xl overflow-hidden bg-black shadow-lg"
      // make sure pointer events / touch work as expected
      style={{ touchAction: "pan-y" }} // allow vertical page scroll, but intercept horizontal pan
    >
      {/* Image */}
      <img
        src={images[index]}
        alt={`360 frame ${index + 1}`}
        draggable={false}
        className="w-full h-full object-contain select-none pointer-events-none"
      />

      {/* Mode buttons (bottom-left) */}
      <div className="absolute bottom-4 left-4 flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-md">
        {(["EXTERIOR", "OPEN", "INTERIOR"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-sm font-semibold rounded ${
              mode === m ? "bg-white text-sky-600" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Controls (bottom-right) */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-md">
        <button
          onClick={() => {
            setIsAutoRotate(false);
            prevImage();
          }}
          aria-label="Previous"
          className="text-white text-xl p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
        >
          ◀
        </button>

        <button
          onClick={() => setIsAutoRotate((v) => !v)}
          aria-label="Auto rotate"
          className={`text-white text-xl p-2 rounded-full ${
            isAutoRotate ? "bg-red-600" : "bg-green-600"
          } hover:brightness-110 transition`}
        >
          🔄
        </button>

        <button
          onClick={() => {
            setIsAutoRotate(false);
            nextImage();
          }}
          aria-label="Next"
          className="text-white text-xl p-2 rounded-full bg-black/30 hover:bg-black/50 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Image360Viewer;
