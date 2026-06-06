import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, Clock3, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';
import { BLOG_REFERENCE_IMAGE, getBlogHrefFromPost, getBlogImageFromPost } from '../data/blogs';

const BASE_URL = 'http://localhost:4001';

type Post = {
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

type BlogsPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  featured: Post;
  categories: string[];
  posts: Post[];
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  cta: {
    title: string;
    description: string;
    primaryText: string;
    primaryUrl: string;
  };
};

const fallbackContent: BlogsPageContent = {
  hero: {
    eyebrow: 'Insights And Blogs',
    title: 'Engineering Insights From Mission-Critical Programs',
    subtitle: 'Explore articles on RF design, defence communication trends, validation practices, and deployment lessons from strategic projects.',
  },
  featured: {
    title: 'Designing RF Chains For Harsh-Environment Reliability',
    excerpt: 'A practical view of balancing insertion loss, thermal constraints, and field stability in defence-linked RF subsystem design.',
    category: 'RF Engineering',
    readTime: '8 min read',
    publishedOn: 'May 2026',
    author: 'Engineering Team',
    url: '#',
    image: BLOG_REFERENCE_IMAGE,
    content: [],
  },
  categories: [],
  posts: [],
  newsletter: {
    title: 'Get New Engineering Insights',
    description: 'Receive updates on new articles, program learnings, and RF technology trends.',
    buttonText: 'Subscribe',
    buttonUrl: '/contact',
  },
  cta: {
    title: 'Have A Topic You Want Us To Cover?',
    description: 'Share your interest areas and we will publish practical insights relevant to your program needs.',
    primaryText: 'Request A Topic',
    primaryUrl: '/contact',
  },
};

export default function Blogs() {
  const [content, setContent] = useState<BlogsPageContent>(fallbackContent);
  const [activeCategory, setActiveCategory] = useState('All');
  const bannerSrc = useCmsBanner();

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/blogs-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blogs page');
        return res.json() as Promise<BlogsPageContent>;
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

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return content.posts;
    return content.posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, content.posts]);

  const allCategories = useMemo(() => ['All', ...(content.categories || [])], [content.categories]);
  const featuredHref = getBlogHrefFromPost(content.featured.title, content.featured.url);

  const renderBlogLink = (href: string, className: string, label: React.ReactNode) => {
    if (/^https?:\/\//i.test(href)) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {label}
        </a>
      );
    }

    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      <section className="relative min-h-[340px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4dfad]/90 via-[#f7e8c4]/80 to-[#fff7e3]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-black/60 font-semibold mb-4">{content.hero.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 max-w-4xl">{content.hero.title}</h1>
          <p className="text-lg md:text-xl text-black/75 font-opensans leading-relaxed max-w-3xl">{content.hero.subtitle}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-goldenrod/20 bg-gradient-to-r from-[#1a1a1a] to-[#2c2515] p-8 md:p-10 text-white">
            <p className="inline-flex items-center rounded-full border border-goldenrod/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-goldenrod mb-4">
              {content.featured.category}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-4xl">{content.featured.title}</h2>
            <p className="text-white/80 font-opensans max-w-3xl mb-6">{content.featured.excerpt}</p>
            <div className="flex flex-wrap gap-5 text-sm text-white/80 mb-7">
              <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4 text-goldenrod" />{content.featured.readTime}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4 text-goldenrod" />{content.featured.publishedOn}</span>
              <span className="inline-flex items-center gap-2"><UserCircle2 className="w-4 h-4 text-goldenrod" />{content.featured.author}</span>
            </div>
            {renderBlogLink(
              featuredHref,
              'inline-flex items-center gap-2 rounded-full bg-goldenrod px-6 py-3 font-semibold text-white hover:bg-goldenrod/90 transition-all duration-300',
              <>
                Read Featured Insight
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                    isActive
                      ? 'bg-goldenrod text-white border-goldenrod'
                      : 'bg-white text-black/70 border-goldenrod/25 hover:bg-[#fff7e7]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-b from-[#fffef9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-grid">
          {filteredPosts.map((post, index) => (
            <article key={`${post.title}-${index}`} className="rounded-3xl border border-goldenrod/20 bg-white overflow-hidden shadow-[0_12px_28px_rgba(112,85,29,0.08)] flex flex-col motion-soft-card">
              <img
                src={getBlogImageFromPost(post)}
                alt={post.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-goldenrod font-semibold mb-2">{post.category}</p>
                <h3 className="text-2xl font-bold text-black mb-3 leading-tight">{post.title}</h3>
                <p className="text-black/70 font-opensans text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
                <div className="text-xs text-black/55 flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{post.readTime}</span>
                  <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{post.publishedOn}</span>
                </div>
                {renderBlogLink(
                  getBlogHrefFromPost(post.title, post.url),
                  'inline-flex items-center gap-2 text-goldenrod font-semibold hover:text-goldenrod/80 transition-colors duration-300',
                  <>
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fff6e1] border-y border-goldenrod/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl border border-goldenrod/25 bg-white p-8 md:p-10 text-center">
          <h3 className="text-3xl font-bold text-black mb-3">{content.newsletter.title}</h3>
          <p className="text-black/70 font-opensans mb-6">{content.newsletter.description}</p>
          <a href={content.newsletter.buttonUrl || '#'} className="inline-flex items-center gap-2 rounded-full bg-goldenrod px-7 py-3 font-semibold text-white hover:bg-goldenrod/90 transition-all duration-300">
            {content.newsletter.buttonText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">{content.cta.title}</h3>
          <p className="text-black/70 text-lg font-opensans mb-8">{content.cta.description}</p>
          <a href={content.cta.primaryUrl || '#'} className="inline-flex items-center gap-2 rounded-lg border-2 border-goldenrod px-8 py-3 font-semibold text-goldenrod hover:bg-goldenrod hover:text-white transition-all duration-300">
            {content.cta.primaryText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
