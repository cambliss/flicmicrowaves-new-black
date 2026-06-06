import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = 'http://localhost:4001';

type Pair = { title: string; body: string };
type Role = { title: string; location: string; type: string; experience: string; summary: string };
type Faq = { question: string; answer: string };
type ProcessStep = { step: string; title: string; body: string };

type CareersPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
  };
  whyJoin: string[];
  openRoles: Role[];
  culture: Pair[];
  hiringProcess: ProcessStep[];
  benefits: string[];
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

const fallbackContent: CareersPageContent = {
  hero: {
    eyebrow: 'Careers At Flic Microwaves',
    title: 'Build Mission-Ready Technology With Us',
    subtitle: 'Join teams designing and delivering RF and microwave systems for defence, aerospace, satellite, and critical communication programs.',
    primaryCtaText: 'Apply Now',
    primaryCtaUrl: '/contact',
    secondaryCtaText: 'Talk To HR',
    secondaryCtaUrl: '/contact',
  },
  whyJoin: [],
  openRoles: [],
  culture: [],
  hiringProcess: [],
  benefits: [],
  faq: [],
  cta: {
    title: 'Ready To Build With Flic Microwaves?',
    description: 'Share your profile and area of interest. Our hiring team will connect with suitable opportunities.',
    primaryText: 'Submit Application',
    primaryUrl: '/contact',
    secondaryText: 'Connect With HR',
    secondaryUrl: '/contact',
  },
};

export default function Careers() {
  const [content, setContent] = useState<CareersPageContent>(fallbackContent);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/careers-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load careers page');
        return res.json() as Promise<CareersPageContent>;
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
      <section className="relative min-h-[380px] flex items-center overflow-hidden bg-black border-b border-goldenrod/30">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/62 to-[#b8860b]/28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(184,134,11,0.24),transparent_46%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-goldenrod font-semibold mb-4">{content.hero.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">{content.hero.title}</h1>
            <p className="text-lg md:text-xl text-white/80 font-opensans leading-relaxed">{content.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={content.hero.primaryCtaUrl || '#'} className="bg-goldenrod text-white px-7 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300">
                {content.hero.primaryCtaText}
              </a>
              <a href={content.hero.secondaryCtaUrl || '#'} className="border border-goldenrod/60 text-goldenrod px-7 py-3 font-semibold hover:bg-goldenrod/10 transition-all duration-300">
                {content.hero.secondaryCtaText}
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 border border-goldenrod/30 bg-[linear-gradient(165deg,rgba(255,255,255,0.03),rgba(184,134,11,0.08))] backdrop-blur-md p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-goldenrod font-semibold mb-4">Why Join</p>
            <div className="space-y-3">
              {content.whyJoin.slice(0, 4).map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-goldenrod mt-1" />
                  <p className="text-sm text-white/90 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#070707] via-[#111111] to-[#18120a] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Open Positions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Current Opportunities</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.openRoles.map((role, index) => (
              <article key={`${role.title}-${index}`} className="border border-goldenrod/30 bg-[linear-gradient(165deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_14px_28px_rgba(0,0,0,0.3)]">
                <h3 className="text-xl font-bold text-white mb-3">{role.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 border border-goldenrod/35 bg-black/50 text-white/80"><MapPin className="w-3 h-3" /> {role.location}</span>
                  <span className="text-xs px-3 py-1 border border-goldenrod/35 bg-black/50 text-white/80">{role.type}</span>
                  <span className="text-xs px-3 py-1 border border-goldenrod/35 bg-black/50 text-white/80">{role.experience}</span>
                </div>
                <p className="text-white/72 font-opensans leading-relaxed">{role.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#060606] to-[#141414] border-b border-goldenrod/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <article className="border border-goldenrod/30 bg-[linear-gradient(180deg,rgba(184,134,11,0.08),rgba(255,255,255,0.02))] p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Culture At Flic</h3>
            <div className="space-y-4">
              {content.culture.map((item, index) => (
                <div key={`${item.title}-${index}`} className="border border-goldenrod/25 bg-black/45 p-4">
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-white/72 font-opensans text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="border border-goldenrod/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(184,134,11,0.08))] p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Benefits</h3>
            <div className="space-y-3">
              {content.benefits.map((item, index) => (
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
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Hiring Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Hiring Process</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.hiringProcess.map((item, index) => (
              <article key={`${item.title}-${index}`} className="border border-goldenrod/35 bg-[linear-gradient(180deg,rgba(184,134,11,0.1),rgba(255,255,255,0.02))] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-2">Step {item.step || index + 1}</p>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/72 font-opensans text-sm leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#0a0704] to-[#131313] border-b border-goldenrod/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {content.faq.map((item, index) => (
              <details key={`${item.question}-${index}`} className="border border-goldenrod/30 p-4 bg-black/35">
                <summary className="font-semibold text-white cursor-pointer">{item.question}</summary>
                <p className="mt-3 text-white/72 font-opensans">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#121212] border-t border-goldenrod/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="w-10 h-10 text-goldenrod mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.cta.title}</h2>
          <p className="text-white/72 text-lg font-opensans mb-8">{content.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={content.cta.primaryUrl || '#'} className="bg-goldenrod text-white px-8 py-3 font-semibold hover:bg-goldenrod/90 transition-all duration-300">
              {content.cta.primaryText}
            </a>
            <a href={content.cta.secondaryUrl || '#'} className="border-2 border-goldenrod text-goldenrod px-8 py-3 font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300">
              {content.cta.secondaryText}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
