import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface FeaturedProductItem {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
}

const defaultItem = (): FeaturedProductItem => ({
  title: '',
  description: '',
  buttonText: 'View Details',
  buttonUrl: '#',
  image: '',
});

export default function FeaturedProductsManager() {
  const [heading, setHeading] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState<FeaturedProductItem[]>([defaultItem(), defaultItem(), defaultItem()]);

  const [savedHeading, setSavedHeading] = useState('');
  const [savedSubtitle, setSavedSubtitle] = useState('');
  const [savedItems, setSavedItems] = useState<FeaturedProductItem[]>([]);
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
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
      const { data } = await client.get('/api/home-content/featured-products');
      setHeading(data.heading || '');
      setSubtitle(data.subtitle || '');
      const initialItems = data.items?.length ? data.items : [defaultItem(), defaultItem(), defaultItem()];
      setItems(initialItems);
      setImageFiles({});
      setImagePreviews(
        initialItems.reduce((acc: Record<number, string>, item: FeaturedProductItem, index: number) => {
          acc[index] = resolveImage(item.image || '');
          return acc;
        }, {})
      );

      setSavedHeading(data.heading || '');
      setSavedSubtitle(data.subtitle || '');
      setSavedItems(data.items?.length ? data.items : []);
    } catch {
      setError('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleItemChange = (index: number, key: keyof FeaturedProductItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFiles((prev) => ({ ...prev, [index]: file }));

    if (!file) {
      setImagePreviews((prev) => ({ ...prev, [index]: resolveImage(items[index]?.image || '') }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviews((prev) => ({ ...prev, [index]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    setItems((prev) => (prev.length >= 6 ? prev : [...prev, defaultItem()]));
  };

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
    setImageFiles((prev) => {
      const next: Record<number, File | null> = {};
      Object.keys(prev).forEach((key) => {
        const idx = Number(key);
        if (idx < index) next[idx] = prev[idx];
        if (idx > index) next[idx - 1] = prev[idx];
      });
      return next;
    });
    setImagePreviews((prev) => {
      const next: Record<number, string> = {};
      Object.keys(prev).forEach((key) => {
        const idx = Number(key);
        if (idx < index) next[idx] = prev[idx];
        if (idx > index) next[idx - 1] = prev[idx];
      });
      return next;
    });
  };

  const removeSelectedImage = (index: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], image: '' };
      return next;
    });
    setImageFiles((prev) => ({ ...prev, [index]: null }));
    setImagePreviews((prev) => ({ ...prev, [index]: '' }));
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await client.post('/api/home-content/featured-products/image', formData);
    return data.image as string;
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanedItems = items
      .map((item, index) => ({
        index,
        title: item.title.trim(),
        description: item.description.trim(),
        buttonText: item.buttonText.trim() || 'View Details',
        buttonUrl: item.buttonUrl.trim() || '#',
        image: item.image?.trim() || '',
      }))
      .filter((item) => item.title && item.description);

    if (!heading.trim() || !subtitle.trim() || cleanedItems.length === 0) {
      setError('Heading, subtitle, and at least one featured product card are required');
      return;
    }

    setSaving(true);
    try {
      const itemsWithUploads = await Promise.all(
        cleanedItems.map(async (item) => {
          const pendingFile = imageFiles[item.index];
          if (pendingFile) {
            const uploadedImage = await uploadImage(pendingFile);
            return { ...item, image: uploadedImage || item.image };
          }
          return item;
        })
      );

      await client.put('/api/home-content/featured-products', {
        heading: heading.trim(),
        subtitle: subtitle.trim(),
        items: itemsWithUploads.map(({ index, ...item }) => item),
      });
      await loadContent();
    } catch {
      setError('Failed to save CMS content');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSavedItem = async (index: number) => {
    if (!window.confirm('Delete this saved featured product card?')) return;

    setSaving(true);
    setError('');
    try {
      const nextItems = savedItems.filter((_, i) => i !== index);
      await client.put('/api/home-content/featured-products', {
        heading: savedHeading,
        subtitle: savedSubtitle,
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
    if (!window.confirm('Delete all saved featured products content?')) return;

    setSaving(true);
    setError('');
    try {
      await client.put('/api/home-content/featured-products', {
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
        <p style={{ color: '#6c757d', fontSize: 13 }}>Manage Featured Products section content</p>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Featured Products Section</h2>

            <label>Section Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
              placeholder="Featured Products"
            />

            <label>Section Subtitle</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Cutting-edge components engineered for superior performance"
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
                    value={item.buttonText}
                    onChange={(event) => handleItemChange(index, 'buttonText', event.target.value)}
                    placeholder="Button text"
                  />
                  <input
                    type="text"
                    value={item.buttonUrl}
                    onChange={(event) => handleItemChange(index, 'buttonUrl', event.target.value)}
                    placeholder="Button URL"
                  />
                  <label>Card Image (optional)</label>
                  <input
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(event) => handleImageChange(index, event)}
                  />
                  {!!imagePreviews[index] && (
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, maxWidth: 360 }}>
                      <img
                        src={imagePreviews[index]}
                        alt={`Card ${index + 1}`}
                        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
                      />
                    </div>
                  )}
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
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: 12, marginLeft: 8 }}
                      onClick={() => removeSelectedImage(index)}
                    >
                      Remove Image
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
                {saving ? 'Saving...' : 'Save Featured Products Section'}
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
                disabled={saving || savedItems.length === 0}
              >
                Delete All
              </button>
            </div>

            {!savedHeading && !savedSubtitle && savedItems.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 13 }}>No saved content yet.</p>
            ) : (
              <>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Heading</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{savedHeading || '-'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 6px' }}>Subtitle</p>
                  <p style={{ fontSize: 14, color: '#374151' }}>{savedSubtitle || '-'}</p>
                </div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {savedItems.map((item, index) => (
                    <div key={`${item.title}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, display: 'grid', gap: 8 }}>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>Saved Card {index + 1}</p>
                      {!!item.image && (
                        <img
                          src={resolveImage(item.image)}
                          alt={item.title}
                          style={{ width: '100%', maxWidth: 360, height: 160, objectFit: 'cover', borderRadius: 8 }}
                        />
                      )}
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{item.title}</p>
                      <p style={{ fontSize: 14, color: '#374151' }}>{item.description}</p>
                      <p style={{ fontSize: 12, color: '#4b5563' }}>Button: {item.buttonText} -&gt; {item.buttonUrl}</p>
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
