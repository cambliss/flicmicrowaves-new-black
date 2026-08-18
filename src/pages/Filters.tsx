import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Filter, Radio, CheckCircle, Mail, Phone,
  TrendingUp, Settings, Layers,
} from 'lucide-react';
import Footer from '../components/Footer';
import { fetchProducts, productImageUrls, UPLOADS_BASE, type Product } from '../api/products';
import useCmsBanner from '../hooks/useCmsBanner';

// --- Helpers ---

/** Look up a spec value by key name (case-insensitive partial match) */
function specValue(product: Product, keyFragment: string): string {
  const match = product.specifications.find((s) =>
    s.key.toLowerCase().includes(keyFragment.toLowerCase())
  );
  return match?.value ?? '---';
}

// --- Filter options ---

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'Bandpass', label: 'Bandpass' },
  { value: 'Cavity', label: 'Cavity' },
  { value: 'Ceramic', label: 'Ceramic' },
  { value: 'Combline', label: 'Combline' },
  { value: 'Notch', label: 'Notch' },
  { value: 'Diplexer', label: 'Diplexer' },
];

const frequencyOptions = [
  { value: 'all', label: 'All Frequencies' },
  { value: '700', label: '700 MHz' },
  { value: '1.8', label: '1.8 GHz' },
  { value: '2.6', label: '2.6 GHz' },
  { value: '3.5', label: '3.5 GHz' },
  { value: '28', label: '28 GHz (mmWave)' },
];

// --- Component ---

