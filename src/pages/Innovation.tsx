import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, FlaskConical, Lightbulb } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

type Pair = { title: string; body: string };
type Step = { step: string; title: string; body: string };
type Metric = { value: string; label: string };
type Project = { title: string; problem: string; approach: string; outcome: string };

type InnovationPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
  };
  focusAreas: Pair[];
  labCapabilities: string[];
  pipeline: Step[];
  metrics: Metric[];
  featuredProjects: Project[];
  cta: {
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
    secondaryText: string;
    secondaryUrl: string;
  };
};

const fallbackContent: InnovationPageContent = {
  hero: {
    eyebrow: 'Innovation Lab',
    title: 'Research-Led RF Innovation For Strategic Missions',
    subtitle: 'From concept validation to deployable subsystems, our innovation programs transform mission constraints into reliable RF and microwave outcomes.',
    primaryCtaText: 'Discuss Innovation Program',
    primaryCtaUrl: '/contact',
    secondaryCtaText: 'Book Technical Session',
    secondaryCtaUrl: '/book-appointment',
  },
  focusAreas: [],
  labCapabilities: [],
  pipeline: [],
  metrics: [],
  featuredProjects: [],
  cta: {
    title: 'Co-Create Your Next Innovation Program',
    description: 'Bring your technical challenge to our innovation team and we will define an actionable R&D pathway.',
    primaryText: 'Start Innovation Discussion',
    primaryUrl: '/contact',
    secondaryText: 'Schedule Discovery Call',
    secondaryUrl: '/book-appointment',
  },
};

export default function Innovation() {
  const [content, setContent] = useState<InnovationPageContent>(fallbackContent);
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/innovation-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load innovation page');
        return res.json() as Promise<InnovationPageContent>;
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
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      <section className="relative min-h-[360px] flex items-center overflow-hidden bg-[#101010]">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111]/90 via-[#111]/70 to-goldenrod/55" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80 font-semibold mb-4">{content.hero.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{content.hero.title}</h1>
            <p className="text-lg md:text-xl text-white/85 font-opensans leading-relaxed">{content.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={content.hero.primaryCtaUrl || '#'} className="bg-goldenrod text-white px-7 py-3 rounded-full font-semibold hover:bg-goldenrod/90 transition-all duration-300">
                {content.hero.primaryCtaText}
              </a>
              <a href={content.hero.secondaryCtaUrl || '#'} className="border border-white/40 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                {content.hero.secondaryCtaText}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#fffdf6] to-[#f6efdf]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">R&D Focus</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Innovation Focus Areas</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.focusAreas.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-2xl border border-goldenrod/20 bg-white p-6 shadow-[0_14px_30px_rgba(109,79,24,0.08)]">
                <p className="text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-3">Track {index + 1}</p>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-black/70 font-opensans leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
          <article className="rounded-2xl border border-goldenrod/20 bg-[#fff9ec] p-6">
            <h3 className="text-2xl font-bold text-black mb-4">Lab Capabilities</h3>
            <div className="space-y-3">
              {content.labCapabilities.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                  <p className="text-black/75 font-opensans">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-goldenrod/20 bg-[#fffef8] p-6">
            <h3 className="text-2xl font-bold text-black mb-4">Innovation Pipeline</h3>
            <div className="space-y-4">
              {content.pipeline.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-xl border border-goldenrod/20 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-1">Step {item.step || index + 1}</p>
                  <h4 className="font-bold text-black mb-1">{item.title}</h4>
                  <p className="text-black/70 text-sm font-opensans">{item.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-12 bg-[#f8f2e1] border-y border-goldenrod/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.metrics.map((item, index) => (
            <article key={`${item.value}-${index}`} className="rounded-2xl bg-white border border-goldenrod/20 p-5 text-center">
              <p className="text-3xl font-bold text-goldenrod">{item.value}</p>
              <p className="text-sm text-black/70 font-opensans mt-2">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-goldenrod font-semibold mb-3">Project Highlights</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Featured Innovation Projects</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {content.featuredProjects.map((item, index) => (
              <article key={`${item.title}-${index}`} className="rounded-2xl border border-goldenrod/20 bg-gradient-to-b from-white to-[#fff8e7] p-6 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-4">{item.title}</h3>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Problem</p>
                <p className="text-black/70 font-opensans mb-3">{item.problem}</p>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Approach</p>
                <p className="text-black/70 font-opensans mb-3">{item.approach}</p>
                <p className="text-sm uppercase text-goldenrod font-semibold mb-1">Outcome</p>
                <p className="text-black/70 font-opensans">{item.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#fffef9] to-[#f7efdd] border-t border-goldenrod/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full border border-goldenrod/25 bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-5">
            <FlaskConical className="w-3.5 h-3.5 mr-2" />Innovation Collaboration
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">{content.cta.title}</h2>
          <p className="text-black/70 text-lg font-opensans mb-8">{content.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={content.cta.primaryUrl || '#'} className="bg-goldenrod text-white px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 inline-flex items-center justify-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {content.cta.primaryText}
            </a>
            <a href={content.cta.secondaryUrl || '#'} className="border-2 border-goldenrod text-goldenrod px-8 py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2">
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
