import { BASE_URL } from '../config/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircuitBoard,
  Factory,
  Globe,
  Moon,
  Radio,
  RadioTower,
  SatelliteDish,
  Satellite,
  Shield,
  ShieldCheck,
  Sun,
  Target,
  Users,
  Award,
  Zap,
} from 'lucide-react';
import { useCmsBannerSlides } from '../hooks/useCmsBanner';
import Footer from '../components/Footer';
import { getBlogHrefFromPost, getBlogImageFromPost } from '../data/blogs';

type GenericItem = { title: string; description: string };
type WhyChooseContent = { heading: string; subtitle: string; items: GenericItem[] };
type ProcessContent = { heading: string; subtitle: string; items: GenericItem[] };
type IndustryContent = { heading: string; subtitle: string; image: string; items: GenericItem[] };
type InnovationContent = {
  heading: string;
  description: string;
  points: string[];
  buttonText: string;
  buttonUrl: string;
  image: string;
};

type SolutionItem = { title: string; description: string; buttonText: string; buttonUrl: string };
type SolutionsContent = { heading: string; subtitle: string; items: SolutionItem[] };

type ProductItem = { title: string; description: string; image: string; buttonText: string; buttonUrl: string };
type FeaturedProductsContent = { heading: string; subtitle: string; items: ProductItem[] };

type FacilityItem = { id: string; title: string; summary: string; details: string; image: string };
type FacilitiesPageContent = { facilities: FacilityItem[] };

type HomeDarkIndustryItem = {
  title: string;
  description: string;
  stat: string;
  linkText: string;
  linkUrl: string;
};
type HomeDarkIndustriesContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  mediaEyebrow: string;
  mediaTitle: string;
  mediaHighlight: string;
  mediaDescription: string;
  mediaButtonText: string;
  mediaButtonUrl: string;
  items: HomeDarkIndustryItem[];
};

type HomeAdvantagePoint = {
  number: string;
  title: string;
  description: string;
};

type HomeAdvantageContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  videoUrl: string;
  points: HomeAdvantagePoint[];
};

type HomeSuccessStoriesContent = {
  eyebrow: string;
  stories: {
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    imageUrl: string;
    imageAlt: string;
  }[];
};

type BlogPost = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedOn: string;
  author: string;
  url: string;
  image: string;
  content: string[];
};
type BlogsPageContent = { featured: BlogPost; posts: BlogPost[] };

const WHY_CHOOSE_ICONS = [Award, Shield, Users, Globe, Target, Zap];
const SOLUTION_ICONS = [Radio, Satellite, Shield, Globe, Target, Zap];
const INDUSTRY_ICONS = [SatelliteDish, RadioTower, ShieldCheck, Factory, CircuitBoard, Target];
const FEATURED_PRODUCT_ICONS = [Radio, Satellite, Shield, Zap, Globe, Target];
const HOME_THEME_STORAGE_KEY = 'home-bw-mode';
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

