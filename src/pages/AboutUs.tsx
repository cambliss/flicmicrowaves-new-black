import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Radar,
  ShieldCheck,
  Orbit,
  Cpu,
  Factory,
  Globe2,
  CheckCircle2,
  Users,
  Target,
  Eye,
  Trophy,
  Award,
  ClipboardCheck,
  Mail,
  Phone,
} from 'lucide-react';
import Footer from '../components/Footer';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

type Stat = { value: string; label: string };
type Pair = { title: string; description: string };
type Capability = { title: string; body: string };
type Step = { step: string; title: string; body: string };
type Leader = { name: string; role: string; bio: string };
type Timeline = { year: string; title: string; body: string };

type AboutContent = {
  overview: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    bannerImage: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
    stats: Stat[];
  };
  journey: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    highlights: Pair[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Capability[];
  };
  operatingModel: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Step[];
  };
  leadership: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Leader[];
  };
  missionVision: {
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    valuesTitle: string;
    valuesText: string;
  };
  timeline: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Timeline[];
  };
  globalPresence: {
    eyebrow: string;
    title: string;
    points: string[];
    stats: Stat[];
  };
  awardsQuality: {
    awardsTitle: string;
    awards: string[];
    qualityTitle: string;
    qualityPoints: string[];
    certifications: string[];
  };
  mdMessage: {
    title: string;
    name: string;
    role: string;
    message: string;
    image: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
    secondaryText: string;
    secondaryUrl: string;
  };
};

