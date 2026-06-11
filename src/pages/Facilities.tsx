import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

type FacilityItem = {
  id: string;
  title: string;
  summary: string;
  details: string;
  image: string;
};

type FacilitiesPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
  };
  intro: {
    heading: string;
    description: string;
  };
  facilities: FacilityItem[];
  cta: {
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
  };
};

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

const fallbackContent: FacilitiesPageContent = {
  hero: {
    eyebrow: 'Our Facilities',
    title: 'Advanced Infrastructure For RF And Microwave Excellence',
    subtitle:
      'From design and simulation to precision testing and integration, our facilities are built to deliver consistent, mission-ready outcomes.',
    primaryCtaText: 'Explore Facilities',
    primaryCtaUrl: '#facilities-grid',
  },
  intro: {
    heading: 'Engineering, Validation, And Production Under One Roof',
    description:
      'Our ecosystem combines CAD engineering, RF testing labs, environmental verification, and assembly capabilities for complete lifecycle support.',
  },
  facilities: [
    {
      id: 'rf-lab',
      title: 'RF And Microwave Lab',
      summary: 'Design and prototyping for high-frequency subsystems.',
      details:
        'Simulation-led engineering with HFSS/CST workflows for filters, transceivers, and amplification chains from concept to prototype.',
      image: '/facilities/facilities-reference.jpeg',
    },
    {
      id: 'test-lab',
      title: 'Testing And Validation Lab',
      summary: 'Structured verification for repeatable RF performance.',
      details:
        'Includes RF characterization, insertion-loss profiling, thermal checks, and qualification evidence generation for program acceptance.',
      image: '/facilities/facilities-reference.jpeg',
    },
    {
      id: 'cad-center',
      title: 'CAD Design Center',
      summary: 'Mechanical and package design for integration readiness.',
      details:
        'Precision CAD workflows focused on manufacturability, thermal management, and stable fitment in mission-constrained platforms.',
      image: '/facilities/facilities-reference.jpeg',
    },
    {
      id: 'integration-bay',
      title: 'Assembly And Integration Facility',
      summary: 'Controlled build and final subsystem integration.',
      details:
        'Build, alignment, and interface integration checkpoints to ensure consistent output quality before customer deployment.',
      image: '/facilities/facilities-reference.jpeg',
    },
  ],
  cta: {
    title: 'Need A Facility Walkthrough For Your Program?',
    description: 'Talk with our team and plan a technical walkthrough aligned to your RF and microwave requirements.',
    primaryText: 'Schedule A Visit',
    primaryUrl: '/contact',
  },
};

export default function Facilities() {
  const [content, setContent] = useState<FacilitiesPageContent>(fallbackContent);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/facilities-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load facilities page');
        return res.json() as Promise<FacilitiesPageContent>;
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

  const facilities = useMemo(() => (Array.isArray(content.facilities) ? content.facilities : []), [content.facilities]);

  const toImageUrl = (raw?: string) => {
    if (!raw) return '/facilities/facilities-reference.jpeg';
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) return raw;
    return `${BASE_URL}/uploads/${raw}`;
  };

  return (
    <div className="min-h-screen bg-black font-montserrat overflow-x-hidden pt-24 text-white">
      <section className="relative min-h-[360px] flex items-center overflow-hidden bg-black border-b border-goldenrod/30">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-[#b8860b]/22" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(184,134,11,0.24),transparent_44%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-goldenrod font-semibold mb-4">{content.hero.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">{content.hero.title}</h1>
          <p className="text-lg md:text-xl text-white/80 font-opensans leading-relaxed max-w-3xl mb-8">{content.hero.subtitle}</p>
          <a href={content.hero.primaryCtaUrl || '#facilities-grid'} className="inline-flex items-center gap-2 bg-goldenrod px-7 py-3 font-semibold text-white hover:bg-goldenrod/90 transition-all duration-300">
            {content.hero.primaryCtaText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] to-[#131313] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.intro.heading}</h2>
          <p className="text-white/70 max-w-4xl mx-auto font-opensans leading-relaxed">{content.intro.description}</p>
        </div>
      </section>

      <section id="facilities-grid" className="pb-16 bg-gradient-to-b from-[#090909] via-[#111111] to-[#171109]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-goldenrod/50 mb-8" />
          <div className="space-y-8">
            {facilities.map((facility, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={`${facility.id}-${index}`}
                  id={facility.id}
                  className="grid md:grid-cols-2 border border-goldenrod/30 bg-[linear-gradient(165deg,rgba(255,255,255,0.02),rgba(184,134,11,0.08))] overflow-hidden motion-soft-card shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className={`${isEven ? 'md:order-1' : 'md:order-2'} min-h-[260px]`}>
                    <img src={toImageUrl(facility.image)} alt={facility.title} className="w-full h-full min-h-[260px] object-cover" />
                  </div>

                  <div className={`${isEven ? 'md:order-2' : 'md:order-1'} p-6 md:p-8 flex flex-col justify-center`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Facility {index + 1}</p>
                    <h3 className="text-2xl md:text-[1.9rem] font-bold text-white mb-3">{facility.title}</h3>
                    <p className="text-goldenrod font-semibold text-sm md:text-base mb-4">{facility.summary}</p>
                    <p className="text-white/72 text-sm md:text-base font-opensans leading-relaxed">{facility.details}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#080808] to-[#121212] border-y border-goldenrod/25">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border border-goldenrod/30 bg-[linear-gradient(160deg,rgba(5,5,5,0.85),rgba(184,134,11,0.08))] p-8 md:p-10 text-center">
          <h3 className="text-3xl font-bold text-white mb-3">{content.cta.title}</h3>
          <p className="text-white/72 font-opensans mb-6">{content.cta.description}</p>
          <a href={content.cta.primaryUrl || '/contact'} className="inline-flex items-center gap-2 bg-goldenrod px-7 py-3 font-semibold text-white hover:bg-goldenrod/90 transition-all duration-300">
            {content.cta.primaryText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
