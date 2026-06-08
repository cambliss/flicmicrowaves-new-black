import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

type AnyObj = Record<string, any>;

type LinkSection = {
  slug: string;
  title: string;
  desc: string;
};

const sections: LinkSection[] = [
  { slug: 'overview', title: 'Overview', desc: 'Hero text, CTAs, and stats.' },
  { slug: 'journey', title: 'Journey', desc: 'Corporate narrative, image, and highlights.' },
  { slug: 'capabilities', title: 'Capabilities', desc: 'Capability heading and cards.' },
  { slug: 'operating-model', title: 'Operating Model', desc: 'Execution model heading and steps.' },
  { slug: 'leadership', title: 'Leadership', desc: 'Leadership heading and cards.' },
  { slug: 'mission-vision', title: 'Mission And Vision', desc: 'Mission, vision, and values content.' },
  { slug: 'timeline', title: 'Timeline', desc: 'Vertical timeline milestones.' },
  { slug: 'global-presence', title: 'Global Presence', desc: 'Points and stats.' },
  { slug: 'awards', title: 'Awards', desc: 'Awards and recognition list.' },
  { slug: 'quality-iso', title: 'Quality And ISO', desc: 'Quality points and certifications.' },
  { slug: 'md-message', title: 'MD Message', desc: 'Message from MD with profile photo.' },
  { slug: 'cta', title: 'CTA', desc: 'Bottom call-to-action text and buttons.' },
];

const slugToApi: Record<string, string> = {
  overview: 'overview',
  journey: 'journey',
  capabilities: 'capabilities',
  'operating-model': 'operatingModel',
  leadership: 'leadership',
  'mission-vision': 'missionVision',
  timeline: 'timeline',
  'global-presence': 'globalPresence',
  awards: 'awardsQuality',
  'quality-iso': 'awardsQuality',
  'md-message': 'mdMessage',
  cta: 'cta',
};

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Overview';
}

function sectionPath(slug: string) {
  return slug === 'overview' ? '/about-content' : `/about-content/${slug}`;
}

const emptyPair = () => ({ title: '', description: '' });
const emptyCard = () => ({ title: '', body: '' });
const emptyLeader = () => ({ name: '', role: '', bio: '' });
const emptyStep = () => ({ step: '', title: '', body: '' });
const emptyTimeline = () => ({ year: '', title: '', body: '' });
const emptyStat = () => ({ value: '', label: '' });

