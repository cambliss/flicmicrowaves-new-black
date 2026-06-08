import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface InnovationContent {
  heading: string;
  description: string;
  points: string[];
  buttonText: string;
  buttonUrl: string;
  image: string;
}

const defaultPoint = () => '';

const emptyContent = (): InnovationContent => ({
  heading: '',
  description: '',
  points: [],
  buttonText: 'View Research',
  buttonUrl: '#',
  image: '',
});

export default function InnovationManager() {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<string[]>([defaultPoint(), defaultPoint(), defaultPoint()]);
  const [buttonText, setButtonText] = useState('View Research');
  const [buttonUrl, setButtonUrl] = useState('#');

  const [saved, setSaved] = useState<InnovationContent>(emptyContent());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

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
      const { data } = await client.get('/api/home-content/innovation');
      setHeading(data.heading || '');
      setDescription(data.description || '');
      setPoints(data.points?.length ? data.points : [defaultPoint(), defaultPoint(), defaultPoint()]);
      setButtonText(data.buttonText || 'View Research');
      setButtonUrl(data.buttonUrl || '#');

      setSaved({
        heading: data.heading || '',
        description: data.description || '',
        points: data.points?.length ? data.points : [],
        buttonText: data.buttonText || 'View Research',
        buttonUrl: data.buttonUrl || '#',
        image: data.image || '',
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

  const handlePointChange = (index: number, value: string) => {
    setPoints((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addPoint = () => {
    setPoints((prev) => (prev.length >= 8 ? prev : [...prev, defaultPoint()]));
  };

  const removePoint = (index: number) => {
    setPoints((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
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
    if (!imageFile) return null;
    const form = new FormData();
    form.append('image', imageFile);
    const { data } = await client.post('/api/home-content/innovation/image', form);
    const uploaded = data.image || '';
    setSaved((prev) => ({ ...prev, image: uploaded || prev.image }));
    return uploaded || null;
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedPoints = points.map((p) => p.trim()).filter((p) => !!p);

    if (!heading.trim() || !description.trim() || cleanedPoints.length === 0) {
      setError('Heading, description, and at least one innovation point are required');
      return;
    }

    setSaving(true);
    try {
      const uploadedImage = await uploadImageIfNeeded();
      await client.put('/api/home-content/innovation', {
        heading: heading.trim(),
        description: description.trim(),
        points: cleanedPoints,
        buttonText: buttonText.trim() || 'View Research',
        buttonUrl: buttonUrl.trim() || '#',
        image: uploadedImage ?? saved.image ?? '',
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

  const handleDeleteSavedPoint = async (index: number) => {
    if (!window.confirm('Delete this saved point?')) return;

    setSaving(true);
    setError('');
    try {
      const nextPoints = saved.points.filter((_, i) => i !== index);
      await client.put('/api/home-content/innovation', {
        heading: saved.heading,
        description: saved.description,
        points: nextPoints,
        buttonText: saved.buttonText,
        buttonUrl: saved.buttonUrl,
      });
      await loadContent();
    } catch {
      setError('Failed to delete saved point');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSavedSection = async () => {
    if (!window.confirm('Delete all saved innovation content?')) return;

    setSaving(true);
    setError('');
    try {
      await client.put('/api/home-content/innovation', {
        heading: '',
        description: '',
        points: [],
        buttonText: 'View Research',
        buttonUrl: '#',
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
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Innovation section content</p>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Innovation Section</h2>

            <label>Section Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
              placeholder="Driving Innovation"
            />

            <label>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Our dedicated R&D facility..."
            />

            <label>Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(event) => setButtonText(event.target.value)}
              placeholder="View Research"
            />

            <label>Button URL</label>
            <input
              type="text"
              value={buttonUrl}
              onChange={(event) => setButtonUrl(event.target.value)}
              placeholder="/products or https://example.com"
            />

            <label>Section Image (JPG, PNG, GIF, WebP)</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleSelectImage}
            />

            {preview && (
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 8, width: '100%', maxWidth: 440 }}>
                  <img src={preview} alt="Innovation preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
                  onClick={() => {
                    setSaved((prev) => ({ ...prev, image: '' }));
                    setImageFile(null);
                    setPreview('');
                    if (imageInputRef.current) imageInputRef.current.value = '';
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Bullet Points</h3>

              {points.map((point, index) => (
                <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Point {index + 1}</p>
                  <textarea
                    rows={2}
                    value={point}
                    onChange={(event) => handlePointChange(index, event.target.value)}
                    placeholder="Bullet point"
                  />
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => removePoint(index)}
                      disabled={points.length <= 1}
                    >
                      Remove Point
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <button type="button" className="btn btn-outline" onClick={addPoint}>
                  + Add Point
                </button>
              </div>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Innovation Section'}
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
                disabled={saving || saved.points.length === 0}
              >
                Delete All
              </button>
            </div>

            {!saved.heading && !saved.description && saved.points.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 13 }}>No saved content yet.</p>
            ) : (
              <>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Heading</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{saved.heading || '-'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Description</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{saved.description || '-'}</p>
                  <p style={{ fontSize: 12, color: '#4b5563', marginTop: 8 }}>Button: {saved.buttonText} -&gt; {saved.buttonUrl}</p>
                </div>

                {!!saved.image && (
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 8, width: '100%', maxWidth: 440 }}>
                    <img src={resolveImage(saved.image)} alt="Saved innovation" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                )}

                <div style={{ display: 'grid', gap: 10 }}>
                  {saved.points.map((point, index) => (
                    <div key={`${point}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>Saved Point {index + 1}</p>
                      <p style={{ fontSize: 14, color: '#374151' }}>{point}</p>
                      <div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => handleDeleteSavedPoint(index)}
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
