import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

interface AdvantagePoint {
  number: string;
  title: string;
  description: string;
}

interface HomeAdvantageContent {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  videoUrl: string;
  points: AdvantagePoint[];
}

const defaultPoint = (index: number): AdvantagePoint => ({
  number: String(index + 1).padStart(2, '0'),
  title: '',
  description: '',
});

const emptyContent = (): HomeAdvantageContent => ({
  eyebrow: '',
  title: '',
  highlight: '',
  description: '',
  videoUrl: '',
  points: [defaultPoint(0), defaultPoint(1), defaultPoint(2), defaultPoint(3)],
});

export default function HomeAdvantageManager() {
  const [eyebrow, setEyebrow] = useState('');
  const [title, setTitle] = useState('');
  const [highlight, setHighlight] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [points, setPoints] = useState<AdvantagePoint[]>(emptyContent().points);

  const [saved, setSaved] = useState<HomeAdvantageContent>(emptyContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/home-advantage');
      setEyebrow(data.eyebrow || '');
      setTitle(data.title || '');
      setHighlight(data.highlight || '');
      setDescription(data.description || '');
      setVideoUrl(data.videoUrl || '');
      setPoints(data.points?.length ? data.points : emptyContent().points);
      setSaved({
        eyebrow: data.eyebrow || '',
        title: data.title || '',
        highlight: data.highlight || '',
        description: data.description || '',
        videoUrl: data.videoUrl || '',
        points: data.points?.length ? data.points : [],
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

  const handlePointChange = (index: number, key: keyof AdvantagePoint, value: string) => {
    setPoints((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addPoint = () => {
    setPoints((prev) => (prev.length >= 8 ? prev : [...prev, defaultPoint(prev.length)]));
  };

  const removePoint = (index: number) => {
    setPoints((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedPoints = points
      .map((point, index) => ({
        number: point.number.trim() || String(index + 1).padStart(2, '0'),
        title: point.title.trim(),
        description: point.description.trim(),
      }))
      .filter((point) => point.title && point.description);

    if (!title.trim() || !description.trim() || cleanedPoints.length === 0) {
      setError('Title, description, and at least one point are required');
      return;
    }

    setSaving(true);
    try {
      await client.put('/api/home-content/home-advantage', {
        eyebrow: eyebrow.trim(),
        title: title.trim(),
        highlight: highlight.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        points: cleanedPoints,
      });
      await loadContent();
    } catch {
      setError('Failed to save CMS content');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset Home Advantage section to defaults?')) return;

    setSaving(true);
    setError('');
    try {
      await client.delete('/api/home-content/home-advantage');
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
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Home Advantage section content</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/home-advantage-content" className="btn btn-outline">+ Home Advantage</Link>
          <Link to="/home-dark-industries-content" className="btn btn-outline">+ Home Dark Industries</Link>
          <Link to="/" className="btn btn-secondary">Product List</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loading && <p>Loading content...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && (
        <div style={{ display: 'grid', gap: 18 }}>
          <form className="card" style={{ display: 'grid', gap: 14 }} onSubmit={handleSave}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Home Advantage Section</h2>

            <label>Eyebrow</label>
            <input type="text" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} placeholder="The Flicmicrowaves Advantage" />

            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Why leading engineers choose us" />

            <label>Highlight Word</label>
            <input type="text" value={highlight} onChange={(e) => setHighlight(e.target.value)} placeholder="choose us" />

            <label>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Intro description" />

            <label>YouTube Video URL</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />

            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Right-side Points</h3>
              {points.map((point, index) => (
                <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Point {index + 1}</p>
                  <input type="text" value={point.number} onChange={(e) => handlePointChange(index, 'number', e.target.value)} placeholder="01" />
                  <input type="text" value={point.title} onChange={(e) => handlePointChange(index, 'title', e.target.value)} placeholder="Title" />
                  <textarea rows={3} value={point.description} onChange={(e) => handlePointChange(index, 'description', e.target.value)} placeholder="Description" />
                  <button type="button" className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => removePoint(index)} disabled={points.length <= 1}>Remove Point</button>
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={addPoint}>+ Add Point</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Home Advantage'}</button>
              <button type="button" className="btn btn-danger" disabled={saving} onClick={handleReset}>Reset To Default</button>
            </div>
          </form>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Saved Content</h2>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#6b7280' }}>Eyebrow</p>
              <p style={{ fontSize: 14, color: '#111827' }}>{saved.eyebrow || '—'}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Title</p>
              <p style={{ fontSize: 15, color: '#111827' }}>{saved.title || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
