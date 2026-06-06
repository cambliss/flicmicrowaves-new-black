import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

type GalleryImage = {
  image: string;
  title: string;
  alt: string;
};

type GalleryContent = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  images: GalleryImage[];
};

const emptyContent: GalleryContent = {
  eyebrow: 'Gallery',
  heading: 'Engineering Gallery',
  subtitle: 'Explore snapshots from our labs, teams, and mission-critical RF integration work.',
  images: [],
};

const emptyImage = (): GalleryImage => ({ image: '', title: '', alt: '' });

export default function GalleryManager() {
  const [form, setForm] = useState<GalleryContent>(emptyContent);
  const [saved, setSaved] = useState<GalleryContent>(emptyContent);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const resolveImage = (name: string) => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/')) return name;
    return `${UPLOADS_URL}/${name}`;
  };

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/gallery');
      const next: GalleryContent = {
        eyebrow: data.eyebrow || 'Gallery',
        heading: data.heading || 'Engineering Gallery',
        subtitle: data.subtitle || '',
        images: Array.isArray(data.images) ? data.images : [],
      };
      setForm(next);
      setSaved(next);
    } catch {
      setError('Failed to load gallery content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleImageChange = (index: number, key: keyof GalleryImage, value: string) => {
    setForm((prev) => {
      const next = [...prev.images];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, images: next };
    });
  };

  const handleUpload = async () => {
    setError('');
    const file = uploadRef.current?.files?.[0];
    if (!file) {
      setError('Choose an image to upload first');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await client.post('/api/home-content/gallery/image', fd);
      const image = data?.image || '';
      if (!image) throw new Error('No image returned');

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, { ...emptyImage(), image }],
      }));

      if (uploadRef.current) uploadRef.current.value = '';
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedImages = (form.images || [])
      .map((item) => ({
        image: item.image.trim(),
        title: item.title.trim(),
        alt: item.alt.trim(),
      }))
      .filter((item) => item.image);

    setSaving(true);
    try {
      await client.put('/api/home-content/gallery', {
        eyebrow: form.eyebrow.trim() || 'Gallery',
        heading: form.heading.trim() || 'Engineering Gallery',
        subtitle: form.subtitle.trim(),
        images: cleanedImages,
      });
      await loadContent();
    } catch {
      setError('Failed to save gallery content');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset gallery section to default?')) return;
    setSaving(true);
    setError('');
    try {
      await client.delete('/api/home-content/gallery');
      await loadContent();
    } catch {
      setError('Failed to reset gallery section');
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'grid', gap: 14, marginBottom: 28, justifyItems: 'start' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Gallery CMS</h1>
        <p style={{ color: '#9ca3af', fontSize: 13 }}>Upload and publish images for the Gallery page</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/gallery-content" className="btn btn-outline">+ Gallery Content</Link>
          <Link to="/banners" className="btn btn-outline">+ Banner CMS</Link>
          <Link to="/home-content" className="btn btn-outline">+ Why Choose</Link>
          <Link to="/footer-content" className="btn btn-outline">+ Footer Content</Link>
          <Link to="/" className="btn btn-secondary">Product List</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading && <p>Loading gallery content...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && (
        <div style={{ display: 'grid', gap: 18 }}>
          <form className="card" style={{ display: 'grid', gap: 14 }} onSubmit={handleSave}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb' }}>Gallery Section</h2>

            <label>Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => setForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
              placeholder="Gallery"
            />

            <label>Heading</label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm((prev) => ({ ...prev, heading: e.target.value }))}
              placeholder="Engineering Gallery"
            />

            <label>Subtitle</label>
            <textarea
              rows={3}
              value={form.subtitle}
              onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Gallery subtitle"
            />

            <div style={{ border: '1px solid #303540', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
              <label>Upload Gallery Image</label>
              <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-outline" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : '+ Upload Image'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>Images</h3>
              {form.images.length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: 13 }}>No images uploaded yet.</p>
              )}

              {form.images.map((item, index) => (
                <div key={`${item.image}-${index}`} style={{ border: '1px solid #303540', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>Image {index + 1}</p>
                  {item.image && (
                    <img
                      src={resolveImage(item.image)}
                      alt={item.alt || item.title || `Gallery ${index + 1}`}
                      style={{ width: '100%', maxWidth: 340, height: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid #303540' }}
                    />
                  )}

                  <label>Image Path</label>
                  <input
                    type="text"
                    value={item.image}
                    onChange={(e) => handleImageChange(index, 'image', e.target.value)}
                    placeholder="home-content-xxx.png"
                  />

                  <label>Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleImageChange(index, 'title', e.target.value)}
                    placeholder="Lab Integration"
                  />

                  <label>Alt Text</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    placeholder="RF team working in lab"
                  />

                  <div>
                    <button type="button" className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => removeImage(index)}>
                      Remove Image
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Gallery Section'}</button>
              <button type="button" className="btn btn-danger" disabled={saving} onClick={handleReset}>Reset To Default</button>
            </div>
          </form>

          <div className="card" style={{ display: 'grid', gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb' }}>Published Snapshot</h2>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Heading: {saved.heading || '—'}</p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Total Images: {saved.images.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
