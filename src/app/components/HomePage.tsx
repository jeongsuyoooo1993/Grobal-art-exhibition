import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * DATA: World Class Museums with Exhibition Lists (Alphabetical Order)
 */

// Exhibition Detail Interface
interface ExhibitionDetail {
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  website: string;
}

const MUSEUMS = [
  {
    id: 1,
    country: "CHINA",
    city: "Hong Kong",
    name: "M+ Museum",
    shortName: "M+",
    description: "아시아 최초의 글로벌 현대 시각문화 박물관. 동서양이 교차하는 문화의 허브.",
    image: "https://images.unsplash.com/photo-1737040621533-6cc229f1e506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNJTIwUGx1cyUyME11c2V1bSUyMEhvbmclMjBLb25nfGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    exhibitions: [
      { 
        title: "Things, Spaces, Interactions", 
        category: "Design", 
        year: "2024",
        description: "사물, 공간, 상호작용. 20세기부터 현재까지 아시아 디자인의 진화와 혁신을 탐구합니다.",
        image: "https://images.unsplash.com/photo-1556297850-b44db1a663f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjaGluZXNlJTIwYXJ0fGVufDF8fHx8MTc2ODM3NTkzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Ink Dreams: Chinese Literati Painting", 
        category: "Traditional", 
        year: "2024",
        description: "수묵의 꿈. 중국 문인화의 정신세계를 담은 먹과 물의 조화, 그 깊이를 만나다.",
        image: "https://images.unsplash.com/photo-1684871430772-569936b1a0ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaW5rJTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY4Mzc1OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Calligraphy as Living Art", 
        category: "Calligraphy", 
        year: "2024",
        description: "살아있는 예술, 서예. 현대 서예가들이 전통의 붓글씨에 불어넣은 새로운 생명력.",
        image: "https://images.unsplash.com/photo-1658236738162-43b272396b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwY2FsbGlncmFwaHklMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "The Terracotta Warriors: Guardian Spirits", 
        category: "Ancient Art", 
        year: "2023",
        description: "병마용의 수호령. 2천 년 전 진시황의 군대, 고대 중국의 위대한 예술적 유산.",
        image: "https://images.unsplash.com/photo-1737418829009-f4a4cec7219c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXJyYWNvdHRhJTIwd2FycmlvcnMlMjBleGhpYml0aW9ufGVufDF8fHx8MTc2ODM3NTkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      },
      { 
        title: "Contemporary Asian Sculpture", 
        category: "Sculpture", 
        year: "2023",
        description: "아시아 현대 조각의 지평. 전통과 현대를 넘나드는 조각가들의 실험적 도전.",
        image: "https://images.unsplash.com/photo-1605658782236-54c8632c7619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvbnRlbXBvcmFyeSUyMHNjdWxwdHVyZXxlbnwxfHx8fDE3NjgzNzU5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        website: "https://www.mplus.org.hk"
      }
    ]
  },
  // ... 나머지 미술관 데이터는 기존 App.tsx에서 복사
];

// --- COMPONENTS ---

