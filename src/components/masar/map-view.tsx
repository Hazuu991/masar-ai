import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cameras, parkingZones } from '@/lib/masar-data';
import { useLanguage } from '@/contexts/language-context';
import { useQuery } from "convex/react";
import { api } from "@convex/api";

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const cameraIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #DC2626; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">📷</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const incidentIcon = (type: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #C9A227; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">${
    type === 'jam' ? '🚗' : type === 'accident' ? '⚠️' : type === 'roadblock' ? '🚧' : type === 'debris' ? '⚡' : '🚛'
  }</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const userIcon = L.divIcon({
  className: 'user-location-pulse',
  html: `<div class="pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapViewProps {
  userPos: { lat: number; lng: number } | null;
  showParking: boolean;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

export const MapView = ({ userPos, showParking }: MapViewProps) => {
  const { lang, t } = useLanguage();
  const incidents = useQuery(api.incidents.get) || [];
  const dammamCenter: [number, number] = [26.4207, 50.0888];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={dammamCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {userPos && (
          <>
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />
            <MapUpdater center={[userPos.lat, userPos.lng]} />
          </>
        )}

        {/* Saher Cameras */}
        {cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.lat, camera.lng]}
            icon={cameraIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-center">
                <p className="font-bold">{lang === 'ar' ? camera.nameAr : camera.nameEn}</p>
                <p className="text-sm">
                  {camera.type === 'speed' ? t('speedCamera') : t('redLight')}
                  {camera.limit && ` - ${camera.limit} km/h`}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={[incident.lat, incident.lng]}
            icon={incidentIcon(incident.type)}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold">{t(incident.type as any)}</p>
                <p className="text-xs text-muted-foreground">{new Date(incident.timestamp).toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Parking Zones */}
        {showParking && parkingZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coords}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.4,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold">{lang === 'ar' ? zone.nameAr : zone.nameEn}</p>
                <p className="text-sm">{t('parking')}</p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .user-location-pulse .pulse {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
          animation: pulse 2s infinite;
          border: 2px solid white;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .leaflet-container {
          background: #0A0F14;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #1A1F26;
          color: white;
          border-radius: 8px;
        }
        .custom-popup .leaflet-popup-tip {
          background: #1A1F26;
        }
      `}} />
    </div>
  );
};
