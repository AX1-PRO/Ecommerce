import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { get_category } from '../../store/category/category_api';

export default function Categories() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const { categorys, loading } = useSelector((state) => state.category_slice);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  // Check overflow for scrolling arrows
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowArrows(scrollWidth > clientWidth);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categorys]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth'
    });
  };

  // Skeleton Loading State
  if (loading?.when_getall) {
    return (
      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-2">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-40 flex-shrink-0 space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:w-48">
                <div className="h-32 w-full animate-pulse rounded-xl bg-slate-200" />
                <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-y border-slate-100 bg-slate-50/60 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Tag size={14} />
              <span>Categories</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Shop by Category</h2>
          </div>

          {/* Navigation Controls */}
          {showArrows && (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scroll('left')}
                aria-label="Previous categories"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next categories"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="group relative">
          {/* Scrollable List */}
          <div ref={scrollRef} className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth px-1 py-2">
            {categorys?.data?.map((item) => (
              <Link
                key={item._id}
                to={`/products?category=${item._id}`}
                className="group/card min-w-[150px] flex-shrink-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 sm:min-w-[180px]"
              >
                {/* Image Wrapper */}
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img src={item.imageUrl} alt={item.name} className="group-hover/card:scale-108 h-full w-full object-cover transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-slate-900/5 transition-opacity group-hover/card:opacity-0" />
                </div>

                {/* Category Name */}
                <div className="mt-3 text-center">
                  <h3 className="line-clamp-1 text-sm font-semibold text-slate-800 transition-colors group-hover/card:text-indigo-600">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
