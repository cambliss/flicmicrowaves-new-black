import React, { useEffect, useMemo, useState } from 'react';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterOfficeLocation {
  title: string;
  lines: string[];
}

interface FooterContent {
  description: string;
  email: string;
  phone: string;
  address: string;
  backgroundImage: string;
  qualityBadges: string[];
  socialLinks: FooterLink[];
  officeLocations: FooterOfficeLocation[];
  productsLinks: FooterLink[];
  aboutSiteLinks: FooterLink[];
  registeredOfficeLabel: string;
  registeredOfficeAddress: string;
  helpText: string;
  helpUrl: string;
  creditLine: string;
  solutionsLinks: FooterLink[];
  companyLinks: FooterLink[];
  bottomLinks: FooterLink[];
  copyright: string;
}

const emptyFooter: FooterContent = {
  description: '',
  email: '',
  phone: '',
  address: '',
  backgroundImage: '',
  qualityBadges: [],
  socialLinks: [],
  officeLocations: [],
  productsLinks: [],
  aboutSiteLinks: [],
  registeredOfficeLabel: '',
  registeredOfficeAddress: '',
  helpText: '',
  helpUrl: '',
  creditLine: '',
  solutionsLinks: [],
  companyLinks: [],
  bottomLinks: [],
  copyright: '',
};

