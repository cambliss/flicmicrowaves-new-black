const BASE_URL = 'http://localhost:4001';
export const UPLOADS_BASE = `${BASE_URL}/uploads`;

export interface ProductSpec {
  id: number;
  key: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  category: 'filters' | 'amplifiers' | 'transceivers' | 'defense' | 'frequency';
  description: string | null;
  image: string | null;
  images: string[];
  datasheet: string | null;
  price: string | null;
  features: string[];
  applications: string[];
  specifications: ProductSpec[];
  created_at: string;
  updated_at: string;
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category
    ? `${BASE_URL}/api/products?category=${encodeURIComponent(category)}`
    : `${BASE_URL}/api/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export function productImageUrl(filename: string | null): string | null {
  if (!filename) return null;
  return `${UPLOADS_BASE}/${filename}`;
}

export function productImageUrls(product: Pick<Product, 'image' | 'images'> | null): string[] {
  if (!product) return [];
  const fromGallery = Array.isArray(product.images)
    ? product.images.map((filename) => productImageUrl(filename)).filter(Boolean)
    : [];
  if (fromGallery.length > 0) return fromGallery as string[];
  return product.image ? [productImageUrl(product.image) as string] : [];
}
