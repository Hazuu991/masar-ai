import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../../contexts/language-context';

// I am adding the camera data directly here to stop "Import Errors"
const localCameras = [
  { id: 1, lat: 26.4207, lng: 50.0888, nameAr: "كاميرا الدمام 1", nameEn: "Dammam Cam 1" },
  { id: 2, lat: 26.4300, lng: 50.1000, nameAr: "كاميرا الدمام 2", nameEn: "Dammam Cam 2" }
];

const cameraIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white;">📷</div>`,
  iconSize: [30, 30],
});

function MapActions({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export const MapView = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([26.4207, 50.0888]);

  const handleSearch = async (e: any) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Dammam`);
      const data = await res.json();
      if (data[0]) setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0A0F14' }}>
      <div style={{ position: 'fixed', top: '150px', left: '5%', width: '90%', zIndex: 10000 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', background: '#111827', border: '2px solid #10b981', borderRadius: '12px', overflow: 'hidden' }}>
          <input 
            style={{ flex: 1, padding: '15px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={{ padding: '0 20px', background: '#10b981', color: 'black', fontWeight: 'bold', border: 'none' }}>GO</button>
        </form>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapActions center={center} />
        {localCameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cameraIcon}>
            <Popup>
               <div style={{color: 'black'}}>{lang === 'ar' ? c.nameAr : c.nameEn}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
