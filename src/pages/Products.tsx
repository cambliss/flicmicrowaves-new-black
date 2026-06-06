import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Filter, Search, SlidersHorizontal, Sparkles, X, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { fetchProducts, productImageUrls, type Product } from '../api/products';
import { getCategoryLabel, getFacetValues, getSpecValue, groupProductsByCategory } from '../utils/catalog';
import useCmsBanner from '../hooks/useCmsBanner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') ?? 'all';
    setSelectedCategory(category);
  }, [searchParams]);

  const categoryOptions = useMemo(
    () => ['all', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );
  const typeOptions = useMemo(() => ['all', ...getFacetValues(products, 'type')], [products]);
  const frequencyOptions = useMemo(() => ['all', ...getFacetValues(products, 'frequency')], [products]);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        (product.description ?? '').toLowerCase().includes(search) ||
        product.features.some((feature) => feature.toLowerCase().includes(search)) ||
        product.applications.some((application) => application.toLowerCase().includes(search));

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesType =
        selectedType === 'all' ||
        getSpecValue(product, 'type').toLowerCase().includes(selectedType.toLowerCase());
      const matchesFrequency =
        selectedFrequency === 'all' ||
        getSpecValue(product, 'frequency').toLowerCase().includes(selectedFrequency.toLowerCase());

      return matchesSearch && matchesCategory && matchesType && matchesFrequency;
    });
  }, [products, query, selectedCategory, selectedType, selectedFrequency]);

  const groupedProducts = useMemo(() => groupProductsByCategory(filteredProducts), [filteredProducts]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: 'query' | 'category' | 'type' | 'frequency'; label: string }> = [];
    if (query.trim()) filters.push({ key: 'query', label: `Search: ${query.trim()}` });
    if (selectedCategory !== 'all') {
      filters.push({ key: 'category', label: `Category: ${getCategoryLabel(selectedCategory)}` });
    }
    if (selectedType !== 'all') filters.push({ key: 'type', label: `Type: ${selectedType}` });
    if (selectedFrequency !== 'all') filters.push({ key: 'frequency', label: `Frequency: ${selectedFrequency}` });
    return filters;
  }, [query, selectedCategory, selectedType, selectedFrequency]);

  const clearSingleFilter = (key: 'query' | 'category' | 'type' | 'frequency') => {
    if (key === 'query') setQuery('');
    if (key === 'category') setSelectedCategory('all');
    if (key === 'type') setSelectedType('all');
    if (key === 'frequency') setSelectedFrequency('all');
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedFrequency('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-black font-montserrat overflow-x-hidden pt-24 text-white">
      <section className="relative min-h-[420px] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-[#b8860b]/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(184,134,11,0.22),transparent_48%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-goldenrod mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Product Discovery
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Product <span className="text-goldenrod">Catalog</span>
            </h1>
            <p className="text-xl text-white/85 leading-relaxed font-opensans">
              Browse our live catalog of RF filters, satellite amplifiers, and defence electronics. Every product includes detailed specifications.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
              <div className="rounded-xl border border-white/15 bg-black/35 px-4 py-3">
                <p className="text-2xl font-bold text-goldenrod">{products.length}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Total Products</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-black/35 px-4 py-3">
                <p className="text-2xl font-bold text-goldenrod">{Math.max(categoryOptions.length - 1, 0)}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Categories</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-black/35 px-4 py-3 col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-goldenrod">{filteredProducts.length}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Filtered View</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-[#090909] via-[#111111] to-[#181818]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sticky top-24 space-y-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-6 h-6 text-goldenrod" />
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-white/35 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search products"
                      className="w-full pl-9 pr-4 py-3 rounded-lg border border-white/15 bg-black/40 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-goldenrod/35 focus:border-goldenrod/45"
                    />
                  </div>
                </div>

                <FilterGroup
                  title="Category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  formatLabel={(value) => (value === 'all' ? 'All Categories' : getCategoryLabel(value))}
                />

                <FilterGroup
                  title="Type"
                  options={typeOptions}
                  value={selectedType}
                  onChange={setSelectedType}
                  formatLabel={(value) => (value === 'all' ? 'All Types' : value)}
                />

                <FilterGroup
                  title="Frequency"
                  options={frequencyOptions}
                  value={selectedFrequency}
                  onChange={setSelectedFrequency}
                  formatLabel={(value) => (value === 'all' ? 'All Frequencies' : value)}
                />

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/65 font-opensans">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full text-sm border border-goldenrod/35 bg-goldenrod/10 text-goldenrod hover:bg-goldenrod hover:text-white transition-all duration-300 py-3 rounded-lg font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-goldenrod font-semibold mb-1">Refined Results</p>
                    <p className="text-white/75 font-opensans text-sm">Use filters to narrow by category, type, and frequency range.</p>
                  </div>
                  <p className="text-sm text-white/70 font-opensans">Showing <span className="text-goldenrod font-semibold">{filteredProducts.length}</span> products</p>
                </div>
                {activeFilters.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeFilters.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => clearSingleFilter(item.key)}
                        className="inline-flex items-center gap-2 rounded-full border border-goldenrod/35 bg-black/45 px-3 py-1.5 text-xs text-[#ffd77d] hover:bg-goldenrod/20 transition-colors"
                      >
                        <span>{item.label}</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-20">
                  <p className="text-goldenrod font-opensans text-lg">Loading products...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-20">
                  <p className="text-red-500 font-opensans text-lg">{error}</p>
                </div>
              )}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                  <SlidersHorizontal className="w-16 h-16 text-goldenrod/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                  <p className="text-lg text-white/65 mb-6 font-opensans">
                    Try changing the filters to see more results.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-goldenrod text-white px-8 py-4 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && !error && groupedProducts.length > 0 && (
                <div className="space-y-10">
                  {groupedProducts.map((group) => (
                    <div key={group.category} className="space-y-5">
                      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-goldenrod font-semibold mb-2">
                            Main Category
                          </p>
                          <h2 className="text-2xl font-bold text-white">{group.label}</h2>
                        </div>
                        <Link
                          to={`/products?category=${group.category}`}
                          className="text-sm text-goldenrod font-semibold hover:text-[#ffd77d]"
                        >
                          Filter this category
                        </Link>
                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 stagger-grid">
                        {group.products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function FilterGroup({
  title,
  options,
  value,
  onChange,
  formatLabel,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatLabel: (value: string) => string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="space-y-2 max-h-56 overflow-auto pr-1">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name={title}
              value={option}
              checked={value === option}
              onChange={(event) => onChange(event.target.value)}
              className="w-4 h-4 text-goldenrod border-white/30 bg-transparent focus:ring-goldenrod"
            />
            <span className="text-white/70 group-hover:text-goldenrod transition-colors duration-300 text-sm font-opensans">
              {formatLabel(option)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imgUrl = productImageUrls(product)[0] || null;
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white/5 rounded-2xl border border-white/12 hover:border-goldenrod/35 transition-all duration-300 hover:shadow-[0_24px_64px_rgba(0,0,0,0.38)] group transform hover:-translate-y-2 overflow-hidden block motion-soft-card backdrop-blur-sm"
    >
      <div className="w-full h-48 bg-black/50 overflow-hidden relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/55">
            <Zap className="w-16 h-16 text-goldenrod/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 group-hover:from-black/45 transition-colors duration-300" />
        <div className="absolute top-4 right-4 bg-black/70 border border-goldenrod/35 rounded-full px-3 py-1 text-xs font-semibold text-goldenrod backdrop-blur-sm">
          {product.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-goldenrod transition-colors duration-300">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-white/72 leading-relaxed mb-4 font-opensans line-clamp-3">
            {product.description}
          </p>
        )}
        {product.features.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50 mb-2">Key Features</p>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-white/65 text-sm flex items-center gap-2 font-opensans">
                  <span className="w-1.5 h-1.5 rounded-full bg-goldenrod flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.price && <p className="text-goldenrod font-bold text-sm mb-4">{product.price}</p>}
        <div className="w-full bg-goldenrod text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          View Details <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default Products;
