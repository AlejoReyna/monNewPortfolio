import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link 
          href="/" 
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