const fallbackContent: AboutContent = {
  overview: {
    eyebrow: 'Who We Are',
    title: 'Engineering RF Advantage',
    highlight: 'For Mission-Critical Systems',
    description:
      'Flic Microwaves develops high-performance RF and microwave solutions for organizations where every decibel, every millisecond, and every deployment matters.',
    bannerImage: '',
    primaryCtaText: 'Talk To Our Team',
    primaryCtaUrl: '/contact',
    secondaryCtaText: 'Explore Capabilities',
    secondaryCtaUrl: '/products',
    stats: [
      { value: '25+', label: 'Years In RF Engineering' },
      { value: '500+', label: 'Programs Supported' },
      { value: '50+', label: 'Countries Served' },
      { value: '99.2%', label: 'On-Time Delivery Rate' },
    ],
  },
  journey: {
    eyebrow: 'Corporate Narrative',
    title: 'Built To Perform Where Failure Is Not An Option',
    paragraph1:
      'Our operating philosophy combines precision design, disciplined validation, and field-led collaboration. We do not build generic components. We build mission-fit systems designed to handle operational pressure.',
    paragraph2:
      'Across defence, telecom, and satellite ecosystems, our teams work as technical partners, not vendors, translating complex requirements into deployable hardware with measurable outcomes.',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=900',
    highlights: [
      { title: 'Integrated Manufacturing', description: 'Prototype-to-production continuity.' },
      { title: 'Global Delivery Footprint', description: 'Responsive support across regions.' },
    ],
  },
  capabilities: {
    eyebrow: 'What We Deliver',
    title: 'Capability Areas',
    subtitle: 'A unified engineering stack for high-reliability communications and electronics programs.',
    items: [
      {
        title: 'RF And Microwave Design',
        body: 'Custom filters, amplifiers, and front-end architectures tuned for precision, low loss, and field reliability.',
      },
      {
        title: 'Defence-Grade Reliability',
        body: 'Design and validation workflows aligned with harsh-environment requirements and mission-critical uptime.',
      },
      {
        title: 'Satellite And Space Readiness',
        body: 'Payload and ground-segment component expertise for LEO/MEO/GEO communication and tracking systems.',
      },
      {
        title: 'Advanced Engineering Stack',
        body: 'Simulation-first development using HFSS/CST, rapid prototyping loops, and repeatable performance verification.',
      },
    ],
  },
  operatingModel: {
    eyebrow: 'How We Execute',
    title: 'Our Operating Model',
    subtitle: 'Structured for speed, precision, and accountability from concept through deployment.',
    items: [
      {
        step: '01',
        title: 'Understand Mission Context',
        body: 'We align to your operational goals, constraints, and standards before architecture decisions begin.',
      },
      {
        step: '02',
        title: 'Engineer For Performance',
        body: 'Our team optimizes each subsystem for electromagnetic efficiency, manufacturability, and integration fit.',
      },
      {
        step: '03',
        title: 'Validate Under Stress',
        body: 'Every solution is tested against electrical and environmental targets to ensure repeatable field outcomes.',
      },
      {
        step: '04',
        title: 'Deploy With Support',
        body: 'From documentation to long-term technical response, we stay accountable throughout operational lifecycle.',
      },
    ],
  },
  leadership: {
    eyebrow: 'Leadership',
    title: 'Leadership Journey Of Flic Microwaves',
    subtitle: 'Experienced leadership with engineering depth, execution discipline, and long-term customer commitment.',
    items: [
      {
        name: 'A. K. Sharma',
        role: 'Managing Director',
        bio: 'Leads strategic growth, customer partnerships, and long-term program direction across global markets.',
      },
      {
        name: 'R. Mehta',
        role: 'Director - Engineering',
        bio: 'Drives RF architecture, simulation-led design, and performance validation for complex mission systems.',
      },
      {
        name: 'S. Iyer',
        role: 'Head - Operations & Quality',
        bio: 'Oversees production rigor, process excellence, and compliance-led delivery with quality-first governance.',
      },
    ],
  },
  missionVision: {
    missionTitle: 'Mission',
    missionText:
      'Engineer dependable RF and microwave solutions that enable secure, high-performance communication in critical applications.',
    visionTitle: 'Vision',
    visionText: 'Become the most trusted technology partner for advanced RF systems across defence, aerospace, and telecom markets.',
    valuesTitle: 'Core Values',
    valuesText: 'Integrity in execution, quality in every detail, innovation in design, and accountability through the product lifecycle.',
  },
  timeline: {
    eyebrow: 'Our Journey',
    title: 'Timeline And Milestones',
    subtitle: 'A milestone view of how Flic Microwaves evolved from a specialist engineering company to a strategic technology partner.',
    items: [
      {
        year: '2001',
        title: 'Foundation Of Flic Microwaves',
        body: 'Established with a focused mission to build dependable RF and microwave systems for demanding environments.',
      },
      {
        year: '2008',
        title: 'Expansion Into Defence Programs',
        body: 'Scaled engineering and testing capabilities to support high-reliability defence communication projects.',
      },
      {
        year: '2014',
        title: 'Satellite Communication Focus',
        body: 'Introduced specialized product lines for satellite payload and ground infrastructure requirements.',
      },
      {
        year: '2020',
        title: 'Global Program Delivery',
        body: 'Strengthened international delivery and service response model across strategic regions.',
      },
      {
        year: '2025',
        title: 'Advanced Quality Transformation',
        body: 'Implemented tighter quality governance with process digitization and traceability improvements.',
      },
    ],
  },
  globalPresence: {
    eyebrow: 'Global Presence',
    title: 'Trusted Across Strategic Programs Worldwide',
    points: [
      'Deployment support across defence, telecom, and aerospace sectors.',
      'Manufacturing discipline with validated quality and documentation standards.',
      'Long-lifecycle product support with engineering continuity.',
    ],
    stats: [
      { value: '150+', label: 'Engineering Specialists' },
      { value: '40+', label: 'Strategic Partners' },
      { value: '98%', label: 'Program Retention' },
      { value: '24/7', label: 'Technical Responsiveness' },
    ],
  },
  awardsQuality: {
    awardsTitle: 'Awards And Recognition',
    awards: [
      'Excellence In Indigenous RF Innovation',
      'Strategic Supplier Recognition For Mission Delivery',
      'Customer Excellence Award For Technical Responsiveness',
      'Program Reliability Recognition For Multi-Year Support',
    ],
    qualityTitle: 'Quality Management And Control',
    qualityPoints: [
      'Incoming and in-process quality checks with documented control plans.',
      'First article inspection and production validation with traceable reports.',
      'RF performance verification at subsystem and final assembly stages.',
      'Preventive and corrective action framework with root-cause closure.',
    ],
    certifications: ['ISO 9001:2015', 'AS9100-Aligned Practices', 'ESD Controlled Production', 'RoHS Compliant Processes'],
  },
  mdMessage: {
    title: 'Message From Managing Director',
    name: 'A. K. Sharma',
    role: 'Managing Director',
    message:
      'At Flic Microwaves, we believe trust is earned through consistent execution, measurable quality, and long-term commitment to customer success. Our teams are focused on building RF and microwave systems that perform reliably in the most demanding environments. As technology evolves rapidly, we continue to invest in engineering depth, process discipline, and innovation that keeps our partners ahead.',
    image: '',
  },
  cta: {
    eyebrow: 'Start A Conversation',
    title: 'Bring Your Next Program To Life With Flic Microwaves',
    description: 'We partner with teams that need speed, rigor, and engineering clarity from first requirement to field deployment.',
    primaryText: 'Contact Us',
    primaryUrl: '/contact',
    secondaryText: 'Schedule a Call',
    secondaryUrl: '/book-appointment',
  },
};

