import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import client from '../api/client';

type AnyObj = Record<string, any>;

type LinkSection = {
  slug: string;
  title: string;
  desc: string;
};

const sections: LinkSection[] = [
  { slug: 'hero', title: 'Hero', desc: 'Page headline and subtitle.' },
  { slug: 'featured', title: 'Featured Post', desc: 'Primary highlighted article.' },
  { slug: 'categories', title: 'Categories', desc: 'Topic tag list.' },
  { slug: 'posts', title: 'Posts', desc: 'Blog cards and metadata.' },
  { slug: 'newsletter', title: 'Newsletter', desc: 'Subscriber panel content.' },
  { slug: 'cta', title: 'CTA', desc: 'Bottom action section.' },
];

const slugToApi: Record<string, string> = {
  hero: 'hero',
  featured: 'featured',
  categories: 'categories',
  posts: 'posts',
  newsletter: 'newsletter',
  cta: 'cta',
};

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Hero';
}

function sectionPath(slug: string) {
  return slug === 'hero' ? '/blogs-page-content' : `/blogs-page-content/${slug}`;
}

const emptyPost = () => ({ title: '', excerpt: '', category: '', readTime: '', publishedOn: '', author: '', url: '', image: '', content: [] as string[] });

export default function BlogsPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'blogs-page-content';
  const slug = routeSlug === 'blogs-page-content' ? 'hero' : routeSlug;
  const apiSection = slugToApi[slug] || 'hero';

  const [form, setForm] = useState<AnyObj>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSection = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await client.get(`/api/home-content/blogs-page/${apiSection}`);
      setForm(data || {});
    } catch {
      setError('Failed to load section data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, [apiSection]);

  const setField = (key: string, value: any) => {
    setForm((prev: AnyObj) => ({ ...prev, [key]: value }));
  };

  const setSection = (value: any) => {
    setForm(value);
  };

  const saveSection = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await client.put(`/api/home-content/blogs-page/${apiSection}`, form);
      setSuccess(`${sectionTitle(slug)} section saved successfully`);
      await loadSection();
    } catch {
      setError('Failed to save section data');
    } finally {
      setSaving(false);
    }
  };

  const resetSection = async () => {
    const confirmed = window.confirm(`Reset ${sectionTitle(slug)} section to defaults?`);
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete(`/api/home-content/blogs-page/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL Blogs sections to defaults? This will clear all saved blogs page content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/blogs-page');
      setSuccess('All Blogs sections reset to defaults');
      await loadSection();
    } catch {
      setError('Failed to reset all sections');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Blogs Page CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage Blogs page one section at a time. This is fully dynamic and connected to backend APIs.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All Blogs Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Blogs Sections</h2>
          {sections.map((section) => {
            const active = section.slug === slug;
            return (
              <Link
                key={section.slug}
                to={sectionPath(section.slug)}
                style={{
                  border: active ? '1px solid #b8860b' : '1px solid #e5e7eb',
                  background: active ? '#fff4dd' : '#fff',
                  borderRadius: 10,
                  padding: 10,
                  display: 'grid',
                  gap: 2,
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>{section.title}</p>
                <p style={{ fontSize: 12, color: '#6b7280' }}>{section.desc}</p>
              </Link>
            );
          })}
        </aside>

        <section>
          {loading && <p>Loading section...</p>}
          {error && <p className="error-msg">{error}</p>}
          {success && <p style={{ color: '#198754', fontSize: 13, marginBottom: 12 }}>{success}</p>}

          {!loading && (
            <form className="card" style={{ display: 'grid', gap: 14 }} onSubmit={saveSection}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{sectionTitle(slug)} CMS</h2>
              {renderSectionEditor(slug, form, setField, setSection)}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : `Save ${sectionTitle(slug)}`}
                </button>
                <button type="button" className="btn btn-danger" disabled={saving} onClick={resetSection}>
                  Reset Section
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function renderSectionEditor(
  slug: string,
  form: AnyObj,
  setField: (key: string, value: any) => void,
  setSection: (value: any) => void
) {
  if (slug === 'hero') {
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 3)}
      </>
    );
  }

  if (slug === 'featured') {
    return renderPostEditor('Featured Post', form || emptyPost(), (next) => setSection(next), false);
  }

  if (slug === 'categories') {
    const items = Array.isArray(form) ? form : ['', '', ''];
    return renderStringListEditor('Categories', items, (next) => setSection(next));
  }

  if (slug === 'posts') {
    const items = Array.isArray(form) ? form : [emptyPost(), emptyPost()];
    return renderPostsEditor('Posts', items, (next) => setSection(next));
  }

  if (slug === 'newsletter') {
    return (
      <>
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Description', form.description, (v) => setField('description', v), 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Button Text', form.buttonText, (v) => setField('buttonText', v))}
          {simpleInput('Button URL', form.buttonUrl, (v) => setField('buttonUrl', v))}
        </div>
      </>
    );
  }

  if (slug === 'cta') {
    return (
      <>
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Description', form.description, (v) => setField('description', v), 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Primary Button Text', form.primaryText, (v) => setField('primaryText', v))}
          {simpleInput('Primary Button URL', form.primaryUrl, (v) => setField('primaryUrl', v))}
        </div>
      </>
    );
  }

  return null;
}

function simpleInput(label: string, value: string, onChange: (next: string) => void) {
  return (
    <div>
      <label>{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function simpleText(label: string, value: string, onChange: (next: string) => void, rows = 3) {
  return (
    <div>
      <label>{label}</label>
      <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function renderPostEditor(title: string, item: AnyObj, setItem: (next: AnyObj) => void, withHeading = true) {
  const contentValue = Array.isArray(item?.content)
    ? item.content.join('\n')
    : typeof item?.content === 'string'
      ? item.content
      : '';

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {withHeading && <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>}
      <input type="text" value={item?.title || ''} onChange={(e) => setItem({ ...item, title: e.target.value })} placeholder="title" />
      <textarea rows={3} value={item?.excerpt || ''} onChange={(e) => setItem({ ...item, excerpt: e.target.value })} placeholder="excerpt" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <input type="text" value={item?.category || ''} onChange={(e) => setItem({ ...item, category: e.target.value })} placeholder="category" />
        <input type="text" value={item?.readTime || ''} onChange={(e) => setItem({ ...item, readTime: e.target.value })} placeholder="readTime" />
        <input type="text" value={item?.publishedOn || ''} onChange={(e) => setItem({ ...item, publishedOn: e.target.value })} placeholder="publishedOn" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input type="text" value={item?.author || ''} onChange={(e) => setItem({ ...item, author: e.target.value })} placeholder="author" />
        <input type="text" value={item?.url || ''} onChange={(e) => setItem({ ...item, url: e.target.value })} placeholder="url" />
      </div>
      <input type="text" value={item?.image || ''} onChange={(e) => setItem({ ...item, image: e.target.value })} placeholder="image (example: /blogs/reference-blog.jpeg)" />
      <textarea
        rows={5}
        value={contentValue}
        onChange={(e) => {
          const lines = e.target.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          setItem({ ...item, content: lines });
        }}
        placeholder="content paragraphs (one paragraph per line)"
      />
    </div>
  );
}

function renderPostsEditor(title: string, items: AnyObj[], setItems: (next: AnyObj[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          {renderPostEditor('Post', item, (next) => {
            const updated = [...items];
            updated[index] = next;
            setItems(updated);
          })}
          <button
            type="button"
            className="btn btn-danger"
            style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
            onClick={() => setItems(items.filter((_, i) => i !== index))}
            disabled={items.length <= 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setItems([...items, emptyPost()])}>
        + Add
      </button>
    </div>
  );
}

function renderStringListEditor(title: string, items: string[], setItems: (next: string[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <textarea
            rows={2}
            value={item || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              setItems(next);
            }}
            placeholder="Item"
          />
          <button
            type="button"
            className="btn btn-danger"
            style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
            onClick={() => setItems(items.filter((_, i) => i !== index))}
            disabled={items.length <= 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setItems([...items, ''])}>
        + Add
      </button>
    </div>
  );
}
