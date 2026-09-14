import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export function Contact() {
  const { language } = useLanguage();
  
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const t = language === 'uk' ? {
    cta: "ТВОРІМО",
    cta2: "МАЙБУТНЄ",
    available: "Відкритий до нових викликів та колаборацій",
    email: "Написати",
    cv: "Резюме Work.ua",
    behance: "Behance",
    localTime: "Локальний час (Львів)",
    copyright: "Designed with semantic precision."
  } : {
    cta: "SHAPING",
    cta2: "THE FUTURE",
    available: "Open for new challenges and collaborations",
    email: "Send Email",
    cv: "Work.ua CV",
    behance: "Behance",
    localTime: "Local Time (Lviv)",
    copyright: "Designed with semantic precision."
  };

  return (
    <section id="contact" className="relative z-10 bg-[#00FF41] text-black overflow-hidden">
      <div className="w-full flex flex-col justify-between min-h-screen p-6 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mt-24">
          <div className="max-w-md">
            <h3 className="font-mono text-sm uppercase tracking-widest font-bold mb-4">[ STATUS ]</h3>
            <p className="text-xl md:text-2xl font-light leading-snug">
              {t.available}
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <a href="mailto:www.johnsel771994@gmail.com" className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t.email}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
            <a href="https://www.work.ua/jobseeker/my/resumes/edit/?id=5394846" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t.cv}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
            <a href="https://www.behance.net/ivanselivanov" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-12 border-b border-black pb-4 hover:pl-4 transition-all text-xl font-bold uppercase">
              {t.behance}
              <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-32 relative">
           <img src="/logo.png" alt="IS Logo" className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 absolute -top-16 right-0 mix-blend-difference" />
           <h2 className="text-[10vw] leading-[0.85] font-display font-black uppercase tracking-tighter break-words">
             {t.cta} <br/> {t.cta2}
           </h2>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-6 font-mono text-xs uppercase tracking-widest font-bold">
           <div>
             <span className="block opacity-50 mb-1">{t.localTime}</span>
             {time.toLocaleTimeString('uk-UA', { timeZone: 'Europe/Kyiv' })}
           </div>
           <div>
             <span className="block opacity-50 mb-1">© {new Date().getFullYear()} IVAN SELIVANOV</span>
             {t.copyright}
           </div>
        </div>

      </div>
    </section>
  );
}
