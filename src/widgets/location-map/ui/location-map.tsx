"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";

/** OpenStreetMap with one marker. Leaflet needs `window`, so it loads after hydration. */
export function LocationMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: { remove(): void } | undefined;
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      const instance = L.map(ref.current, { scrollWheelZoom: false }).setView([lat, lng], 16);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(instance);
      // A CSS marker: no image files to serve.
      const icon = L.divIcon({
        className: "",
        html: '<span class="block size-5 rounded-full border-2 border-night bg-white shadow-lg"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([lat, lng], { icon, title: label, alt: label }).addTo(instance);
      map = instance;
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className="z-0 h-80 w-full overflow-hidden bg-night sm:h-[26rem] [&_.leaflet-tile-pane]:[filter:grayscale(1)_invert(1)_brightness(0.85)_contrast(0.9)]"
      dir="ltr"
    />
  );
}
