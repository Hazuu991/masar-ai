import { useState, useEffect } from 'react';
import { MapView } from '@/components/masar/map-view';
import { ReportButton } from '@/components/masar/report-button';
import { ParkingLayerToggle } from '@/components/masar/parking-layer';
import { CameraAlert } from '@/components/masar/camera-alert';
import { LanguageToggle } from '@/components/masar/language-toggle';
import { AIAssistant } from '@/components/masar/ai-assistant';
import { useGeolocation } from '@/hooks/use-geolocation';
import { cameras, Camera } from '@/lib/masar-data';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';

function HomePageContent() {
  const { position, calculateDistance } = useGeolocation();
  const { t } = useLanguage();
  const [showParking, setShowParking] = useState(false);
  const [activeCamera, setActiveCamera] = useState<Camera | null>(null);
  const [cameraDistance, setCameraDistance] = useState<number | null>(null);

  useEffect(() => {
    if (position) {
      let closestCamera: Camera | null = null;
      let minDistance = Infinity;

      cameras.forEach((camera) => {
        const dist = calculateDistance(position.lat, position.lng, camera.lat, camera.lng);
        if (dist < 500 && dist < minDistance) {
          closestCamera = camera;
          minDistance = dist;
        }
      });

      if (closestCamera) {
        setActiveCamera(closestCamera);
        setCameraDistance(minDistance);
      } else {
        setActiveCamera(null);
        setCameraDistance(null);
      }
    }
  }, [position, calculateDistance]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Map View */}
      <MapView
        userPos={position}
        showParking={showParking}
      />

      {/* Overlays */}
      <CameraAlert camera={activeCamera} distance={cameraDistance} />

      <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
        <ParkingLayerToggle enabled={showParking} onToggle={setShowParking} />
      </div>

      <div className="fixed top-4 right-4 z-[9999]">
        <LanguageToggle />
      </div>

      <ReportButton />

      <AIAssistant />

      {/* Legend Overlay for Parking (conditional) */}
      {showParking && (
        <div className="fixed top-24 left-4 z-[9999] bg-background/80 backdrop-blur p-2 rounded-xl text-[10px] space-y-1 shadow-lg border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#22c55e]" /> <span>{t('parking')} (Free)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#3b82f6]" /> <span>{t('parking')} (Paid)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#ef4444]" /> <span>{t('parking')} (No)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
