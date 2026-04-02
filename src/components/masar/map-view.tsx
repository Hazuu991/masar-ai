import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras, parkingZones } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';
import { useQuery } from "convex/react";
// Fixed API path for Netlify/GitHub structure
import { api } from "../../../convex/_generated/api";

const userIcon = L.divIcon({
  className: 'user-location-pulse',
  html: `<div style="width:20px; height:20px; background:#3b82f6; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const cameraIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #DC2626; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">📷</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export const MapView = ({ userPos, showParking }: any) => {
  const { lang, t } = useLanguage();
  // We use a try/catch or fallback because convex might not be fully linked yet
  const incidents = useQuery(api.incidents.get) || [];
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.4207, 50.0888]);
  const [zoom, setZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}, Dammam, Saudi Arabia`);
      const data = await res.json();
      if (data && data[0]) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setZoom(16);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const getDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="h-full w-full relative bg-[#0A0F14]">
      {/* FIXED SEARCH BAR: Lowered top and forced z-index */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md">
        <form onSubmit={handleSearch} className="flex items-center bg-[#111827]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden">
          <input 
            type="text"
            className="flex-1 p-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
            placeholder={lang === 'ar' ? 'البحث عن موقع...' : 'Search Dammam...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="p-4 text-emerald-400 hover:text-emerald-300">
            🔍
          </button>
        </form>
      </div>

      <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full" zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapController center={mapCenter} zoom={zoom} />

        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />}

        {cameras.map((camera) => (
          <Marker key={camera.id} position={[camera.lat, camera.lng]} icon={cameraIcon}>
            <Popup>
              <div className="p-2 text-center min-w-[120px] text-black">
                <h3 className="font-bold">{lang === 'ar' ? camera.nameAr : camera.nameEn}</h3>
                <button 
                  onClick={() => getDirections(camera.lat, camera.lng)}
                  className="mt-2 w-full bg-emerald-600 text-white py-1 px-2 rounded-lg text-xs"
                >
                  🚗 {lang === 'ar' ? 'إظهار الطريق' : 'Directions'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {showParking && parkingZones.map((zone: any) => (
          <Polygon key={zone.id} positions={zone.coords} pathOptions={{ color: zone.color, fillOpacity: 0.4 }}>
            <Popup>
               <div className="p-2 text-center text-black">
                 <p className="font-bold">{lang === 'ar' ? zone.nameAr : zone.nameEn}</p>
                 <button onClick={() => getDirections(zone.coords[0][0], zone.coords[0][1])} className="text-blue-600 underline text-xs">Navigate</button>
               </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};
