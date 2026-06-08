import { useEffect, useMemo, useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, type Product } from '../api/products';
import { groupProductsByCategory } from '../utils/catalog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchProducts()
      .then(setCatalogProducts)
      .catch(() => setCatalogProducts([]));
  }, []);

  const catalogGroups = useMemo(() => groupProductsByCategory(catalogProducts), [catalogProducts]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Industries', path: '/industries' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Innovation', path: '/innovation' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      // Handle anchor links
      if (location.pathname !== '/') {
        // If not on home page, navigate to home first then scroll
        window.location.href = `/${path}`;
      } else {
        // If on home page, just scroll
        const element = document.querySelector(path);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black font-montserrat pt-2 pb-1 px-3 sm:px-5">
      <div className="max-w-[96rem] mx-auto">
        <div className="flex justify-between items-center h-[6rem] bg-black backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] px-5 lg:px-7">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img
              src="/images/flicmicrowaves.png"
              alt="Flic Microwaves"
              className="h-[4.5rem] lg:h-[5rem] w-auto max-w-none object-contain transition-opacity duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 relative text-[0.93rem]">
            {navItems.slice(0, 2).map((item) => (
              item.name === 'Home' ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`transition-colors duration-300 font-semibold tracking-[0.02em] whitespace-nowrap ${
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-white/90 hover:text-goldenrod'
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`transition-colors duration-300 font-semibold tracking-[0.02em] whitespace-nowrap ${
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-white/90 hover:text-goldenrod'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] flex items-center gap-1 whitespace-nowrap"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProductsOpen && (
                <div 
                  className="fixed top-[6.9rem] left-1/2 -translate-x-1/2 w-[min(1200px,95vw)] bg-black/95 backdrop-blur-2xl shadow-2xl border border-white/20 p-8 xl:p-12 z-[10000]"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
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
            
            {/* Remaining Navigation Items */}
            {navItems.slice(2, -1).map((item) => (
              item.path.startsWith('#') ? (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className="text-white/90 hover:text-goldenrod transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`transition-colors duration-300 font-semibold tracking-[0.02em] whitespace-nowrap ${
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-white/90 hover:text-goldenrod'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            <a
              href="/book-appointment"
              className="bg-goldenrod text-white px-5 xl:px-6 py-2.5 xl:py-3 font-semibold whitespace-nowrap shrink-0 hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105"
            >
              Book Appointment
            </a>
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
            <div className="flex flex-col space-y-4 bg-black backdrop-blur-xl border border-white/20 px-6 py-5 shadow-xl text-[0.93rem]">
              {navItems.slice(0, 2).map((item) => (
                item.path.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors duration-300 font-semibold tracking-[0.02em] ${
                      location.pathname === item.path 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-goldenrod'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] text-left flex items-center gap-2"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProductsOpen && (
                  <div className="ml-4 mt-2 p-4 bg-white/10 border border-white/25 backdrop-blur-lg">
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
              
              {navItems.slice(2).map((item) => (
                item.path.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-white hover:text-goldenrod transition-colors duration-300 font-semibold tracking-[0.02em] text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition-colors duration-300 font-semibold tracking-[0.02em] ${
                      location.pathname === item.path 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-goldenrod'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="bg-white text-goldenrod px-6 py-3 font-semibold hover:bg-black hover:text-white transition-all duration-300 w-full mt-4 text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;