export default function AboutPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'about-content';
  const slug = routeSlug === 'about-content' ? 'overview' : routeSlug;
  const apiSection = slugToApi[slug] || 'overview';

  const [form, setForm] = useState<AnyObj>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const { data } = await client.get(`/api/home-content/about/${apiSection}`);
      setForm(data || {});
      const imageField =
        apiSection === 'overview'
          ? data?.bannerImage
          : apiSection === 'journey'
            ? data?.image
            : apiSection === 'mdMessage'
              ? data?.image
              : '';
      setPreviewImage(resolveImage(imageField || ''));
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  const onUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadFile(file);
    if (!file) {
      const currentField = apiSection === 'overview' ? form.bannerImage : form.image;
      setPreviewImage(resolveImage(currentField || ''));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadIfNeeded = async () => {
    if (!uploadFile) return {} as AnyObj;
    const payload = new FormData();
    payload.append('image', uploadFile);

    if (apiSection === 'overview') {
      const { data } = await client.post('/api/home-content/about/overview-banner', payload);
      const uploaded = data.bannerImage || '';
      setForm((prev: AnyObj) => ({ ...prev, bannerImage: uploaded || prev.bannerImage }));
      return { bannerImage: uploaded } as AnyObj;
    }

    if (apiSection === 'journey') {
      const { data } = await client.post('/api/home-content/about/journey-image', payload);
      const uploaded = data.image || '';
      setForm((prev: AnyObj) => ({ ...prev, image: uploaded || prev.image }));
      return { image: uploaded } as AnyObj;
    }

    if (apiSection === 'mdMessage') {
      const { data } = await client.post('/api/home-content/about/md-image', payload);
      const uploaded = data.image || '';
      setForm((prev: AnyObj) => ({ ...prev, image: uploaded || prev.image }));
      return { image: uploaded } as AnyObj;
    }

    return {} as AnyObj;
  };

  const saveSection = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const uploadPatch = await uploadIfNeeded();
      const basePayload = apiSection === 'awardsQuality' ? buildAwardsQualityPayload(slug, form) : form;
      const sectionPayload = { ...basePayload, ...uploadPatch };
      await client.put(`/api/home-content/about/${apiSection}`, sectionPayload);
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
      await client.delete(`/api/home-content/about/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL About Us sections to defaults? This will clear all saved About page content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/about');
      setSuccess('All About sections reset to defaults');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - About Us CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage About page one section at a time. This is fully dynamic and connected to backend APIs.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All About Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>About Sections</h2>
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
              {renderSectionEditor(slug, form, setField, previewImage, setPreviewImage, onUploadChange, fileInputRef)}
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

function buildAwardsQualityPayload(slug: string, form: AnyObj) {
  if (slug === 'awards') {
    return {
      ...form,
      qualityTitle: form.qualityTitle || 'Quality Management And Control',
      qualityPoints: Array.isArray(form.qualityPoints) ? form.qualityPoints : [],
      certifications: Array.isArray(form.certifications) ? form.certifications : [],
    };
  }

  return {
    ...form,
    awardsTitle: form.awardsTitle || 'Awards And Recognition',
    awards: Array.isArray(form.awards) ? form.awards : [],
  };
}

function renderSectionEditor(
  slug: string,
  form: AnyObj,
  setField: (key: string, value: any) => void,
  previewImage: string,
  setPreviewImage: (value: string) => void,
  onUploadChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  fileInputRef: React.RefObject<HTMLInputElement>
) {
  if (slug === 'overview') {
    const stats = Array.isArray(form.stats) ? form.stats : [emptyStat(), emptyStat(), emptyStat(), emptyStat()];
    return (
      <>
        <div
          style={{
            border: '1px solid #e5cf97',
            background: '#fff6df',
            borderRadius: 10,
            padding: 12,
            display: 'grid',
            gap: 10,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: '#7a5d20' }}>About Banner Upload</p>
          <p style={{ fontSize: 12, color: '#8b6d2e' }}>Upload separate About Us hero banner image here, then click Save Overview.</p>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onUploadChange} />
          {!!previewImage && (
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, maxWidth: 500, background: '#fff' }}>
                <img src={previewImage} alt="About banner preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6 }} />
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
                onClick={() => {
                  setField('bannerImage', '');
                  setPreviewImage('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleInput('Highlight Text', form.highlight, (v) => setField('highlight', v))}
        {simpleText('Description', form.description, (v) => setField('description', v), 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Primary CTA Text', form.primaryCtaText, (v) => setField('primaryCtaText', v))}
          {simpleInput('Primary CTA URL', form.primaryCtaUrl, (v) => setField('primaryCtaUrl', v))}
          {simpleInput('Secondary CTA Text', form.secondaryCtaText, (v) => setField('secondaryCtaText', v))}
          {simpleInput('Secondary CTA URL', form.secondaryCtaUrl, (v) => setField('secondaryCtaUrl', v))}
        </div>
        {renderStatsEditor('Hero Stats', stats, (next) => setField('stats', next))}
      </>
    );
  }

  if (slug === 'journey') {
    const highlights = Array.isArray(form.highlights) ? form.highlights : [emptyPair(), emptyPair()];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Paragraph 1', form.paragraph1, (v) => setField('paragraph1', v), 3)}
        {simpleText('Paragraph 2', form.paragraph2, (v) => setField('paragraph2', v), 3)}

        <label>Journey Image</label>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onUploadChange} />
        {!!previewImage && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, maxWidth: 460 }}>
              <img src={previewImage} alt="Journey preview" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 6 }} />
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
              onClick={() => {
                setField('image', '');
                setPreviewImage('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        {renderPairEditor('Highlights', highlights, (next) => setField('highlights', next), 'title', 'description')}
      </>
    );
  }

  if (slug === 'capabilities') {
    const items = Array.isArray(form.items) ? form.items : [emptyCard(), emptyCard(), emptyCard()];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 2)}
        {renderPairEditor('Capability Cards', items, (next) => setField('items', next), 'title', 'body')}
      </>
    );
  }

  if (slug === 'operating-model') {
    const items = Array.isArray(form.items) ? form.items : [emptyStep(), emptyStep(), emptyStep(), emptyStep()];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 2)}
        {renderTripleEditor('Operating Steps', items, (next) => setField('items', next), 'step', 'title', 'body')}
      </>
    );
  }

  if (slug === 'leadership') {
    const items = Array.isArray(form.items) ? form.items : [emptyLeader(), emptyLeader(), emptyLeader()];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 2)}
        {renderTripleEditor('Leadership Cards', items, (next) => setField('items', next), 'name', 'role', 'bio')}
      </>
    );
  }

  if (slug === 'mission-vision') {
    return (
      <>
        {simpleInput('Mission Title', form.missionTitle, (v) => setField('missionTitle', v))}
        {simpleText('Mission Text', form.missionText, (v) => setField('missionText', v), 3)}
        {simpleInput('Vision Title', form.visionTitle, (v) => setField('visionTitle', v))}
        {simpleText('Vision Text', form.visionText, (v) => setField('visionText', v), 3)}
        {simpleInput('Values Title', form.valuesTitle, (v) => setField('valuesTitle', v))}
        {simpleText('Values Text', form.valuesText, (v) => setField('valuesText', v), 3)}
      </>
    );
  }

  if (slug === 'timeline') {
    const items = Array.isArray(form.items) ? form.items : [emptyTimeline(), emptyTimeline(), emptyTimeline()];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 2)}
        {renderTripleEditor('Milestones', items, (next) => setField('items', next), 'year', 'title', 'body')}
      </>
    );
  }

  if (slug === 'global-presence') {
    const stats = Array.isArray(form.stats) ? form.stats : [emptyStat(), emptyStat(), emptyStat(), emptyStat()];
    const points = Array.isArray(form.points) ? form.points : ['', '', ''];
    return (
      <>
        {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {renderStringListEditor('Global Points', points, (next) => setField('points', next))}
        {renderStatsEditor('Global Stats', stats, (next) => setField('stats', next))}
      </>
    );
  }

  if (slug === 'awards') {
    const awards = Array.isArray(form.awards) ? form.awards : [''];
    return (
      <>
        {simpleInput('Awards Section Title', form.awardsTitle, (v) => setField('awardsTitle', v))}
        {renderStringListEditor('Awards', awards, (next) => setField('awards', next))}
      </>
    );
  }

  if (slug === 'quality-iso') {
    const qualityPoints = Array.isArray(form.qualityPoints) ? form.qualityPoints : [''];
    const certifications = Array.isArray(form.certifications) ? form.certifications : [''];
    return (
      <>
        {simpleInput('Quality Section Title', form.qualityTitle, (v) => setField('qualityTitle', v))}
        {renderStringListEditor('Quality Points', qualityPoints, (next) => setField('qualityPoints', next))}
        {renderStringListEditor('Certifications', certifications, (next) => setField('certifications', next))}
      </>
    );
  }

  if (slug === 'md-message') {
    return (
      <>
        {simpleInput('Section Title', form.title, (v) => setField('title', v))}
        {simpleInput('MD Name', form.name, (v) => setField('name', v))}
        {simpleInput('MD Role', form.role, (v) => setField('role', v))}
        {simpleText('Message', form.message, (v) => setField('message', v), 5)}

        <label>MD Photo</label>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={onUploadChange} />
        {!!previewImage && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, maxWidth: 300 }}>
              <img src={previewImage} alt="MD preview" style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 6 }} />
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
              onClick={() => {
                setField('image', '');
                setPreviewImage('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Remove Image
            </button>
          </div>
        )}
      </>
    );
  }

  const cta = slug === 'cta';
  return cta ? (
    <>
      {simpleInput('Eyebrow', form.eyebrow, (v) => setField('eyebrow', v))}
      {simpleInput('Title', form.title, (v) => setField('title', v))}
      {simpleText('Description', form.description, (v) => setField('description', v), 3)}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {simpleInput('Primary CTA Text', form.primaryText, (v) => setField('primaryText', v))}
        {simpleInput('Primary CTA URL', form.primaryUrl, (v) => setField('primaryUrl', v))}
        {simpleInput('Secondary CTA Text', form.secondaryText, (v) => setField('secondaryText', v))}
        {simpleInput('Secondary CTA URL', form.secondaryUrl, (v) => setField('secondaryUrl', v))}
      </div>
    </>
  ) : null;
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

function renderPairEditor(
  title: string,
  items: AnyObj[],
  setItems: (next: AnyObj[]) => void,
  key1: string,
  key2: string
) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item[key1] || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], [key1]: e.target.value };
              setItems(next);
            }}
            placeholder={key1}
          />
          <textarea
            rows={3}
            value={item[key2] || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], [key2]: e.target.value };
              setItems(next);
            }}
            placeholder={key2}
          />
          <div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => setItems(items.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={() => setItems([...items, { [key1]: '', [key2]: '' }])}>
          + Add Item
        </button>
      </div>
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
        <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item[key1] || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], [key1]: e.target.value };
              setItems(next);
            }}
            placeholder={key1}
          />
          <input
            type="text"
            value={item[key2] || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], [key2]: e.target.value };
              setItems(next);
            }}
            placeholder={key2}
          />
          <textarea
            rows={3}
            value={item[key3] || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], [key3]: e.target.value };
              setItems(next);
            }}
            placeholder={key3}
          />
          <div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => setItems(items.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={() => setItems([...items, { [key1]: '', [key2]: '', [key3]: '' }])}>
          + Add Item
        </button>
      </div>
    </div>
  );
}

function renderStringListEditor(title: string, items: string[], setItems: (next: string[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <input
            type="text"
            value={item || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              setItems(next);
            }}
          />
          <button type="button" className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setItems(items.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={() => setItems([...items, ''])}>
          + Add Item
        </button>
      </div>
    </div>
  );
}

function renderStatsEditor(title: string, items: AnyObj[], setItems: (next: AnyObj[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {items.map((item, index) => (
        <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={item.value || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], value: e.target.value };
              setItems(next);
            }}
            placeholder="Value (e.g. 25+)"
          />
          <input
            type="text"
            value={item.label || ''}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], label: e.target.value };
              setItems(next);
            }}
            placeholder="Label"
          />
          <div>
            <button type="button" className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setItems(items.filter((_, i) => i !== index))}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={() => setItems([...items, emptyStat()])}>
          + Add Stat
        </button>
      </div>
    </div>
  );
}
