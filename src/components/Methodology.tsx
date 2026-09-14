import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const stepsUk = [
  { step: '01', title: 'UX-дослідження', desc: 'Аналіз потреб користувачів, збір даних та формування архітектури досвіду.' },
  { step: '02', title: 'Візуальна концепція', desc: 'Пошук стилістики, створення мудбордів та ключових візуальних метафор.' },
  { step: '03', title: 'Розробка UI-інтерфейсу', desc: 'Проєктування екранів, типографіки, сіток та дизайн-системи продукту.' },
  { step: '04', title: 'Розробка прототипу та реалізація проєкту', desc: 'Створення інтерактивних прототипів, підготовка асетів та фінальний запуск.' }
];

const stepsEn = [
  { step: '01', title: 'UX Research', desc: 'Analyzing user needs, gathering data, and shaping the experience architecture.' },
  { step: '02', title: 'Visual Concept', desc: 'Searching for styling, creating moodboards, and defining key visual metaphors.' },
  { step: '03', title: 'UI Design', desc: 'Designing screens, typography, grids, and the product\'s design system.' },
  { step: '04', title: 'Prototyping & Implementation', desc: 'Creating interactive prototypes, preparing assets, and final launch.' }
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
