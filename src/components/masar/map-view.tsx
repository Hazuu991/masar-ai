import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras, parkingZones } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';

const userIcon = L.divIcon({
  className: 'user-icon',
  html: `<div style="width:20px; height:20px; background:#3b82f6; border-radius:50%; border:2px solid white;"></div>`,
  iconSize: [20, 20],
});

const cameraIcon = L.divIcon({
  className: 'cam-icon',
  html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white;">📷</div>`,
  iconSize: [30, 30],
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center, map]);
  return null;
}

export const MapView = ({ userPos, showParking }: any) => {
  const { lang } = useLanguage();
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.4207, 50.0888]);
  const [query, setQuery] = useState('');

  const search = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}, Dammam`);
    const data = await res.json();
    if (data[0]) setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
  };

  return (
    <div className="h-full w-full relative">
      {/* FORCE VISIBLE SEARCH BAR */}
      <div className="fixed top-[140px] left-1/2 -translate-x-1/2 z-[99999] w-[90%]">
        <form onSubmit={search} className="flex bg-[#111827] border-2 border-emerald-500 rounded-xl overflow-hidden shadow-2xl">
          <input 
            className="flex-1 p-3 bg-transparent text-white outline-none"
            placeholder={lang === 'ar' ? 'بحث...' : 'Search...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="p-3 bg-emerald-500 text-black font-bold">GO</button>
        </form>
      </div>

      <MapContainer center={mapCenter} zoom={13} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapController center={mapCenter} />
        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />}
        {cameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={cameraIcon}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-black">{lang === 'ar' ? c.nameAr : c.nameEn}</p>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-xs"
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
