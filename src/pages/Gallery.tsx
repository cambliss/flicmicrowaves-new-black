import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

type GalleryItem = {
  image: string;
  title: string;
  alt: string;
};

type GalleryContent = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  images: GalleryItem[];
};

const fallbackContent: GalleryContent = {
  eyebrow: 'Gallery',
  heading: 'Engineering Gallery',
  subtitle: 'Explore snapshots from our labs, teams, and mission-critical RF integration work.',
  images: [],
};

export default function Gallery() {
  const [content, setContent] = useState<GalleryContent>(fallbackContent);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/gallery`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery content');
        return res.json() as Promise<GalleryContent>;
      })
      .then((data) => {
        if (mounted && data) setContent(data);
      })
      .catch(() => {
        if (mounted) setContent(fallbackContent);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const images = useMemo(() => {
    return (Array.isArray(content.images) ? content.images : []).map((item) => {
      const src = item.image?.startsWith('http') || item.image?.startsWith('/')
        ? item.image
        : `${BASE_URL}/uploads/${item.image}`;
      return {
        ...item,
        image: src,
        alt: item.alt || item.title || 'Gallery image',
      };
    });
  }, [content.images]);

  return (
    <div className="min-h-screen bg-black font-montserrat overflow-x-hidden pt-24 text-white">
      <section className="relative min-h-[320px] flex items-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 text-left">
          <p className="text-xs uppercase tracking-[0.35em] text-goldenrod font-semibold mb-4">{content.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{content.heading}</h1>
          <p className="text-lg md:text-xl text-white/75 font-opensans leading-relaxed max-w-3xl">{content.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#171717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center">
              <p className="text-white/65 font-opensans">No gallery images published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((item, index) => (
                <article
                  key={`${item.image}-${index}`}
                  className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-sm text-white/80 font-opensans">{item.title || `Gallery Image ${index + 1}`}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
