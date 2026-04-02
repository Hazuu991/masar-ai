import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { Camera } from '@/lib/masar-data';

interface CameraAlertProps {
  camera: Camera | null;
  distance: number | null;
}

export const CameraAlert = ({ camera, distance }: CameraAlertProps) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {camera && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[2000]"
        >
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-yellow-400 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-white text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl border-2 border-red-600">
                {camera.type === 'speed' ? camera.limit : '🔴'}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">{t('slowDown')}</span>
                <span className="text-xs opacity-90">{t('slowDownAr')}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black">{distance?.toFixed(0)}</span>
              <span className="text-xs font-bold">{t('meters')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
