import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface Spec { key: string; value: string }

interface ProductFormState {
  name: string;
  category: string;
  description: string;
  price: string;
  features: string[];
  applications: string[];
  specifications: Spec[];
}

const DEFAULT_CATEGORIES = ['filters', 'amplifiers', 'transceivers', 'defense', 'frequency'];

const emptyForm = (): ProductFormState => ({
  name: '',
  category: 'filters',
  description: '',
  price: '',
  features: [''],
  applications: [''],
  specifications: [{ key: '', value: '' }],
});

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingDatasheet, setExistingDatasheet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('custom_categories') || '[]');
    } catch {
      return [];
    }
  });
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const datasheetInputRef = useRef<HTMLInputElement>(null);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const confirmNewCategory = () => {
    const slug = newCategoryInput.trim().toLowerCase().replace(/\s+/g, '_');
    if (!slug) return;
    if (allCategories.includes(slug)) {
      set('category', slug);
    } else {
      const updated = [...customCategories, slug];
      setCustomCategories(updated);
      localStorage.setItem('custom_categories', JSON.stringify(updated));
      set('category', slug);
    }
    setNewCategoryInput('');
    setAddingCategory(false);
  };

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await client.get(`/api/products/${id}`);
        setForm({
          name: data.name ?? '',
          category: data.category ?? 'filters',
          description: data.description ?? '',
          price: data.price ?? '',
          features: data.features?.length ? data.features : [''],
          applications: data.applications?.length ? data.applications : [''],
          specifications: data.specifications?.length
            ? data.specifications.map((s: Spec) => ({ key: s.key, value: s.value }))
            : [{ key: '', value: '' }],
        });
        const dbImages = Array.isArray(data.images) ? data.images : [];
        setExistingImages(dbImages.length > 0 ? dbImages : data.image ? [data.image] : []);
        setExistingDatasheet(data.datasheet || null);
      } catch {
        setError('Failed to load product');
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const set = (field: keyof ProductFormState, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setListItem = (field: 'features' | 'applications', index: number, value: string) =>
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });

  const addListItem = (field: 'features' | 'applications') =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));

  const removeListItem = (field: 'features' | 'applications', index: number) =>
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const setSpec = (index: number, key: 'key' | 'value', value: string) =>
    setForm((prev) => {
      const specs = [...prev.specifications];
      specs[index] = { ...specs[index], [key]: value };
      return { ...prev, specifications: specs };
    });

  const addSpec = () =>
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));

  const removeSpec = (index: number) =>
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxNew = Math.max(0, 4 - existingImages.length);
    const selected = files.slice(0, maxNew);
    setImageFiles(selected);

    Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then(setImagePreviews);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDatasheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatasheetFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages < 3 || totalImages > 4) {
      setError('Please keep 3 to 4 product images for each product.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('price', form.price);

      // Clean empty entries before sending
      const cleanFeatures = form.features.filter((f) => f.trim());
      const cleanApplications = form.applications.filter((a) => a.trim());
      const cleanSpecs = form.specifications.filter((s) => s.key.trim() && s.value.trim());

      fd.append('features', JSON.stringify(cleanFeatures));
      fd.append('applications', JSON.stringify(cleanApplications));
      fd.append('specifications', JSON.stringify(cleanSpecs));

      fd.append('existingImages', JSON.stringify(existingImages));
      imageFiles.forEach((file) => fd.append('images', file));
      if (datasheetFile) fd.append('datasheet', datasheetFile);

      if (isEdit) {
        await client.put(`/api/products/${id}`, fd);
      } else {
        await client.post('/api/products', fd);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      {/* Back link */}
      <Link to="/" style={{ color: '#b8860b', fontSize: 14, fontWeight: 600 }}>
        ← Back to products
      </Link>

      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '16px 0 28px', color: '#1a1a1a' }}>
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Name */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Ultra-Low Loss Bandpass Filter"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            {addingCategory ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  autoFocus
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); confirmNewCategory(); }
                    if (e.key === 'Escape') { setAddingCategory(false); setNewCategoryInput(''); }
                  }}
                  placeholder="New category name (e.g. connectors)"
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn btn-primary" style={{ padding: '7px 14px', flexShrink: 0 }} onClick={confirmNewCategory}>
                  Add
                </button>
                <button type="button" className="btn btn-outline" style={{ padding: '7px 14px', flexShrink: 0 }} onClick={() => { setAddingCategory(false); setNewCategoryInput(''); }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  style={{ flex: 1 }}
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1).replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '7px 14px', flexShrink: 0, whiteSpace: 'nowrap' }}
                  onClick={() => setAddingCategory(true)}
                  title="Add a new category"
                >
                  + New
                </button>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="e.g. $2,450 or Price on Request"
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <p style={{ fontSize: 12, color: '#6c757d', margin: '0 0 6px' }}>
              Write 2–4 sentences covering what the product is, its key performance highlights, and its primary use case.
              This appears on the product listing card and the detail page.
            </p>
            <textarea
              rows={6}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Example: The XF-3500 is a precision-engineered cavity bandpass filter designed for 5G base station infrastructure operating at 3.4–3.6 GHz. It delivers ultra-low insertion loss (<0.5 dB) with exceptional out-of-band rejection exceeding 80 dB. Built to withstand harsh environmental conditions, it is ideal for deployment in outdoor radio units and macro cell base stations."
            />
            <p style={{ fontSize: 11, color: form.description.length > 800 ? '#dc3545' : '#adb5bd', textAlign: 'right', marginTop: 4 }}>
              {form.description.length} / 800 characters
            </p>
          </div>
        </div>

        {/* ── Image Upload ── */}
        <SectionTitle>Product Images (up to 4)</SectionTitle>
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {existingImages.map((img, i) => (
                <div key={`existing-${img}-${i}`} style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', background: '#f8f9fa' }}>
                  <img src={`${UPLOADS_URL}/${img}`} alt={`existing-${i + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                  <button type="button" className="btn btn-danger" style={{ width: '100%', borderRadius: 0 }} onClick={() => removeExistingImage(i)}>
                    Remove
                  </button>
                </div>
              ))}
              {imagePreviews.map((preview, i) => (
                <div key={`new-${i}`} style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', background: '#f8f9fa' }}>
                  <img src={preview} alt={`new-${i + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                  <button type="button" className="btn btn-danger" style={{ width: '100%', borderRadius: 0 }} onClick={() => removeNewImage(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <label>Upload 3 to 4 images (JPG, PNG, WebP — max 20 MB each)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleImageChange}
                ref={imageInputRef}
                style={{ marginTop: 6 }}
              />
              <p style={{ fontSize: 12, color: '#6c757d', marginTop: 6 }}>
                {existingImages.length + imageFiles.length} / 4 selected
              </p>
            </div>
          </div>
        </div>

        {/* ── Datasheet Upload ── */}
        <SectionTitle>Datasheet (PDF)</SectionTitle>
        <div className="card" style={{ marginBottom: 24 }}>
          <label>Upload PDF Datasheet (max 20 MB)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleDatasheetChange}
            ref={datasheetInputRef}
            style={{ marginTop: 6 }}
          />
          {existingDatasheet && !datasheetFile && (
            <p style={{ fontSize: 12, color: '#6c757d', marginTop: 6 }}>
              Current:{' '}
              <a
                href={`${UPLOADS_URL}/${existingDatasheet}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#b8860b' }}
              >
                {existingDatasheet}
              </a>
            </p>
          )}
        </div>

        {/* ── Specifications ── */}
        <SectionTitle>Technical Specifications</SectionTitle>
        <div className="card" style={{ marginBottom: 24 }}>
          {form.specifications.map((spec, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Key (e.g. Frequency)"
                value={spec.key}
                onChange={(e) => setSpec(i, 'key', e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Value (e.g. 3.4–3.6 GHz)"
                value={spec.value}
                onChange={(e) => setSpec(i, 'value', e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: '7px 12px', flexShrink: 0 }}
                onClick={() => removeSpec(i)}
                disabled={form.specifications.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" style={{ marginTop: 4 }} onClick={addSpec}>
            + Add Specification
          </button>
        </div>

        {/* ── Features ── */}
        <SectionTitle>Key Features</SectionTitle>
        <div className="card" style={{ marginBottom: 24 }}>
          {form.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder={`Feature ${i + 1}`}
                value={f}
                onChange={(e) => setListItem('features', i, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: '7px 12px', flexShrink: 0 }}
                onClick={() => removeListItem('features', i)}
                disabled={form.features.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            style={{ marginTop: 4 }}
            onClick={() => addListItem('features')}
          >
            + Add Feature
          </button>
        </div>

        {/* ── Applications ── */}
        <SectionTitle>Applications</SectionTitle>
        <div className="card" style={{ marginBottom: 32 }}>
          {form.applications.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder={`Application ${i + 1}`}
                value={a}
                onChange={(e) => setListItem('applications', i, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                style={{ padding: '7px 12px', flexShrink: 0 }}
                onClick={() => removeListItem('applications', i)}
                disabled={form.applications.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline"
            style={{ marginTop: 4 }}
            onClick={() => addListItem('applications')}
          >
            + Add Application
          </button>
        </div>

        {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: '#495057',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '2px solid #dee2e6',
      }}
    >
      {children}
    </h2>
  );
}
