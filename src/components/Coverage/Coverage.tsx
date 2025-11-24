"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface ServiceCenter {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
  status: string;
  flowchart?: string;
  longitude: number;
  latitude: number;
}

type Props = {
  dataUrl?: string; // optional, default "/data/coverageData.json"
};

const FlyToMarker = ({ coord }: { coord: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coord) {
      map.flyTo(coord, 12, { animate: true, duration: 1.2 });
    }
  }, [coord, map]);
  return null;
};

const Coverage: React.FC<Props> = ({ dataUrl = "/data/coverageData.json" }) => {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [flyToCoord, setFlyToCoord] = useState<[number, number] | null>(null);
  const mapRef = useRef<any>(null);
  const bangladeshCenter: [number, number] = [23.6850, 90.3563];

  useEffect(() => {
    // load JSON from public folder
    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load coverage data");
        return res.json();
      })
      .then((data: ServiceCenter[]) => setServiceCenters(data))
      .catch((err) => {
        console.error("Error loading coverage data:", err);
      });
  }, [dataUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim().toLowerCase();
    if (!query) return;

    const found = serviceCenters.find((c) =>
      c.district.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.covered_area.some((a) => a.toLowerCase().includes(query))
    );

    if (found) {
      setFlyToCoord([found.latitude, found.longitude]);
      // for accessibility: clear input or keep it
    } else {
      alert("District / place not found. Check spelling.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">We are available in 64 districts</h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4 flex gap-2">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          name="location"
          placeholder="Search district, city or area (e.g. Dhaka, Uttara)..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-lime-500 text-white px-4 rounded font-semibold">Go</button>
      </form>

      <div className="w-full h-[700px] border rounded overflow-hidden">
        <MapContainer
          center={bangladeshCenter}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {serviceCenters.map((center, idx) => (
            <Marker
              key={idx}
              position={[center.latitude, center.longitude]}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <strong>{center.district}</strong>
                  <div className="text-sm mt-1">
                    {center.city} • {center.region}
                  </div>
                  <div className="text-xs mt-2">Service areas:</div>
                  <div className="text-sm">{center.covered_area.join(", ")}</div>
                  {center.flowchart && (
                    <div className="mt-2">
                      <a href={center.flowchart} target="_blank" rel="noreferrer" className="text-xs text-lime-600 underline">
                        Open flowchart
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          <FlyToMarker coord={flyToCoord} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
