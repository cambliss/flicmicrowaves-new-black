const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
let imagesColumnEnsured = false;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer configuration — store files to disk with original extension
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|pdf/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg,jpg,png,gif,webp) and PDFs are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); // 20 MB

async function ensureImagesColumn() {
  if (imagesColumnEnsured) return;
  await pool.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb
  `);
  imagesColumnEnsured = true;
}

// Helper: fetch a product with its specifications
async function fetchProductById(id) {
  const { rows } = await pool.query(
    `SELECT p.*,
            COALESCE(
              json_agg(ps ORDER BY ps.id) FILTER (WHERE ps.id IS NOT NULL),
              '[]'
            ) AS specifications
     FROM products p
     LEFT JOIN product_specifications ps ON ps.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return rows[0] ? hydrateProduct(rows[0]) : null;
}

// ─── GET /api/products ─────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    await ensureImagesColumn();
    const { category } = req.query;
    const params = [];
    let where = '';
    if (category) {
      params.push(category);
      where = 'WHERE p.category = $1';
    }

    const { rows } = await pool.query(
      `SELECT p.*,
              COALESCE(
                json_agg(ps ORDER BY ps.id) FILTER (WHERE ps.id IS NOT NULL),
                '[]'
              ) AS specifications
       FROM products p
       LEFT JOIN product_specifications ps ON ps.product_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      params
    );
    res.json(rows.map(hydrateProduct));
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/products/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    await ensureImagesColumn();
    const product = await fetchProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/products ────────────────────────────────────────────────────────
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 4 },
    { name: 'datasheet', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      await ensureImagesColumn();
      const { name, category, description, price } = req.body;
      if (!name || !category) {
        return res.status(400).json({ error: 'name and category are required' });
      }

      // Parse array fields sent as JSON strings from multipart forms
      const features = parseJsonField(req.body.features, []);
      const applications = parseJsonField(req.body.applications, []);
      const specifications = parseJsonField(req.body.specifications, []);

      const singleImage = req.files?.image?.[0]?.filename || null;
      const uploadedImages = req.files?.images?.map((file) => file.filename) || [];
      const images = normalizeImages(uploadedImages.length > 0 ? uploadedImages : [singleImage]);
      const image = images[0] || null;
      const datasheet = req.files?.datasheet?.[0]?.filename || null;

      const { rows } = await pool.query(
        `INSERT INTO products (name, category, description, image, images, datasheet, price, features, applications)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING id`,
        [
          name,
          category,
          description || null,
          image,
          JSON.stringify(images),
          datasheet,
          price || null,
          features,
          applications,
        ]
      );

      const productId = rows[0].id;
      await insertSpecifications(productId, specifications);

      const product = await fetchProductById(productId);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/products/:id ─────────────────────────────────────────────────────
router.put(
  '/:id',
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 4 },
    { name: 'datasheet', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      await ensureImagesColumn();
      const { id } = req.params;
      const existing = await fetchProductById(id);
      if (!existing) return res.status(404).json({ error: 'Product not found' });

      const { name, category, description, price } = req.body;
      const features = parseJsonField(req.body.features, existing.features);
      const applications = parseJsonField(req.body.applications, existing.applications);
      const specifications = parseJsonField(req.body.specifications, null);

      const existingImages = normalizeImages(
        parseJsonField(req.body.existingImages, existing.images || [])
      );
      const singleImage = req.files?.image?.[0]?.filename || null;
      const uploadedImages = req.files?.images?.map((file) => file.filename) || [];
      const newImages = normalizeImages([
        ...existingImages,
        ...uploadedImages,
        ...(singleImage ? [singleImage] : []),
      ]);

      const image = newImages[0] || null;
      const datasheet = req.files?.datasheet?.[0]?.filename || existing.datasheet;

      await pool.query(
        `UPDATE products
         SET name=$1, category=$2, description=$3, image=$4, images=$5, datasheet=$6, price=$7, features=$8, applications=$9
         WHERE id=$10`,
        [
          name || existing.name,
          category || existing.category,
          description !== undefined ? description : existing.description,
          image,
          JSON.stringify(newImages),
          datasheet,
          price !== undefined ? price : existing.price,
          features,
          applications,
          id,
        ]
      );

      if (specifications !== null) {
        await pool.query('DELETE FROM product_specifications WHERE product_id = $1', [id]);
        await insertSpecifications(id, specifications);
      }

      const product = await fetchProductById(id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/products/:id ──────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
function parseJsonField(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  const cleaned = images
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
  return [...new Set(cleaned)].slice(0, 4);
}

function hydrateProduct(product) {
  const images = normalizeImages(product.images || []);
  const merged = images.length > 0 ? images : normalizeImages([product.image]);
  return {
    ...product,
    image: merged[0] || null,
    images: merged,
  };
}

async function insertSpecifications(productId, specifications) {
  if (!Array.isArray(specifications) || specifications.length === 0) return;
  const values = specifications
    .filter((s) => s.key && s.value)
    .map((s, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
    .join(', ');
  if (!values) return;
  const params = [productId, ...specifications.flatMap((s) => [s.key, s.value])];
  await pool.query(
    `INSERT INTO product_specifications (product_id, key, value) VALUES ${values}`,
    params
  );
}

module.exports = router;
