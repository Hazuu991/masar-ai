import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useLanguage } from '@/contexts/language-context';
import { toast } from 'sonner';
import { useMutation } from "convex/react";
import { api } from "@convex/api";
import { useGeolocation } from '@/hooks/use-geolocation';

const incidentTypes = [
  { id: 'jam', icon: '🚗', label: 'jam', labelAr: 'jamAr' },
  { id: 'accident', icon: '⚠️', label: 'accident', labelAr: 'accidentAr' },
  { id: 'roadblock', icon: '🚧', label: 'roadblock', labelAr: 'roadblockAr' },
  { id: 'debris', icon: '⚡', label: 'debris', labelAr: 'debrisAr' },
  { id: 'truck', icon: '🚛', label: 'truck', labelAr: 'truckAr' },
] as const;

export const ReportButton = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const { position } = useGeolocation();
  const createIncident = useMutation(api.incidents.create);

  const handleReport = async (type: string) => {
    if (!position) {
      toast.error(t('locationRequired'));
      return;
    }
    
    try {
      await createIncident({
        type,
        lat: position.lat,
        lng: position.lng
      });
      toast.success(t('reportSuccess'));
      setOpen(false);
    } catch (error) {
      toast.error(t('reportFailed'));
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-[0_0_30px_rgba(0,108,53,0.5)] bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center gap-1 border-4 border-white/20 z-[9999] transition-transform active:scale-90 pointer-events-auto"
        >
          <span className="text-3xl">⚠️</span>
          <div className="flex flex-col items-center -mt-1">
            <span className="text-[10px] font-bold leading-none uppercase tracking-tighter">Report</span>
            <span className="text-xs font-bold leading-none">بلغ</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-background border-t-emerald-600/30">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold text-center">
            {t('report')} / {t('reportAr')}
          </DrawerTitle>
          <DrawerDescription className="text-center">
            {lang === 'ar' ? 'اختر نوع البلاغ في موقعك الحالي' : 'Select incident type at your current location'}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4 p-6 overflow-y-auto max-h-[60vh]">
          {incidentTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="h-28 flex flex-col gap-2 rounded-2xl border-2 hover:border-emerald-600 hover:bg-emerald-600/10 transition-all group"
              onClick={() => handleReport(type.id)}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{type.icon}</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-sm leading-tight">{t(type.label as any)}</span>
                <span className="text-[10px] opacity-60 leading-tight">{t(type.labelAr as any)}</span>
              </div>
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost" className="rounded-full h-12">{t('close')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
