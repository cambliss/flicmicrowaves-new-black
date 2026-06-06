import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

interface HomeDarkIndustryItem {
  title: string;
  description: string;
  stat: string;
  linkText: string;
  linkUrl: string;
}

interface HomeDarkIndustriesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  mediaEyebrow: string;
  mediaTitle: string;
  mediaHighlight: string;
  mediaDescription: string;
  mediaButtonText: string;
  mediaButtonUrl: string;
  items: HomeDarkIndustryItem[];
}

const defaultItem = (): HomeDarkIndustryItem => ({
  title: '',
  description: '',
  stat: '',
  linkText: 'Explore More',
  linkUrl: '/industries',
});

const emptyContent = (): HomeDarkIndustriesContent => ({
  eyebrow: '',
  title: '',
  subtitle: '',
  videoUrl: '',
  mediaEyebrow: '',
  mediaTitle: '',
  mediaHighlight: '',
  mediaDescription: '',
  mediaButtonText: '',
  mediaButtonUrl: '',
  items: [defaultItem(), defaultItem(), defaultItem(), defaultItem()],
});

export default function HomeDarkIndustriesManager() {
  const [eyebrow, setEyebrow] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaEyebrow, setMediaEyebrow] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaHighlight, setMediaHighlight] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaButtonText, setMediaButtonText] = useState('');
  const [mediaButtonUrl, setMediaButtonUrl] = useState('');
  const [items, setItems] = useState<HomeDarkIndustryItem[]>(emptyContent().items);

  const [saved, setSaved] = useState<HomeDarkIndustriesContent>(emptyContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/home-dark-industries');
      setEyebrow(data.eyebrow || '');
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setVideoUrl(data.videoUrl || '');
      setMediaEyebrow(data.mediaEyebrow || '');
      setMediaTitle(data.mediaTitle || '');
      setMediaHighlight(data.mediaHighlight || '');
      setMediaDescription(data.mediaDescription || '');
      setMediaButtonText(data.mediaButtonText || '');
      setMediaButtonUrl(data.mediaButtonUrl || '');
      setItems(data.items?.length ? data.items : emptyContent().items);
      setSaved({
        eyebrow: data.eyebrow || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        videoUrl: data.videoUrl || '',
        mediaEyebrow: data.mediaEyebrow || '',
        mediaTitle: data.mediaTitle || '',
        mediaHighlight: data.mediaHighlight || '',
        mediaDescription: data.mediaDescription || '',
        mediaButtonText: data.mediaButtonText || '',
        mediaButtonUrl: data.mediaButtonUrl || '',
        items: data.items?.length ? data.items : [],
      });
    } catch {
      setError('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleItemChange = (index: number, key: keyof HomeDarkIndustryItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => (prev.length >= 8 ? prev : [...prev, defaultItem()]));
  };

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedItems = items
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        stat: item.stat.trim(),
        linkText: item.linkText.trim() || 'Explore More',
        linkUrl: item.linkUrl.trim() || '/industries',
      }))
      .filter((item) => item.title && item.description);

    if (!title.trim() || !subtitle.trim() || cleanedItems.length === 0) {
      setError('Title, subtitle, and at least one card are required');
      return;
    }

    setSaving(true);
    try {
      await client.put('/api/home-content/home-dark-industries', {
        eyebrow: eyebrow.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        videoUrl: videoUrl.trim(),
        mediaEyebrow: mediaEyebrow.trim(),
        mediaTitle: mediaTitle.trim(),
        mediaHighlight: mediaHighlight.trim(),
        mediaDescription: mediaDescription.trim(),
        mediaButtonText: mediaButtonText.trim(),
        mediaButtonUrl: mediaButtonUrl.trim(),
        items: cleanedItems,
      });
      await loadContent();
    } catch {
      setError('Failed to save CMS content');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSavedItem = async (index: number) => {
    if (!window.confirm('Delete this saved card?')) return;

    setSaving(true);
    setError('');
    try {
      const nextItems = saved.items.filter((_, i) => i !== index);
      await client.put('/api/home-content/home-dark-industries', {
        eyebrow: saved.eyebrow,
        title: saved.title,
        subtitle: saved.subtitle,
        videoUrl: saved.videoUrl,
        mediaEyebrow: saved.mediaEyebrow,
        mediaTitle: saved.mediaTitle,
        mediaHighlight: saved.mediaHighlight,
        mediaDescription: saved.mediaDescription,
        mediaButtonText: saved.mediaButtonText,
        mediaButtonUrl: saved.mediaButtonUrl,
        items: nextItems,
      });
      await loadContent();
    } catch {
      setError('Failed to delete saved card');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = async () => {
    if (!window.confirm('Reset Home Dark Industries section to defaults?')) return;

    setSaving(true);
    setError('');
    try {
      await client.delete('/api/home-content/home-dark-industries');
      await loadContent();
    } catch {
      setError('Failed to reset section');
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
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Home Dark Industries section content</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
          <Link to="/banners" className="btn btn-outline">+ Add Banner</Link>
          <Link to="/home-content" className="btn btn-outline">+ Why Choose Content</Link>
          <Link to="/solutions-content" className="btn btn-outline">+ Solutions Content</Link>
          <Link to="/process-content" className="btn btn-outline">+ Process Content</Link>
          <Link to="/industries-content" className="btn btn-outline">+ Industries Content</Link>
          <Link to="/featured-products-content" className="btn btn-outline">+ Featured Products Content</Link>
          <Link to="/innovation-content" className="btn btn-outline">+ Innovation Content</Link>
          <Link to="/home-dark-industries-content" className="btn btn-outline">+ Home Dark Industries</Link>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Home Dark Industries Section</h2>

            <label>Eyebrow</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(event) => setEyebrow(event.target.value)}
              placeholder="Diverse Industries, One Goal"
            />

            <label>Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Built For Environments Where Failure Is Not An Option"
            />

            <label>Section Subtitle</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Our RF and microwave systems support strategic sectors..."
            />

            <label>YouTube Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=HHXpnf4b3Kk"
            />

            <label>Media Block Eyebrow</label>
            <input
              type="text"
              value={mediaEyebrow}
              onChange={(event) => setMediaEyebrow(event.target.value)}
              placeholder="Design & Manufacturing Solutions"
            />

            <label>Media Block Title</label>
            <input
              type="text"
              value={mediaTitle}
              onChange={(event) => setMediaTitle(event.target.value)}
              placeholder="Customised RF, Microwave and mmWave solutions"
            />

            <label>Media Highlight Word</label>
            <input
              type="text"
              value={mediaHighlight}
              onChange={(event) => setMediaHighlight(event.target.value)}
              placeholder="mmWave"
            />

            <label>Media Block Description</label>
            <textarea
              rows={4}
              value={mediaDescription}
              onChange={(event) => setMediaDescription(event.target.value)}
              placeholder="Description text for left-side media block"
            />

            <label>Media Button Text</label>
            <input
              type="text"
              value={mediaButtonText}
              onChange={(event) => setMediaButtonText(event.target.value)}
              placeholder="Learn More"
            />

            <label>Media Button URL</label>
            <input
              type="text"
              value={mediaButtonUrl}
              onChange={(event) => setMediaButtonUrl(event.target.value)}
              placeholder="/solutions"
            />

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
                  <input
                    type="text"
                    value={item.stat}
                    onChange={(event) => handleItemChange(index, 'stat', event.target.value)}
                    placeholder="Stat chip text (example: 98.7% Stability)"
                  />
                  <input
                    type="text"
                    value={item.linkText}
                    onChange={(event) => handleItemChange(index, 'linkText', event.target.value)}
                    placeholder="Link text"
                  />
                  <input
                    type="text"
                    value={item.linkUrl}
                    onChange={(event) => handleItemChange(index, 'linkUrl', event.target.value)}
                    placeholder="Link URL"
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

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Home Dark Industries'}
              </button>
              <button type="button" className="btn btn-danger" disabled={saving} onClick={handleResetSection}>
                Reset To Default
              </button>
            </div>
          </form>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Saved Content</h2>
            {!saved.title && !saved.subtitle && saved.items.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 13 }}>No saved content yet.</p>
            ) : (
              <>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Eyebrow</p>
                  <p style={{ fontSize: 14, color: '#111827', marginBottom: 8 }}>{saved.eyebrow || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Title</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{saved.title || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Subtitle</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.subtitle || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>YouTube Video URL</p>
                  <p style={{ fontSize: 13, color: '#2563eb', wordBreak: 'break-all' }}>{saved.videoUrl || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Media Block Eyebrow</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.mediaEyebrow || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Media Block Title</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.mediaTitle || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Media Highlight Word</p>
                  <p style={{ fontSize: 14, color: '#92400e' }}>{saved.mediaHighlight || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Media Block Description</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.mediaDescription || '—'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Media Button</p>
                  <p style={{ fontSize: 13, color: '#374151' }}>{saved.mediaButtonText || '—'}{' -> '}{saved.mediaButtonUrl || '—'}</p>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {saved.items.map((item, index) => (
                    <div key={`${item.title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>Saved Card {index + 1}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.title}</p>
                      <p style={{ fontSize: 14, color: '#374151' }}>{item.description}</p>
                      <p style={{ fontSize: 12, color: '#92400e', fontWeight: 700 }}>{item.stat || '—'}</p>
                      <p style={{ fontSize: 12, color: '#4b5563' }}>{item.linkText}{' -> '}{item.linkUrl}</p>
                      <div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => handleDeleteSavedItem(index)}
                          disabled={saving}
                        >
                          Delete Card
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
