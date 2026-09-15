import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProjectsFromSheet } from '../lib/sheets';

const categories = ['All', 'UI/UX', 'Information Design', '3D'];

const fallbackProjectsUk = [
  {
    title: 'Rodowod',
    category: 'Information Design',
    role: 'Architect / Developer',
    year: '2023',
    description: 'Генеалогічний проєкт, створений за допомогою Google AI Studio. Інтеграція Google Sheets як бази даних та розгортання на Vercel.',
    image: 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=1200&h=800',
    link: 'https://rodowod.vercel.app/'
  },
  {
    title: 'Behance Collection',
    category: 'UI/UX',
    role: 'Lead Designer',
    year: '2024',
    description: 'Комплексні рішення для візуальних інтерфейсів: дашборди, лендинги та мобільні застосунки.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=800',
    link: 'https://www.behance.net/ivanselivanov'
  },
  {
    title: 'Spatial Typography',
    category: '3D',
    role: 'Creator',
    year: '2022',
    description: 'Дослідження кінетичної типографіки у тривимірному просторі за допомогою генеративних інструментів.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=800',
    link: '#'
  }
];

const fallbackProjectsEn = [
  {
    title: 'Rodowod',
    category: 'Information Design',
    role: 'Architect / Developer',
    year: '2023',
    description: 'A genealogical project created using Google AI Studio. Integrates Google Sheets as a database and deployed on Vercel.',
    image: 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=1200&h=800',
    link: 'https://rodowod.vercel.app/'
  },
  {
    title: 'Behance Collection',
    category: 'UI/UX',
    role: 'Lead Designer',
    year: '2024',
    description: 'Comprehensive solutions for visual interfaces: dashboards, landing pages, and mobile applications.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=800',
    link: 'https://www.behance.net/ivanselivanov'
  },
  {
    title: 'Spatial Typography',
    category: '3D',
    role: 'Creator',
    year: '2022',
    description: 'Exploration of kinetic typography in three-dimensional space using generative tools.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=800',
    link: '#'
  }
];

export function Projects() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [projectsData, setProjectsData] = useState<any[]>(language === 'uk' ? fallbackProjectsUk : fallbackProjectsEn);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProjects = async () => {
      const sheetProjects = await fetchProjectsFromSheet();
      if (sheetProjects.length > 0) {
        const mapped = sheetProjects
          .filter(p => p.title && p.title.trim() !== '')
          .map((p, i) => ({
          id: i.toString(),
          title: p.title,
          category: p.category,
          role: p.role,
          year: p.year,
          description: language === 'uk' ? p.descriptionUk : p.descriptionEn,
          image: p.image || "https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?auto=format&fit=crop&q=80&w=1200&h=800",
          link: p.link
        }));
        setProjectsData(mapped);
      } else {
        setProjectsData(language === 'uk' ? fallbackProjectsUk : fallbackProjectsEn);
      }
    };
    loadProjects();
  }, [language]);

  const filteredProjects = activeCategory === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeCategory);

  useEffect(() => {
    // Only apply horizontal scroll if we have a reasonable amount of projects
    // and if the viewport is large enough (skip on mobile for better UX)
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !scrollContainerRef.current) return;
      
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) return;

      const getScrollAmount = () => {
        let scrollWidth = scrollContainerRef.current!.scrollWidth;
        return -(scrollWidth - window.innerWidth + 100); // 100px padding
      };

      gsap.to(scrollContainerRef.current, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, [filteredProjects, language]);

  return (
    <section ref={sectionRef} id="work" className="py-32 relative z-10 border-t border-zinc-900 bg-[#050505] overflow-hidden">
      <div className="px-6 mb-24 md:pl-24 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white uppercase">
            {t('Projects_Title1', language === 'uk' ? 'Приклади' : 'Project')} <br/><span className="text-zinc-600">{t('Projects_Title2', language === 'uk' ? 'Проєктів' : 'Examples')}</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-mono text-xs uppercase tracking-widest border transition-all ${
                  activeCategory === cat 
                    ? 'border-[#00FF41] text-[#00FF41]' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex flex-col md:flex-row gap-12 md:pl-24 pr-24 w-max">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={`project-${index}-${project.title}`}
                className="group block relative border border-zinc-900 bg-black hover:border-zinc-700 transition-colors overflow-hidden w-full md:w-[600px] lg:w-[800px] h-[450px] lg:h-[550px] flex-shrink-0"
              >
                {/* Always visible cover image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                </div>

                {/* Informative overlapping panel */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 lg:p-8 gap-6 bg-black/85 backdrop-blur-md border border-zinc-800/80 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[#00FF41] font-mono text-sm">[{index + 1 < 10 ? `0${index + 1}` : index + 1}]</span>
                      <span className="text-zinc-400 font-mono text-xs uppercase tracking-widest">{project.category}</span>
                    </div>
                    <h3 className="text-2xl lg:text-4xl font-display font-bold text-white uppercase tracking-tight group-hover:text-[#00FF41] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex-1 lg:max-w-md w-full">
                    <p className="text-zinc-300 font-light leading-relaxed mb-5 text-sm lg:text-base">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                       <div className="flex gap-8 font-mono text-xs text-zinc-500">
                          <div>
                            <span className="block text-zinc-500 mb-1 uppercase text-[10px]">Role</span>
                            <span className="text-zinc-300">{project.role}</span>
                          </div>
                          <div>
                            <span className="block text-zinc-500 mb-1 uppercase text-[10px]">Year</span>
                            <span className="text-zinc-300">{project.year}</span>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center bg-black group-hover:bg-[#00FF41] group-hover:border-[#00FF41] group-hover:text-black transition-all">
                         <ExternalLink className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
