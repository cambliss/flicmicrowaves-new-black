import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Solutions from './pages/Solutions';
import Industries from './pages/Industries';
import Careers from './pages/Careers';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Gallery from './pages/Gallery';
import Innovation from './pages/Innovation';
import Facilities from './pages/Facilities';
import Filters from './pages/Filters';
import SatelliteAmplifiers from './pages/SatelliteAmplifiers';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="route-animate">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/innovation" element={<Innovation />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/filters" element={<Filters />} />
        <Route path="/satellite-amplifiers" element={<SatelliteAmplifiers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Navigation />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;