const capabilityIcons = [Radar, ShieldCheck, Orbit, Cpu, Factory, Globe2];

const AboutUs = () => {
  const [about, setAbout] = useState<AboutContent>(fallbackContent);

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/about`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load about content');
        return res.json() as Promise<AboutContent>;
      })
      .then((data) => {
        if (mounted && data) {
          setAbout(data);
        }
      })
      .catch(() => {
        if (mounted) setAbout(fallbackContent);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const journeyImage = useMemo(() => {
    if (!about.journey.image) return fallbackContent.journey.image;
    if (about.journey.image.startsWith('http://') || about.journey.image.startsWith('https://')) return about.journey.image;
    return `${BASE_URL}/uploads/${about.journey.image}`;
  }, [about.journey.image]);

  const mdImage = useMemo(() => {
    if (!about.mdMessage.image) return '';
    if (about.mdMessage.image.startsWith('http://') || about.mdMessage.image.startsWith('https://')) return about.mdMessage.image;
    return `${BASE_URL}/uploads/${about.mdMessage.image}`;
  }, [about.mdMessage.image]);

  const aboutBanner = useMemo(() => {
    if (!about.overview.bannerImage) return '';
    if (about.overview.bannerImage.startsWith('http://') || about.overview.bannerImage.startsWith('https://')) {
      return about.overview.bannerImage;
    }
    return `${BASE_URL}/uploads/${about.overview.bannerImage}`;
  }, [about.overview.bannerImage]);

  return (
    <div className="about-page-font min-h-screen bg-[#050505] font-montserrat overflow-x-hidden text-white">
      <section className="relative min-h-[78vh] flex items-center overflow-hidden py-24">
        <div className="absolute inset-0">
          {aboutBanner && <img src={aboutBanner} alt="Flic Microwaves banner" className="w-full h-full object-cover scale-105" />}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-[#b8860b]/25" />
          <div className="absolute inset-0 about-grid-pattern opacity-25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(184,134,11,0.34),transparent_48%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl py-4 md:py-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs tracking-[0.22em] uppercase text-white/90 mb-6">
              {about.overview.eyebrow}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
              {about.overview.title}
              <span className="block mt-2 text-[#ffe2a4] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                {about.overview.highlight}
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-9 leading-relaxed font-opensans drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">{about.overview.description}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={about.overview.primaryCtaUrl || '#'} className="bg-goldenrod text-white px-8 py-3.5 rounded-full font-semibold hover:bg-goldenrod/90 transition-all duration-300 flex items-center gap-2">
                {about.overview.primaryCtaText} <ArrowRight className="w-4 h-4" />
              </a>
              <a href={about.overview.secondaryCtaUrl || '#'} className="border border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                {about.overview.secondaryCtaText}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-r from-[#0d0d0d] via-[#141414] to-[#0d0d0d] py-8 border-y border-goldenrod/20 overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {about.overview.stats.map((stat, index) => (
              <div key={`${stat.value}-${index}`}>
                <p className="text-3xl font-bold text-goldenrod">{stat.value}</p>
                <p className="text-white/65 text-sm mt-1 font-opensans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#050505] to-[#0d0d0d] overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-goldenrod/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <img src={journeyImage} alt="Engineering and manufacturing" className="w-full h-[420px] object-cover rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]" />
            </div>
            <div className="lg:col-span-7">
              <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.journey.eyebrow}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">{about.journey.title}</h2>
              <p className="text-white/72 leading-relaxed text-lg font-opensans mb-5">{about.journey.paragraph1}</p>
              <p className="text-white/60 leading-relaxed font-opensans mb-7">{about.journey.paragraph2}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {about.journey.highlights.map((item, idx) => {
                  const Icon = idx % 2 === 0 ? Factory : Globe2;
                  return (
                    <div key={`${item.title}-${idx}`} className="about-journey-chip rounded-2xl p-4">
                      <Icon className="w-6 h-6 text-goldenrod mb-2" />
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-white/65 font-opensans">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-[#090909] overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.capabilities.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{about.capabilities.title}</h2>
            <p className="text-white/65 text-lg font-opensans max-w-3xl">{about.capabilities.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {about.capabilities.items.map((card, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return (
                <article key={`${card.title}-${index}`} className="about-capability-card rounded-3xl p-7">
                  <div className="w-12 h-12 rounded-xl bg-goldenrod/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-goldenrod" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-white/70 font-opensans leading-relaxed">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#0b0b0b] to-[#111111] overflow-hidden">
        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-goldenrod/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.operatingModel.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{about.operatingModel.title}</h2>
            <p className="text-white/65 text-lg font-opensans max-w-3xl">{about.operatingModel.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.operatingModel.items.map((item, index) => (
              <article key={`${item.step}-${index}`} className="about-process-card rounded-3xl p-6">
                <p className="text-sm font-bold tracking-[0.15em] text-goldenrod mb-3">{item.step}</p>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 text-sm font-opensans leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,134,11,0.12),transparent_45%)]" />
        <div className="absolute inset-0 about-fine-pattern opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.leadership.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{about.leadership.title}</h2>
            <p className="text-white/70 text-lg font-opensans max-w-3xl">{about.leadership.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {about.leadership.items.map((leader, index) => (
              <article key={`${leader.name}-${index}`} className="rounded-3xl p-7 bg-[#111111]/95 border border-goldenrod/25 shadow-[0_16px_38px_rgba(0,0,0,0.42)] transition-all duration-300 hover:border-goldenrod/45 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-goldenrod/15 border border-goldenrod/30 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6 text-goldenrod" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{leader.name}</h3>
                <p className="text-[#ffd77d] font-semibold mb-3">{leader.role}</p>
                <p className="text-white/75 font-opensans leading-relaxed">{leader.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-[#0b0b0b] overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <article className="about-pillar-card about-pillar-mission rounded-3xl p-7">
              <Target className="w-7 h-7 text-goldenrod mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">{about.missionVision.missionTitle}</h3>
              <p className="text-white/70 font-opensans leading-relaxed">{about.missionVision.missionText}</p>
            </article>
            <article className="about-pillar-card about-pillar-vision rounded-3xl p-7">
              <Eye className="w-7 h-7 text-goldenrod mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">{about.missionVision.visionTitle}</h3>
              <p className="text-white/70 font-opensans leading-relaxed">{about.missionVision.visionText}</p>
            </article>
            <article className="about-pillar-card about-pillar-values rounded-3xl p-7">
              <ShieldCheck className="w-7 h-7 text-goldenrod mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">{about.missionVision.valuesTitle}</h3>
              <p className="text-white/70 font-opensans leading-relaxed">{about.missionVision.valuesText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#090909] to-[#111111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.timeline.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{about.timeline.title}</h2>
            <p className="text-white/65 text-lg font-opensans max-w-3xl">{about.timeline.subtitle}</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-goldenrod/60 via-goldenrod/35 to-goldenrod/10" />
            <div className="space-y-6 md:space-y-8">
              {about.timeline.items.map((event, index) => (
                <article key={`${event.year}-${index}`} className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-12 items-start">
                  <div className="absolute left-[8px] md:left-1/2 md:-translate-x-1/2 top-7 h-6 w-6 rounded-full border-4 border-[#fff7e4] bg-goldenrod shadow-[0_0_0_4px_rgba(184,134,11,0.24)]" />

                  <div className={index % 2 === 0 ? 'md:col-start-1 md:pr-8' : 'md:col-start-2 md:pl-8'}>
                    <div className="about-timeline-card rounded-3xl p-6">
                      <p className="text-sm font-bold tracking-[0.15em] text-goldenrod mb-2">{event.year}</p>
                      <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-sm text-white/70 font-opensans leading-relaxed">{event.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-r from-[#070707] via-[#121212] to-[#070707] text-white overflow-hidden">
        <div className="absolute inset-0 about-grid-pattern opacity-15 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(184,134,11,0.28),transparent_45%)] pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.globalPresence.eyebrow}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{about.globalPresence.title}</h2>
              <div className="space-y-4 text-white/70 font-opensans">
                {about.globalPresence.points.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {about.globalPresence.stats.map((stat, index) => (
                <div key={`${stat.value}-${index}`} className="about-presence-stat rounded-2xl p-6">
                  <p className="text-4xl font-bold text-goldenrod">{stat.value}</p>
                  <p className="text-sm text-white/70 mt-2 font-opensans">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#090909] to-[#111111] overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <article className="about-awards-panel rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="w-7 h-7 text-goldenrod" />
                <h3 className="text-3xl font-bold text-white">{about.awardsQuality.awardsTitle}</h3>
              </div>
              <div className="space-y-3">
                {about.awardsQuality.awards.map((award, index) => (
                  <div key={`${award}-${index}`} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-goldenrod mt-0.5" />
                    <p className="text-white/70 font-opensans leading-relaxed">{award}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="about-quality-panel rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <ClipboardCheck className="w-7 h-7 text-goldenrod" />
                <h3 className="text-3xl font-bold text-white">{about.awardsQuality.qualityTitle}</h3>
              </div>
              <div className="space-y-3 mb-6">
                {about.awardsQuality.qualityPoints.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-goldenrod mt-0.5" />
                    <p className="text-white/70 font-opensans leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {about.awardsQuality.certifications.map((item, index) => (
                  <span key={`${item}-${index}`} className="inline-flex items-center rounded-full border border-goldenrod/35 bg-black/45 px-4 py-2 text-sm font-semibold text-[#ffd77d]">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#090909] to-[#121212] overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(184,134,11,0.12),transparent_45%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4">
              {mdImage ? (
                <img src={mdImage} alt="Managing Director" className="w-full h-[420px] object-cover rounded-3xl border border-goldenrod/25 shadow-[0_20px_45px_rgba(0,0,0,0.45)]" />
              ) : (
                <div className="w-full h-[420px] rounded-3xl border border-goldenrod/25 bg-gradient-to-br from-black to-[#1a1407] flex items-center justify-center">
                  <Users className="w-20 h-20 text-goldenrod/70" />
                </div>
              )}
            </div>
            <div className="lg:col-span-8">
              <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">Leadership Note</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">{about.mdMessage.title}</h2>
              <p className="text-xl font-semibold text-[#ffd77d] mb-1">{about.mdMessage.name}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-goldenrod mb-6">{about.mdMessage.role}</p>
              <div className="about-md-note rounded-2xl p-6 md:p-7 border border-goldenrod/20 bg-black/45">
                <p className="text-white/75 text-lg font-opensans leading-relaxed">{about.mdMessage.message}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#050505] to-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0 about-fine-pattern opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-goldenrod font-semibold mb-4">{about.cta.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{about.cta.title}</h2>
          <p className="text-xl text-white/68 mb-10 leading-relaxed">
            <span className="font-opensans">{about.cta.description}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={about.cta.primaryUrl || '#'} className="bg-goldenrod text-white px-8 py-4 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              {about.cta.primaryText}
            </a>
            <a href={about.cta.secondaryUrl || '#'} className="border-2 border-goldenrod text-goldenrod px-8 py-4 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              {about.cta.secondaryText}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
