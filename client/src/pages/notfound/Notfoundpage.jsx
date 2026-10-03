import { Link } from 'react-router';
import { ShoppingBag, Home } from 'lucide-react';

export default function Notfoundpage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 px-6">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-100 shadow-lg">
          <ShoppingBag className="h-14 w-14 text-green-600" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-extrabold text-green-600">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold text-gray-800">Oops! Page Not Found</h2>

        {/* Description */}
        <p className="mt-3 text-gray-500 leading-relaxed">The page you're looking for doesn't exist or may have been moved. Let's get you back to shopping.</p>

        {/* Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
