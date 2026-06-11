import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

type Pair = { title: string; body: string };
type Metric = { value: string; label: string };
type CaseStudy = { title: string; challenge: string; solution: string; outcome: string };
type Faq = { question: string; answer: string };

type SolutionsPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
  };
  categories: Pair[];
  applications: string[];
  engineeringDepth: string[];
  qualityCompliance: string[];
  lifecycleSupport: Pair[];
  caseStudies: CaseStudy[];
  metrics: Metric[];
  security: string[];
  faq: Faq[];
  cta: {
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
    secondaryText: string;
    secondaryUrl: string;
  };
};

const fallbackSolutionsPage: SolutionsPageContent = {
  hero: {
    eyebrow: 'Defence Solutions',
    title: 'Mission-Ready RF And Microwave Solutions',
    subtitle:
      'Engineered for tactical communication, radar, EW, and satellite-linked defence programs where reliability is non-negotiable.',
    primaryCtaText: 'Discuss Program Requirements',
    primaryCtaUrl: '/contact',
    secondaryCtaText: 'Book Engineering Consultation',
    secondaryCtaUrl: '/book-appointment',
  },
  categories: [],
  applications: [],
  engineeringDepth: [],
  qualityCompliance: [],
  lifecycleSupport: [],
  caseStudies: [],
  metrics: [],
  security: [],
  faq: [],
  cta: {
    title: 'Start Your Defence Program Discussion',
    description: 'Share your technical requirements and timelines. Our engineering team will propose a mission-fit solution path.',
    primaryText: 'Request Technical Discussion',
    primaryUrl: '/contact',
    secondaryText: 'Submit RF Specification',
    secondaryUrl: '/contact',
  },
};

export default function Solutions() {
  const [pageContent, setPageContent] = useState<SolutionsPageContent>(fallbackSolutionsPage);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/solutions-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load solutions page');
        return res.json() as Promise<SolutionsPageContent>;
      })
      .then((data) => {
        if (mounted && data) setPageContent(data);
      })
      .catch(() => {
        if (mounted) setPageContent(fallbackSolutionsPage);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="solutions-page-font min-h-screen bg-black font-montserrat overflow-x-hidden pt-24 text-white">
      <section className="relative min-h-[390px] flex items-center overflow-hidden bg-black border-b border-goldenrod/30">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/62 to-[#b8860b]/28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(184,134,11,0.24),transparent_46%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-goldenrod font-semibold mb-4">{pageContent.hero.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{pageContent.hero.title}</h1>
            <p className="text-xl text-white/80 leading-relaxed font-opensans">{pageContent.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={pageContent.hero.primaryCtaUrl || '#'} className="bg-goldenrod text-white px-7 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300 shadow-[0_16px_40px_rgba(184,134,11,0.2)]">
                {pageContent.hero.primaryCtaText}
              </a>
              <a href={pageContent.hero.secondaryCtaUrl || '#'} className="border border-goldenrod/60 text-goldenrod px-7 py-3 font-semibold hover:bg-goldenrod/10 transition-all duration-300">
                {pageContent.hero.secondaryCtaText}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] via-[#111111] to-[#18120a] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Core Offerings</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Defence Solution Categories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageContent.categories.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(165deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-3">Category {index + 1}</p>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 font-opensans leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#060606] to-[#141414] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <article className="border border-goldenrod/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(184,134,11,0.05))] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-bold text-white mb-4">Application Platforms</h3>
            <div className="space-y-3">
              {pageContent.applications.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/70 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-goldenrod/35 bg-[linear-gradient(180deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-bold text-white mb-4">Engineering Depth</h3>
            <div className="space-y-3">
              {pageContent.engineeringDepth.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/70 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-goldenrod/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(184,134,11,0.07))] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-bold text-white mb-4">Quality And Compliance</h3>
            <div className="space-y-3">
              {pageContent.qualityCompliance.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/70 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-black via-[#14100a] to-black border-y border-goldenrod/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Lifecycle</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Program Lifecycle Support</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageContent.lifecycleSupport.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(170deg,rgba(184,134,11,0.1),rgba(255,255,255,0.02))] p-6 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-goldenrod font-semibold mb-2">Step {index + 1}</p>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 font-opensans leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0704] to-[#131313] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Program Snapshots</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Case Studies</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {pageContent.caseStudies.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(160deg,rgba(255,255,255,0.02),rgba(184,134,11,0.09))] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.32)]">
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Challenge</p>
                <p className="text-white/70 font-opensans mb-3">{item.challenge}</p>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Solution</p>
                <p className="text-white/70 font-opensans mb-3">{item.solution}</p>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Outcome</p>
                <p className="text-white/70 font-opensans">{item.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black border-y border-goldenrod/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {pageContent.metrics.map((item, index) => (
            <article key={`${item.value}-${index}`} className="bg-[linear-gradient(180deg,rgba(184,134,11,0.11),rgba(255,255,255,0.02))] border border-goldenrod/35 p-5 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-goldenrod">{item.value}</p>
              <p className="text-sm text-white/70 font-opensans mt-2">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] to-[#171109] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <article className="border border-goldenrod/30 p-6 bg-[linear-gradient(180deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))]">
            <h3 className="text-2xl font-bold text-white mb-4">Security And Confidentiality</h3>
            <div className="space-y-3">
              {pageContent.security.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-white/70 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-goldenrod/30 p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(184,134,11,0.07))]">
            <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {pageContent.faq.map((item, index) => (
                <details key={`${item.question}-${index}`} className="border border-goldenrod/30 p-4 bg-black/35">
                  <summary className="font-semibold text-white cursor-pointer">{item.question}</summary>
                  <p className="mt-3 text-white/72 font-opensans">{item.answer}</p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#121212] border-t border-goldenrod/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{pageContent.cta.title}</h2>
          <p className="text-white/72 text-lg font-opensans mb-8">{pageContent.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={pageContent.cta.primaryUrl || '#'} className="bg-goldenrod text-white px-8 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300">
              {pageContent.cta.primaryText}
            </a>
            <a href={pageContent.cta.secondaryUrl || '#'} className="border-2 border-goldenrod text-goldenrod px-8 py-3 font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300">
              {pageContent.cta.secondaryText}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
