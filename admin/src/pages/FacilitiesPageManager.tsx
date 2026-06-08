import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

type AnyObj = Record<string, any>;

type LinkSection = {
  slug: string;
  title: string;
  desc: string;
};

const sections: LinkSection[] = [
  { slug: 'hero', title: 'Hero', desc: 'Main banner heading and CTA.' },
  { slug: 'intro', title: 'Intro', desc: 'Facilities introduction text.' },
  { slug: 'facilities', title: 'Facilities', desc: 'Facility cards shown on home and facilities page.' },
  { slug: 'cta', title: 'CTA', desc: 'Bottom call-to-action block.' },
];

const slugToApi: Record<string, string> = {
  hero: 'hero',
  intro: 'intro',
  facilities: 'facilities',
  cta: 'cta',
};

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Hero';
}

function sectionPath(slug: string) {
  return slug === 'hero' ? '/facilities-page-content' : `/facilities-page-content/${slug}`;
}

const emptyFacility = () => ({ id: '', title: '', summary: '', details: '', image: '' });

export default function FacilitiesPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'facilities-page-content';
  const slug = routeSlug === 'facilities-page-content' ? 'hero' : routeSlug;
  const apiSection = slugToApi[slug] || 'hero';

  const [form, setForm] = useState<AnyObj>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resolveImage = (name: string) => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://')) return name;
    return `${UPLOADS_URL}/${name}`;
  };

  const loadSection = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await client.get(`/api/home-content/facilities-page/${apiSection}`);
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

  const uploadCmsImage = async (index: number, file: File) => {
    setError('');
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await client.post('/api/home-content/upload/image', fd);
      const uploaded = data?.image || '';
      if (!uploaded) throw new Error('Upload failed');

      setForm((prev: AnyObj) => {
        const items = Array.isArray(prev) ? [...prev] : [];
        if (!items[index]) return prev;
        items[index] = { ...items[index], image: uploaded };
        return items;
      });
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const saveSection = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await client.put(`/api/home-content/facilities-page/${apiSection}`, form);
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
      await client.delete(`/api/home-content/facilities-page/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL Facilities sections to defaults? This will clear all saved facilities content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/facilities-page');
      setSuccess('All Facilities sections reset to defaults');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Facilities Page CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage Facilities page one section at a time. Home page facilities cards are also controlled here.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All Facilities Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Facilities Sections</h2>
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
              {renderSectionEditor(slug, form, setField, setSection, uploadCmsImage, resolveImage, uploadingIndex)}
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
  setSection: (value: any) => void,
  uploadCmsImage: (index: number, file: File) => Promise<void>,
  resolveImage: (name: string) => string,
  uploadingIndex: number | null
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
        </div>
      </>
    );
  }

  if (slug === 'intro') {
    return (
      <>
        {simpleInput('Heading', form.heading, (v) => setField('heading', v))}
        {simpleText('Description', form.description, (v) => setField('description', v), 4)}
      </>
    );
  }

  if (slug === 'facilities') {
    const items = Array.isArray(form) ? form : [emptyFacility(), emptyFacility(), emptyFacility(), emptyFacility()];
    return renderFacilitiesEditor(items, (next) => setSection(next), uploadCmsImage, resolveImage, uploadingIndex);
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

function renderFacilitiesEditor(
  items: AnyObj[],
  setItems: (next: AnyObj[]) => void,
  uploadCmsImage: (index: number, file: File) => Promise<void>,
  resolveImage: (name: string) => string,
  uploadingIndex: number | null
) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Facilities Cards</h3>
      {items.map((item, index) => (
        <div key={`facility-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Card {index + 1}</p>
          <input
            type="text"
            value={item?.id || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], id: event.target.value };
              setItems(next);
            }}
            placeholder="id (example: rf-lab)"
          />
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
          <textarea
            rows={2}
            value={item?.summary || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], summary: event.target.value };
              setItems(next);
            }}
            placeholder="summary"
          />
          <textarea
            rows={3}
            value={item?.details || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], details: event.target.value };
              setItems(next);
            }}
            placeholder="details"
          />
          <input
            type="text"
            value={item?.image || ''}
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], image: event.target.value };
              setItems(next);
            }}
            placeholder="image URL or /path"
          />
          {!!item?.image && (
            <>
              <img
                src={resolveImage(item.image)}
                alt={`Facility ${index + 1}`}
                style={{ width: '100%', maxWidth: 360, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
                onClick={() => {
                  const next = [...items];
                  next[index] = { ...next[index], image: '' };
                  setItems(next);
                }}
              >
                Remove Image
              </button>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await uploadCmsImage(index, file);
              event.target.value = '';
            }}
          />
          {uploadingIndex === index && <p style={{ fontSize: 12, color: '#6b7280' }}>Uploading image...</p>}
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
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setItems([...items, emptyFacility()])}>
        + Add
      </button>
    </div>
  );
}
