import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Radar, Shield } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = 'http://localhost:4001';

type Pair = { title: string; body: string };
type Metric = { value: string; label: string };
type FeaturedProgram = { title: string; sector: string; challenge: string; outcome: string };

type IndustriesPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
  };
  sectors: Pair[];
  capabilities: string[];
  compliance: string[];
  deploymentModel: Pair[];
  featuredPrograms: FeaturedProgram[];
  metrics: Metric[];
  coverage: string[];
  cta: {
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
    secondaryText: string;
    secondaryUrl: string;
  };
};

const fallbackContent: IndustriesPageContent = {
  hero: {
    eyebrow: 'Industries We Serve',
    title: 'Defence-Focused Industries And Mission Domains',
    subtitle: 'We support strategic sectors that require dependable RF and microwave performance across communication, surveillance, and secure infrastructure programs.',
    primaryCtaText: 'Discuss Industry Requirements',
    primaryCtaUrl: '/contact',
    secondaryCtaText: 'Book Consultation',
    secondaryCtaUrl: '/book-appointment',
  },
  sectors: [],
  capabilities: [],
  compliance: [],
  deploymentModel: [],
  featuredPrograms: [],
  metrics: [],
  coverage: [],
  cta: {
    title: 'Build Your Next Industry Program With Flic Microwaves',
    description: 'Share your sector-specific requirements and mission priorities. We will align a solution pathway that fits your operational context.',
    primaryText: 'Request Industry Consultation',
    primaryUrl: '/contact',
    secondaryText: 'Book A Technical Session',
    secondaryUrl: '/book-appointment',
  },
};

const mapPositions = [
  { left: '12%', top: '18%' },
  { left: '58%', top: '16%' },
  { left: '34%', top: '37%' },
  { left: '72%', top: '42%' },
  { left: '18%', top: '61%' },
  { left: '52%', top: '72%' },
  { left: '80%', top: '76%' },
  { left: '8%', top: '82%' },
];

export default function Industries() {
  const [content, setContent] = useState<IndustriesPageContent>(fallbackContent);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/industries-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load industries page');
        return res.json() as Promise<IndustriesPageContent>;
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

  return (
    <div className="min-h-screen bg-black font-montserrat overflow-x-hidden pt-24 text-white">
      <section className="relative min-h-[390px] flex items-center overflow-hidden bg-black border-b border-goldenrod/30">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/62 to-[#b8860b]/28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(184,134,11,0.24),transparent_46%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-goldenrod font-semibold mb-4">{content.hero.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{content.hero.title}</h1>
            <p className="text-xl text-white/80 leading-relaxed font-opensans">{content.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={content.hero.primaryCtaUrl || '#'} className="bg-goldenrod text-white px-7 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300">{content.hero.primaryCtaText}</a>
              <a href={content.hero.secondaryCtaUrl || '#'} className="border border-goldenrod/60 text-goldenrod px-7 py-3 font-semibold hover:bg-goldenrod/10 transition-all duration-300">{content.hero.secondaryCtaText}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] via-[#111111] to-[#18120a] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Sectors</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Industry Domains We Support</h2>
              <p className="text-white/70 font-opensans leading-relaxed mb-6">
                A defence-first sector map highlighting where our RF and microwave systems are deployed and sustained.
              </p>

              <div className="industries-grid-panel p-6 h-[360px] relative overflow-hidden">
                {content.sectors.slice(0, 8).map((item, index) => {
                  const pos = mapPositions[index % mapPositions.length];
                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="industries-sector-node absolute"
                      style={{ left: pos.left, top: pos.top }}
                    >
                      <span>{item.title}</span>
                    </div>
                  );
                })}
                <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 border border-goldenrod/35 bg-black/70 px-3 py-1 text-xs font-semibold text-goldenrod">
                  <Radar className="w-3.5 h-3.5" />
                  Strategic Coverage
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid md:grid-cols-2 gap-5">
              {content.sectors.map((item, index) => (
                <article key={`${item.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(165deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-2">Sector {index + 1}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 font-opensans leading-relaxed">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#060606] to-[#141414] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <article className="border border-goldenrod/30 p-6 industries-capability-panel">
            <h3 className="text-2xl font-bold text-white mb-4">Capability Coverage</h3>
            <div className="space-y-3">
              {content.capabilities.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/75 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-goldenrod/30 p-6 industries-compliance-panel">
            <h3 className="text-2xl font-bold text-white mb-4">Compliance And Governance</h3>
            <div className="space-y-3">
              {content.compliance.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/75 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-black via-[#14100a] to-black border-y border-goldenrod/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Execution</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Deployment Model</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.deploymentModel.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/35 bg-[linear-gradient(180deg,rgba(184,134,11,0.1),rgba(255,255,255,0.02))] p-6 backdrop-blur-sm industries-phase-card">
                <p className="text-sm uppercase tracking-[0.2em] text-goldenrod font-semibold mb-2">Phase {index + 1}</p>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/75 font-opensans leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0704] to-[#131313] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Snapshots</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Industry Programs</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {content.featuredPrograms.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(160deg,rgba(255,255,255,0.02),rgba(184,134,11,0.09))] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.32)]">
                <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-2">{item.sector}</p>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Challenge</p>
                <p className="text-white/70 font-opensans mb-3">{item.challenge}</p>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Outcome</p>
                <p className="text-white/70 font-opensans">{item.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black border-y border-goldenrod/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.metrics.map((item, index) => (
            <article key={`${item.value}-${index}`} className="border border-goldenrod/35 p-5 text-center industries-metric-tile">
              <p className="text-3xl font-bold text-goldenrod">{item.value}</p>
              <p className="text-sm text-white/70 font-opensans mt-2">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] to-[#171109] border-b border-goldenrod/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="border border-goldenrod/30 p-6 bg-[linear-gradient(180deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))]">
            <h3 className="text-2xl font-bold text-white mb-4">Coverage And Collaboration</h3>
            <div className="space-y-3">
              {content.coverage.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/75 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#121212] border-t border-goldenrod/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.cta.title}</h2>
          <p className="text-white/72 text-lg font-opensans mb-8">{content.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={content.cta.primaryUrl || '#'} className="bg-goldenrod text-white px-8 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300 inline-flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              {content.cta.primaryText}
            </a>
            <a href={content.cta.secondaryUrl || '#'} className="border-2 border-goldenrod text-goldenrod px-8 py-3 font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2">
              {content.cta.secondaryText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
