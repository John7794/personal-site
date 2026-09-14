import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const { language } = useLanguage();
  const [researchData, setResearchData] = useState<any[]>([]);
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

  const t = language === 'uk' ? {
    philosophyTitle: "Філософія",
    manifesto: "Дизайн для мене — це створення комплексного мультимедійного досвіду. Я проєктую сучасні вебрішення та цифрові продукти, де продумана візуальна естетика поєднується з передовими технологіями для максимально інтуїтивної взаємодії.",
    researchTitle1: "Дослідження",
    researchTitle2: "Та Академія",
    researchDesc: "Академічна практика та викладання є фундаментальною частиною мого підходу до комерційного дизайну.",
  } : {
    philosophyTitle: "Philosophy",
    manifesto: "For me, design is about creating a comprehensive multimedia experience. I engineer modern web solutions and digital products where thoughtful visual aesthetics combine with advanced technologies for highly intuitive interaction.",
    researchTitle1: "Research",
    researchTitle2: "& Academia",
    researchDesc: "Academic practice and teaching are a fundamental part of my approach to commercial design.",
  };

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
              [ {t.philosophyTitle} ]
            </h2>
            <div className="hidden lg:flex relative w-full aspect-square border border-zinc-900 p-6 rounded-full items-center justify-center bg-black/40 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full relative flex items-center justify-center">
                
                {/* Static Rings */}
                <div className="absolute inset-0 border border-zinc-700/30 rounded-full border-dashed pointer-events-none"></div>
                <div className="absolute inset-[20%] border border-zinc-800/60 rounded-full pointer-events-none"></div>
                <div className="absolute inset-[40%] border border-zinc-800/40 rounded-full border-dotted pointer-events-none"></div>

                {/* Rotating Sweep and Line */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                >
                   {/* Conic sweep trail */}
                   <div 
                     className="absolute inset-0 rounded-full opacity-60"
                     style={{
                       background: 'conic-gradient(from 90deg at 50% 50%, transparent 50%, rgba(0, 255, 65, 0.05) 80%, rgba(0, 255, 65, 0.4) 100%)'
                     }}
                   />
                   {/* Radar line */}
                   <div className="absolute top-1/2 right-0 w-1/2 h-px bg-[#00FF41] transform -translate-y-1/2 origin-left shadow-[0_0_12px_#00FF41]"></div>
                </motion.div>

                {/* Radar Blips (Targets) */}
                <motion.div 
                  className="absolute top-[30%] left-[65%] w-1.5 h-1.5 bg-[#00FF41] rounded-full shadow-[0_0_8px_#00FF41]"
                  animate={{ opacity: [0, 1, 0, 0] }}
                  transition={{ duration: 8, repeat: Infinity, times: [0, 0.05, 0.3, 1], delay: 1.5 }}
                />
                <motion.div 
                  className="absolute top-[65%] left-[25%] w-1 h-1 bg-[#00FF41] rounded-full shadow-[0_0_8px_#00FF41]"
                  animate={{ opacity: [0, 1, 0, 0] }}
                  transition={{ duration: 8, repeat: Infinity, times: [0, 0.05, 0.3, 1], delay: 5.5 }}
                />

                {/* Center Core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#00FF41] rounded-full z-10 shadow-[0_0_15px_#00FF41]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-[#00FF41]/30 rounded-full z-10"></div>
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
              {t.manifesto}
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
        <div className="pt-32 border-t border-zinc-900">
           <div className="mb-16">
             <h2 className="text-[10vw] md:text-[12vw] leading-[0.85] font-display font-black uppercase tracking-tighter mix-blend-difference">
                <span className="text-white block">{t.researchTitle1}</span>
                <span className="text-zinc-600 block md:-mt-4">{t.researchTitle2}</span>
             </h2>
             <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-sm mt-8">
              {t.researchDesc}
             </p>
           </div>

          <div className="flex flex-col">
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
