import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

export const LanguageToggle = () => {
  const { lang, setLang, t } = useLanguage();

  return (
    <Button
      variant="outline"
      className="bg-background/80 backdrop-blur border-emerald-600/50 text-foreground hover:bg-emerald-600/20 px-4 h-12 rounded-full shadow-lg"
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
    >
      <span className="font-bold text-lg">{t('langToggle')}</span>
    </Button>
  );
};
