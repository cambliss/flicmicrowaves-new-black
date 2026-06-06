import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, UserCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';
import { BLOG_REFERENCE_IMAGE, getBlogImageFromPost, normalizeBlogSlug } from '../data/blogs';

const BASE_URL = 'http://localhost:4001';

type CmsPost = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedOn: string;
  author: string;
  image: string;
  content: string[];
  url?: string;
};

type BlogsPageResponse = {
  featured?: CmsPost;
  posts?: CmsPost[];
};

export default function BlogDetail() {
  const { slug = '' } = useParams();
  const bannerSrc = useCmsBanner();
  const [cmsPost, setCmsPost] = useState<CmsPost | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/blogs-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blogs content');
        return res.json() as Promise<BlogsPageResponse>;
      })
      .then((data) => {
        if (!mounted) return;

        const allPosts = [data.featured, ...(data.posts || [])].filter(Boolean) as CmsPost[];
        const found = allPosts.find((post) => normalizeBlogSlug(post.title) === slug);
        setCmsPost(found || null);
      })
      .catch(() => {
        if (mounted) setCmsPost(null);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const article = useMemo(() => {
    if (!cmsPost) return null;

    return {
      ...cmsPost,
      image: cmsPost.image || BLOG_REFERENCE_IMAGE,
      content: Array.isArray(cmsPost.content) && cmsPost.content.length > 0 ? cmsPost.content : [cmsPost.excerpt],
    };
  }, [cmsPost]);

  const hasContent = !!article;

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      <section className="relative min-h-[320px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {bannerSrc && <img src={bannerSrc} alt="Flic Microwaves banner" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3d99d]/90 via-[#f7e7c1]/80 to-[#fff8e8]/90" />
        </div>
        <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors mb-5 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-black/60 font-semibold mb-4">{article?.category || 'Blog'}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-black max-w-4xl">{article?.title || 'Blog article not found'}</h1>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasContent && (
            <div className="rounded-2xl border border-goldenrod/20 p-10 text-center">
              <p className="text-black/70 font-opensans">Blog not found.</p>
            </div>
          )}

          {hasContent && (
            <article className="space-y-8">
              <img src={getBlogImageFromPost(article || {})} alt={article?.title} className="w-full h-[260px] md:h-[420px] object-cover rounded-3xl border border-goldenrod/20 shadow-[0_14px_34px_rgba(109,79,24,0.12)]" />

              <div className="flex flex-wrap gap-5 text-sm text-black/60">
                <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4 text-goldenrod" />{article?.readTime}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4 text-goldenrod" />{article?.publishedOn}</span>
                <span className="inline-flex items-center gap-2"><UserCircle2 className="w-4 h-4 text-goldenrod" />{article?.author}</span>
              </div>

              <p className="text-lg text-black/80 leading-relaxed font-opensans">{article?.excerpt}</p>

              <div className="space-y-5">
                {article?.content.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`} className="text-black/75 font-opensans leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
