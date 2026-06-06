import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface BannerSlide {
  id: string;
  image: string;
  mainHeading: string;
  subHeading: string;
  buttonText: string;
  buttonUrl: string;
}

export default function BannerManager() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [mainHeading, setMainHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchSlides = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/banners');
      setSlides(data.slides || []);
    } catch {
      setError('Failed to load banner slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setBannerFile(file);
    if (!file) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!bannerFile) {
      setError('Please choose a banner image first');
      return;
    }

    if (!mainHeading.trim() || !subHeading.trim() || !buttonText.trim() || !buttonUrl.trim()) {
      setError('Main heading, sub heading, button text and redirection URL are required');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('banner', bannerFile);
      fd.append('mainHeading', mainHeading.trim());
      fd.append('subHeading', subHeading.trim());
      fd.append('buttonText', buttonText.trim());
      fd.append('buttonUrl', buttonUrl.trim());
      const { data } = await client.post('/api/banners/slides', fd);
      setSlides(data.slides || []);
      setMainHeading('');
      setSubHeading('');
      setButtonText('');
      setButtonUrl('');
      setBannerFile(null);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add banner slide');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Remove this banner slide?')) return;
    setSaving(true);
    setError('');
    try {
      const { data } = await client.delete(`/api/banners/slides/${id}`);
      setSlides(data.slides || []);
    } catch {
      setError('Failed to remove banner slide');
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Banner CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage home banner sliders from dashboard</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/products/new" className="btn btn-primary">
            + Add Product
          </Link>
          <Link to="/banners" className="btn btn-outline">
            + Add Banner
          </Link>
          <Link to="/home-content" className="btn btn-outline">
            + Why Choose Content
          </Link>
          <Link to="/solutions-content" className="btn btn-outline">
            + Solutions Content
          </Link>
          <Link to="/process-content" className="btn btn-outline">
            + Process Content
          </Link>
          <Link to="/industries-content" className="btn btn-outline">
            + Industries Content
          </Link>
          <Link to="/featured-products-content" className="btn btn-outline">
            + Featured Products Content
          </Link>
          <Link to="/innovation-content" className="btn btn-outline">
            + Innovation Content
          </Link>
          <Link to="/footer-content" className="btn btn-outline">
            + Footer Content
          </Link>
          <Link to="/" className="btn btn-secondary">
            Product List
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p>Loading banner sliders...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Add Banner Slide</h2>

            <div
              style={{
                width: '100%',
                height: 220,
                border: '2px dashed #dee2e6',
                borderRadius: 10,
                overflow: 'hidden',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 13, color: '#8a8a8a' }}>Choose an image to preview</span>
              )}
            </div>

            <form onSubmit={handleUpload} style={{ display: 'grid', gap: 10, maxWidth: 640 }}>
            <label>Main Heading</label>
            <input
              type="text"
              value={mainHeading}
              onChange={(event) => setMainHeading(event.target.value)}
              placeholder="Advanced Electronics & Telecommunications"
            />

            <label>Sub Heading</label>
            <textarea
              rows={3}
              value={subHeading}
              onChange={(event) => setSubHeading(event.target.value)}
              placeholder="Pioneering cutting-edge solutions for aerospace..."
            />

            <label>Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(event) => setButtonText(event.target.value)}
              placeholder="Explore Solutions"
            />

            <label>Button Redirection URL</label>
            <input
              type="text"
              value={buttonUrl}
              onChange={(event) => setButtonUrl(event.target.value)}
              placeholder="/products or https://example.com"
            />

            <label>Upload banner image (JPG, PNG, GIF, WebP - max 20MB)</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Slide'}
              </button>
            </div>
          </form>

          </div>

          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Current Slides</h2>

            {slides.length === 0 ? (
              <p style={{ color: '#8a8a8a', fontSize: 13 }}>No slides added yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    style={{
                      border: '1px solid #e9ecef',
                      borderRadius: 10,
                      padding: 12,
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr auto',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={`${UPLOADS_URL}/${slide.image}`}
                      alt={`Slide ${index + 1}`}
                      style={{ width: 180, height: 96, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: '#6c757d', marginBottom: 4 }}>
                        Slide {index + 1} {index === 0 ? '(Shown first)' : ''}
                      </p>
                      <h3 style={{ fontSize: 16, marginBottom: 4, color: '#212529' }}>{slide.mainHeading}</h3>
                      <p style={{ fontSize: 13, color: '#6c757d', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {slide.subHeading}
                      </p>
                      <p style={{ fontSize: 12, color: '#495057' }}>
                        Button: {slide.buttonText} -&gt; {slide.buttonUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemove(slide.id)}
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
