import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface IndustryItem {
  title: string;
  description: string;
}

interface IndustriesContent {
  heading: string;
  subtitle: string;
  image: string;
  items: IndustryItem[];
}

const defaultItem = (): IndustryItem => ({
  title: '',
  description: '',
});

const emptyContent = (): IndustriesContent => ({
  heading: '',
  subtitle: '',
  image: '',
  items: [],
});

export default function IndustriesManager() {
  const [heading, setHeading] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState<IndustryItem[]>([defaultItem(), defaultItem(), defaultItem()]);
  const [saved, setSaved] = useState<IndustriesContent>(emptyContent());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const resolveImage = (name: string) => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://')) return name;
    return `${UPLOADS_URL}/${name}`;
  };

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/industries');
      setHeading(data.heading || '');
      setSubtitle(data.subtitle || '');
      setItems(data.items?.length ? data.items : [defaultItem(), defaultItem(), defaultItem()]);
      setSaved({
        heading: data.heading || '',
        subtitle: data.subtitle || '',
        image: data.image || '',
        items: data.items?.length ? data.items : [],
      });
      setPreview(resolveImage(data.image || ''));
    } catch {
      setError('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleItemChange = (index: number, key: keyof IndustryItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => (prev.length >= 6 ? prev : [...prev, defaultItem()]));
  };

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (!file) {
      setPreview(resolveImage(saved.image));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return;
    const form = new FormData();
    form.append('image', imageFile);
    const { data } = await client.post('/api/home-content/industries/image', form);
    setSaved((prev) => ({ ...prev, image: data.image || prev.image }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedItems = items
      .map((item) => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter((item) => item.title && item.description);

    if (!heading.trim() || !subtitle.trim() || cleanedItems.length === 0) {
      setError('Heading, subtitle, and at least one industry card are required');
      return;
    }

    setSaving(true);
    try {
      await uploadImageIfNeeded();
      await client.put('/api/home-content/industries', {
        heading: heading.trim(),
        subtitle: subtitle.trim(),
        items: cleanedItems,
      });
      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
      await loadContent();
    } catch {
      setError('Failed to save CMS content');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSavedItem = async (index: number) => {
    if (!window.confirm('Delete this saved industry card?')) return;

    setSaving(true);
    setError('');
    try {
      const nextItems = saved.items.filter((_, i) => i !== index);
      await client.put('/api/home-content/industries', {
        heading: saved.heading,
        subtitle: saved.subtitle,
        items: nextItems,
      });
      await loadContent();
    } catch {
      setError('Failed to delete saved card');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSavedSection = async () => {
    if (!window.confirm('Delete all saved industries content?')) return;

    setSaving(true);
    setError('');
    try {
      await client.put('/api/home-content/industries', {
        heading: '',
        subtitle: '',
        items: [],
      });
      await loadContent();
    } catch {
      setError('Failed to clear saved content');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'grid', gap: 14, marginBottom: 28, justifyItems: 'start' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Home CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Serving Critical Industries section</p>
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
        <div style={{ display: 'grid', gap: 18 }}>
          <form className="card" style={{ display: 'grid', gap: 14 }} onSubmit={handleSave}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Serving Critical Industries Section</h2>

            <label>Section Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
              placeholder="Serving Critical Industries"
            />

            <label>Section Subtitle</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Industries we serve..."
            />

            <label>Section Image (JPG, PNG, GIF, WebP)</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleSelectImage}
            />

            {preview && (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 8, width: '100%', maxWidth: 440 }}>
                <img src={preview} alt="Industries preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}

            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Cards</h3>

              {items.map((item, index) => (
                <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Card {index + 1}</p>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) => handleItemChange(index, 'title', event.target.value)}
                    placeholder="Card title"
                  />
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(event) => handleItemChange(index, 'description', event.target.value)}
                    placeholder="Card description"
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <button type="button" className="btn btn-outline" onClick={addItem}>
                  + Add Card
                </button>
              </div>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Industries Section'}
              </button>
            </div>
          </form>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Saved Content</h2>
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={handleClearSavedSection}
                disabled={saving || saved.items.length === 0}
              >
                Delete All
              </button>
            </div>

            {!saved.heading && !saved.subtitle && saved.items.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 13 }}>No saved content yet.</p>
            ) : (
              <>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Heading</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{saved.heading || '-'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Subtitle</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.subtitle || '-'}</p>
                </div>

                {!!saved.image && (
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 8, width: '100%', maxWidth: 440 }}>
                    <img src={resolveImage(saved.image)} alt="Saved industries" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                )}

                <div style={{ display: 'grid', gap: 10 }}>
                  {saved.items.map((item, index) => (
                    <div key={`${item.title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>Saved Card {index + 1}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.title}</p>
                      <p style={{ fontSize: 14, color: '#374151' }}>{item.description}</p>
                      <div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => handleDeleteSavedItem(index)}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
