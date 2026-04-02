import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 1. Internal Camera Data (No imports needed)
const localCameras = [
  { id: 1, lat: 26.4207, lng: 50.0888, name: "Dammam Center" },
  { id: 2, lat: 26.4300, lng: 50.1000, name: "Corniche Area" }
];

// 2. Fix for missing Leaflet icons
const icon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background:#ef4444; width:25px; height:25px; border-radius:50%; border:2px solid white;"></div>`,
  iconSize: [25, 25],
});

// 3. Helper to move map
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

export const MapView = () => {
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([26.4207, 50.0888]);

  const handleSearch = async (e: any) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Dammam`);
      const data = await res.json();
      if (data && data[0]) {
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0A0F14', position: 'fixed', top: 0, left: 0 }}>
      {/* ADDING CSS MANUALLY IN CASE PROJECT FAILED TO LOAD IT */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* SEARCH BAR */}
      <div style={{ position: 'absolute', top: '140px', left: '5%', width: '90%', zIndex: 10000 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', background: '#111827', border: '2px solid #10b981', borderRadius: '12px', overflow: 'hidden' }}>
          <input 
            style={{ flex: 1, padding: '15px', background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '16px' }}
            placeholder="Search Dammam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={{ padding: '0 20px', background: '#10b981', color: 'black', fontWeight: 'bold', border: 'none' }}>GO</button>
        </form>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapUpdater center={center} />
        {localCameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={icon}>
            <Popup><div style={{color: 'black'}}>{c.name}</div></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
