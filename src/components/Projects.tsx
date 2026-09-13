import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categories = ['All', 'UI/UX', 'Information Design', '3D'];

const projectsUk = [
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

const projectsEn = [
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
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const t = language === 'uk' ? {
    titleWork: "Архітектура ",
    titleHighlight: "Проєктів",
  } : {
    titleWork: "Project ",
    titleHighlight: "Architecture",
  };

  const projectsData = language === 'uk' ? projectsUk : projectsEn;
  const filteredProjects = activeCategory === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="py-32 relative z-10 border-t border-zinc-900 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white uppercase">
            {t.titleWork} <br/><span className="text-zinc-600">{t.titleHighlight}</span>
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

        <div className="space-y-12">
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
                key={project.title}
                className="group block relative border border-zinc-900 bg-black hover:border-zinc-700 transition-colors overflow-hidden"
              >
                {/* Background Image that appears on hover */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <img src={project.image} alt="" className="w-full h-full object-cover grayscale" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between p-8 lg:p-12 gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[#00FF41] font-mono text-sm">[{index + 1 < 10 ? `0${index + 1}` : index + 1}]</span>
                      <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{project.category}</span>
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-display font-bold text-white uppercase tracking-tight group-hover:text-[#00FF41] transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex-1 lg:max-w-md w-full">
                    <p className="text-zinc-400 font-light leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                       <div className="flex gap-8 font-mono text-xs text-zinc-500">
                          <div>
                            <span className="block text-zinc-600 mb-1 uppercase">Role</span>
                            <span className="text-zinc-300">{project.role}</span>
                          </div>
                          <div>
                            <span className="block text-zinc-600 mb-1 uppercase">Year</span>
                            <span className="text-zinc-300">{project.year}</span>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-[#00FF41] group-hover:border-[#00FF41] group-hover:text-black transition-all">
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