const Footer = () => {
  const [content, setContent] = useState<FooterContent>(emptyFooter);

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:4001/api/home-content/footer')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load footer');
        return res.json() as Promise<Partial<FooterContent>>;
      })
      .then((data) => {
        if (!mounted) return;
        setContent({
          description: data.description?.trim() || '',
          email: data.email?.trim() || '',
          phone: data.phone?.trim() || '',
          address: data.address?.trim() || '',
          backgroundImage: data.backgroundImage?.trim() || '',
          qualityBadges: Array.isArray(data.qualityBadges) ? data.qualityBadges : [],
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          officeLocations: Array.isArray(data.officeLocations) ? data.officeLocations : [],
          productsLinks: Array.isArray(data.productsLinks) ? data.productsLinks : [],
          aboutSiteLinks: Array.isArray(data.aboutSiteLinks) ? data.aboutSiteLinks : [],
          registeredOfficeLabel: data.registeredOfficeLabel?.trim() || '',
          registeredOfficeAddress: data.registeredOfficeAddress?.trim() || '',
          helpText: data.helpText?.trim() || '',
          helpUrl: data.helpUrl?.trim() || '',
          creditLine: data.creditLine?.trim() || '',
          solutionsLinks:
            Array.isArray(data.solutionsLinks) && data.solutionsLinks.length > 0
              ? data.solutionsLinks
              : [],
          companyLinks:
            Array.isArray(data.companyLinks) && data.companyLinks.length > 0
              ? data.companyLinks
              : [],
          bottomLinks:
            Array.isArray(data.bottomLinks) && data.bottomLinks.length > 0
              ? data.bottomLinks
              : [],
          copyright: data.copyright?.trim() || '',
        });
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const officeLocations = useMemo(() => {
    if (content.officeLocations.length) return content.officeLocations;
    return content.address
      ? [{ title: 'Head Office', lines: [content.address] }]
      : [];
  }, [content.address, content.officeLocations]);

  const productLinks = useMemo(() => {
    if (content.productsLinks.length) return content.productsLinks;
    return content.solutionsLinks;
  }, [content.productsLinks, content.solutionsLinks]);

  const aboutSiteLinks = useMemo(() => {
    if (content.aboutSiteLinks.length) return content.aboutSiteLinks;
    return [...content.companyLinks, ...content.bottomLinks].slice(0, 8);
  }, [content.aboutSiteLinks, content.bottomLinks, content.companyLinks]);

  const socialLinks = useMemo(() => {
    if (content.socialLinks.length) return content.socialLinks;
    return [];
  }, [content.socialLinks]);

  const registeredOfficeLines = useMemo(() => {
    if (content.registeredOfficeAddress.trim()) {
      return content.registeredOfficeAddress
        .split(',')
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (officeLocations.length > 0 && officeLocations[0].lines.length > 0) {
      return officeLocations[0].lines;
    }
    if (content.address.trim()) {
      return [content.address.trim()];
    }
    return [];
  }, [content.address, content.registeredOfficeAddress, officeLocations]);

  const products = useMemo(() => {
    if (productLinks.length > 0) return productLinks;
    return content.solutionsLinks;
  }, [content.solutionsLinks, productLinks]);

  const aboutLinks = useMemo(() => {
    if (aboutSiteLinks.length > 0) return aboutSiteLinks;
    return content.bottomLinks;
  }, [aboutSiteLinks, content.bottomLinks]);

  const bottomLinks = useMemo(() => {
    if (content.bottomLinks.length > 0) return content.bottomLinks;
    return aboutLinks;
  }, [aboutLinks, content.bottomLinks]);

  const mapUrl = useMemo(() => {
    if (content.address.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address.trim())}`;
    }
    if (content.helpUrl.trim()) return content.helpUrl;
    return '#';
  }, [content.address, content.helpUrl]);

  const locationLine = useMemo(() => {
    if (officeLocations.length > 0) {
      const first = officeLocations[0];
      const city = first.title?.trim() || 'HYDERABAD';
      const country = first.lines[first.lines.length - 1]?.trim() || 'INDIA';
      return `FLICMICROWAVES · ${city.toUpperCase()} · ${country.toUpperCase()}`;
    }
    return 'FLICMICROWAVES · HYDERABAD · INDIA';
  }, [officeLocations]);

  const productColumns = useMemo(() => {
    if (products.length === 0) return [[], []] as [FooterLink[], FooterLink[]];
    const midpoint = Math.ceil(products.length / 2);
    return [products.slice(0, midpoint), products.slice(midpoint)] as [FooterLink[], FooterLink[]];
  }, [products]);

  const getSocialGlyph = (label: string) => {
    const normalized = label.trim().toLowerCase();
    if (normalized.includes('linkedin')) return 'in';
    if (normalized === 'x' || normalized.includes('twitter')) return 'x';
    return label.trim().slice(0, 1).toLowerCase() || '#';
  };

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-14">
        <div className="grid lg:grid-cols-[280px_1fr_1.2fr] gap-12 lg:gap-16">
          <div>
            <div className="flex items-center justify-start mb-6">
              <img src="/images/flicmicrowaves.png" alt="Flic Microwaves" className="h-[4.5rem] lg:h-[5rem] w-auto max-w-none object-contain" />
            </div>
            <p className="text-[15px] leading-relaxed text-white/55 font-opensans mb-8">{content.copyright}</p>

            {socialLinks.length > 0 && (
              <div className="flex gap-4 mb-8">
                {socialLinks.slice(0, 2).map((item, index) => (
                  <a
                    key={`${item.label}-${index}`}
                    href={item.url || '#'}
                    aria-label={item.label}
                    className="h-10 w-10 border border-white/20 text-white/70 inline-flex items-center justify-center text-base font-light hover:text-goldenrod hover:border-goldenrod/40 transition-colors"
                  >
                    {getSocialGlyph(item.label)}
                  </a>
                ))}
              </div>
            )}

            {content.qualityBadges.length > 0 && (
              <div className="space-y-4">
                {content.qualityBadges.slice(0, 2).map((badge, index) => (
                  <p key={`${badge}-${index}`} className="inline-flex px-4 py-2 border border-white/20 text-sm tracking-[0.05em] text-white/65">
                    {badge.split(' - ')[0]}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-goldenrod text-[13px] tracking-[0.14em] uppercase font-semibold">Flicmicrowaves</h3>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-goldenrod text-[13px] tracking-[0.14em] uppercase font-semibold mb-6">
                {content.registeredOfficeLabel || 'Registered Office'}
              </h4>
              <div className="space-y-3 mb-8">
                {registeredOfficeLines.map((line, index) => (
                  <p key={`${line}-${index}`} className="text-[15px] leading-relaxed text-white/55 font-opensans">
                    {line}
                  </p>
                ))}
              </div>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="text-goldenrod text-[15px] leading-none font-opensans hover:text-goldenrod/80 transition-colors">
                View on Google Maps →
              </a>
            </div>

            {aboutLinks.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <h4 className="text-goldenrod text-[13px] tracking-[0.14em] uppercase font-semibold mb-6">About this Site</h4>
                <div className="space-y-4">
                  {aboutLinks.map((item, index) => (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.url || '#'}
                      className="block text-[15px] leading-relaxed text-white/55 hover:text-white transition-colors font-opensans"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-goldenrod text-[13px] tracking-[0.14em] uppercase font-semibold">Products</h4>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              {productColumns[0].map((item, index) => (
                <a
                  key={`${item.label}-left-${index}`}
                  href={item.url || '#'}
                  className="text-[15px] leading-relaxed text-white/55 hover:text-white transition-colors font-opensans"
                >
                  {item.label}
                </a>
              ))}
              {productColumns[1].map((item, index) => (
                <a
                  key={`${item.label}-right-${index}`}
                  href={item.url || '#'}
                  className="text-[15px] leading-relaxed text-white/55 hover:text-white transition-colors font-opensans"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-20 py-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {bottomLinks.map((item, index) => (
              <a
                key={`${item.label}-${index}`}
                href={item.url || '#'}
                className="text-[14px] leading-relaxed text-white/45 hover:text-white/75 transition-colors font-opensans"
              >
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-[14px] leading-relaxed tracking-[0.08em] text-white/35 uppercase font-opensans">{locationLine}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;