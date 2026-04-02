import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';

const cameraIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white;">📷</div>`,
  iconSize: [30, 30],
});

// This small component handles the actual "flying" to the new location
function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, 15, { duration: 1.5 });
  }
  return null;
}

export const MapView = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [center, setCenter] = useState<[number, number]>([26.4207, 50.0888]);

  const handleSearch = async (e?: any) => {
    if (e) e.preventDefault();
    if (!query) return;

    try {
      // Adding "Dammam" to the search to keep results local
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Dammam, Saudi Arabia`);
      const data = await res.json();
      if (data && data[0]) {
        setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="h-full w-full relative bg-[#0A0F14]">
      {/* SEARCH BAR - Using pointer-events-auto to ensure clicks work */}
      <div 
        className="fixed left-1/2 -translate-x-1/2 w-[90%] max-w-md"
        style={{ top: '140px', zIndex: 99999, pointerEvents: 'auto' }}
      >
        <form 
          onSubmit={handleSearch}
          className="flex bg-[#111827] border-2 border-[#10b981] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
        >
          <input 
            className="flex-1 p-4 bg-transparent text-white outline-none text-base"
            placeholder={lang === 'ar' ? 'بحث في الدمام...' : 'Search Dammam...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            type="button" // Changed to button type to manually trigger handleSearch
            onClick={handleSearch}
            className="p-4 bg-[#10b981] text-[#0A0F14] font-black active:bg-emerald-400 transition-colors"
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
        
        {/* The "Fly" logic */}
        <FlyToLocation center={center} />

        {cameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cameraIcon}>
            <Popup>
              <div className="text-center text-black">
                <p className="font-bold">{lang === 'ar' ? c.nameAr : c.nameEn}</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`)}
                  className="mt-2 bg-[#10b981] text-white px-4 py-2 rounded-lg text-xs font-bold"
                >
                  {lang === 'ar' ? 'اتجه الآن' : 'Navigate'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
