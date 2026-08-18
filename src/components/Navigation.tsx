import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, type Product } from '../api/products';
import { groupProductsByCategory } from '../utils/catalog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const location = useLocation();

  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts()
      .then(setCatalogProducts)
      .catch(() => setCatalogProducts([]));
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setIsProductsOpen(false);
    setIsAboutOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const catalogGroups = useMemo(() => groupProductsByCategory(catalogProducts), [catalogProducts]);

  const aboutItems = [
    { name: 'About Us', path: '/about', description: 'Our history, mission, and company vision' },
    { name: 'Careers', path: '/careers', description: 'Join our team of microwave & RF engineers' },
    { name: 'Blogs', path: '/blogs', description: 'Latest news, technical insights & articles' },
    { name: 'Gallery', path: '/gallery', description: 'Explore our technology & product showcase' },
    { name: 'Innovation', path: '/innovation', description: 'R&D initiatives and cutting-edge tech' },
  ];

  const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Industries', path: '/industries' },
    { name: 'Facilities', path: '/facilities' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black font-montserrat pt-2 pb-1 px-3 sm:px-5">
      <div className="max-w-[96rem] mx-auto">
        <div className="flex justify-between items-center h-[6rem] bg-black backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-5 lg:px-7">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img
              src="/images/flicmicrowaves.png"
              alt="Flic Microwaves"
              className="h-[4.5rem] lg:h-[5rem] w-auto max-w-none object-contain transition-opacity duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 relative text-[0.95rem]">
            <Link
              to="/"
              className={`transition-colors duration-300 font-semibold tracking-[0.02em] whitespace-nowrap ${
                location.pathname === '/' 
                  ? 'text-goldenrod' 
                  : 'text-white/90 hover:text-goldenrod'
              }`}
            >
              Home
            </Link>

            {/* About Us Dropdown */}
            <div ref={aboutRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAboutOpen((prev) => !prev);
                  setIsProductsOpen(false);
                }}
                className={`transition-colors duration-300 font-semibold tracking-[0.02em] flex items-center gap-1.5 whitespace-nowrap py-2 ${
                  aboutItems.some((i) => location.pathname === i.path)
                    ? 'text-goldenrod'
                    : 'text-white hover:text-goldenrod'
                }`}
              >
                About Us
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAboutOpen ? 'rotate-180 text-goldenrod' : ''}`} />
              </button>

              {/* About Us Dropdown Menu */}
              {isAboutOpen && (
                <div className="absolute top-full left-0 w-64 bg-black/95 backdrop-blur-2xl shadow-2xl border border-white/20 py-3 rounded-lg z-[10000]">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsAboutOpen(false)}
                      className={`block px-5 py-2.5 transition-all duration-200 text-sm ${
                        location.pathname === item.path
                          ? 'text-goldenrod bg-goldenrod/10 font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-[0.75rem] text-white/50 font-normal mt-0.5">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Products Dropdown */}
            <div ref={productsRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProductsOpen((prev) => !prev);
                  setIsAboutOpen(false);
                }}
                className={`transition-colors duration-300 font-semibold tracking-[0.02em] flex items-center gap-1.5 whitespace-nowrap py-2 ${
                  location.pathname.startsWith('/products')
                    ? 'text-goldenrod'
                    : 'text-white hover:text-goldenrod'
                }`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-goldenrod' : ''}`} />
              </button>

              {/* Products Dropdown Menu */}
              {isProductsOpen && (
                <div 
                  className="fixed top-[6.9rem] left-1/2 -translate-x-1/2 w-[min(1200px,95vw)] bg-black/95 backdrop-blur-2xl shadow-2xl border border-white/20 p-8 xl:p-12 z-[10000]"
                >
                  <div className="grid grid-cols-5 gap-8">
                    {catalogGroups.length > 0 ? (
                      catalogGroups.map((group) => (
                        <div key={group.category}>
                          <div className="flex items-center justify-between gap-3 mb-4 border-b border-goldenrod/20 pb-2">
                            <h3 className="text-lg font-bold text-white">{group.label}</h3>
                            <Link
                              to={`/products?category=${group.category}`}
                              className="text-xs font-semibold tracking-[0.02em] text-goldenrod hover:text-goldenrod/80"
                              onClick={() => setIsProductsOpen(false)}
                            >
                              View all
                            </Link>
                          </div>
                          <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                            {group.products.slice(0, 7).map((product) => (
                              <li key={product.id}>
                                <Link
                                  to={`/products/${product.id}`}
                                  className="text-white/75 hover:text-goldenrod transition-colors duration-300 text-sm"
                                  onClick={() => setIsProductsOpen(false)}
                                >
                                  {product.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-5 text-center py-10 text-white/60">
                        Loading product catalog...
                      </div>
                    )}
                  </div>
                  
                  {/* View All Products Button */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Link
                      to="/products"
                      className="w-full bg-goldenrod text-white py-3 font-montserrat font-semibold hover:bg-goldenrod/90 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => setIsProductsOpen(false)}
                    >
                      View All Products <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Navigation Items */}
            {mainNavItems.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`transition-colors duration-300 font-semibold tracking-[0.02em] whitespace-nowrap ${
                  location.pathname === item.path 
                    ? 'text-goldenrod' 
                    : 'text-white/90 hover:text-goldenrod'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/book-appointment"
              className="bg-goldenrod text-white px-5 xl:px-6 py-2.5 xl:py-3 font-semibold whitespace-nowrap shrink-0 hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105 rounded"
            >
              Contact us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-goldenrod transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3">
            <div className="flex flex-col space-y-4 bg-black backdrop-blur-xl px-6 py-5 shadow-xl text-[0.93rem]">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`transition-colors duration-300 font-semibold tracking-[0.02em] ${
                  location.pathname === '/' ? 'text-goldenrod' : 'text-white/90 hover:text-goldenrod'
                }`}
              >
                Home
              </Link>

              {/* About Us Submenu */}
              <div>
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] text-left flex items-center justify-between w-full"
                >
                  About Us
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAboutOpen ? 'rotate-180 text-goldenrod' : ''}`} />
                </button>
                {isAboutOpen && (
                  <div className="ml-4 mt-2 p-3 bg-white/10 border border-white/20 space-y-2 rounded">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block text-sm py-1.5 transition-colors ${
                          location.pathname === item.path ? 'text-goldenrod font-semibold' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Submenu */}
              <div>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] text-left flex items-center justify-between w-full"
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-goldenrod' : ''}`} />
                </button>
                {isProductsOpen && (
                  <div className="ml-4 mt-2 p-4 bg-white/10 border border-white/25 backdrop-blur-lg rounded">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">RF Components</h4>
                        <p className="text-white/80 text-xs">Filters, Amplifiers, Switches</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">Transceivers</h4>
                        <p className="text-white/80 text-xs">5G, Satellite, Military</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-1">Frequency Solutions</h4>
                        <p className="text-white/80 text-xs">Oscillators, Synthesizers</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Nav Items */}
              {mainNavItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`transition-colors duration-300 font-semibold tracking-[0.02em] ${
                    location.pathname === item.path ? 'text-goldenrod' : 'text-white/90 hover:text-goldenrod'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                to="/book-appointment"
                onClick={() => setIsMenuOpen(false)}
                className="bg-goldenrod text-white px-6 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300 w-full mt-4 text-center rounded"
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;