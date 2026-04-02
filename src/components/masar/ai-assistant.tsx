import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Loader2 } from 'lucide-react';
import { aiKnowledge } from '@/lib/masar-data';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const AIAssistant = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: t('ai_a3') },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Mock AI response logic with localized knowledge
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let botResponse = lang === 'ar' 
        ? "أنا مساعد مسار الذكي. يمكنني مساعدتك في حركة المرور بالدمام، والمواقف، والطرق."
        : "I am Masar AI. I can help you with Dammam traffic, parking, and routes.";

      // Keyword matching
      const match = aiKnowledge.find(k => 
        k.keywords.some(kw => lowerText.includes(kw.toLowerCase()))
      );

      if (match) {
        botResponse = lang === 'ar' ? match.response.ar : match.response.en;
      } else {
        // Fallback to legacy translations if they exist and match
        if (lowerText.includes('park') || lowerText.includes('موقف')) botResponse = t('ai_a1');
        if (lowerText.includes('block') || lowerText.includes('طريق')) botResponse = t('ai_a2');
      }

      setMessages((prev) => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  const suggestions = aiKnowledge.map(k => ({
    text: lang === 'ar' ? k.question.ar : k.question.en,
    action: () => handleSend(lang === 'ar' ? k.question.ar : k.question.en)
  }));

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'right-8' : 'left-8'} z-[9999] pointer-events-auto`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="mb-4"
          >
            <Card className="w-80 h-[450px] flex flex-col shadow-2xl border-emerald-600/30 bg-background/95 backdrop-blur overflow-hidden">
              <CardHeader className="p-4 bg-emerald-600 text-white flex flex-row items-center justify-between space-y-0 shrink-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bot size={18} />
                  {t('chatTitle')}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-emerald-700 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4 pb-4">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            m.role === 'user'
                              ? 'bg-emerald-600 text-white rounded-tr-none'
                              : 'bg-muted text-foreground rounded-tl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-xs">{lang === 'ar' ? 'جاري الكتابة...' : 'Typing...'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-emerald-600/10 space-y-3 bg-muted/30">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={s.action}
                        disabled={isTyping}
                        className="whitespace-nowrap text-[10px] bg-background hover:bg-emerald-600 hover:text-white transition-colors text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-600/20 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('chatPlaceholder')}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                      disabled={isTyping}
                      className="rounded-full h-10 text-sm focus-visible:ring-emerald-600 bg-background"
                    />
                    <Button
                      size="icon"
                      disabled={isTyping || !input.trim()}
                      className="rounded-full h-10 w-10 bg-emerald-600 hover:bg-emerald-700 shrink-0"
                      onClick={() => handleSend(input)}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className={`w-14 h-14 rounded-full shadow-lg transition-all ${
          isOpen ? 'scale-0' : 'scale-100'
        } bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-white/20`}
        onClick={() => setIsOpen(true)}
      >
        <Bot size={28} />
      </Button>
    </div>
  );
};
