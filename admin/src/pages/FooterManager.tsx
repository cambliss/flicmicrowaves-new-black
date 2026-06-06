import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterOfficeLocation {
  title: string;
  lines: string[];
}

interface FooterContent {
  description: string;
  email: string;
  phone: string;
  address: string;
  backgroundImage: string;
  qualityBadges: string[];
  socialLinks: FooterLink[];
  officeLocations: FooterOfficeLocation[];
  productsLinks: FooterLink[];
  aboutSiteLinks: FooterLink[];
  registeredOfficeLabel: string;
  registeredOfficeAddress: string;
  helpText: string;
  helpUrl: string;
  creditLine: string;
  solutionsLinks: FooterLink[];
  companyLinks: FooterLink[];
  bottomLinks: FooterLink[];
  copyright: string;
}

const defaultLink = (): FooterLink => ({ label: '', url: '#' });
const defaultOffice = (): FooterOfficeLocation => ({ title: '', lines: ['', '', ''] });

const emptyFooter = (): FooterContent => ({
  description: '',
  email: '',
  phone: '',
  address: '',
  backgroundImage: '',
  qualityBadges: ['', ''],
  socialLinks: [defaultLink(), defaultLink(), defaultLink()],
  officeLocations: [defaultOffice()],
  productsLinks: [defaultLink(), defaultLink(), defaultLink()],
  aboutSiteLinks: [defaultLink(), defaultLink(), defaultLink()],
  registeredOfficeLabel: '',
  registeredOfficeAddress: '',
  helpText: '',
  helpUrl: '',
  creditLine: '',
  solutionsLinks: [defaultLink(), defaultLink(), defaultLink()],
  companyLinks: [defaultLink(), defaultLink(), defaultLink()],
  bottomLinks: [defaultLink(), defaultLink(), defaultLink()],
  copyright: '',
});

