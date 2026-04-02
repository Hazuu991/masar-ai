import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';

const cameraIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white;">📷</div>`,
  iconSize: [30, 30],
});

export const MapView = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([26.4207, 50.0888]);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}, Dammam`);
      const data = await res.json();
      if (data[0]) setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-full w-full relative">
      {/* SEARCH BAR - Using fixed pixels to ensure it stays below your top buttons */}
      <div style={{ position: 'fixed', top: '150px', left: '5%', width: '90%', zIndex: 10000 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', background: '#111827', border: '2px solid #10b981', borderRadius: '12px', overflow: 'hidden' }}>
          <input 
            style={{ flex: 1, padding: '12px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }}
            placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={{ padding: '12px', background: '#10b981', color: 'black', fontWeight: 'bold', border: 'none' }}>GO</button>
        </form>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {cameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cameraIcon}>
            <Popup>
              <div style={{ textAlign: 'center', color: 'black' }}>
                <p><b>{lang === 'ar' ? c.nameAr : c.nameEn}</b></p>
                <button onClick={() => window.open(`https://www.google.com/maps?q=${c.lat},${c.lng}`)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', marginTop: '5px' }}>
                  Navigate
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
