import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchGeneralDataFromSheet, SheetGeneralData } from '../lib/sheets';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  generalData: SheetGeneralData | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uk');
  const [generalData, setGeneralData] = useState<SheetGeneralData | null>(null);

  useEffect(() => {
    fetchGeneralDataFromSheet().then(data => {
      if (data) setGeneralData(data);
    });
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'uk' ? 'en' : 'uk');
  };

  const t = (key: string, fallback: string = '') => {
    if (generalData?.translations?.[key]) {
      return generalData.translations[key][language] || fallback;
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, generalData }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
