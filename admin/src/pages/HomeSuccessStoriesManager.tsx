import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface SuccessStoryItem {
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  imageAlt: string;
}

interface HomeSuccessStoriesContent {
  eyebrow: string;
  stories: SuccessStoryItem[];
}

const defaultStory = (): SuccessStoryItem => ({
  heading: '',
  description: '',
  buttonText: '',
  buttonUrl: '',
  imageUrl: '',
  imageAlt: '',
});

const emptyContent: HomeSuccessStoriesContent = {
  eyebrow: '',
  stories: [defaultStory()],
};

export default function HomeSuccessStoriesManager() {
  const [form, setForm] = useState<HomeSuccessStoriesContent>(emptyContent);
  const [saved, setSaved] = useState<HomeSuccessStoriesContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/api/home-content/home-success-stories');
      const stories = Array.isArray(data.stories) && data.stories.length
        ? data.stories
        : [{
            heading: data.heading || '',
            description: data.description || '',
            buttonText: data.buttonText || '',
            buttonUrl: data.buttonUrl || '',
            imageUrl: data.imageUrl || '',
            imageAlt: data.imageAlt || '',
          }];
      const next = {
        eyebrow: data.eyebrow || '',
        stories,
      };
      setForm(next);
      setSaved(next);
    } catch {
      setError('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedStories = form.stories
      .map((story) => ({
        heading: story.heading.trim(),
        description: story.description.trim(),
        buttonText: story.buttonText.trim(),
        buttonUrl: story.buttonUrl.trim(),
        imageUrl: story.imageUrl.trim(),
        imageAlt: story.imageAlt.trim(),
      }))
      .filter((story) => story.heading && story.description);

    if (cleanedStories.length === 0) {
      setError('At least one story with heading and description is required');
      return;
    }

    setSaving(true);
    try {
      await client.put('/api/home-content/home-success-stories', {
        eyebrow: form.eyebrow.trim(),
        stories: cleanedStories,
      });
      await loadContent();
    } catch {
      setError('Failed to save CMS content');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset Home Success Stories section to defaults?')) return;

    setSaving(true);
    setError('');
    try {
      await client.delete('/api/home-content/home-success-stories');
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

  const handleStoryChange = (index: number, key: keyof SuccessStoryItem, value: string) => {
    setForm((prev) => {
      const nextStories = [...prev.stories];
      nextStories[index] = { ...nextStories[index], [key]: value };
      return { ...prev, stories: nextStories };
    });
  };

  const resolveImage = (name: string) => {
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://')) return name;
    return `${UPLOADS_URL}/${name}`;
  };

  const uploadStoryImage = async (index: number, file: File) => {
    setError('');
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await client.post('/api/home-content/upload/image', fd);
      const uploaded = data?.image || '';
      if (!uploaded) throw new Error('Upload failed');
      handleStoryChange(index, 'imageUrl', uploaded);
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const addStory = () => {
    setForm((prev) => ({
      ...prev,
      stories: prev.stories.length >= 24 ? prev.stories : [...prev.stories, defaultStory()],
    }));
  };

  const removeStory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      stories: prev.stories.length <= 1 ? prev.stories : prev.stories.filter((_, i) => i !== index),
    }));
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'grid', gap: 14, marginBottom: 28, justifyItems: 'start' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>Flic Microwaves - Home CMS</h1>
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Home Success Stories section content</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/home-success-stories-content" className="btn btn-outline">+ Home Success Stories</Link>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Home Success Stories Section</h2>

            <label>Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => setForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
              placeholder="Success Stories"
            />

            <div style={{ display: 'grid', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937' }}>Stories</h3>
              {form.stories.map((story, index) => (
                <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Story {index + 1}</p>

                  <label>Heading</label>
                  <input
                    type="text"
                    value={story.heading}
                    onChange={(e) => handleStoryChange(index, 'heading', e.target.value)}
                    placeholder="Real-world engineering successes"
                  />

                  <label>Description</label>
                  <textarea
                    rows={4}
                    value={story.description}
                    onChange={(e) => handleStoryChange(index, 'description', e.target.value)}
                    placeholder="Section description"
                  />

                  <label>Button Text</label>
                  <input
                    type="text"
                    value={story.buttonText}
                    onChange={(e) => handleStoryChange(index, 'buttonText', e.target.value)}
                    placeholder="Read Case Studies"
                  />

                  <label>Button URL</label>
                  <input
                    type="text"
                    value={story.buttonUrl}
                    onChange={(e) => handleStoryChange(index, 'buttonUrl', e.target.value)}
                    placeholder="/blogs"
                  />

                  <label>Right Image URL</label>
                  <input
                    type="text"
                    value={story.imageUrl}
                    onChange={(e) => handleStoryChange(index, 'imageUrl', e.target.value)}
                    placeholder="/facilities/facilities-reference.jpeg"
                  />
                  {!!story.imageUrl && (
                    <>
                      <img
                        src={resolveImage(story.imageUrl)}
                        alt={story.imageAlt || `Story ${index + 1}`}
                        style={{ width: '100%', maxWidth: 360, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: 'fit-content', padding: '6px 12px', fontSize: 12 }}
                        onClick={() => handleStoryChange(index, 'imageUrl', '')}
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
                      await uploadStoryImage(index, file);
                      event.target.value = '';
                    }}
                  />
                  {uploadingIndex === index && <p style={{ fontSize: 12, color: '#6b7280' }}>Uploading image...</p>}

                  <label>Image Alt Text</label>
                  <input
                    type="text"
                    value={story.imageAlt}
                    onChange={(e) => handleStoryChange(index, 'imageAlt', e.target.value)}
                    placeholder="Engineering team reviewing RF systems"
                  />

                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => removeStory(index)}
                    disabled={form.stories.length <= 1}
                  >
                    Remove Story
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={addStory}>+ Add Story</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Home Success Stories'}</button>
              <button type="button" className="btn btn-danger" disabled={saving} onClick={handleReset}>Reset To Default</button>
            </div>
          </form>

          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Saved Content</h2>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#6b7280' }}>Eyebrow</p>
              <p style={{ fontSize: 15, color: '#111827' }}>{saved.eyebrow || '—'}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Total Stories</p>
              <p style={{ fontSize: 13, color: '#111827' }}>{saved.stories?.length || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
