import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function Methodology() {
  const { language, t } = useLanguage();
  const title = t('Methodology_Title', language === 'uk' ? 'Методологія' : 'Methodology');

  const stepsData = [
    {
      step: '01',
      title: t('Methodology_Step1_Title', language === 'uk' ? 'UX-дослідження' : 'UX Research'),
      desc: t('Methodology_Step1_Desc', language === 'uk' ? 'Аналіз потреб користувачів, збір даних та формування архітектури досвіду.' : 'Analyzing user needs, gathering data, and shaping the experience architecture.')
    },
    {
      step: '02',
      title: t('Methodology_Step2_Title', language === 'uk' ? 'Візуальна концепція' : 'Visual Concept'),
      desc: t('Methodology_Step2_Desc', language === 'uk' ? 'Пошук стилістики, створення мудбордів та ключових візуальних метафор.' : 'Searching for styling, creating moodboards, and defining key visual metaphors.')
    },
    {
      step: '03',
      title: t('Methodology_Step3_Title', language === 'uk' ? 'Розробка UI-інтерфейсу' : 'UI Design'),
      desc: t('Methodology_Step3_Desc', language === 'uk' ? 'Проєктування екранів, типографіки, сіток та дизайн-системи продукту.' : 'Designing screens, typography, grids, and the product\'s design system.')
    },
    {
      step: '04',
      title: t('Methodology_Step4_Title', language === 'uk' ? 'Розробка прототипу та реалізація проєкту' : 'Prototyping & Implementation'),
      desc: t('Methodology_Step4_Desc', language === 'uk' ? 'Створення інтерактивних прототипів, підготовка асетів та фінальний запуск.' : 'Creating interactive prototypes, preparing assets, and final launch.')
    }
  ];

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