// Exhibition Detail Card Component (Left Side)
const ExhibitionCard = ({ exhibition }: { exhibition: ExhibitionDetail | null }) => {
  if (!exhibition) {
    return (
      <div className="sticky top-32 h-fit bg-[#0a0a0a] border border-white/10 p-8">
        <div className="flex items-center justify-center h-64 text-white/30 text-sm">
          전시회를 선택해주세요
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-32 h-fit bg-[#0a0a0a] border border-white/10">
      {/* Category Badge and Year */}
      <div className="p-6 pb-0 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 px-3 py-1.5 border border-white/20">
          {exhibition.category}
        </span>
        <span className="text-xs font-mono text-white/70">{exhibition.year}</span>
      </div>

      {/* Exhibition Image */}
      <div className="p-6">
        <div className="w-full h-48 overflow-hidden">
          <img
            src={exhibition.image}
            alt={exhibition.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Exhibition Details */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-light text-white mb-4 leading-tight">
          {exhibition.title}
        </h3>

        <div className="text-sm text-white/60 leading-relaxed mb-6">
          {exhibition.description.split('. ').map((sentence, index, array) => (
            <span key={index}>
              {sentence}{index < array.length - 1 && '.'}
              {index < array.length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Visit Website Button */}
        <a
          href={exhibition.website}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 text-xs tracking-wide"
        >
          <span>웹사이트 방문</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-exclusion"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className={`w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${isHovering ? 'scale-[3] opacity-50' : 'scale-100'}`} />
    </div>
  );
};

// List Item Component for Exhibition (Table Style)
const ExhibitionItem = ({ 
  title, 
  category, 
  year, 
  onClick,
  isSelected,
  isLast
}: { 
  title: string, 
  category: string, 
  year: string,
  onClick: () => void,
  isSelected?: boolean,
  isLast?: boolean
}) => (
  <div 
    onClick={onClick}
    className={`group interactive flex items-center justify-between py-4 border-white/10 hover:bg-white/5 transition-all cursor-pointer ${isSelected ? 'bg-white/5' : ''} ${isLast ? '' : 'border-b'}`}
  >
    <div className="flex-1 px-4">
      <h4 className="text-sm font-light text-white/90 group-hover:text-white transition-colors">{title}</h4>
    </div>
    <div className="flex-1 text-center px-4">
      <span className="text-xs uppercase tracking-[0.15em] text-white/40">{category}</span>
    </div>
    <div className="w-20 text-right px-4">
      <span className="text-xs font-mono text-white/50">{year}</span>
    </div>
  </div>
);

const HomePage = () => {
  const [introMode, setIntroMode] = useState(true);
  const [selectedExhibitions, setSelectedExhibitions] = useState<{[key: number]: ExhibitionDetail}>({});
  const [zoomProgress, setZoomProgress] = useState<{[key: number]: number}>({});
  const [activeSection, setActiveSection] = useState<number>(1);

  // Initialize with first exhibition of each museum
  useEffect(() => {
    const initial: {[key: number]: ExhibitionDetail} = {};
    MUSEUMS.forEach(museum => {
      initial[museum.id] = museum.exhibitions[0];
    });
    setSelectedExhibitions(initial);
  }, []);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Image scale effect on scroll
  useEffect(() => {
    if (introMode) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-museum]');
      const progressState: {[key: number]: number} = {};
      
      sections.forEach((section) => {
        const museumId = parseInt(section.getAttribute('data-museum') || '0');
        const rect = section.getBoundingClientRect();
        const visualArea = section.querySelector('.visual-scroll-area') as HTMLElement;
        const imageWrapper = section.querySelector('.image-scale-wrapper') as HTMLElement;
        const imageElement = section.querySelector('.image-scale-wrapper img') as HTMLElement;
        const contentArea = section.querySelector('.content-slide-up') as HTMLElement;
        const heroOverlay = section.querySelector('.hero-text-overlay') as HTMLElement;
        
        if (!visualArea || !imageElement || !contentArea) return;
        
        const visualAreaHeight = visualArea.clientHeight;
        const sectionTop = rect.top;
        
        // Calculate scroll progress within the visual area (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1, -sectionTop / visualAreaHeight));
        
        // Phase 1: Zoom out (first 50% of scroll)
        const zoomProgress = Math.min(scrollProgress * 2, 1);
        const scale = 1.4 - (zoomProgress * 0.4);
        imageElement.style.transform = `scale(${scale})`;
        
        // Fade out hero text during zoom
        if (heroOverlay) {
          const fadeProgress = Math.min(zoomProgress, 1);
          heroOverlay.style.opacity = `${1 - fadeProgress}`;
        }
        
        // Dim image slightly during zoom
        if (imageWrapper) {
          const dimOpacity = zoomProgress * 0.3;
          imageWrapper.style.filter = `brightness(${1 - dimOpacity})`;
        }
        
        // Phase 2: Slide up content (second 50% of scroll, after zoom completes)
        const slideProgress = Math.max(0, (scrollProgress - 0.5) * 2);
        const translateY = (1 - slideProgress) * 100; // Start at 100vh, end at 0
        contentArea.style.transform = `translateY(${translateY}vh)`;
        
        // Store zoom progress for progress bar
        progressState[museumId] = zoomProgress;
        
        // Detect active section (when section is in the middle of viewport)
        const viewportMiddle = window.innerHeight / 2;
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          setActiveSection(museumId);
        }
      });
      
      setZoomProgress(progressState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [introMode]);

  // Scroll to section function
  const scrollToSection = (museumId: number) => {
    const section = document.querySelector(`section[data-museum="${museumId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white w-full min-h-screen font-sans selection:bg-white selection:text-black">
      <CustomCursor />

      {/* NOISE & GRAIN OVERLAY */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-50 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-8 pointer-events-none">
        <div className="text-xs uppercase tracking-widest font-bold pointer-events-auto text-white">
          The Living Archive
        </div>
        <Link 
          to="/login"
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors pointer-events-auto"
        >
          ADMIN
        </Link>
      </header>

      {/* RIGHT NAVIGATION */}
      <nav className="fixed top-1/2 right-8 -translate-y-1/2 z-40 flex flex-col items-end gap-6">
        {MUSEUMS.map((museum) => (
          <button
            key={museum.id}
            onClick={() => scrollToSection(museum.id)}
            className="interactive group flex items-center gap-3 transition-all"
          >
            <span 
              className={`text-xs uppercase tracking-widest transition-all duration-300 ${
                activeSection === museum.id 
                  ? 'text-white opacity-100' 
                  : 'text-white/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {museum.country}
            </span>
            <div 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === museum.id 
                  ? 'bg-white scale-150' 
                  : 'bg-white/30 scale-100'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ==================== INTRO OVERLAY ==================== */}
      {introMode && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-pointer"
          onClick={() => setIntroMode(false)}
        >
          <div className="text-center animate-pulse">
            <h1 className="text-4xl font-serif italic mb-2">The Archive</h1>
            <p className="text-[10px] tracking-widest uppercase opacity-70">Click to Explore</p>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className={`transition-opacity duration-1000 ${introMode ? 'opacity-0' : 'opacity-100'}`}>
        
        {MUSEUMS.map((museum, index) => (
          <section key={museum.id} className="relative w-full" data-museum={museum.id}>
            
            {/* 1. VISUAL AREA - Image Zoom Effect Only */}
            <div className="visual-scroll-area relative w-full" style={{ height: '200vh' }}>
              <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
                <div 
                  className="image-scale-wrapper w-full h-full flex items-center justify-center"
                  style={{
                    willChange: 'transform'
                  }}
                >
                  <img 
                    src={museum.image} 
                    alt={museum.name}
                    className="w-full h-full object-cover"
                    style={{
                      willChange: 'transform'
                    }}
                  />
                </div>
                
                <div className="hero-text-overlay absolute inset-0 flex flex-col justify-center items-center text-center p-4 pointer-events-none" style={{ willChange: 'opacity' }}>
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 flex flex-col items-center"
                  >
                    <h2 className="text-6xl md:text-8xl font-light tracking-tight uppercase text-white">
                      {museum.country}
                    </h2>
                    <p className="text-xs tracking-[0.2em] uppercase text-white/70 mt-4">
                      {museum.name} · {museum.city}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="max-w-md text-sm font-light text-white/90 leading-relaxed mb-6 text-center">
                      {museum.description.split('. ').map((sentence, index, array) => (
                        <span key={index}>
                          {sentence}{index < array.length - 1 && '.'}
                          {index < array.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-64 flex flex-col items-center gap-2">
                      <div className="w-full h-[1px] bg-white/20 relative overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-white transition-all duration-100 ease-out"
                          style={{ 
                            width: `${(zoomProgress[museum.id] || 0) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* 2. CONTENT AREA - Slides up over the pinned image */}
            <div className="content-slide-up relative z-20 bg-[#0a0a0a] min-h-screen" style={{ willChange: 'transform', marginTop: '-100vh', transform: 'translateY(100vh)' }}>
              <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
                {/* Header */}
                <div className="mb-12">
                  <div className="flex items-baseline justify-between border-b border-white/20 pb-3">
                    <h3 className="text-xl md:text-2xl font-serif italic text-white">Current Exhibitions</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">SELECTED WORKS 2024-2025</span>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  {/* Left Column - Exhibition Card */}
                  <div className="lg:col-span-4">
                    <ExhibitionCard exhibition={selectedExhibitions[museum.id] || museum.exhibitions[0]} />
                  </div>

                  {/* Right Column - Exhibition List */}
                  <div className="lg:col-span-8">
                    <div className="bg-[#0a0a0a] border border-white/10">
                      {museum.exhibitions.map((exh, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                          <ExhibitionItem 
                            title={exh.title}
                            category={exh.category}
                            year={exh.year}
                            onClick={() => {
                              setSelectedExhibitions(prev => ({
                                ...prev,
                                [museum.id]: exh
                              }));
                            }}
                            isSelected={selectedExhibitions[museum.id]?.title === exh.title}
                            isLast={i === museum.exhibitions.length - 1}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom padding for smooth scroll */}
                <div className="h-32"></div>
              </div>
            </div>

          </section>
        ))}

        {/* FOOTER */}
        <footer className="w-full py-20 bg-black border-t border-white/10 flex flex-col items-center justify-center text-center text-white/30">
          <p className="text-xs uppercase tracking-widest mb-4">The Living Archive © 2026</p>
          <p className="font-serif italic text-lg">Art is not what you see, but what you make others see.</p>
        </footer>

      </main>

      <style>{`
        .text-shadow-sm {
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
