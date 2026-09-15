import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { fetchGeneralDataFromSheet, SheetGeneralData } from '../lib/sheets';

export function Contact() {
  const { language, t } = useLanguage();
  const [generalData, setGeneralData] = useState<SheetGeneralData | null>(null);
  
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    fetchGeneralDataFromSheet().then(data => {
      if (data) setGeneralData(data);
    });
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contact" className="relative z-10 bg-[#00FF41] text-black overflow-hidden">
      <div className="w-full flex flex-col justify-between min-h-screen p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-24">
          <div className="max-w-md">
            <h3 className="font-mono text-sm uppercase tracking-widest font-bold mb-4">[ STATUS ]</h3>
            <p className="text-xl md:text-2xl font-light leading-snug">
              {t('Contact_Available', language === 'uk' ? 'Відкритий до нових викликів та колаборацій' : 'Open for new challenges and collaborations')}
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <a href={`mailto:${generalData?.email || 'www.johnsel771994@gmail.com'}`} className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t('Contact_Email', language === 'uk' ? 'Написати' : 'Send Email')}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
            <a href="https://www.work.ua/jobseeker/my/resumes/edit/?id=5394846" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t('Contact_CV', language === 'uk' ? 'Резюме Work.ua' : 'Work.ua CV')}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
            <a href={generalData?.linkedin || "https://www.behance.net/ivanselivanov"} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t('Contact_Behance', language === 'uk' ? 'Behance' : 'Behance')}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-32 relative">
           <img src="/logo.png" alt="IS Logo" className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 absolute -top-16 right-0 mix-blend-difference" />
           <h2 className="text-[10vw] leading-[0.85] font-display font-black uppercase tracking-tighter break-words">
             {t('Contact_CTA1', language === 'uk' ? 'ТВОРІМО' : 'SHAPING')} <br/> {t('Contact_CTA2', language === 'uk' ? 'МАЙБУТНЄ' : 'THE FUTURE')}
           </h2>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-6 font-mono text-xs uppercase tracking-widest font-bold">
           <div>
             <span className="block opacity-50 mb-1">{t('Contact_LocalTime', language === 'uk' ? 'Локальний час (Львів)' : 'Local Time (Lviv)')}</span>
             {time.toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv' })}
           </div>
           <div>
             <span className="block opacity-50 mb-1">© {new Date().getFullYear()} IVAN SELIVANOV</span>
             {t('Contact_Copyright', 'Designed with semantic precision.')}
           </div>
        </div>

      </div>
    </section>
  );
}
