import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';

// Simple icon fix
const cameraIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">📷</div>`,
  iconSize: [30, 30],
});

// Component to handle moving the map
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
}

export const MapView = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([26.4207, 50.0888]);

  const handleSearch = async (e: any) => {
    if (e) e.preventDefault();
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Dammam, Saudi Arabia`);
      const data = await res.json();
      if (data && data[0]) {
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: '#0A0F14' }}>
      {/* SEARCH BAR - Using direct styles to avoid CSS conflicts */}
      <div style={{ position: 'fixed', top: '140px', left: '5%', width: '90%', zIndex: 9999, pointerEvents: 'auto' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', background: '#111827', border: '2px solid #10b981', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
          <input 
            style={{ flex: 1, padding: '15px', background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '16px' }}
            placeholder={lang === 'ar' ? 'بحث...' : 'Search Dammam...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="button" 
            onClick={handleSearch}
            style={{ padding: '0 20px', background: '#10b981', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            GO
          </button>
        </form>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <ChangeView center={center} />
        
        {cameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cameraIcon}>
            <Popup>
              <div style={{ textAlign: 'center', color: '#000' }}>
                <p><b>{lang === 'ar' ? c.nameAr : c.nameEn}</b></p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`)}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', marginTop: '5px', fontWeight: 'bold' }}
                >
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
