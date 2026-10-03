import { useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/category/category_api';

export default function Categories() {
  const dispatch = useDispatch();
  const { categorys, loading } = useSelector((state) => state.category_slice);
  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  if (loading.when_getall) return <div className="flex h-60 items-center justify-center text-lg font-semibold text-gray-600">Loading...</div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Categories</h1>

        <p className="mt-3 text-gray-500">Explore our product categories</p>
      </div>

      {/* Categories */}

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {categorys?.data?.map((category) => (
          <Link
            key={category._id}

            to={`/products?category=${category._id}`}

            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image */}

            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={category.imageUrl || '/empty.png'}

                alt={category.name}

                loading="lazy"

                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* overlay */}

              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
            </div>

            {/* Content */}

            <div className="p-4 text-center">
              <h2 className="line-clamp-1 text-sm font-bold text-gray-800 transition group-hover:text-blue-600 md:text-base">{category.name}</h2>

              <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                View Products
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!categorys?.data || categorys.data.length === 0) && <div className="mt-10 text-center text-gray-500">No Categories Found</div>}
    </section>
  );
}
