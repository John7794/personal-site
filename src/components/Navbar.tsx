import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('Nav_Work', language === 'uk' ? 'Роботи' : 'Work'), href: '#work' },
    { name: t('Nav_About', language === 'uk' ? 'Про мене' : 'About'), href: '#about' },
    { name: t('Nav_Contact', language === 'uk' ? 'Контакти' : 'Contact'), href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/60 backdrop-blur-md border-b border-zinc-800/50 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="text-xl font-bold tracking-tighter text-white font-display hover:text-zinc-300 transition-colors">
            IS<span className="text-zinc-500">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              {language === 'uk' ? 'EN' : 'UK'}
            </button>

            <a 
              href="#contact"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            >
              {t('Nav_Talk', language === 'uk' ? "Зв'язатися" : "Let's Talk")}
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              {language === 'uk' ? 'EN' : 'UK'}
            </button>
            <button 
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col p-6"
          >
            <div className="flex justify-end mb-12">
              <button 
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-6 items-center justify-center flex-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
