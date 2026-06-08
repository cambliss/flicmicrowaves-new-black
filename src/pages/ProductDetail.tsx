import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Mail, Phone, Settings } from 'lucide-react';
import Footer from '../components/Footer';
import { fetchProduct, productImageUrls, UPLOADS_BASE, type Product } from '../api/products';
import useCmsBanner from '../hooks/useCmsBanner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    if (!id) {
      setError('Product not found.');
      setLoading(false);
      return;
    }

    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError('Could not load the product details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const imageUrls = productImageUrls(product);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white font-semibold hover:text-white/80 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Product <span className="text-black">Details</span></h1>
            <p className="text-white/90 font-opensans text-lg">
              Specifications, performance metrics, and technical documentation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-goldenrod font-opensans text-lg">Loading product details...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 font-opensans text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && product && (
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-goldenrod/20 shadow-sm">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                  <div>
                    {imageUrls.length > 0 && (
                      <div className="space-y-4">
                        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-goldenrod/10 via-white to-goldenrod/5 rounded-2xl overflow-hidden border border-goldenrod/25 shadow-[0_20px_45px_rgba(184,134,11,0.12)]">
                          <img
                            src={imageUrls[activeImageIndex]}
                            alt={`${product.name} ${activeImageIndex + 1}`}
                            className="w-full h-full object-contain p-4 md:p-6"
                          />
                          {imageUrls.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => setActiveImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                aria-label="Previous image"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveImageIndex((prev) => (prev + 1) % imageUrls.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                aria-label="Next image"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>

                        {imageUrls.length > 1 && (
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            {imageUrls.map((url, index) => (
                              <button
                                key={`${url}-${index}`}
                                type="button"
                                onClick={() => setActiveImageIndex(index)}
                                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                                  index === activeImageIndex
                                    ? 'border-goldenrod shadow-[0_0_0_2px_rgba(184,134,11,0.18)]'
                                    : 'border-goldenrod/20 hover:border-goldenrod/50'
                                }`}
                              >
                                <img
                                  src={url}
                                  alt={`${product.name} thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    <p className="inline-flex items-center px-3 py-1 rounded-full bg-goldenrod/10 text-goldenrod text-xs font-semibold mb-4 uppercase tracking-[0.2em]">
                      {product.category}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-4">{product.name}</h2>
                    {product.price && <p className="text-2xl font-bold text-goldenrod mb-4">{product.price}</p>}

                    {product.description && (
                      <p className="text-base md:text-lg text-black/75 leading-relaxed font-opensans mb-8">
                        {product.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <button className="border-2 border-goldenrod text-goldenrod px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" /> Request Quote
                      </button>
                      <button className="bg-goldenrod text-white px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" /> Contact Sales
                      </button>
                    </div>

                    {product.datasheet && (
                      <div className="mt-5">
                        <a
                          href={`${UPLOADS_BASE}/${product.datasheet}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-goldenrod underline text-sm font-opensans"
                        >
                          Download Datasheet (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-goldenrod/20 pt-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-goldenrod/80 font-semibold mb-2">Product Summary</p>
                  <p className="text-black/70 font-opensans leading-relaxed">
                    Review complete technical details, feature highlights, and application-specific suitability below.
                  </p>
                </div>
              </div>

              {product.features.length > 0 && (
                <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="w-6 h-6 text-goldenrod" />
                    <h3 className="text-2xl font-bold text-black">Key Features</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-goldenrod flex-shrink-0 mt-0.5" />
                        <span className="text-black/80 font-opensans">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.specifications.length > 0 && (
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

              {product.applications.length > 0 && (
                <div className="bg-white p-8 rounded-2xl border border-goldenrod/20">
                  <h3 className="text-2xl font-bold text-black mb-6">Applications</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.applications.map((application, index) => (
                      <span key={index} className="bg-goldenrod/10 text-goldenrod px-4 py-2 rounded-full text-sm font-semibold font-opensans">
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;