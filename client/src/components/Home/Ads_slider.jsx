import { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from 'lucide-react';

export default function OffersCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slidesRef = useRef([]);

  const offers = [
    {
      badge: 'عرض الصيف المميز',
      title: 'خصومات الصيف الكبرى',
      description: 'استمتع بتخفيضات تصل حتى 50% على المنتجات المختارة لفترة محدودة',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
      cta: 'تسوق الآن',
      link: '/offers/summer'
    },
    {
      badge: 'حصرياً للمشتركين',
      title: 'عروض وساعات خاصة',
      description: 'أسعار استثنائية على أحدث أجهزة الإلكترونيات والإكسسوارات',
      image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=1200&q=80',
      cta: 'اكتشف العروض',
      link: '/offers/exclusive'
    },
    {
      badge: 'شحن مجاني',
      title: 'توصيل مجاني لباب المنزل',
      description: 'احصل على شحن مجاني بالكامل لجميع الطلبات التي تتجاوز 500 جنيه',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
      cta: 'ابدأ التسوق',
      link: '/products'
    }
  ];

  // التبديل التلقائي
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, offers.length]);

  // التمرير الدقيق والموافق للغة العربية (RTL & LTR Compatible)
  useEffect(() => {
    const activeSlide = slidesRef.current[current];
    if (activeSlide) {
      activeSlide.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % offers.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <section className="dir-rtl relative w-full overflow-hidden rounded-3xl shadow-xl shadow-slate-200/50" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} dir="rtl">
      {/* Carousel Container */}
      <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {offers.map((offer, index) => (
          <div key={index} ref={(el) => (slidesRef.current[index] = el)} className="relative min-w-full flex-shrink-0 snap-start overflow-hidden">
            {/* Background Image */}
            <div className="h-[300px] w-full overflow-hidden sm:h-[380px] md:h-[460px]">
              <img
                src={offer.image}
                alt={offer.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`h-full w-full object-cover transition-transform duration-1000 ease-out ${current === index ? 'scale-105' : 'scale-100'}`}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-950/60 md:to-transparent" />

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl space-y-3 px-6 text-white sm:space-y-4 sm:px-12 md:px-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium shadow-inner backdrop-blur-md sm:text-sm">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>{offer.badge}</span>
                </div>

                <h2 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">{offer.title}</h2>

                <p className="max-w-md text-xs font-normal leading-relaxed text-slate-200 sm:text-base md:text-lg">{offer.description}</p>

                <div className="pt-2">
                  <a
                    href={offer.link || '#'}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-bold text-slate-900 shadow-lg transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 active:scale-95 sm:text-sm"
                  >
                    <span>{offer.cta}</span>
                    <ArrowLeft size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrow - Right */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-900/50 text-white shadow-lg backdrop-blur-md transition hover:bg-white hover:text-slate-900 active:scale-90 sm:h-12 sm:w-12"
      >
        <ChevronRight size={24} />
      </button>

      {/* Navigation Arrow - Left */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-900/50 text-white shadow-lg backdrop-blur-md transition hover:bg-white hover:text-slate-900 active:scale-90 sm:h-12 sm:w-12"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1.5 backdrop-blur-md">
        {offers.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 cursor-pointer rounded-full transition-all duration-500 ${current === index ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </section>
  );
}
