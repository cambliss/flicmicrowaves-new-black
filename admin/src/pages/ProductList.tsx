import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { UPLOADS_URL } from '../api/client';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string | null;
  image: string | null;
  created_at: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/api/products');
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await client.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gap: 14,
          marginBottom: 28,
          justifyItems: 'start',
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#b8860b' }}>
            Flic Microwaves — Admin
          </h1>
          <p style={{ color: '#6c757d', fontSize: 13, marginTop: 2 }}>
            Manage all products
          </p>
        </div>
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
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6', background: '#f8f9fa' }}>
                <th style={th}>Image</th>
                <th style={th}>Name</th>
                <th style={th}>Category</th>
                <th style={th}>Price</th>
                <th style={th}>Added</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6c757d' }}>
                    No products yet.{' '}
                    <Link to="/products/new" style={{ color: '#b8860b' }}>
                      Add the first one
                    </Link>
                    .
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={td}>
                    {p.image ? (
                      <img
                        src={`${UPLOADS_URL}/${p.image}`}
                        alt={p.name}
                        style={{
                          width: 56,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #dee2e6',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 56,
                          height: 40,
                          background: '#f0f0f0',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: '#aaa',
                        }}
                      >
                        No img
                      </div>
                    )}
                  </td>
                  <td style={{ ...td, fontWeight: 600 }}>{p.name}</td>
                  <td style={td}>
                    <span className="badge">{p.category}</span>
                  </td>
                  <td style={td}>{p.price || '—'}</td>
                  <td style={{ ...td, color: '#6c757d', fontSize: 12 }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={`/products/${p.id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 700,
  color: '#495057',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const td: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 14,
  verticalAlign: 'middle',
};
