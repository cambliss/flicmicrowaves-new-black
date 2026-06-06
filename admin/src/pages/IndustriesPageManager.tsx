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
  { slug: 'hero', title: 'Hero', desc: 'Main title, subtitle, and CTAs.' },
  { slug: 'sectors', title: 'Sectors', desc: 'Industry sector cards.' },
  { slug: 'capabilities', title: 'Capabilities', desc: 'Core capability highlights.' },
  { slug: 'compliance', title: 'Compliance', desc: 'Quality and governance points.' },
  { slug: 'deployment-model', title: 'Deployment Model', desc: 'Delivery model steps.' },
  { slug: 'featured-programs', title: 'Featured Programs', desc: 'Program snapshots and outcomes.' },
  { slug: 'metrics', title: 'Metrics', desc: 'Performance stats strip.' },
  { slug: 'coverage', title: 'Coverage', desc: 'Service coverage statements.' },
  { slug: 'cta', title: 'CTA', desc: 'Bottom call-to-action block.' },
];

const slugToApi: Record<string, string> = {
  hero: 'hero',
  sectors: 'sectors',
  capabilities: 'capabilities',
  compliance: 'compliance',
  'deployment-model': 'deploymentModel',
  'featured-programs': 'featuredPrograms',
  metrics: 'metrics',
  coverage: 'coverage',
  cta: 'cta',
};

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Hero';
}

function sectionPath(slug: string) {
  return slug === 'hero' ? '/industries-page-content' : `/industries-page-content/${slug}`;
}

const emptyPair = () => ({ title: '', body: '' });
const emptyMetric = () => ({ value: '', label: '' });
const emptyProgram = () => ({ title: '', sector: '', challenge: '', outcome: '' });

export default function IndustriesPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'industries-page-content';
  const slug = routeSlug === 'industries-page-content' ? 'hero' : routeSlug;
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
      const { data } = await client.get(`/api/home-content/industries-page/${apiSection}`);
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
      await client.put(`/api/home-content/industries-page/${apiSection}`, form);
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
      await client.delete(`/api/home-content/industries-page/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL Industries sections to defaults? This will clear all saved industries page content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/industries-page');
      setSuccess('All Industries sections reset to defaults');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Industries Page CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage Industries page one section at a time. This is fully dynamic and connected to backend APIs.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All Industries Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Industries Sections</h2>
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

  if (slug === 'sectors' || slug === 'deployment-model') {
    const items = Array.isArray(form) ? form : [emptyPair(), emptyPair(), emptyPair()];
    return renderPairEditor('Items', items, (next) => setSection(next), 'title', 'body');
  }

  if (slug === 'capabilities' || slug === 'compliance' || slug === 'coverage') {
    const items = Array.isArray(form) ? form : ['', '', ''];
    return renderStringListEditor('Points', items, (next) => setSection(next));
  }

  if (slug === 'featured-programs') {
    const items = Array.isArray(form) ? form : [emptyProgram(), emptyProgram()];
    return renderQuadEditor('Featured Programs', items, (next) => setSection(next), 'title', 'sector', 'challenge', 'outcome');
  }

  if (slug === 'metrics') {
    const items = Array.isArray(form) ? form : [emptyMetric(), emptyMetric(), emptyMetric()];
    return renderPairEditor('Metrics', items, (next) => setSection(next), 'value', 'label');
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

function renderQuadEditor(
  title: string,
  items: AnyObj[],
  setItems: (next: AnyObj[]) => void,
  key1: string,
  key2: string,
  key3: string,
  key4: string
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
          {[key2, key3, key4].map((key) => (
            <textarea
              key={key}
              rows={2}
              value={item?.[key] || ''}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], [key]: event.target.value };
                setItems(next);
              }}
              placeholder={key}
            />
          ))}
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
        onClick={() => setItems([...items, { [key1]: '', [key2]: '', [key3]: '', [key4]: '' }])}
      >
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
