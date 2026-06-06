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
  { slug: 'hero', title: 'Hero', desc: 'Title, subtitle, and page CTAs.' },
  { slug: 'why-join', title: 'Why Join', desc: 'Candidate value proposition points.' },
  { slug: 'open-roles', title: 'Open Roles', desc: 'Current role cards and details.' },
  { slug: 'culture', title: 'Culture', desc: 'Culture and ways of working.' },
  { slug: 'hiring-process', title: 'Hiring Process', desc: 'Application and interview flow.' },
  { slug: 'benefits', title: 'Benefits', desc: 'Benefits and employee support.' },
  { slug: 'faq', title: 'FAQ', desc: 'Frequently asked questions.' },
  { slug: 'cta', title: 'CTA', desc: 'Bottom call-to-action block.' },
];

const slugToApi: Record<string, string> = {
  hero: 'hero',
  'why-join': 'whyJoin',
  'open-roles': 'openRoles',
  culture: 'culture',
  'hiring-process': 'hiringProcess',
  benefits: 'benefits',
  faq: 'faq',
  cta: 'cta',
};

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Hero';
}

function sectionPath(slug: string) {
  return slug === 'hero' ? '/careers-page-content' : `/careers-page-content/${slug}`;
}

const emptyRole = () => ({ title: '', location: '', type: '', experience: '', summary: '' });
const emptyPair = () => ({ title: '', body: '' });
const emptyFaq = () => ({ question: '', answer: '' });
const emptyProcess = () => ({ step: '', title: '', body: '' });

export default function CareersPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'careers-page-content';
  const slug = routeSlug === 'careers-page-content' ? 'hero' : routeSlug;
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
      const { data } = await client.get(`/api/home-content/careers-page/${apiSection}`);
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
      await client.put(`/api/home-content/careers-page/${apiSection}`, form);
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
      await client.delete(`/api/home-content/careers-page/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL Careers sections to defaults? This will clear all saved careers page content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/careers-page');
      setSuccess('All Careers sections reset to defaults');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Careers Page CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage Careers page one section at a time. This is fully dynamic and connected to backend APIs.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All Careers Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Careers Sections</h2>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Primary CTA Text', form.primaryCtaText, (v) => setField('primaryCtaText', v))}
          {simpleInput('Primary CTA URL', form.primaryCtaUrl, (v) => setField('primaryCtaUrl', v))}
          {simpleInput('Secondary CTA Text', form.secondaryCtaText, (v) => setField('secondaryCtaText', v))}
          {simpleInput('Secondary CTA URL', form.secondaryCtaUrl, (v) => setField('secondaryCtaUrl', v))}
        </div>
      </>
    );
  }

  if (slug === 'why-join' || slug === 'benefits') {
    const items = Array.isArray(form) ? form : ['', '', ''];
    return renderStringListEditor('Points', items, (next) => setSection(next));
  }

  if (slug === 'open-roles') {
    const items = Array.isArray(form) ? form : [emptyRole(), emptyRole()];
    return renderRoleEditor('Open Roles', items, (next) => setSection(next));
  }

  if (slug === 'culture') {
    const items = Array.isArray(form) ? form : [emptyPair(), emptyPair()];
    return renderPairEditor('Culture Cards', items, (next) => setSection(next), 'title', 'body');
  }

  if (slug === 'hiring-process') {
    const items = Array.isArray(form) ? form : [emptyProcess(), emptyProcess()];
    return renderTripleEditor('Hiring Steps', items, (next) => setSection(next), 'step', 'title', 'body');
  }

  if (slug === 'faq') {
    const items = Array.isArray(form) ? form : [emptyFaq(), emptyFaq()];
    return renderPairEditor('FAQ', items, (next) => setSection(next), 'question', 'answer');
  }

  if (slug === 'cta') {
    return (
      <>
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Description', form.description, (v) => setField('description', v), 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Primary Button Text', form.primaryText, (v) => setField('primaryText', v))}
          {simpleInput('Primary Button URL', form.primaryUrl, (v) => setField('primaryUrl', v))}
          {simpleInput('Secondary Button Text', form.secondaryText, (v) => setField('secondaryText', v))}
          {simpleInput('Secondary Button URL', form.secondaryUrl, (v) => setField('secondaryUrl', v))}
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

function renderPairEditor(title: string, items: AnyObj[], setItems: (next: AnyObj[]) => void, key1: string, key2: string) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item?.[key1] || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], [key1]: event.target.value };
              setItems(next);
            }}
            placeholder={key1}
          />
          <textarea
            rows={3}
            value={item?.[key2] || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], [key2]: event.target.value };
              setItems(next);
            }}
            placeholder={key2}
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
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setItems([...items, { [key1]: '', [key2]: '' }])}>
        + Add
      </button>
    </div>
  );
}

function renderTripleEditor(
  title: string,
  items: AnyObj[],
  setItems: (next: AnyObj[]) => void,
  key1: string,
  key2: string,
  key3: string
) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item?.[key1] || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], [key1]: event.target.value };
              setItems(next);
            }}
            placeholder={key1}
          />
          <input
            type="text"
            value={item?.[key2] || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], [key2]: event.target.value };
              setItems(next);
            }}
            placeholder={key2}
          />
          <textarea
            rows={3}
            value={item?.[key3] || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], [key3]: event.target.value };
              setItems(next);
            }}
            placeholder={key3}
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
      <button
        type="button"
        className="btn btn-outline"
        style={{ width: 'fit-content' }}
        onClick={() => setItems([...items, { [key1]: '', [key2]: '', [key3]: '' }])}
      >
        + Add
      </button>
    </div>
  );
}

function renderRoleEditor(title: string, items: AnyObj[], setItems: (next: AnyObj[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item?.title || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], title: event.target.value };
              setItems(next);
            }}
            placeholder="title"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input
              type="text"
              value={item?.location || ''}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], location: event.target.value };
                setItems(next);
              }}
              placeholder="location"
            />
            <input
              type="text"
              value={item?.type || ''}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], type: event.target.value };
                setItems(next);
              }}
              placeholder="type"
            />
            <input
              type="text"
              value={item?.experience || ''}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], experience: event.target.value };
                setItems(next);
              }}
              placeholder="experience"
            />
          </div>
          <textarea
            rows={3}
            value={item?.summary || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], summary: event.target.value };
              setItems(next);
            }}
            placeholder="summary"
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
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setItems([...items, emptyRole()])}>
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
            placeholder="Point"
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
