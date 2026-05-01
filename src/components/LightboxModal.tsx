"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function LightboxModal({
  images,
  initialIndex = 0,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [isInteracting, setIsInteracting] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // ✅ Auto slide
  useEffect(() => {
    if (images.length <= 1 || isInteracting) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isInteracting]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  // ✅ Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) next();
    if (touchEnd - touchStart > 50) prev();

    setTimeout(() => setIsInteracting(false), 300);
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[index]}
          alt="preview"
          fill
          className="object-contain"
          priority
        />

        {/* زرار قفل */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-3xl"
        >
          ✕
        </button>

        {/* أسهم */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-3xl"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-3xl"
            >
              ›
            </button>
          </>
        )}

        {/* dots */}
        <div className="absolute bottom-5 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full cursor-pointer ${
                i === index ? "bg-white w-6" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}