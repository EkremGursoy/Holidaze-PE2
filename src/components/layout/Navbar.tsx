import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isVenueManager, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const guestLinks = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const authLinks = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    ...(isVenueManager ? [{ name: 'My Venues', path: '/my-venues' }] : []),
  ];

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
      <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-orange-600 tracking-tight hover:text-orange-700 transition-colors">
            Holidaze
          </Link>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-stone-500 hover:text-stone-800 focus:outline-none"
              aria-label="toggle menu"
            >
              {!isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-stone-600 font-medium hover:text-orange-600 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {isVenueManager && (
                <Link to="/venue/create" className="px-5 py-2.5 font-semibold text-white transition-all duration-200 bg-orange-500 rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40">
                  Create Venue
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-stone-600 font-medium hover:text-orange-600 transition-colors duration-200"
              >
                <span>Logout</span>
                {user?.avatar?.url && (
                  <img
                    src={user.avatar.url}
                    alt={user.avatar.alt || user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                  />
                )}
              </button>
            </>
          ) : (
            <Link to="/login" className="px-5 py-2.5 font-semibold text-white transition-all duration-200 bg-orange-500 rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu (Collapsible/Lateral) */}
        <div
          className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white border-b border-orange-100 md:hidden top-16 shadow-lg ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
            }`}
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-stone-600 font-medium hover:text-orange-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {isVenueManager && (
                  <Link
                    to="/venue/create"
                    className="px-5 py-2.5 font-semibold text-white transition-all bg-orange-500 rounded-full hover:bg-orange-600 text-center shadow-lg shadow-orange-500/30"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Venue
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 font-semibold text-orange-600 border-2 border-orange-500 rounded-full hover:bg-orange-50 transition-colors text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 font-semibold text-white transition-all bg-orange-500 rounded-full hover:bg-orange-600 text-center shadow-lg shadow-orange-500/30"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
