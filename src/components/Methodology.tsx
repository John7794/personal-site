import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const stepsUk = [
  { step: '01', title: 'Аналіз даних', desc: 'Збір, декомпозиція та первинне структурування інформаційного хаосу.' },
  { step: '02', title: 'Семіотичне моделювання', desc: 'Пошук візуальних метафор та створення системи знаків для майбутнього продукту.' },
  { step: '03', title: 'Проєктування логіки', desc: 'Створення wireframes та архітектури користувацького досвіду (UX).' },
  { step: '04', title: 'Візуальна форма', desc: 'Імплементація UI, типографіки, сіток та інтерактивних анімацій.' },
  { step: '05', title: 'Реалізація', desc: 'Підготовка асетів, верстка, налаштування аналітики та запуск.' }
];

const stepsEn = [
  { step: '01', title: 'Data Analysis', desc: 'Collection, decomposition, and initial structuring of information chaos.' },
  { step: '02', title: 'Semiotic Modeling', desc: 'Searching for visual metaphors and creating a sign system for the future product.' },
  { step: '03', title: 'Logic Design', desc: 'Creating wireframes and user experience architecture (UX).' },
  { step: '04', title: 'Visual Form', desc: 'Implementation of UI, typography, grids, and interactive animations.' },
  { step: '05', title: 'Implementation', desc: 'Preparation of assets, coding, analytics setup, and launch.' }
];

export function Methodology() {
  const { language } = useLanguage();
  const stepsData = language === 'uk' ? stepsUk : stepsEn;
  const title = language === 'uk' ? 'Методологія' : 'Methodology';

  return (
    <section className="py-32 relative z-10 border-t border-zinc-900 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-24">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {stepsData.map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col group"
            >
              <div className="text-[#00FF41] font-mono text-xl mb-4 group-hover:-translate-y-2 transition-transform">{item.step}</div>
              <div className="w-full h-px bg-zinc-800 mb-8 relative overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileInView={{ x: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute inset-0 bg-white"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm font-mono text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