export default function Home() {
  const slides = useCmsBannerSlides([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [monoMode, setMonoMode] = useState(() => {
    try {
      return window.localStorage.getItem(HOME_THEME_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [whyChoose, setWhyChoose] = useState<WhyChooseContent>({ heading: '', subtitle: '', items: [] });
  const [solutions, setSolutions] = useState<SolutionsContent>({ heading: '', subtitle: '', items: [] });
  const [process, setProcess] = useState<ProcessContent>({ heading: '', subtitle: '', items: [] });
  const [industries, setIndustries] = useState<IndustryContent>({ heading: '', subtitle: '', image: '', items: [] });
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductsContent>({ heading: '', subtitle: '', items: [] });
  const [innovation, setInnovation] = useState<InnovationContent>({
    heading: '',
    description: '',
    points: [],
    buttonText: '',
    buttonUrl: '',
    image: '',
  });
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [homeBlogs, setHomeBlogs] = useState<BlogPost[]>([]);
  const [homeDarkIndustries, setHomeDarkIndustries] = useState<HomeDarkIndustriesContent>({
    eyebrow: '',
    title: '',
    subtitle: '',
    videoUrl: '',
    mediaEyebrow: '',
    mediaTitle: '',
    mediaHighlight: '',
    mediaDescription: '',
    mediaButtonText: '',
    mediaButtonUrl: '',
    items: [],
  });
  const [homeAdvantage, setHomeAdvantage] = useState<HomeAdvantageContent>({
    eyebrow: '',
    title: '',
    highlight: '',
    description: '',
    videoUrl: '',
    points: [],
  });
  const [homeSuccessStories, setHomeSuccessStories] = useState<HomeSuccessStoriesContent>({
    eyebrow: '',
    stories: [],
  });
  const [activeSuccessStory, setActiveSuccessStory] = useState(0);

  useEffect(() => setActiveSlide(0), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => setActiveSlide((prev) => (prev + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const count = homeSuccessStories.stories?.length || 0;
    if (!count) {
      setActiveSuccessStory(0);
      return;
    }
    setActiveSuccessStory((prev) => prev % count);
  }, [homeSuccessStories.stories?.length]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HOME_THEME_STORAGE_KEY, monoMode ? '1' : '0');
    } catch {
      // Ignore localStorage write issues in restricted environments.
    }
  }, [monoMode]);

  useEffect(() => {
    const load = async () => {
      const fetchJson = async <T,>(url: string): Promise<T | null> => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          return (await res.json()) as T;
        } catch {
          return null;
        }
      };

      const [w, s, p, i, fp, inn, fpage, bpage, hdi, ha, hss] = await Promise.all([
        fetchJson<WhyChooseContent>(`${BASE_URL}/api/home-content/why-choose`),
        fetchJson<SolutionsContent>(`${BASE_URL}/api/home-content/solutions`),
        fetchJson<ProcessContent>(`${BASE_URL}/api/home-content/process`),
        fetchJson<IndustryContent>(`${BASE_URL}/api/home-content/industries`),
        fetchJson<FeaturedProductsContent>(`${BASE_URL}/api/home-content/featured-products`),
        fetchJson<InnovationContent>(`${BASE_URL}/api/home-content/innovation`),
        fetchJson<FacilitiesPageContent>(`${BASE_URL}/api/home-content/facilities-page`),
        fetchJson<BlogsPageContent>(`${BASE_URL}/api/home-content/blogs-page`),
        fetchJson<HomeDarkIndustriesContent>(`${BASE_URL}/api/home-content/home-dark-industries`),
        fetchJson<HomeAdvantageContent>(`${BASE_URL}/api/home-content/home-advantage`),
        fetchJson<HomeSuccessStoriesContent>(`${BASE_URL}/api/home-content/home-success-stories`),
      ]);

      if (w) setWhyChoose(w);
      if (s) setSolutions(s);
      if (p) setProcess(p);
      if (i) setIndustries(i);
      if (fp) setFeaturedProducts(fp);
      if (inn) setInnovation(inn);
      if (fpage) setFacilities((fpage.facilities || []).slice(0, 4));
      if (hdi) setHomeDarkIndustries(hdi);
      if (ha) setHomeAdvantage(ha);
      if (hss) setHomeSuccessStories(hss);

      const cmsBlogs = bpage ? [bpage.featured, ...(bpage.posts || [])].filter(Boolean).slice(0, 3) : [];
      if (cmsBlogs.length > 0) {
        setHomeBlogs(
          cmsBlogs.map((blog) => ({
            ...blog,
            content: Array.isArray(blog.content) ? blog.content : [],
          }))
        );
      }
    };

    void load();
  }, []);

  const hero = slides[activeSlide];
  const industriesImage = industries.image
    ? industries.image.startsWith('http://') || industries.image.startsWith('https://')
      ? industries.image
      : `${BASE_URL}/uploads/${industries.image}`
    : '';
  const innovationImage = innovation.image
    ? innovation.image.startsWith('http://') || innovation.image.startsWith('https://')
      ? innovation.image
      : `${BASE_URL}/uploads/${innovation.image}`
    : '';
  const homeDarkTiles = homeDarkIndustries.items.slice(0, 5);
  const homeDarkTitleParts = (homeDarkIndustries.title || '')
    .split(',')
    .map((part) => part.trim());
  const homeDarkFirstTitle = homeDarkTitleParts[0] || '';
  const homeDarkAccentTitle = homeDarkTitleParts[1] || '';
  const homeDarkVideoUrl = (homeDarkIndustries.videoUrl || '').trim();
  const homeDarkVideoEmbedUrl = (() => {
    if (!homeDarkVideoUrl) return '';
    const shortMatch = homeDarkVideoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/i);
    if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = homeDarkVideoUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/i);
    if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const embedMatch = homeDarkVideoUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i);
    if (embedMatch?.[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    return '';
  })();
  const homeDarkVideoId = (() => {
    if (!homeDarkVideoUrl) return '';
    const shortMatch = homeDarkVideoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/i);
    if (shortMatch?.[1]) return shortMatch[1];
    const watchMatch = homeDarkVideoUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/i);
    if (watchMatch?.[1]) return watchMatch[1];
    const embedMatch = homeDarkVideoUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i);
    if (embedMatch?.[1]) return embedMatch[1];
    return '';
  })();
  const homeDarkVideoEmbedAutoplayUrl = homeDarkVideoId
    ? `https://www.youtube.com/embed/${homeDarkVideoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`
    : '';
  const mediaTitle = homeDarkIndustries.mediaTitle || '';
  const mediaHighlight = homeDarkIndustries.mediaHighlight || '';
  const mediaTitleParts = mediaHighlight
    ? mediaTitle.split(new RegExp(`(${mediaHighlight})`, 'i'))
    : [mediaTitle];
  const advantageVideoUrl = (homeAdvantage.videoUrl || '').trim();
  const advantageVideoId = (() => {
    if (!advantageVideoUrl) return '';
    const shortMatch = advantageVideoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/i);
    if (shortMatch?.[1]) return shortMatch[1];
    const watchMatch = advantageVideoUrl.match(/[?&]v=([a-zA-Z0-9_-]{6,})/i);
    if (watchMatch?.[1]) return watchMatch[1];
    const embedMatch = advantageVideoUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i);
    if (embedMatch?.[1]) return embedMatch[1];
    return '';
  })();
  const advantageEmbedUrl = advantageVideoId
    ? `https://www.youtube.com/embed/${advantageVideoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`
    : '';
  const advantageTitleParts = homeAdvantage.highlight
    ? homeAdvantage.title.split(new RegExp(`(${homeAdvantage.highlight})`, 'i'))
    : [homeAdvantage.title];
  const successStoriesList = homeSuccessStories.stories || [];
  const currentSuccessStory = successStoriesList[activeSuccessStory];
  const successStoriesImage = currentSuccessStory?.imageUrl
    ? currentSuccessStory.imageUrl.startsWith('http://') || currentSuccessStory.imageUrl.startsWith('https://') || currentSuccessStory.imageUrl.startsWith('/')
      ? currentSuccessStory.imageUrl
      : `${BASE_URL}/uploads/${currentSuccessStory.imageUrl}`
    : '';
  const whyChooseCards = whyChoose.items;
  const whyChooseStatement = whyChoose.subtitle || '';
  const whyChooseStatementParts = whyChooseStatement
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean);

  return (
    <div className={`min-h-screen overflow-x-hidden pt-24 ${monoMode ? 'home-bw-mode' : ''}`}>
      <button
        type="button"
        onClick={() => setMonoMode((prev) => !prev)}
        className="home-toggle-btn"
        aria-label="Toggle black and white mode"
      >
        {monoMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {monoMode ? 'Color' : 'B/W'}
      </button>

      <section className="home-hero-black relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {hero?.image && <img src={hero.image} alt="Hero" className="w-full h-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-black/88" />
          <div className="absolute inset-0 home-hero-dots" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(201,168,76,0.14),transparent_40%)]" />
        </div>

        <div className="home-hero-tech hidden lg:block" aria-hidden>
          <div className="home-tech-box home-tech-box-lg" />
          <div className="home-tech-box home-tech-box-md" />
          <div className="home-tech-ring home-tech-ring-lg" />
          <div className="home-tech-ring home-tech-ring-md" />
          <div className="home-tech-ring home-tech-ring-sm" />
          <div className="home-tech-line home-tech-line-h" />
          <div className="home-tech-line home-tech-line-v" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl py-10">
            <p className="home-hero-eyebrow">Advanced Microwave Solutions - Hyderabad, India</p>
            <h1 className="home-hero-title mb-6">
              {hero?.mainHeading || ''}
              <span className="home-hero-title-accent">Precision at every frequency</span>
            </h1>
            <p className="text-lg text-white/70 mb-10 leading-relaxed font-opensans max-w-2xl">{hero?.subHeading || ''}</p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href={hero?.buttonUrl || '#'} className="home-hero-btn-primary inline-flex items-center gap-2">
                {hero?.buttonText || ''} <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/contact" className="home-hero-btn-secondary inline-flex items-center gap-2">
                Get In Touch
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-[1px] bg-[#2a2418] max-w-3xl">
              <Link to="/blogs" className="home-hero-link-card">
                <ArrowRight className="w-4 h-4 text-goldenrod" />
                <span>Real-world engineering successes</span>
              </Link>
              <Link to="/solutions" className="home-hero-link-card">
                <ArrowRight className="w-4 h-4 text-goldenrod" />
                <span>Custom RF design &amp; manufacturing</span>
              </Link>
              <Link to="/careers" className="home-hero-link-card">
                <ArrowRight className="w-4 h-4 text-goldenrod" />
                <span>Join the Flicmicrowaves team</span>
              </Link>
            </div>

            {slides.length > 1 && (
              <div className="mt-8 flex items-center gap-3">
                <button type="button" onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="bg-black/45 text-goldenrod border border-goldenrod/35 p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                <button type="button" onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)} className="bg-black/45 text-goldenrod border border-goldenrod/35 p-2 rounded-full"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-goldenrod/95 border-t border-goldenrod/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '300GHz', label: 'Max Design Frequency' },
              { value: '5+', label: 'Industry Sectors' },
              { value: 'ISO', label: '9001:2015 Certified' },
              { value: 'HYD', label: 'Headquarters, India' },
            ].map((item) => (
              <div key={item.label} className="text-center md:text-left border-r border-black/20 last:border-r-0 pr-2">
                <p className="text-black text-2xl md:text-3xl font-semibold leading-none">{item.value}</p>
                <p className="text-black/70 text-[10px] md:text-xs tracking-[0.14em] uppercase mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-dark-industry-section py-20 text-white relative overflow-hidden">
        <div className="home-dark-industry-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="home-dark-intro-wrap mb-12">
            <p className="home-dark-kicker">{homeDarkIndustries.eyebrow}</p>
            <h2 className="home-dark-title">
              {homeDarkFirstTitle}
              <span className="home-dark-title-accent">, {homeDarkAccentTitle}</span>
            </h2>
            <p className="home-dark-subtitle">{homeDarkIndustries.subtitle}</p>
            {!!(homeDarkIndustries.videoUrl || '').trim() && (
              <a
                href={homeDarkIndustries.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-goldenrod font-semibold uppercase tracking-[0.12em] text-xs"
              >
                Watch Video <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="home-dark-grid stagger-grid">
            {homeDarkTiles.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                to={item.linkUrl || '/industries'}
                className={`group home-dark-tile ${index === 2 ? 'home-dark-tile-critical' : ''}`}
              >
                <div className={`home-dark-artboard home-dark-art-${(index % 5) + 1}`}>
                  <div className="home-dark-art-plate" />
                  <div className="home-dark-art-dot home-dark-art-dot-1" />
                  <div className="home-dark-art-dot home-dark-art-dot-2" />
                  <div className="home-dark-art-line" />
                </div>
                <div className="home-dark-tile-footer">
                  <span>{item.title}</span>
                  <ArrowRight className="w-4 h-4 text-goldenrod transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}

            <Link to="/products" className="group home-dark-tile home-dark-products-tile">
              <div className="home-dark-products-icons">
                <div className="home-dark-icon-circle"><Radio className="w-4 h-4" /></div>
                <div className="home-dark-icon-circle"><Target className="w-4 h-4" /></div>
                <div className="home-dark-icon-circle"><Satellite className="w-4 h-4" /></div>
                <div className="home-dark-icon-circle"><Shield className="w-4 h-4" /></div>
              </div>
              <p className="home-dark-products-link">
                View all products <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </p>
              <div className="home-dark-products-edge" />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-media-showcase py-20 bg-[#060607] border-b border-goldenrod/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="home-media-kicker">{homeDarkIndustries.mediaEyebrow}</p>
              <h2 className="home-media-title">
                {mediaTitleParts.map((chunk, index) => {
                  const isHighlight = mediaHighlight && chunk.toLowerCase() === mediaHighlight.toLowerCase();
                  return isHighlight ? (
                    <span key={`hl-${index}`} className="home-media-title-accent">{chunk}</span>
                  ) : (
                    <span key={`txt-${index}`}>{chunk}</span>
                  );
                })}
              </h2>
              <p className="home-media-description">
                {homeDarkIndustries.mediaDescription}
              </p>
              <a
                href={homeDarkIndustries.mediaButtonUrl || '#'}
                className="home-media-btn"
              >
                {(homeDarkIndustries.mediaButtonText || '').toUpperCase()} <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div>
              {homeDarkVideoUrl ? (
                <div className="home-media-video-card" aria-label="Embedded video player">
                  {homeDarkVideoEmbedAutoplayUrl ? (
                    <iframe
                      src={homeDarkVideoEmbedAutoplayUrl}
                      title="Flic Microwaves video"
                      className="home-media-video-frame"
                      loading="lazy"
                      allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : homeDarkVideoEmbedUrl ? (
                    <iframe
                      src={homeDarkVideoEmbedUrl}
                      title="Flic Microwaves video"
                      className="home-media-video-frame"
                      loading="lazy"
                      allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={homeDarkVideoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="home-media-video-fallback"
                    >
                      Watch Video <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="home-media-video-card" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="home-advantage-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16">
            <div>
              <p className="home-advantage-kicker">{homeAdvantage.eyebrow}</p>
              <h2 className="home-advantage-title">
                {advantageTitleParts.map((chunk, index) => {
                  const isHighlight = homeAdvantage.highlight && chunk.toLowerCase() === homeAdvantage.highlight.toLowerCase();
                  return isHighlight ? (
                    <span key={`ahl-${index}`} className="home-advantage-title-accent">{chunk}</span>
                  ) : (
                    <span key={`atxt-${index}`}>{chunk}</span>
                  );
                })}
              </h2>
              <p className="home-advantage-description">{homeAdvantage.description}</p>

              <div className="home-advantage-video-wrap">
                {advantageEmbedUrl ? (
                  <iframe
                    src={advantageEmbedUrl}
                    title="Flic Advantage video"
                    className="home-advantage-video-frame"
                    loading="lazy"
                    allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="home-advantage-video-fallback" />
                )}
              </div>
            </div>

            <div className="home-advantage-points">
              {homeAdvantage.points.map((point, index) => (
                <article key={`${point.number}-${point.title}-${index}`} className="home-advantage-point">
                  <p className="home-advantage-point-number">{point.number || String(index + 1).padStart(2, '0')}</p>
                  <h3 className="home-advantage-point-title">{point.title}</h3>
                  <p className="home-advantage-point-description">{point.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-success-stories-section py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="home-success-stories-kicker">{homeSuccessStories.eyebrow}</p>
              <h2 className="home-success-stories-title">{currentSuccessStory?.heading || ''}</h2>
              <p className="home-success-stories-description">{currentSuccessStory?.description || ''}</p>
              <a
                href={currentSuccessStory?.buttonUrl || '#'}
                className="home-success-stories-btn"
              >
                {(currentSuccessStory?.buttonText || '').toUpperCase()} <ArrowRight className="w-4 h-4" />
              </a>

              <div className="home-success-stories-nav">
                <button
                  type="button"
                  aria-label="Previous success story"
                  className="home-success-stories-nav-btn"
                  onClick={() => setActiveSuccessStory((prev) => (prev - 1 + successStoriesList.length) % successStoriesList.length)}
                  disabled={successStoriesList.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next success story"
                  className="home-success-stories-nav-btn"
                  onClick={() => setActiveSuccessStory((prev) => (prev + 1) % successStoriesList.length)}
                  disabled={successStoriesList.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="home-success-stories-image-wrap">
              <img
                src={successStoriesImage}
                alt={currentSuccessStory?.imageAlt || ''}
                className="home-success-stories-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-quality-section py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="home-quality-kicker">{whyChoose.heading}</p>

          <div className="home-quality-grid">
            {whyChooseCards.slice(0, 4).map((item, index) => {
              const Icon = WHY_CHOOSE_ICONS[index % WHY_CHOOSE_ICONS.length];
              return (
                <article key={`${item.title}-${index}`} className="home-quality-card">
                  <div className="home-quality-icon-wrap"><Icon className="w-7 h-7 text-goldenrod" /></div>
                  <h3 className="home-quality-card-title">{item.title}</h3>
                </article>
              );
            })}
          </div>

          <h2 className="home-quality-statement">
            {whyChooseStatementParts.map((part, index) => {
              const isEmphasis = part.startsWith('*') && part.endsWith('*');
              const content = isEmphasis ? part.slice(1, -1) : part;
              return isEmphasis ? (
                <span key={`qc-em-${index}`} className="home-quality-statement-emphasis">{content}</span>
              ) : (
                <span key={`qc-tx-${index}`}>{content}</span>
              );
            })}
          </h2>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black via-[#111111] to-[#1b1b1b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4"><span className="text-goldenrod">{solutions.heading}</span></h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-opensans">{solutions.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 stagger-grid">
            {solutions.items.map((item, index) => {
              const Icon = SOLUTION_ICONS[index % SOLUTION_ICONS.length];
              return (
                <div key={`${item.title}-${index}`} className="bg-white/6 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)] motion-soft-card">
                  <div className="w-16 h-16 bg-goldenrod/15 rounded-full flex items-center justify-center mb-6"><Icon className="w-8 h-8 text-goldenrod" /></div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed font-opensans">{item.description}</p>
                  <a href={item.buttonUrl || '#'} className="text-goldenrod font-semibold inline-flex items-center gap-2">{item.buttonText} <ArrowRight className="w-4 h-4" /></a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#090909] via-[#121212] to-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <img src={industriesImage} alt={industries.heading} className="w-full h-[34rem] object-cover rounded-[1.5rem]" />
              <div className="absolute left-8 bottom-8 max-w-xs rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md px-5 py-4 shadow-lg">
                <p className="text-[11px] uppercase tracking-[0.35em] text-goldenrod mb-2">Serving critical industries</p>
                <p className="text-sm text-white/80 font-opensans">Classy, dependable solutions for demanding environments.</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-goldenrod mb-4">Serving critical industries</p>
              <h2 className="text-4xl font-bold text-white mb-6"><span className="text-goldenrod">{industries.heading}</span></h2>
              <p className="text-white/70 font-opensans mb-8 max-w-2xl">{industries.subtitle}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {industries.items.map((item, index) => {
                  const Icon = INDUSTRY_ICONS[index % INDUSTRY_ICONS.length];
                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="group rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:border-goldenrod/30"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-goldenrod/20 bg-goldenrod/10 text-goldenrod">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="font-opensans text-sm leading-relaxed text-white/72">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#090909] via-[#111111] to-[#181818] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.38em] text-goldenrod font-semibold mb-4">Featured Products</p>
            <h2 className="text-4xl font-bold text-white mb-4"><span className="text-goldenrod">{featuredProducts.heading}</span></h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-opensans">{featuredProducts.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 md:h-[540px] stagger-grid">
            {featuredProducts.items.slice(0, 4).map((item, index) => {
              const Icon = FEATURED_PRODUCT_ICONS[index % FEATURED_PRODUCT_ICONS.length];
              const tileClass = index === 0 ? 'md:row-span-2' : index === 1 ? 'md:col-span-2' : 'md:col-span-1';
              const image = item.image?.startsWith('http') || item.image?.startsWith('/') ? item.image : `${BASE_URL}/uploads/${item.image}`;

              return (
                <Link
                  key={`${item.title}-${index}`}
                  to="/products"
                  className={`group relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-black min-h-[240px] shadow-[0_22px_60px_rgba(0,0,0,0.35)] ${tileClass}`}
                >
                  <img src={image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/10" />
                  <div className="absolute left-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-goldenrod/25 bg-black/55 backdrop-blur-md shadow-lg">
                    <Icon className="h-5 w-5 text-goldenrod" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-goldenrod/90">Featured product</p>
                    <h3 className="text-white text-2xl font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-white/80 text-sm font-opensans leading-relaxed opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#090909] via-[#121212] to-[#181818] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-goldenrod font-semibold mb-3">Our Facilities</p>
              <h2 className="text-4xl font-bold text-white">Lab, Testing, CAD And Integration</h2>
            </div>
            <Link to="/facilities" className="inline-flex items-center gap-2 text-goldenrod font-semibold">View all facilities <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-grid">
            {facilities.map((facility, index) => (
              <Link
                key={`${facility.id}-${index}`}
                to={`/facilities#${facility.id}`}
                className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm motion-soft-card"
              >
                <img src={facility.image?.startsWith('http') || facility.image?.startsWith('/') ? facility.image : `${BASE_URL}/uploads/${facility.image}`} alt={facility.title} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <h3 className="text-[1.35rem] font-bold text-white mb-2 leading-tight">{facility.title}</h3>
                  <p className="text-goldenrod text-sm font-semibold mb-2">{facility.summary}</p>
                  <p className="text-white/72 text-sm font-opensans leading-relaxed">{facility.details}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black via-[#111111] to-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-goldenrod font-semibold mb-3">Blogs And Insights</p>
              <h2 className="text-4xl font-bold text-white">Latest from Flic Microwaves</h2>
            </div>
            <Link to="/blogs" className="inline-flex items-center gap-2 text-goldenrod font-semibold">View all blogs <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-grid">
            {homeBlogs.map((blog, index) => (
              <article key={`${blog.title}-${index}`} className="rounded-3xl border border-white/10 bg-white/6 overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-sm motion-soft-card">
                <img src={getBlogImageFromPost(blog)} alt={blog.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{blog.title}</h3>
                  <p className="text-white/72 font-opensans text-sm leading-relaxed mb-5">{blog.excerpt}</p>
                  <div className="text-xs text-white/55 flex flex-wrap gap-3 mb-5">
                    <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{blog.readTime}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{blog.publishedOn}</span>
                  </div>
                  <Link to={getBlogHrefFromPost(blog.title, blog.url)} className="inline-flex items-center gap-2 text-goldenrod font-semibold">Read Article <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-[#090909] via-[#111111] to-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-goldenrod font-semibold mb-4">Driving Innovation</p>
              <h2 className="text-4xl font-bold text-white mb-6"><span className="text-goldenrod">{innovation.heading}</span></h2>
              <p className="text-lg text-white/72 mb-6 leading-relaxed font-opensans max-w-xl">{innovation.description}</p>
              <div className="space-y-4 mb-8 max-w-xl">
                {innovation.points.map((point, index) => (
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm" key={`${point}-${index}`}>
                    <CheckCircle className="mt-0.5 w-5 h-5 text-goldenrod flex-shrink-0" />
                    <span className="text-white/78 font-opensans leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
              <a href={innovation.buttonUrl || '#'} className="inline-flex items-center gap-2 rounded-full border border-goldenrod/35 bg-goldenrod px-8 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(184,134,11,0.18)] transition-transform duration-300 hover:-translate-y-0.5">{innovation.buttonText} <ArrowRight className="w-5 h-5" /></a>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <img src={innovationImage} alt={innovation.heading} className="w-full h-96 rounded-[1.5rem] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
