import type { Product } from '../api/products';

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  filters: 'RF Filters',
  amplifiers: 'Amplifiers',
  transceivers: 'Transceivers',
  defense: 'Defense Electronics',
  frequency: 'Frequency Solutions',
};

export function getCategoryLabel(category: Product['category'] | string): string {
  return CATEGORY_LABELS[category as Product['category']] ?? String(category);
}

export function groupProductsByCategory(products: Product[]) {
  return Object.entries(
    products.reduce<Record<string, Product[]>>((acc, product) => {
      acc[product.category] ??= [];
      acc[product.category].push(product);
      return acc;
    }, {})
  )
    .map(([category, categoryProducts]) => ({
      category: category as Product['category'],
      label: getCategoryLabel(category),
      products: categoryProducts.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getSpecValue(product: Product, keyFragment: string): string {
  const match = product.specifications.find((spec) =>
    spec.key.toLowerCase().includes(keyFragment.toLowerCase())
  );
  return match?.value ?? '';
}

export function getFacetValues(products: Product[], keyFragment: string): string[] {
  return Array.from(
    new Set(
      products
        .map((product) => getSpecValue(product, keyFragment).trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}