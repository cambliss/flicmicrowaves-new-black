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
  { slug: 'hero', title: 'Hero', desc: 'Hero heading and subtitle.' },
  { slug: 'form', title: 'Form Settings', desc: 'Form title, messages, and submit text.' },
  { slug: 'form-fields', title: 'Form Fields', desc: 'Add or remove custom text fields.' },
  { slug: 'contact-info', title: 'Contact Info', desc: 'Emails, phones, address, and quick actions.' },
  { slug: 'map', title: 'Map Block', desc: 'Map section heading and location details.' },
  { slug: 'highlights', title: 'Highlights', desc: 'Small info cards at bottom.' },
];

const slugToApi: Record<string, string> = {
  hero: 'hero',
  form: 'form',
  'form-fields': 'formFields',
  'contact-info': 'contactInfo',
  map: 'map',
  highlights: 'highlights',
};

const fieldTypes = ['text', 'email', 'tel', 'textarea', 'select'] as const;

const emptyField = () => ({
  key: '',
  label: '',
  type: 'text',
  placeholder: '',
  required: false,
  options: [],
});

const emptyPair = () => ({ title: '', body: '' });

function sectionTitle(slug: string) {
  return sections.find((s) => s.slug === slug)?.title || 'Hero';
}

function sectionPath(slug: string) {
  return slug === 'hero' ? '/contact-page-content' : `/contact-page-content/${slug}`;
}

export default function ContactPageManager() {
  const location = useLocation();
  const routeSlug = location.pathname.split('/').filter(Boolean).pop() || 'contact-page-content';
  const slug = routeSlug === 'contact-page-content' ? 'hero' : routeSlug;
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
      const { data } = await client.get(`/api/home-content/contact-page/${apiSection}`);
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
      await client.put(`/api/home-content/contact-page/${apiSection}`, form);
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
      await client.delete(`/api/home-content/contact-page/${apiSection}`);
      setSuccess(`${sectionTitle(slug)} section reset to defaults`);
      await loadSection();
    } catch {
      setError('Failed to reset section');
    } finally {
      setSaving(false);
    }
  };

  const resetAllSections = async () => {
    const confirmed = window.confirm('Reset ALL Contact sections to defaults? This will clear all saved contact page content.');
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await client.delete('/api/home-content/contact-page');
      setSuccess('All Contact sections reset to defaults');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Contact Page CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>
          Manage Contact page one section at a time. Form fields are fully dynamic and publish directly on website.
        </p>
        <div>
          <button type="button" className="btn btn-danger" onClick={resetAllSections} disabled={saving}>
            Reset All Contact Sections
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 18 }}>
        <aside className="card" style={{ display: 'grid', gap: 8, alignContent: 'start', height: 'fit-content' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Contact Sections</h2>
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

  if (slug === 'form') {
    return (
      <>
        {simpleInput('Title', form.title, (v) => setField('title', v))}
        {simpleText('Subtitle', form.subtitle, (v) => setField('subtitle', v), 3)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Submit Button Text', form.submitText, (v) => setField('submitText', v))}
          {simpleInput('Success Message', form.successMessage, (v) => setField('successMessage', v))}
        </div>
        {simpleInput('Error Message', form.errorMessage, (v) => setField('errorMessage', v))}
      </>
    );
  }

  if (slug === 'form-fields') {
    const fields = Array.isArray(form) ? form : [emptyField()];
    return renderFormFieldsEditor(fields, (next) => setSection(next));
  }

  if (slug === 'contact-info') {
    const value = form || {};
    return (
      <>
        {simpleInput('Response Time Text', value.responseTime, (v) => setField('responseTime', v))}
        {simpleInput('Appointment URL', value.appointmentUrl, (v) => setField('appointmentUrl', v))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {simpleInput('Quick Call Label', value.quickCallLabel, (v) => setField('quickCallLabel', v))}
          {simpleInput('Quick Email Label', value.quickEmailLabel, (v) => setField('quickEmailLabel', v))}
        </div>
        {renderStringListEditor('Emails', Array.isArray(value.emails) ? value.emails : [''], (next) => setField('emails', next))}
        {renderStringListEditor('Phones', Array.isArray(value.phones) ? value.phones : [''], (next) => setField('phones', next))}
        {renderStringListEditor('Address Lines', Array.isArray(value.addressLines) ? value.addressLines : [''], (next) => setField('addressLines', next))}
        {renderStringListEditor('Business Hours', Array.isArray(value.hours) ? value.hours : [''], (next) => setField('hours', next))}
      </>
    );
  }

  if (slug === 'map') {
    return (
      <>
        {simpleInput('Map Section Title', form.title, (v) => setField('title', v))}
        {simpleText('Map Section Subtitle', form.subtitle, (v) => setField('subtitle', v), 3)}
        {simpleInput('Location Name', form.locationName, (v) => setField('locationName', v))}
        {simpleInput('Address', form.address, (v) => setField('address', v))}
        {simpleInput('Directions URL', form.directionsUrl, (v) => setField('directionsUrl', v))}
      </>
    );
  }

  if (slug === 'highlights') {
    const items = Array.isArray(form) ? form : [emptyPair(), emptyPair()];
    return renderPairEditor('Highlight Cards', items, (next) => setSection(next), 'title', 'body');
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

function renderFormFieldsEditor(fields: AnyObj[], setFields: (next: AnyObj[]) => void) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Form Fields</h3>
      {fields.map((field, index) => (
        <div key={`field-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              type="text"
              value={field?.key || ''}
              onChange={(event) => {
                const next = [...fields];
                next[index] = { ...next[index], key: event.target.value };
                setFields(next);
              }}
              placeholder="key (example: projectName)"
            />
            <input
              type="text"
              value={field?.label || ''}
              onChange={(event) => {
                const next = [...fields];
                next[index] = { ...next[index], label: event.target.value };
                setFields(next);
              }}
              placeholder="label"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <select
              value={field?.type || 'text'}
              onChange={(event) => {
                const next = [...fields];
                next[index] = { ...next[index], type: event.target.value };
                setFields(next);
              }}
            >
              {fieldTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              value={field?.placeholder || ''}
              onChange={(event) => {
                const next = [...fields];
                next[index] = { ...next[index], placeholder: event.target.value };
                setFields(next);
              }}
              placeholder="placeholder"
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={Boolean(field?.required)}
              onChange={(event) => {
                const next = [...fields];
                next[index] = { ...next[index], required: event.target.checked };
                setFields(next);
              }}
            />
            Required field
          </label>

          {field?.type === 'select' && (
            <div>
              {renderStringListEditor(
                'Select Options',
                Array.isArray(field?.options) ? field.options : [''],
                (nextOptions) => {
                  const next = [...fields];
                  next[index] = { ...next[index], options: nextOptions };
                  setFields(next);
                }
              )}
            </div>
          )}

          <button
            type="button"
            className="btn btn-danger"
            style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
            onClick={() => setFields(fields.filter((_, i) => i !== index))}
            disabled={fields.length <= 1}
          >
            Remove Field
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline" style={{ width: 'fit-content' }} onClick={() => setFields([...fields, emptyField()])}>
        + Add Field
      </button>
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
