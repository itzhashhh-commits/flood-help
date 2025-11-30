"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { HelpSeekerResult } from "@/types";
import { useMapPositionStore } from "@/store/mapPositionStore";

export default function GoogleMap({
  helpSeekers,
}: {
  helpSeekers: HelpSeekerResult[];
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const { position, setPosition } = useMapPositionStore();

  useEffect(() => {
    // Ensure this only runs in the browser
    if (!mapRef.current || typeof window === "undefined") return;

    let myLocationMarker: google.maps.Marker | null = null;
    const helpSeekerMarkers: google.maps.Marker[] = [];
    let infoWindow: google.maps.InfoWindow | null = null;

    (async () => {
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      });

      const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;
      const { Marker } = (await importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      // create map only once
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new Map(mapRef.current as HTMLDivElement, {
          zoom: 12,
        });
      }
      const map = mapInstanceRef.current;

      infoWindow = new google.maps.InfoWindow();

      // Initialize marker position from store (if any)
      if (position) {
        myLocationMarker = new Marker({
          position,
          map,
          title: "My location",
          icon: "", // use custom icon here
        });
        map.setCenter(position);
      }

      // Double‑click anywhere on the map: move the same marker + update store
      map.addListener("dblclick", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const latLng = e.latLng;

        if (!myLocationMarker) {
          myLocationMarker = new Marker({
            position: latLng,
            map,
            title: "My location",
            icon: "", // use custom icon here
          });
        } else {
          myLocationMarker.setPosition(latLng);
          myLocationMarker.setMap(map);
        }

        const pos = { lat: latLng.lat(), lng: latLng.lng() };
        setPosition(pos); // this no longer re‑creates the map
      });

      // Show current user location (default red pin) and sync with same marker
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geo) => {
            if (!map) return;
            const currentPos = {
              lat: geo.coords.latitude,
              lng: geo.coords.longitude,
            };

            map.setCenter(currentPos);

            if (!myLocationMarker) {
              myLocationMarker = new Marker({
                position: currentPos,
                map,
                title: "My location",
                icon: "", // use custom icon here
              });
            } else {
              myLocationMarker.setPosition(currentPos);
              myLocationMarker.setMap(map);
            }

            setPosition(currentPos);
          },
          () => {
            // geolocation failed or denied; keep default center
          }
        );
      }

      const helpSeekerIconUrl = "/location.png"; // put the file in /public

      const helpSeekerIcon: google.maps.Icon = {
        url: helpSeekerIconUrl,
        scaledSize: new google.maps.Size(38, 38),
        anchor: new google.maps.Point(16, 32),
      };

      // Add pins for help seekers (custom icon)
      helpSeekers.forEach((seeker) => {
        // Assuming seeker.coordinates is JSON or already an object: { lat: number; lng: number }
        const raw =
          (seeker as HelpSeekerResult).coordinates ??
          (seeker as HelpSeekerResult).coordinates;
        if (!raw) return;

        let coords: { lat: number; lng: number } | null = null;
        if (typeof raw === "string") {
          try {
            coords = JSON.parse(raw);
          } catch {
            return;
          }
        } else if (typeof raw === "object" && raw.lat && raw.lng) {
          coords = { lat: Number(raw.lat), lng: Number(raw.lng) };
        }

        if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) return;

        const marker = new Marker({
          position: coords,
          map: map || undefined,
          title: seeker.name ?? "Help seeker",
          icon: helpSeekerIcon, // use custom icon here
        });

        marker.addListener("click", () => {
          if (!infoWindow) return;
          const content = `
      <div style="min-width:220px; max-width:260px; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:#0f172a;">
        <div style="border-radius:12px; padding:12px 14px; background:linear-gradient(135deg,#eff6ff,#fefce8); box-shadow:0 10px 20px rgba(15,23,42,0.18); border:1px solid #e5e7eb;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <div style="width:28px; height:28px; border-radius:999px; background:#2563eb; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:600;">
              ${seeker.name ? seeker.name.charAt(0).toUpperCase() : "H"}
            </div>
            <div style="flex:1;">
              <div style="font-size:15px; font-weight:700; color:#111827; margin-bottom:2px;">
                ${seeker.name ?? "Help seeker"}
              </div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#6b7280;">
                ${seeker.need ?? "Need Assistance"}
              </div>
            </div>
          </div>

          ${
            seeker.phone
              ? `
          <div style="display:flex; align-items:flex-start; gap:6px; margin-bottom:6px; font-size:13px; color:#374151;">
            <span style="font-size:14px;">📞</span>
            <div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; margin-bottom:1px;">
                Phone
              </div>
              <a href="tel:${seeker.phone}" style="color:#2563eb; text-decoration:none; font-weight:500;">
                ${seeker.phone}
              </a>
            </div>
          </div>
          `
              : ""
          }

          ${
            seeker.details
              ? `
          <div style="display:flex; align-items:flex-start; gap:6px; font-size:13px; color:#374151; margin-top:4px;">
            <span style="font-size:14px;">📍</span>
            <div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; margin-bottom:1px;">
                Details
              </div>
              <div style="line-height:1.4;">
                ${seeker.details}
              </div>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;
          infoWindow.setContent(content);
          infoWindow.open({
            map: map || undefined,
            anchor: marker,
          });
        });

        helpSeekerMarkers.push(marker);
      });
    })();

    return () => {
      if (myLocationMarker) {
        myLocationMarker.setMap(null);
        myLocationMarker = null;
      }
      helpSeekerMarkers.forEach((m) => m.setMap(null));
      // mapInstanceRef.current = null;
    };
    // NOTE: do NOT depend on `position` or `setPosition` here
  }, [helpSeekers]);

  return <div ref={mapRef} className="w-full h-full" />;
}
