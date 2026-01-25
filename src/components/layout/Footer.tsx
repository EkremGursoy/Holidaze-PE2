import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-12">
      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="text-2xl font-bold text-stone-800 hover:text-orange-600 transition-colors">
            Holidaze
          </Link>
          <p className="mt-4 text-sm text-stone-500">© 2026 Holidaze. All Rights Reserved.</p>
        </div>
      </div>
    </footer>

  );
}
