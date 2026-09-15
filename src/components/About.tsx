import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchGeneralDataFromSheet, SheetGeneralData } from '../lib/sheets';

const defaultResearchUk = [
  { year: '01', title: 'Вебдизайн', type: 'Дисципліна' },
  { year: '02', title: "Основи проєктної та комп'ютерної графіки", type: 'Дисципліна' },
  { year: '03', title: 'Теорія та методика досліджень візуальних комунікацій', type: 'Дисципліна' }
];

const defaultResearchEn = [
  { year: '01', title: 'Web Design', type: 'Discipline' },
  { year: '02', title: 'Fundamentals of Project and Computer Graphics', type: 'Discipline' },
  { year: '03', title: 'Theory and Methodology of Visual Communications Research', type: 'Discipline' }
];

const tags = ['UI/UX', 'Data Visualization', 'Typography', 'Academic Research', 'Spatial Design', 'Semiotics'];

export function About() {
  const { language, t } = useLanguage();
  const [researchData, setResearchData] = useState<any[]>([]);
  const [generalData, setGeneralData] = useState<SheetGeneralData | null>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && data.sheet1 && data.sheet1.length > 1) {
          const parsed = data.sheet1.slice(1).map((row: any) => ({
            year: row[0] || '00',
            titleUk: row[1] || '',
            typeUk: row[2] || 'Дисципліна',
            titleEn: row[3] || '',
            typeEn: row[4] || 'Discipline'
          }));
          setResearchData(parsed);
        }
      })
      .catch(console.error);

    fetchGeneralDataFromSheet().then(data => {
      if (data) setGeneralData(data);
    });
  }, []);

  useEffect(() => {
    // Dynamic font-weight based on scroll velocity (Kinetic Typography)
    let animationFrameId: number;
    
    const updateWeight = () => {
      if (manifestoRef.current) {
        const velocity = Math.abs(ScrollTrigger.getVelocity());
        const mappedWeight = gsap.utils.clamp(300, 800, 300 + velocity * 0.15);
        
        gsap.to(manifestoRef.current, {
          fontWeight: mappedWeight,
          duration: 0.2, // slight ease back to normal
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    };

    ScrollTrigger.addEventListener("scroll", updateWeight);
    return () => {
      ScrollTrigger.removeEventListener("scroll", updateWeight);
    };
  }, []);

  const displayData = researchData.length > 0 
    ? researchData.map(item => ({
        year: item.year,
        title: language === 'uk' ? item.titleUk : item.titleEn,
        type: language === 'uk' ? item.typeUk : item.typeEn
      }))
    : (language === 'uk' ? defaultResearchUk : defaultResearchEn);

  return (
    <section id="about" className="py-32 relative z-10 border-t border-zinc-900 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Philosophy Block - Asymmetrical */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-40">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-[0.2em] mb-8">
              [ {t('About_PhilosophyTitle', language === 'uk' ? 'Філософія' : 'Philosophy')} ]
            </h2>
            {/* Photo Placeholder */}
            <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[3/4] border border-zinc-900 bg-[#0a0a0a] overflow-hidden group">
              <img 
                src={generalData?.photoUrl || "https://lh3.googleusercontent.com/d/1vI5mRWlvqarUewlt53S36TNPEqbzJXs0"} 
                alt="Portrait Placeholder" 
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-zinc-800 px-3 py-1 font-mono text-[10px] text-zinc-400 uppercase tracking-widest z-10">
                [ {generalData?.photoUrl ? 'Portrait.jpg' : 'Photo_Placeholder.jpg'} ]
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 lg:pl-16">
            <motion.p 
              ref={manifestoRef}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-2xl md:text-4xl lg:text-5xl font-display font-light leading-[1.2] tracking-tight text-white mb-16"
            >
              {t('About_Manifesto', language === 'uk' ? 'Дизайн для мене — це створення комплексного мультимедійного досвіду. Я проєктую сучасні вебрішення та цифрові продукти, де продумана візуальна естетика поєднується з передовими технологіями для максимально інтуїтивної взаємодії.' : 'For me, design is about creating a comprehensive multimedia experience. I engineer modern web solutions and digital products where thoughtful visual aesthetics combine with advanced technologies for highly intuitive interaction.')}
            </motion.p>

            {/* Scrolling Ticker (simplified for now, using wrap) */}
            <div className="flex flex-wrap gap-4">
              {tags.map((tag, i) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-6 py-3 border border-zinc-800 rounded-full font-mono text-xs uppercase text-zinc-400 tracking-widest hover:border-[#00FF41] hover:text-[#00FF41] transition-colors"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

         {/* Research & Academia Block - Strict List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 pt-32 border-t border-zinc-900">
          <div className="lg:col-span-5 pr-8">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight mix-blend-difference mb-6 break-words text-white">
                {t('About_ResearchTitle', language === 'uk' ? 'Викладання' : 'Teaching')}
             </h2>
             <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-sm">
              {t('About_ResearchDesc', language === 'uk' ? 'Академічна практика та викладання є фундаментальною частиною мого підходу до концептуального та практичного дизайну.' : 'Academic practice and teaching are a fundamental part of my approach to conceptual and practical design.')}
             </p>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            {displayData.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-zinc-800 hover:border-[#00FF41] transition-colors cursor-crosshair"
              >
                <div className="flex items-baseline gap-8 mb-4 md:mb-0">
                  <span className="font-mono text-zinc-600 text-sm group-hover:text-[#00FF41] transition-colors">{item.year}</span>
                  <h3 className="text-xl md:text-2xl font-light text-zinc-300 group-hover:text-white transition-colors">{item.title}</h3>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full group-hover:border-[#00FF41] transition-colors">
                  {item.type}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
