import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import { ScrambleText } from './ScrambleText';
import { ThreeBackground } from './ThreeBackground';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  const t = language === 'uk' ? {
    surPrefix: 'СЕЛ',
    surHighlight: 'ІВАН',
    surSuffix: 'ОВ',
    desc: 'Структурування хаосу через візуальні форми.',
    btnWork: 'Декодувати Роботи',
    btnContact: "Ініціювати Зв'язок"
  } : {
    surPrefix: 'SEL',
    surHighlight: 'IVAN',
    surSuffix: 'OV',
    desc: 'Structuring chaos through visual forms.',
    btnWork: 'Decode Works',
    btnContact: 'Initiate Contact'
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      
      {/* Shifting Ambient Gradient */}
      <motion.div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background: 'linear-gradient(-45deg, #050505, #0a1c0f, #050505, #07150a)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <ThreeBackground />
      <div className="absolute inset-0 bg-[#050505]/40 z-0 pointer-events-none"></div>
      
      {/* Interactive spotlight (Electric Green) */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.08), transparent 40%)`
        }}
      />

      <div ref={containerRef} className="relative z-10 w-full px-6 flex flex-col items-center justify-center pt-20 pointer-events-none">
        
        <h1 className="w-full flex justify-center text-center font-display font-black uppercase leading-[0.85] tracking-tighter mix-blend-difference pointer-events-auto whitespace-nowrap">
          <span className="text-[10vw] md:text-[11vw] flex items-center group cursor-default">
            <span className="text-transparent [-webkit-text-stroke:2px_#3f3f46] group-hover:[-webkit-text-stroke:2px_#00FF41] transition-all duration-500">
              <ScrambleText text={t.surPrefix} delay={200} />
            </span>
            <span className="text-white">
              <ScrambleText text={t.surHighlight} delay={400} />
            </span>
            <span className="text-transparent [-webkit-text-stroke:2px_#3f3f46] group-hover:[-webkit-text-stroke:2px_#00FF41] transition-all duration-500">
              <ScrambleText text={t.surSuffix} delay={600} />
            </span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-zinc-400 font-light tracking-wide mt-12 text-center pointer-events-auto"
        >
          {t.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16 pointer-events-auto"
        >
          <a 
            href="#work"
            className="px-8 py-4 bg-[#00FF41] text-black font-mono text-sm uppercase tracking-widest font-bold hover:bg-white transition-all duration-300"
          >
            {t.btnWork}
          </a>
          <a 
            href="#contact"
            className="px-8 py-4 bg-transparent text-white border border-zinc-800 font-mono text-sm uppercase tracking-widest hover:border-[#00FF41] hover:text-[#00FF41] transition-all duration-300"
          >
            {t.btnContact}
          </a>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end h-16 pointer-events-none z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-transparent via-[#00FF41] to-transparent opacity-50"
        />
      </motion.div>
    </section>
  );
}