export default function FooterManager() {
  const [form, setForm] = useState<FooterContent>(emptyFooter());
  const [saved, setSaved] = useState<FooterContent>(emptyFooter());
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const resolveImage = (name: string) => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://')) return name;
    return `${UPLOADS_URL}/${name}`;
  };

  const normalizeLinks = (links: FooterLink[]) =>
    links
      .map((item) => ({ label: item.label.trim(), url: item.url.trim() || '#' }))
      .filter((item) => item.label);

  const normalizeStringList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);

  const normalizeOfficeLocations = (items: FooterOfficeLocation[]) =>
    items
      .map((item) => ({
        title: item.title.trim(),
        lines: normalizeStringList(item.lines || []),
      }))
      .filter((item) => item.title && item.lines.length > 0);

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/footer');
      const next: FooterContent = {
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        backgroundImage: data.backgroundImage || '',
        qualityBadges: data.qualityBadges?.length ? data.qualityBadges : ['', ''],
        socialLinks: data.socialLinks?.length ? data.socialLinks : [defaultLink(), defaultLink(), defaultLink()],
        officeLocations: data.officeLocations?.length ? data.officeLocations : [defaultOffice()],
        productsLinks: data.productsLinks?.length ? data.productsLinks : [defaultLink(), defaultLink(), defaultLink()],
        aboutSiteLinks: data.aboutSiteLinks?.length ? data.aboutSiteLinks : [defaultLink(), defaultLink(), defaultLink()],
        registeredOfficeLabel: data.registeredOfficeLabel || '',
        registeredOfficeAddress: data.registeredOfficeAddress || '',
        helpText: data.helpText || '',
        helpUrl: data.helpUrl || '',
        creditLine: data.creditLine || '',
        solutionsLinks: data.solutionsLinks?.length ? data.solutionsLinks : [defaultLink(), defaultLink(), defaultLink()],
        companyLinks: data.companyLinks?.length ? data.companyLinks : [defaultLink(), defaultLink(), defaultLink()],
        bottomLinks: data.bottomLinks?.length ? data.bottomLinks : [defaultLink(), defaultLink(), defaultLink()],
        copyright: data.copyright || '',
      };

      setForm(next);
      setSaved(next);
      setPreview(resolveImage(next.backgroundImage));
      setBackgroundFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      setError('Failed to load footer content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const setField = (key: keyof FooterContent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLinkChange = (
    section: 'solutionsLinks' | 'companyLinks' | 'bottomLinks' | 'socialLinks' | 'productsLinks' | 'aboutSiteLinks',
    index: number,
    key: keyof FooterLink,
    value: string
  ) => {
    setForm((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [section]: next };
    });
  };

  const addLink = (section: 'solutionsLinks' | 'companyLinks' | 'bottomLinks' | 'socialLinks' | 'productsLinks' | 'aboutSiteLinks') => {
    setForm((prev) => {
      const current = prev[section];
      if (current.length >= 16) return prev;
      return { ...prev, [section]: [...current, defaultLink()] };
    });
  };

  const removeLink = (section: 'solutionsLinks' | 'companyLinks' | 'bottomLinks' | 'socialLinks' | 'productsLinks' | 'aboutSiteLinks', index: number) => {
    setForm((prev) => {
      const current = prev[section];
      if (current.length <= 1) return prev;
      return { ...prev, [section]: current.filter((_, i) => i !== index) };
    });
  };

  const handleQualityBadgeChange = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.qualityBadges];
      next[index] = value;
      return { ...prev, qualityBadges: next };
    });
  };

  const addQualityBadge = () => {
    setForm((prev) => ({ ...prev, qualityBadges: [...prev.qualityBadges, ''] }));
  };

  const removeQualityBadge = (index: number) => {
    setForm((prev) => {
      if (prev.qualityBadges.length <= 1) return prev;
      return {
        ...prev,
        qualityBadges: prev.qualityBadges.filter((_, i) => i !== index),
      };
    });
  };

  const updateOffice = (index: number, nextOffice: FooterOfficeLocation) => {
    setForm((prev) => {
      const next = [...prev.officeLocations];
      next[index] = nextOffice;
      return { ...prev, officeLocations: next };
    });
  };

  const addOffice = () => {
    setForm((prev) => ({ ...prev, officeLocations: [...prev.officeLocations, defaultOffice()] }));
  };

  const removeOffice = (index: number) => {
    setForm((prev) => {
      if (prev.officeLocations.length <= 1) return prev;
      return {
        ...prev,
        officeLocations: prev.officeLocations.filter((_, i) => i !== index),
      };
    });
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setBackgroundFile(file);

    if (!file) {
      setPreview(resolveImage(form.backgroundImage));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadBackgroundIfNeeded = async () => {
    if (!backgroundFile) return;
    const payload = new FormData();
    payload.append('image', backgroundFile);
    const { data } = await client.post('/api/home-content/footer/background', payload);
    setForm((prev) => ({ ...prev, backgroundImage: data.backgroundImage || prev.backgroundImage }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    setSaving(true);
    try {
      await uploadBackgroundIfNeeded();
      await client.put('/api/home-content/footer', {
        description: form.description.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        qualityBadges: normalizeStringList(form.qualityBadges),
        socialLinks: normalizeLinks(form.socialLinks),
        officeLocations: normalizeOfficeLocations(form.officeLocations),
        productsLinks: normalizeLinks(form.productsLinks),
        aboutSiteLinks: normalizeLinks(form.aboutSiteLinks),
        registeredOfficeLabel: form.registeredOfficeLabel.trim(),
        registeredOfficeAddress: form.registeredOfficeAddress.trim(),
        helpText: form.helpText.trim(),
        helpUrl: form.helpUrl.trim() || '#',
        creditLine: form.creditLine.trim(),
        solutionsLinks: normalizeLinks(form.solutionsLinks),
        companyLinks: normalizeLinks(form.companyLinks),
        bottomLinks: normalizeLinks(form.bottomLinks),
        copyright: form.copyright.trim() || '© 2026 Flic Microwaves. All rights reserved.',
      });
      await loadContent();
    } catch {
      setError('Failed to save footer content');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const renderLinksEditor = (
    title: string,
    section: 'solutionsLinks' | 'companyLinks' | 'bottomLinks' | 'socialLinks' | 'productsLinks' | 'aboutSiteLinks'
  ) => (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>{title}</h3>
      {form[section].map((item, index) => (
        <div key={`${section}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Link {index + 1}</p>
          <input
            type="text"
            value={item.label}
            onChange={(event) => handleLinkChange(section, index, 'label', event.target.value)}
            placeholder="Label"
          />
          <input
            type="text"
            value={item.url}
            onChange={(event) => handleLinkChange(section, index, 'url', event.target.value)}
            placeholder="URL"
          />
          <div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => removeLink(section, index)}
              disabled={form[section].length <= 1}
            >
              Remove Link
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={() => addLink(section)}>
          + Add Link
        </button>
      </div>
    </div>
  );

  const renderQualityBadgesEditor = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Quality Badges</h3>
      {form.qualityBadges.map((item, index) => (
        <div key={`quality-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Badge {index + 1}</p>
          <input type="text" value={item} onChange={(event) => handleQualityBadgeChange(index, event.target.value)} placeholder="Badge text" />
          <div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => removeQualityBadge(index)}
              disabled={form.qualityBadges.length <= 1}
            >
              Remove Badge
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={addQualityBadge}>
          + Add Badge
        </button>
      </div>
    </div>
  );

  const renderOfficeEditor = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Office Locations</h3>
      {form.officeLocations.map((office, index) => (
        <div key={`office-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Office {index + 1}</p>
          <input
            type="text"
            value={office.title}
            onChange={(event) => updateOffice(index, { ...office, title: event.target.value })}
            placeholder="Office title"
          />
          <textarea
            rows={4}
            value={(office.lines || []).join('\n')}
            onChange={(event) => updateOffice(index, { ...office, lines: event.target.value.split('\n') })}
            placeholder="One address line per row"
          />
          <div>
            <button
              type="button"
              className="btn btn-danger"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={() => removeOffice(index)}
              disabled={form.officeLocations.length <= 1}
            >
              Remove Office
            </button>
          </div>
        </div>
      ))}
      <div>
        <button type="button" className="btn btn-outline" onClick={addOffice}>
          + Add Office
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'grid', gap: 14, marginBottom: 28, justifyItems: 'start' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Footer CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage footer details, links, and sectioned layout content.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
          <Link to="/banners" className="btn btn-outline">+ Add Banner</Link>
          <Link to="/home-content" className="btn btn-outline">+ Why Choose Content</Link>
          <Link to="/solutions-content" className="btn btn-outline">+ Solutions Content</Link>
          <Link to="/process-content" className="btn btn-outline">+ Process Content</Link>
          <Link to="/industries-content" className="btn btn-outline">+ Industries Content</Link>
          <Link to="/featured-products-content" className="btn btn-outline">+ Featured Products Content</Link>
          <Link to="/innovation-content" className="btn btn-outline">+ Innovation Content</Link>
          <Link to="/footer-content" className="btn btn-outline">+ Footer Content</Link>
          <Link to="/" className="btn btn-secondary">Product List</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading && <p>Loading content...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && (
        <form className="card" style={{ display: 'grid', gap: 14 }} onSubmit={handleSave}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Footer Content</h2>

          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} />

          <label>Email</label>
          <input type="text" value={form.email} onChange={(e) => setField('email', e.target.value)} />

          <label>Phone</label>
          <input type="text" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />

          <label>Address</label>
          <input type="text" value={form.address} onChange={(e) => setField('address', e.target.value)} />

          <label>Registered Office Label</label>
          <input type="text" value={form.registeredOfficeLabel} onChange={(e) => setField('registeredOfficeLabel', e.target.value)} />

          <label>Registered Office Address</label>
          <input type="text" value={form.registeredOfficeAddress} onChange={(e) => setField('registeredOfficeAddress', e.target.value)} />

          <label>Help Banner Text</label>
          <input type="text" value={form.helpText} onChange={(e) => setField('helpText', e.target.value)} />

          <label>Help Banner URL</label>
          <input type="text" value={form.helpUrl} onChange={(e) => setField('helpUrl', e.target.value)} />

          <label>Credit Line</label>
          <input type="text" value={form.creditLine} onChange={(e) => setField('creditLine', e.target.value)} />

          <label>Copyright Line</label>
          <input type="text" value={form.copyright} onChange={(e) => setField('copyright', e.target.value)} />

          <label>Footer Background Image</label>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleBackgroundChange}
          />

          {!!preview && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, maxWidth: 440 }}>
              <img src={preview} alt="Footer background" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 6 }} />
            </div>
          )}

          {renderLinksEditor('Social Links', 'socialLinks')}
          {renderQualityBadgesEditor()}
          {renderOfficeEditor()}
          {renderLinksEditor('Products Links', 'productsLinks')}
          {renderLinksEditor('About Site Links', 'aboutSiteLinks')}

          {renderLinksEditor('Solutions Links (Optional)', 'solutionsLinks')}
          {renderLinksEditor('Company Links (Optional)', 'companyLinks')}
          {renderLinksEditor('Bottom Links (Optional)', 'bottomLinks')}

          <div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Footer'}
            </button>
          </div>

          <div className="card" style={{ display: 'grid', gap: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Saved Preview</h3>
            <p style={{ color: '#374151' }}>{saved.description || '-'}</p>
            <p style={{ color: '#374151' }}>Email: {saved.email || '-'}</p>
            <p style={{ color: '#374151' }}>Phone: {saved.phone || '-'}</p>
            <p style={{ color: '#374151' }}>Address: {saved.address || '-'}</p>
          </div>
        </form>
      )}
    </div>
  );
}
