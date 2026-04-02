import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras, parkingZones } from '../../lib/masar-data';
import { useLanguage } from '../../contexts/language-context';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const userIcon = L.divIcon({
  className: 'user-location-pulse',
  html: `<div style="width:22px; height:22px; background:#3b82f6; border-radius:50%; border:2px solid white; box-shadow: 0 0 15px rgba(59,130,246,0.6);"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const cameraIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 34px; height: 34px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">📷</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
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
    <div className="h-full w-full relative">
      {/* SEARCH BAR FIX: 
          - Used top-32 to move it well below the "Parking Assistant" box.
          - Added z-[9999] AND !important styling logic.
      */}
      <div 
        className="fixed left-1/2 -translate-x-1/2 w-[90%] max-w-md"
        style={{ top: '130px', zIndex: 99999 }}
      >
        <form onSubmit={handleSearch} className="flex items-center bg-[#111827] border-2 border-emerald-500/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
          <input 
            type="text"
            className="flex-1 p-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
            placeholder={lang === 'ar' ? 'بحث في الدمام...' : 'Search Dammam...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="p-4 bg-emerald-600/20 text-emerald-400 border-l border-emerald-500/30">
            🔍
          </button>
        </form>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        className="h-full w-full" 
        zoomControl={false}
        style={{ height: '100vh', width: '100vw', background: '#0A0F14' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapController center={mapCenter} zoom={zoom} />

        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />}

        {cameras.map((camera) => (
          <Marker key={camera.id} position={[camera.lat, camera.lng]} icon={cameraIcon}>
            <Popup>
              <div className="p-2 text-center text-black min-w-[140px]">
                <h3 className="font-bold text-sm mb-2">{lang === 'ar' ? camera.nameAr : camera.nameEn}</h3>
                <button 
                  onClick={() => getDirections(camera.lat, camera.lng)}
                  className="w-full bg-emerald-600 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-md"
                >
                  🚗 {lang === 'ar' ? 'اتجه إلى هنا' : 'Navigate'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {showParking && parkingZones.map((zone: any) => (
          <Polygon key={zone.id} positions={zone.coords} pathOptions={{ color: zone.color, fillOpacity: 0.5, weight: 3 }}>
            <Popup>
               <div className="p-2 text-center text-black">
                 <p className="font-bold mb-1">{lang === 'ar' ? zone.nameAr : zone.nameEn}</p>
                 <button 
                    onClick={() => getDirections(zone.coords[0][0], zone.coords[0][1])} 
                    className="text-emerald-700 font-bold underline text-xs"
                  >
                    Go to Zone
                  </button>
               </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};