const Filters = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedType, setSelectedType] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    fetchProducts('filters')
      .then(setProducts)
      .catch(() => setError('Could not load products. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const typeSpec = specValue(p, 'type').toLowerCase();
    const freqSpec = specValue(p, 'frequency').toLowerCase();
    const typeMatch = selectedType === 'all' || typeSpec.includes(selectedType.toLowerCase());
    const freqMatch = selectedFrequency === 'all' || freqSpec.includes(selectedFrequency.toLowerCase());
    return typeMatch && freqMatch;
  });

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedFrequency('all');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-black/20 via-black/10 to-transparent min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {bannerSrc && (
            <img
              src={bannerSrc}
              alt="Flic Microwaves banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-goldenrod/80 via-goldenrod/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              5G Base Station <span className="text-black">Filters</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed font-opensans">
              Advanced filtering solutions engineered for next-generation 5G infrastructure.
              Precision-crafted components that ensure optimal signal quality and network performance.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-goldenrod/20 shadow-lg sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <Filter className="w-6 h-6 text-goldenrod" />
                  <h2 className="text-xl font-bold text-black">Filter Options</h2>
                </div>

                {/* Filter Type */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3">Filter Type</h3>
                  <div className="space-y-2">
                    {typeOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          value={opt.value}
                          checked={selectedType === opt.value}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-4 h-4 text-goldenrod border-goldenrod/30 focus:ring-goldenrod"
                        />
                        <span className="text-black/70 group-hover:text-goldenrod transition-colors duration-300 text-sm font-opensans">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3">Frequency Range</h3>
                  <div className="space-y-2">
                    {frequencyOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="frequency"
                          value={opt.value}
                          checked={selectedFrequency === opt.value}
                          onChange={(e) => setSelectedFrequency(e.target.value)}
                          className="w-4 h-4 text-goldenrod border-goldenrod/30 focus:ring-goldenrod"
                        />
                        <span className="text-black/70 group-hover:text-goldenrod transition-colors duration-300 text-sm font-opensans">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Count */}
                <div className="pt-4 border-t border-goldenrod/20">
                  <p className="text-sm text-black/60 font-opensans">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="w-full mt-4 text-sm text-goldenrod hover:text-white hover:bg-goldenrod transition-all duration-300 py-3 border border-goldenrod rounded-lg font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <p className="text-goldenrod font-opensans text-lg">Loading products...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-20">
                  <p className="text-red-500 font-opensans">{error}</p>
                </div>
              )}

              {!loading && !error && selectedProduct && (
                <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
              )}

              {!loading && !error && !selectedProduct && (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <Filter className="w-16 h-16 text-goldenrod/30 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
                      <p className="text-lg text-black/60 mb-6 font-opensans">
                        Try adjusting your filter criteria to see more results.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="bg-goldenrod text-white px-8 py-4 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Product Card ---

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const imgUrl = productImageUrls(product)[0] || null;
  return (
    <div
      onClick={onClick}
      className="bg-[#111113] rounded-2xl border border-white/15 hover:border-goldenrod/60 cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
    >
      <div className="w-full h-56 bg-black/60 p-4 relative flex items-center justify-center border-b border-white/10 overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Radio className="w-12 h-12 text-goldenrod/30" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/80 border border-goldenrod/40 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-goldenrod backdrop-blur-md">
          {product.category}
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-goldenrod transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
          <p className="text-goldenrod font-bold text-sm tracking-wide">
            {product.price || 'Price on Request'}
          </p>
        </div>
        <button className="w-full bg-goldenrod text-white py-3 px-4 rounded-xl font-montserrat font-semibold hover:bg-goldenrod/90 transition-all duration-300 flex items-center justify-center gap-2 mt-6 group-hover:shadow-[0_8px_20px_rgba(218,165,32,0.35)]">
          View Details <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

// --- Product Detail ---

function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const imgUrl = productImageUrls(product)[0] || null;
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {product.specifications.slice(0, 4).map((spec) => (
              <span key={spec.id} className="bg-goldenrod/10 text-goldenrod px-4 py-2 rounded-full text-sm font-semibold font-opensans">
                {spec.key}: {spec.value}
              </span>
            ))}
          </div>
        </div>
        {imgUrl && (
          <div className="w-full h-96 bg-goldenrod/5 rounded-2xl overflow-hidden border border-goldenrod/20 mb-8">
            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}
        {product.description && (
          <div className="text-center mb-8">
            <p className="text-lg text-black/80 leading-relaxed max-w-4xl mx-auto font-opensans">{product.description}</p>
          </div>
        )}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-goldenrod/5 p-8 rounded-2xl border border-goldenrod/20 max-w-2xl w-full">
            {product.price && (
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-goldenrod">{product.price}</span>
                <span className="text-black/60 ml-2 text-lg font-opensans">per unit</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border-2 border-goldenrod text-goldenrod px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> Request Quote
              </button>
              <button className="bg-goldenrod text-white px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Contact Sales
              </button>
            </div>
            {product.datasheet && (
              <div className="text-center mt-4">
                <a href={`${UPLOADS_BASE}/${product.datasheet}`} target="_blank" rel="noreferrer" className="text-goldenrod underline text-sm font-opensans">
                  Download Datasheet (PDF)
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.features && product.features.length > 0 && (
        <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-goldenrod" />
            <h3 className="text-2xl font-bold text-black">Key Features</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {product.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-goldenrod flex-shrink-0 mt-0.5" />
                <span className="text-black/80 font-opensans">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-goldenrod" />
            <h3 className="text-2xl font-bold text-black">Technical Specifications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-goldenrod/20">
                  <th className="text-left py-4 px-6 text-black font-semibold">Parameter</th>
                  <th className="text-left py-4 px-6 text-black font-semibold">Specification</th>
                </tr>
              </thead>
              <tbody>
                {product.specifications.map((spec) => (
                  <tr key={spec.id} className="border-b border-goldenrod/10 hover:bg-goldenrod/5 transition-colors duration-300">
                    <td className="py-4 px-6 text-black/70 font-medium font-opensans">{spec.key}</td>
                    <td className="py-4 px-6 text-black font-semibold font-opensans">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {product.applications && product.applications.length > 0 && (
        <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-goldenrod" />
            <h3 className="text-2xl font-bold text-black">Applications</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {product.applications.map((app, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-goldenrod/5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-goldenrod flex-shrink-0" />
                <span className="text-black/80 font-medium font-opensans">{app}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button onClick={onBack} className="bg-goldenrod text-white px-8 py-4 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
          <ArrowLeft className="w-5 h-5" /> Back to All Products
        </button>
      </div>
    </div>
  );
}

export default Filters;
