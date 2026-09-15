import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
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

// Reusable Spatial Card Component
const SpatialProjectCard = ({ project, index, total, radius, hoveredIndex, setHoveredIndex, onClick }: any) => {
  const angle = index * (360 / total);
  const isHovered = hoveredIndex === index;
  const isBlurry = hoveredIndex !== null && !isHovered;

  // Local magnetic tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredIndex(null);
  };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[280px] md:w-[450px] lg:w-[600px] h-[400px] md:h-[600px] lg:h-[700px] -ml-[140px] md:-ml-[225px] lg:-ml-[300px] -mt-[200px] md:-mt-[300px] lg:-mt-[350px]"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
        zIndex: isHovered ? 50 : 1
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => onClick(e, project)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          z: isHovered ? 50 : 0,
          opacity: isBlurry ? 0.3 : 1,
          filter: isBlurry ? 'blur(8px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.4 }}
        className="w-full h-full relative cursor-none group"
      >
        {/* Glass Refraction Shell */}
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md border border-white/10 overflow-hidden rounded-sm transition-all duration-500 group-hover:border-white/30 group-hover:bg-zinc-900/60 shadow-2xl">
          <motion.img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            style={{ translateZ: -20 }}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
          />
          {/* Chromatic overlay trick */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-red-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
        </div>

        {/* Cinematic Content Layer */}
        <motion.div
          style={{ translateZ: 50 }}
          className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end pointer-events-none"
        >
          <div className="overflow-hidden mb-2">
            <h3 className="text-3xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] shadow-black drop-shadow-lg">
              {project.title}
            </h3>
          </div>
          
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[0.16,1,0.3,1]">
            <div className="overflow-hidden flex flex-col justify-end">
              <div className="pt-4 border-t border-white/20 mt-4 flex justify-between items-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="font-mono text-xs text-zinc-300 uppercase w-2/3">
                  <p className="text-[#00FF41] mb-2">[{project.category}]</p>
                  <p className="line-clamp-3 leading-relaxed normal-case font-sans tracking-wide text-sm text-zinc-400">{project.description}</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export function Projects() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [projectsData, setProjectsData] = useState<any[]>(language === 'uk' ? fallbackProjectsUk : fallbackProjectsEn);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedProject, setClickedProject] = useState<any | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Global scene magnetic tilt
  const sceneMouseX = useMotionValue(0);
  const sceneMouseY = useMotionValue(0);
  const sceneRotateX = useSpring(useTransform(sceneMouseY, [0, 1], [5, -5]), { stiffness: 100, damping: 40 });
  const sceneRotateY = useSpring(useTransform(sceneMouseX, [0, 1], [-10, 10]), { stiffness: 100, damping: 40 });

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
    const handleGlobalMouseMove = (e: MouseEvent) => {
      sceneMouseX.set(e.clientX / window.innerWidth);
      sceneMouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !carouselRef.current || !titleRef.current) return;
      
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      
      // Momentum Physics 3D Scroll
      gsap.to(carouselRef.current, {
        rotationY: -360 * 2, // 2 full spins
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 1.2, // Momentum / friction feel
          onUpdate: (self) => {
            // Fluid Kinetic Typography based on scroll velocity
            const velocity = Math.abs(self.getVelocity());
            const skewAmount = Math.min(velocity / 50, 15);
            const blurAmount = Math.min(velocity / 150, 8);
            
            gsap.to(titleRef.current, {
              skewX: self.direction === 1 ? -skewAmount : skewAmount,
              filter: `blur(${blurAmount}px)`,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto"
            });
          }
        }
      });
    });

    return () => ctx.revert();
  }, [filteredProjects, language]);

  const handleProjectClick = (e: React.MouseEvent, project: any) => {
    e.preventDefault();
    setClickedProject(project);
  };

  // Math for cylinder radius
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const radius = Math.max(isMobile ? 350 : 700, (filteredProjects.length * (isMobile ? 300 : 600)) / (2 * Math.PI));

  return (
    <section ref={sectionRef} id="work" className="h-screen w-full relative z-10 border-t border-zinc-900 bg-[#050505] overflow-hidden flex flex-col justify-center perspective-[2000px]">
      
      {/* Dynamic Header */}
      <div className="absolute top-12 left-6 md:left-24 z-40 max-w-7xl w-full pointer-events-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 w-full pr-12 md:pr-48">
          <h2 ref={titleRef} className="text-4xl md:text-7xl font-display font-black tracking-tighter text-white uppercase origin-left transform-gpu will-change-transform">
            {t('Projects_Title1', language === 'uk' ? 'Приклади' : 'Project')} <br/>
            <span className="text-zinc-600 block -mt-2">{t('Projects_Title2', language === 'uk' ? 'Проєктів' : 'Examples')}</span>
          </h2>
          
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-mono text-[10px] md:text-xs uppercase tracking-widest border transition-all ${
                  activeCategory === cat 
                    ? 'border-[#00FF41] text-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Spatial Carousel */}
      <motion.div 
        className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ rotateX: sceneRotateX, rotateY: sceneRotateY, transformStyle: "preserve-3d" }}
      >
        <div ref={carouselRef} className="w-full h-full relative pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
          {filteredProjects.map((project, index) => (
            <SpatialProjectCard
              key={`proj-${project.title}-${index}`}
              project={project}
              index={index}
              total={filteredProjects.length}
              radius={radius}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      </motion.div>

      {/* Dive-In Portal Overlay */}
      <AnimatePresence>
        {clickedProject && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 overflow-hidden"
          >
            <motion.img 
              initial={{ scale: 1.2, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={clickedProject.image}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous" 
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />
            
            <div className="relative z-10 text-center flex flex-col items-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter mb-4 shadow-2xl drop-shadow-2xl">
                  {clickedProject.title}
                </h2>
                <p className="text-[#00FF41] font-mono tracking-widest uppercase mb-12 text-sm animate-pulse">
                  [ Establishing connection... ]
                </p>
                <div className="w-64 h-[2px] bg-zinc-900 mx-auto overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    onAnimationComplete={() => {
                      if (clickedProject.link !== '#') {
                        window.open(clickedProject.link, "_blank");
                      }
                      setTimeout(() => setClickedProject(null), 800);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
