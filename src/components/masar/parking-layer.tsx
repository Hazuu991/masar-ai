import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';

interface ParkingLayerToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ParkingLayerToggle = ({ enabled, onToggle }: ParkingLayerToggleProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 bg-background/80 backdrop-blur p-3 rounded-2xl border border-emerald-600/30 shadow-lg select-none">
      <Switch
        id="parking-assistant"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-emerald-600"
      />
      <Label
        htmlFor="parking-assistant"
        className="flex flex-col cursor-pointer text-foreground"
      >
        <span className="font-bold text-sm leading-tight">{t('parking')}</span>
        <span className="text-[10px] opacity-60 leading-tight">{t('parkingAr')}</span>
      </Label>
    </div>
  );
};
