import { useEffect, useState } from 'react';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001').replace(/\/$/, '');

interface ActiveBannerResponse {
  banner: string | null;
  mainHeading?: string;
  subHeading?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface SlidesResponse {
  slides?: Array<{
    id: string;
    image: string;
    mainHeading: string;
    subHeading: string;
    buttonText: string;
    buttonUrl: string;
  }>;
}

export interface CmsBannerContent {
  image: string;
  mainHeading: string;
  subHeading: string;
  buttonText: string;
  buttonUrl: string;
}

export interface CmsBannerSlide extends CmsBannerContent {
  id: string;
}

export default function useCmsBanner(fallbackBanner = '') {
  const [bannerSrc, setBannerSrc] = useState(fallbackBanner);

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/banners/active`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load banner');
        return res.json() as Promise<ActiveBannerResponse>;
      })
      .then((data) => {
        if (!mounted) return;
        if (data.banner) {
          setBannerSrc(`${BASE_URL}/uploads/${data.banner}`);
        } else {
          setBannerSrc(fallbackBanner);
        }
      })
      .catch(() => {
        if (mounted) setBannerSrc(fallbackBanner);
      });

    return () => {
      mounted = false;
    };
  }, [fallbackBanner]);

  return bannerSrc;
}

export function useCmsBannerContent(fallback: CmsBannerContent) {
  const [content, setContent] = useState<CmsBannerContent>(fallback);

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/banners/active`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load banner');
        return res.json() as Promise<ActiveBannerResponse>;
      })
      .then((data) => {
        if (!mounted) return;
        setContent({
          image: data.banner ? `${BASE_URL}/uploads/${data.banner}` : fallback.image,
          mainHeading: data.mainHeading?.trim() || fallback.mainHeading,
          subHeading: data.subHeading?.trim() || fallback.subHeading,
          buttonText: data.buttonText?.trim() || fallback.buttonText,
          buttonUrl: data.buttonUrl?.trim() || fallback.buttonUrl,
        });
      })
      .catch(() => {
        if (mounted) setContent(fallback);
      });

    return () => {
      mounted = false;
    };
  }, [
    fallback.image,
    fallback.mainHeading,
    fallback.subHeading,
    fallback.buttonText,
    fallback.buttonUrl,
  ]);

  return content;
}

export function useCmsBannerSlides(fallback: CmsBannerSlide[]) {
  const [slides, setSlides] = useState<CmsBannerSlide[]>(fallback);

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/banners`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load banners');
        return res.json() as Promise<SlidesResponse>;
      })
      .then((data) => {
        if (!mounted) return;
        const nextSlides = (data.slides || [])
          .filter((slide) => slide.image)
          .map((slide) => ({
            id: slide.id,
            image: `${BASE_URL}/uploads/${slide.image}`,
            mainHeading: slide.mainHeading || '',
            subHeading: slide.subHeading || '',
            buttonText: slide.buttonText || '',
            buttonUrl: slide.buttonUrl || '',
          }));

        setSlides(nextSlides.length > 0 ? nextSlides : fallback);
      })
      .catch(() => {
        if (mounted) setSlides(fallback);
      });

    return () => {
      mounted = false;
    };
  }, [fallback]);

  return slides;
}
