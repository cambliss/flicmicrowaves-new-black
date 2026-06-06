const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
const dataDir = path.join(__dirname, '..', 'data');
const bannerStatePath = path.join(dataDir, 'banners.json');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(bannerStatePath)) {
  fs.writeFileSync(bannerStatePath, JSON.stringify(defaultState(), null, 2));
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `banner-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (!allowed.test(ext)) {
      cb(new Error('Only images (jpeg,jpg,png,gif,webp) are allowed'));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

function readState() {
  try {
    const content = fs.readFileSync(bannerStatePath, 'utf8');
    const parsed = JSON.parse(content);
    return normalizeState(parsed);
  } catch {
    return defaultState();
  }
}

function writeState(nextState) {
  fs.writeFileSync(bannerStatePath, JSON.stringify(normalizeState(nextState), null, 2));
}

function defaultState() {
  return {
    slides: [],
  };
}

function normalizeState(state) {
  const safe = state || {};
  const legacySlide =
    safe.activeBanner || safe.mainHeading || safe.subHeading || safe.buttonText || safe.buttonUrl
      ? [
          {
            id: `legacy-${Date.now()}`,
            image: typeof safe.activeBanner === 'string' ? safe.activeBanner : null,
            mainHeading: typeof safe.mainHeading === 'string' ? safe.mainHeading : '',
            subHeading: typeof safe.subHeading === 'string' ? safe.subHeading : '',
            buttonText: typeof safe.buttonText === 'string' ? safe.buttonText : '',
            buttonUrl: typeof safe.buttonUrl === 'string' ? safe.buttonUrl : '',
          },
        ]
      : [];

  const rawSlides = Array.isArray(safe.slides) ? safe.slides : legacySlide;

  return {
    slides: rawSlides
      .map((slide, index) => ({
        id:
          typeof slide?.id === 'string' && slide.id.trim()
            ? slide.id.trim()
            : `slide-${Date.now()}-${index}`,
        image: typeof slide?.image === 'string' && slide.image.trim() ? slide.image.trim() : null,
        mainHeading:
          typeof slide?.mainHeading === 'string' ? slide.mainHeading.trim() : '',
        subHeading: typeof slide?.subHeading === 'string' ? slide.subHeading.trim() : '',
        buttonText: typeof slide?.buttonText === 'string' ? slide.buttonText.trim() : '',
        buttonUrl: typeof slide?.buttonUrl === 'string' ? slide.buttonUrl.trim() : '',
      }))
      .filter((slide) => slide.image),
  };
}

function toActivePayload(slide) {
  if (!slide) {
    return {
      banner: null,
      mainHeading: '',
      subHeading: '',
      buttonText: '',
      buttonUrl: '',
    };
  }

  return {
    banner: slide.image,
    mainHeading: slide.mainHeading,
    subHeading: slide.subHeading,
    buttonText: slide.buttonText,
    buttonUrl: slide.buttonUrl,
  };
}

function removeUploadFile(filename) {
  if (!filename) return;
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, () => {});
  }
}

router.get('/', (_req, res) => {
  const state = readState();
  res.json({ slides: state.slides });
});

router.get('/active', (_req, res) => {
  const state = readState();
  res.json(toActivePayload(state.slides[0]));
});

router.post('/active', auth, upload.single('banner'), (req, res) => {
  const state = readState();
  const previous = state.slides[0] || null;
  const nextState = {
    slides: [
      {
        id: previous?.id || `slide-${Date.now()}-0`,
        image: req.file?.filename || previous?.image || null,
        mainHeading: (req.body.mainHeading || previous?.mainHeading || '').toString().trim(),
        subHeading: (req.body.subHeading || previous?.subHeading || '').toString().trim(),
        buttonText: (req.body.buttonText || previous?.buttonText || '').toString().trim(),
        buttonUrl: (req.body.buttonUrl || previous?.buttonUrl || '').toString().trim(),
      },
      ...state.slides.slice(1),
    ],
  };

  if (!nextState.slides[0].image) {
    res.status(400).json({ error: 'Banner image is required' });
    return;
  }

  writeState(nextState);

  if (previous?.image && req.file?.filename && previous.image !== req.file.filename) {
    removeUploadFile(previous.image);
  }

  res.json(toActivePayload(nextState.slides[0]));
});

router.post('/slides', auth, upload.single('banner'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Banner image is required' });
    return;
  }

  const state = readState();
  const nextSlide = {
    id: `slide-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    image: req.file.filename,
    mainHeading: (req.body.mainHeading || '').toString().trim(),
    subHeading: (req.body.subHeading || '').toString().trim(),
    buttonText: (req.body.buttonText || '').toString().trim(),
    buttonUrl: (req.body.buttonUrl || '').toString().trim(),
  };

  const nextState = {
    slides: [...state.slides, nextSlide],
  };

  writeState(nextState);
  res.status(201).json({ slide: nextSlide, slides: nextState.slides });
});

router.delete('/slides/:id', auth, (req, res) => {
  const state = readState();
  const toDelete = state.slides.find((slide) => slide.id === req.params.id);
  if (!toDelete) {
    res.status(404).json({ error: 'Slide not found' });
    return;
  }

  const nextSlides = state.slides.filter((slide) => slide.id !== req.params.id);
  writeState({ slides: nextSlides });
  removeUploadFile(toDelete.image);
  res.json({ message: 'Slide removed', slides: nextSlides });
});

router.delete('/active', auth, (_req, res) => {
  const state = readState();
  state.slides.forEach((slide) => removeUploadFile(slide.image));
  writeState({ slides: [] });
  res.json({ message: 'Banner removed' });
});

module.exports = router;
