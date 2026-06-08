const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

const router = express.Router();

const dataDir = path.join(__dirname, '..', 'data');
const contentPath = path.join(dataDir, 'home-content.json');
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `home-content-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG, PNG, GIF, and WebP files are allowed'), ok);
  },
});

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(contentPath)) {
  fs.writeFileSync(contentPath, JSON.stringify(defaultContent(), null, 2));
}

function defaultContent() {
  return {
    whyChoose: {
      heading: 'Quality & Performance Assured',
      subtitle: 'Our technologies deliver reliable, high-performance results for complex applications.',
      items: [
        {
          title: 'Mission Critical Communications',
          description: 'Engineered RF chains for secure, resilient communication in demanding operating environments.',
        },
        {
          title: 'Customised RF Sub-systems',
          description: 'Tailored subsystem design aligned to your frequency plans, integration constraints, and performance goals.',
        },
        {
          title: '300MHz-300GHz Design, Manufacture & Test',
          description: 'End-to-end capability across wideband RF and microwave programs from concept through validation.',
        },
        {
          title: 'Hybrid Manufacturing Services',
          description: 'Flexible manufacturing workflows combining precision build, quality checks, and rapid program scaling.',
        },
      ],
    },
    solutions: {
      heading: '',
      subtitle: '',
      items: [],
    },
    solutionsPage: defaultSolutionsPage(),
    industriesPage: defaultIndustriesPage(),
    careersPage: defaultCareersPage(),
    blogsPage: defaultBlogsPage(),
    innovationPage: defaultInnovationPage(),
    facilitiesPage: defaultFacilitiesPage(),
    contactPage: defaultContactPage(),
    homeDarkIndustries: defaultHomeDarkIndustries(),
    homeAdvantage: defaultHomeAdvantage(),
    homeSuccessStories: defaultHomeSuccessStories(),
    process: {
      heading: '',
      subtitle: '',
      items: [],
    },
    industries: {
      heading: '',
      subtitle: '',
      image: '',
      items: [],
    },
    featuredProducts: {
      heading: '',
      subtitle: '',
      items: [],
    },
    innovation: {
      heading: '',
      description: '',
      points: [],
      buttonText: '',
      buttonUrl: '',
      image: '',
    },
    gallery: defaultGallery(),
    footer: {
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
    },
    about: defaultAbout(),
  };
}

function defaultSolutionsPage() {
  return {
    hero: {
      eyebrow: 'Defence Solutions',
      title: 'Mission-Ready RF And Microwave Solutions',
      subtitle:
        'Engineered for tactical communication, radar, EW, and satellite-linked defence programs where reliability is non-negotiable.',
      primaryCtaText: 'Discuss Program Requirements',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Book Engineering Consultation',
      secondaryCtaUrl: '/book-appointment',
    },
    categories: [
      { title: 'RF Filters For Secure Communications', body: 'High-selectivity filters for stable, low-loss signal integrity in encrypted communication chains.' },
      { title: 'High-Power Amplifiers For Tactical Networks', body: 'Amplifier systems designed for high uptime and thermal stability in mission-critical deployments.' },
      { title: 'SATCOM Ground Segment Modules', body: 'Reliable uplink and downlink subsystem support for defence satellite communication programs.' },
      { title: 'Radar And EW RF Subsystems', body: 'Precision RF building blocks supporting surveillance, tracking, and electronic warfare readiness.' },
      { title: 'Frequency Conversion And Conditioning', body: 'Low-noise, high-stability conversion modules for controlled signal translation across frequency bands.' },
      { title: 'Ruggedized Microwave Assemblies', body: 'Built-to-spec assemblies qualified for vibration, thermal stress, and long-lifecycle field operation.' },
    ],
    applications: [
      'Tactical communication vehicles',
      'Naval communication systems',
      'Airborne communication payloads',
      'Border surveillance networks',
      'Ground radar and tracking stations',
      'Command and control infrastructure',
    ],
    engineeringDepth: [
      'Simulation-led RF architecture and subsystem optimization',
      'EMI/EMC-aware design workflows for contested environments',
      'Thermal and power efficiency tuning for sustained operation',
      'Prototype-to-production transfer with controlled documentation',
      'Obsolescence management and redesign support',
    ],
    qualityCompliance: [
      'Structured incoming, in-process, and final quality checkpoints',
      'Traceability-driven manufacturing and test documentation',
      'Reliability and environmental validation aligned to mission profiles',
      'Configuration control and revision discipline across program lifecycle',
      'Corrective-action loops for continuous process improvement',
    ],
    lifecycleSupport: [
      { title: 'Requirement Analysis', body: 'Aligning mission goals, constraints, and compliance expectations before design kickoff.' },
      { title: 'Rapid Prototyping', body: 'Iterative engineering and validation cycles to shorten time-to-qualification.' },
      { title: 'Qualification Support', body: 'Documentation and performance evidence for customer and program qualification workflows.' },
      { title: 'Scaled Production', body: 'Controlled manufacturing with quality gates and delivery accountability.' },
      { title: 'Integration Assistance', body: 'Hands-on technical collaboration during subsystem and platform integration.' },
      { title: 'Post-Deployment Support', body: 'Lifecycle response, issue resolution, and sustainment planning for long-term programs.' },
    ],
    caseStudies: [
      {
        title: 'Secure Tactical Link Upgrade',
        challenge: 'Legacy communication chain showed signal loss and poor selectivity in dense RF conditions.',
        solution: 'Implemented custom filter-amplifier architecture with improved rejection and thermal stability.',
        outcome: 'Delivered measurable link reliability improvement and reduced field tuning overhead.',
      },
      {
        title: 'Ground Radar RF Front-End Refresh',
        challenge: 'Existing subsystem had inconsistent performance across temperature and vibration ranges.',
        solution: 'Redesigned RF front-end with ruggedized packaging and validation-focused test flow.',
        outcome: 'Improved consistency under stress and faster acceptance across deployment batches.',
      },
      {
        title: 'SATCOM Program Integration Support',
        challenge: 'Program timelines were impacted by integration mismatches between RF modules and platform interfaces.',
        solution: 'Provided co-engineering support, interface tuning, and structured integration documentation.',
        outcome: 'Reduced integration delays and achieved stable uplink/downlink performance targets.',
      },
    ],
    metrics: [
      { value: '500+', label: 'Programs Delivered' },
      { value: '99.2%', label: 'On-Time Delivery' },
      { value: '50+', label: 'Countries Supported' },
      { value: '<24h', label: 'Technical Response Window' },
    ],
    security: [
      'Need-to-know information handling with controlled access workflows',
      'Secure collaboration model under NDA-led engagement processes',
      'Program documentation discipline with revision and release governance',
      'Awareness of export-control and project confidentiality obligations',
    ],
    faq: [
      {
        question: 'Can you support custom frequency bands and unique form factors?',
        answer: 'Yes. We design to program-specific electrical and mechanical requirements, including custom frequency and integration constraints.',
      },
      {
        question: 'Do you provide qualification and validation reports?',
        answer: 'Yes. We provide structured test evidence and supporting documentation aligned to agreed qualification plans.',
      },
      {
        question: 'Can you support legacy redesign and substitution programs?',
        answer: 'Yes. We routinely support redesign, fit-form-function replacements, and lifecycle continuity for legacy systems.',
      },
    ],
    cta: {
      title: 'Start Your Defence Program Discussion',
      description: 'Share your technical requirements and timelines. Our engineering team will propose a mission-fit solution path.',
      primaryText: 'Request Technical Discussion',
      primaryUrl: '/contact',
      secondaryText: 'Submit RF Specification',
      secondaryUrl: '/contact',
    },
  };
}

function normalizeSolutionsPage(rawSolutionsPage) {
  const base = defaultSolutionsPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const categories = toList(rawSolutionsPage?.categories, 8)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const applications = toList(rawSolutionsPage?.applications, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const engineeringDepth = toList(rawSolutionsPage?.engineeringDepth, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const qualityCompliance = toList(rawSolutionsPage?.qualityCompliance, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const lifecycleSupport = toList(rawSolutionsPage?.lifecycleSupport, 12)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const caseStudies = toList(rawSolutionsPage?.caseStudies, 8)
    .map((item) => ({
      title: toText(item?.title),
      challenge: toText(item?.challenge),
      solution: toText(item?.solution),
      outcome: toText(item?.outcome),
    }))
    .filter((item) => item.title && item.challenge && item.solution && item.outcome);

  const metrics = toList(rawSolutionsPage?.metrics, 8)
    .map((item) => ({ value: toText(item?.value), label: toText(item?.label) }))
    .filter((item) => item.value && item.label);

  const security = toList(rawSolutionsPage?.security, 10)
    .map((item) => toText(item))
    .filter(Boolean);

  const faq = toList(rawSolutionsPage?.faq, 12)
    .map((item) => ({ question: toText(item?.question), answer: toText(item?.answer) }))
    .filter((item) => item.question && item.answer);

  return {
    hero: {
      eyebrow: toText(rawSolutionsPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawSolutionsPage?.hero?.title, base.hero.title),
      subtitle: toText(rawSolutionsPage?.hero?.subtitle, base.hero.subtitle),
      primaryCtaText: toText(rawSolutionsPage?.hero?.primaryCtaText, base.hero.primaryCtaText),
      primaryCtaUrl: toText(rawSolutionsPage?.hero?.primaryCtaUrl, base.hero.primaryCtaUrl) || '#',
      secondaryCtaText: toText(rawSolutionsPage?.hero?.secondaryCtaText, base.hero.secondaryCtaText),
      secondaryCtaUrl: toText(rawSolutionsPage?.hero?.secondaryCtaUrl, base.hero.secondaryCtaUrl) || '#',
    },
    categories: categories.length ? categories : base.categories,
    applications: applications.length ? applications : base.applications,
    engineeringDepth: engineeringDepth.length ? engineeringDepth : base.engineeringDepth,
    qualityCompliance: qualityCompliance.length ? qualityCompliance : base.qualityCompliance,
    lifecycleSupport: lifecycleSupport.length ? lifecycleSupport : base.lifecycleSupport,
    caseStudies: caseStudies.length ? caseStudies : base.caseStudies,
    metrics: metrics.length ? metrics : base.metrics,
    security: security.length ? security : base.security,
    faq: faq.length ? faq : base.faq,
    cta: {
      title: toText(rawSolutionsPage?.cta?.title, base.cta.title),
      description: toText(rawSolutionsPage?.cta?.description, base.cta.description),
      primaryText: toText(rawSolutionsPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawSolutionsPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
      secondaryText: toText(rawSolutionsPage?.cta?.secondaryText, base.cta.secondaryText),
      secondaryUrl: toText(rawSolutionsPage?.cta?.secondaryUrl, base.cta.secondaryUrl) || '#',
    },
  };
}

function defaultIndustriesPage() {
  return {
    hero: {
      eyebrow: 'Industries We Serve',
      title: 'Defence-Focused Industries And Mission Domains',
      subtitle:
        'We support strategic sectors that require dependable RF and microwave performance across communication, surveillance, and secure infrastructure programs.',
      primaryCtaText: 'Discuss Industry Requirements',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Book Consultation',
      secondaryCtaUrl: '/book-appointment',
    },
    sectors: [
      {
        title: 'Defence Communication Systems',
        body: 'Secure and resilient RF subsystems for tactical communication, command networks, and mission-critical connectivity.',
      },
      {
        title: 'Aerospace And Avionics',
        body: 'High-reliability microwave components for airborne communication payloads and avionics-linked RF chains.',
      },
      {
        title: 'Satellite And Space Programs',
        body: 'Subsystem support for uplink/downlink architectures, payload interfaces, and ground station infrastructure.',
      },
      {
        title: 'Border And Coastal Surveillance',
        body: 'RF solutions for radar, tracking, monitoring, and integrated situational awareness systems.',
      },
      {
        title: 'Telecom And Critical Infrastructure',
        body: 'Carrier and infrastructure-grade RF components for stable, secure, high-uptime communication networks.',
      },
      {
        title: 'Industrial And Strategic Electronics',
        body: 'Ruggedized assemblies for control, automation, and specialized strategic electronics applications.',
      },
    ],
    capabilities: [
      'Custom RF and microwave architecture aligned to mission constraints',
      'Simulation-led optimization for signal integrity and thermal stability',
      'Design-for-manufacture workflows for prototype-to-production continuity',
      'Validation support across environmental and performance conditions',
      'Long-lifecycle sustainment and redesign capability for legacy platforms',
    ],
    compliance: [
      'Quality-governed execution with controlled stage-wise checks',
      'Traceability-led documentation across assemblies and testing',
      'Configuration control for revision integrity and deployment consistency',
      'Confidentiality-aware collaboration under regulated engagement practices',
    ],
    deploymentModel: [
      {
        title: 'Requirement Discovery',
        body: 'Capture operational, environmental, and program constraints before design finalization.',
      },
      {
        title: 'Engineering And Validation',
        body: 'Develop, test, and refine subsystem performance to match mission-level expectations.',
      },
      {
        title: 'Production And Integration',
        body: 'Deliver controlled manufacturing with integration support and quality documentation.',
      },
      {
        title: 'Lifecycle Support',
        body: 'Sustain long-term readiness through upgrades, technical response, and reliability tracking.',
      },
    ],
    featuredPrograms: [
      {
        title: 'Tactical Communication Network Modernization',
        sector: 'Defence Communication',
        challenge: 'In-field communication quality degraded under dense RF conditions and mobility stress.',
        outcome: 'Enhanced signal reliability and improved deployment readiness through custom RF chain optimization.',
      },
      {
        title: 'Ground Surveillance RF Upgrade',
        sector: 'Border Surveillance',
        challenge: 'Legacy subsystem showed inconsistent tracking performance across variable environments.',
        outcome: 'Improved performance stability with ruggedized subsystem redesign and validation workflows.',
      },
      {
        title: 'SATCOM Integration Acceleration',
        sector: 'Satellite Programs',
        challenge: 'Schedule pressure due to interface and integration mismatches in RF module deployment.',
        outcome: 'Reduced integration delay and stabilized uplink/downlink chain performance in final acceptance.',
      },
    ],
    metrics: [
      { value: '6+', label: 'Strategic Industry Domains' },
      { value: '500+', label: 'Programs Supported' },
      { value: '99.2%', label: 'On-Time Delivery' },
      { value: '50+', label: 'Countries Reached' },
    ],
    coverage: [
      'Cross-functional support across engineering, manufacturing, quality, and integration',
      'Program execution across domestic and international strategic projects',
      'Responsive technical collaboration with OEMs, integrators, and government-linked teams',
    ],
    cta: {
      title: 'Build Your Next Industry Program With Flic Microwaves',
      description: 'Share your sector-specific requirements and mission priorities. We will align a solution pathway that fits your operational context.',
      primaryText: 'Request Industry Consultation',
      primaryUrl: '/contact',
      secondaryText: 'Book A Technical Session',
      secondaryUrl: '/book-appointment',
    },
  };
}

function normalizeIndustriesPage(rawIndustriesPage) {
  const base = defaultIndustriesPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const sectors = toList(rawIndustriesPage?.sectors, 10)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const capabilities = toList(rawIndustriesPage?.capabilities, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const compliance = toList(rawIndustriesPage?.compliance, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const deploymentModel = toList(rawIndustriesPage?.deploymentModel, 10)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const featuredPrograms = toList(rawIndustriesPage?.featuredPrograms, 10)
    .map((item) => ({
      title: toText(item?.title),
      sector: toText(item?.sector),
      challenge: toText(item?.challenge),
      outcome: toText(item?.outcome),
    }))
    .filter((item) => item.title && item.sector && item.challenge && item.outcome);

  const metrics = toList(rawIndustriesPage?.metrics, 8)
    .map((item) => ({ value: toText(item?.value), label: toText(item?.label) }))
    .filter((item) => item.value && item.label);

  const coverage = toList(rawIndustriesPage?.coverage, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  return {
    hero: {
      eyebrow: toText(rawIndustriesPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawIndustriesPage?.hero?.title, base.hero.title),
      subtitle: toText(rawIndustriesPage?.hero?.subtitle, base.hero.subtitle),
      primaryCtaText: toText(rawIndustriesPage?.hero?.primaryCtaText, base.hero.primaryCtaText),
      primaryCtaUrl: toText(rawIndustriesPage?.hero?.primaryCtaUrl, base.hero.primaryCtaUrl) || '#',
      secondaryCtaText: toText(rawIndustriesPage?.hero?.secondaryCtaText, base.hero.secondaryCtaText),
      secondaryCtaUrl: toText(rawIndustriesPage?.hero?.secondaryCtaUrl, base.hero.secondaryCtaUrl) || '#',
    },
    sectors: sectors.length ? sectors : base.sectors,
    capabilities: capabilities.length ? capabilities : base.capabilities,
    compliance: compliance.length ? compliance : base.compliance,
    deploymentModel: deploymentModel.length ? deploymentModel : base.deploymentModel,
    featuredPrograms: featuredPrograms.length ? featuredPrograms : base.featuredPrograms,
    metrics: metrics.length ? metrics : base.metrics,
    coverage: coverage.length ? coverage : base.coverage,
    cta: {
      title: toText(rawIndustriesPage?.cta?.title, base.cta.title),
      description: toText(rawIndustriesPage?.cta?.description, base.cta.description),
      primaryText: toText(rawIndustriesPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawIndustriesPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
      secondaryText: toText(rawIndustriesPage?.cta?.secondaryText, base.cta.secondaryText),
      secondaryUrl: toText(rawIndustriesPage?.cta?.secondaryUrl, base.cta.secondaryUrl) || '#',
    },
  };
}

function defaultCareersPage() {
  return {
    hero: {
      eyebrow: 'Careers At Flic Microwaves',
      title: 'Build Mission-Ready Technology With Us',
      subtitle:
        'Join teams designing and delivering RF and microwave systems for defence, aerospace, satellite, and critical communication programs.',
      primaryCtaText: 'Apply Now',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Talk To HR',
      secondaryCtaUrl: '/contact',
    },
    whyJoin: [
      'Work on high-impact strategic engineering programs.',
      'Collaborate with experienced RF and systems specialists.',
      'Grow through hands-on design, testing, and deployment exposure.',
      'Build long-term expertise in mission-critical technologies.',
    ],
    openRoles: [
      {
        title: 'RF Design Engineer',
        location: 'Hyderabad, India',
        type: 'Full Time',
        experience: '3-6 Years',
        summary: 'Design and optimize RF chains, filters, and subsystem performance for strategic communication programs.',
      },
      {
        title: 'Microwave Test Engineer',
        location: 'Hyderabad, India',
        type: 'Full Time',
        experience: '2-5 Years',
        summary: 'Execute validation, environmental qualification, and performance benchmarking for RF assemblies.',
      },
      {
        title: 'Program Engineer',
        location: 'Hyderabad, India',
        type: 'Full Time',
        experience: '4-8 Years',
        summary: 'Coordinate technical execution, customer communication, and milestone delivery across engineering teams.',
      },
    ],
    culture: [
      { title: 'Engineering Ownership', body: 'Every engineer is accountable from concept through validation and deployment support.' },
      { title: 'Precision Mindset', body: 'We value rigorous thinking, measurable quality, and consistent technical discipline.' },
      { title: 'Collaborative Execution', body: 'Cross-functional teams work together to resolve constraints and deliver reliably.' },
    ],
    hiringProcess: [
      { step: '01', title: 'Application Review', body: 'We evaluate your profile against technical role requirements and project context.' },
      { step: '02', title: 'Technical Evaluation', body: 'Role-focused discussion and assessment with engineering leaders.' },
      { step: '03', title: 'Final Interaction', body: 'Culture and delivery fit evaluation with program and functional stakeholders.' },
      { step: '04', title: 'Offer And Onboarding', body: 'Structured onboarding with role clarity and project alignment from day one.' },
    ],
    benefits: [
      'Performance-linked growth opportunities',
      'Structured technical learning environment',
      'Collaborative and stable workplace culture',
      'Long-term career pathways in strategic engineering domains',
    ],
    faq: [
      {
        question: 'Do you hire fresh graduates for technical roles?',
        answer: 'Yes. Select entry-level roles are available based on project needs and candidate readiness.',
      },
      {
        question: 'Can candidates from non-defence backgrounds apply?',
        answer: 'Yes. Relevant RF, electronics, manufacturing, and program experience is considered across sectors.',
      },
      {
        question: 'Is relocation support available?',
        answer: 'Support options are evaluated based on role criticality and candidate profile.',
      },
    ],
    cta: {
      title: 'Ready To Build With Flic Microwaves?',
      description: 'Share your profile and area of interest. Our hiring team will connect with suitable opportunities.',
      primaryText: 'Submit Application',
      primaryUrl: '/contact',
      secondaryText: 'Connect With HR',
      secondaryUrl: '/contact',
    },
  };
}

function normalizeCareersPage(rawCareersPage) {
  const base = defaultCareersPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const whyJoin = toList(rawCareersPage?.whyJoin, 10).map((item) => toText(item)).filter(Boolean);
  const benefits = toList(rawCareersPage?.benefits, 12).map((item) => toText(item)).filter(Boolean);

  const openRoles = toList(rawCareersPage?.openRoles, 12)
    .map((item) => ({
      title: toText(item?.title),
      location: toText(item?.location),
      type: toText(item?.type),
      experience: toText(item?.experience),
      summary: toText(item?.summary),
    }))
    .filter((item) => item.title && item.location && item.type && item.experience && item.summary);

  const culture = toList(rawCareersPage?.culture, 10)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const hiringProcess = toList(rawCareersPage?.hiringProcess, 10)
    .map((item) => ({ step: toText(item?.step), title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.step && item.title && item.body);

  const faq = toList(rawCareersPage?.faq, 12)
    .map((item) => ({ question: toText(item?.question), answer: toText(item?.answer) }))
    .filter((item) => item.question && item.answer);

  return {
    hero: {
      eyebrow: toText(rawCareersPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawCareersPage?.hero?.title, base.hero.title),
      subtitle: toText(rawCareersPage?.hero?.subtitle, base.hero.subtitle),
      primaryCtaText: toText(rawCareersPage?.hero?.primaryCtaText, base.hero.primaryCtaText),
      primaryCtaUrl: toText(rawCareersPage?.hero?.primaryCtaUrl, base.hero.primaryCtaUrl) || '#',
      secondaryCtaText: toText(rawCareersPage?.hero?.secondaryCtaText, base.hero.secondaryCtaText),
      secondaryCtaUrl: toText(rawCareersPage?.hero?.secondaryCtaUrl, base.hero.secondaryCtaUrl) || '#',
    },
    whyJoin: whyJoin.length ? whyJoin : base.whyJoin,
    openRoles: openRoles.length ? openRoles : base.openRoles,
    culture: culture.length ? culture : base.culture,
    hiringProcess: hiringProcess.length ? hiringProcess : base.hiringProcess,
    benefits: benefits.length ? benefits : base.benefits,
    faq: faq.length ? faq : base.faq,
    cta: {
      title: toText(rawCareersPage?.cta?.title, base.cta.title),
      description: toText(rawCareersPage?.cta?.description, base.cta.description),
      primaryText: toText(rawCareersPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawCareersPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
      secondaryText: toText(rawCareersPage?.cta?.secondaryText, base.cta.secondaryText),
      secondaryUrl: toText(rawCareersPage?.cta?.secondaryUrl, base.cta.secondaryUrl) || '#',
    },
  };
}

function defaultBlogsPage() {
  const referenceImage = '/blogs/reference-blog.jpeg';

  return {
    hero: {
      eyebrow: 'Insights And Blogs',
      title: 'Engineering Insights From Mission-Critical Programs',
      subtitle:
        'Explore articles on RF design, defence communication trends, validation practices, and deployment lessons from strategic projects.',
    },
    featured: {
      title: 'Designing RF Chains For Harsh-Environment Reliability',
      excerpt:
        'A practical view of balancing insertion loss, thermal constraints, and field stability in defence-linked RF subsystem design.',
      category: 'RF Engineering',
      readTime: '8 min read',
      publishedOn: 'May 2026',
      author: 'Engineering Team',
      url: '#',
      image: referenceImage,
      content: [
        'High-reliability RF chains demand careful balancing of insertion loss, thermal margins, and long-term stability under operational stress.',
        'By combining simulation with measured validation loops, engineering teams can improve repeatability while reducing costly redesign cycles.',
      ],
    },
    categories: ['RF Engineering', 'Defence Electronics', 'Satellite Systems', 'Quality And Validation', 'Program Delivery'],
    posts: [
      {
        title: 'Improving Radar Front-End Stability Across Temperature Profiles',
        excerpt: 'Techniques to improve repeatability and performance margins in radar-linked RF assemblies.',
        category: 'Defence Electronics',
        readTime: '7 min read',
        publishedOn: 'Apr 2026',
        author: 'Systems Team',
        url: '#',
        image: referenceImage,
        content: [
          'Radar front-end stability is often affected by thermal drift and component tolerance stack-ups across assemblies.',
          'Structured characterization and compensation strategies improve consistency in field conditions.',
        ],
      },
      {
        title: 'Qualification-Driven Documentation That Speeds Program Acceptance',
        excerpt: 'How structured traceability and documentation reduce integration delays in strategic projects.',
        category: 'Quality And Validation',
        readTime: '6 min read',
        publishedOn: 'Mar 2026',
        author: 'Quality Team',
        url: '#',
        image: referenceImage,
        content: [
          'Qualification documentation should be planned as part of program execution rather than assembled at the end.',
          'Traceability from requirements through testing improves customer confidence and acceptance speed.',
        ],
      },
      {
        title: 'SATCOM Module Integration: Avoiding Common Interface Pitfalls',
        excerpt: 'Lessons from real deployments to improve interface compatibility and satcom subsystem readiness.',
        category: 'Satellite Systems',
        readTime: '9 min read',
        publishedOn: 'Feb 2026',
        author: 'Program Team',
        url: '#',
        image: referenceImage,
        content: [
          'Early interface control agreement between teams prevents downstream integration bottlenecks in satcom programs.',
          'Practical checklists and bench-level validation can significantly reduce rework during final assembly.',
        ],
      },
    ],
    newsletter: {
      title: 'Get New Engineering Insights',
      description: 'Receive updates on new articles, program learnings, and RF technology trends.',
      buttonText: 'Subscribe',
      buttonUrl: '/contact',
    },
    cta: {
      title: 'Have A Topic You Want Us To Cover?',
      description: 'Share your interest areas and we will publish practical insights relevant to your program needs.',
      primaryText: 'Request A Topic',
      primaryUrl: '/contact',
    },
  };
}

function normalizeBlogsPage(rawBlogsPage) {
  const base = defaultBlogsPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const normalizePost = (item, fallbackPost) => {
    const content = toList(item?.content, 20).map((entry) => toText(entry)).filter(Boolean);

    return {
      title: toText(item?.title, fallbackPost.title),
      excerpt: toText(item?.excerpt, fallbackPost.excerpt),
      category: toText(item?.category, fallbackPost.category),
      readTime: toText(item?.readTime, fallbackPost.readTime),
      publishedOn: toText(item?.publishedOn, fallbackPost.publishedOn),
      author: toText(item?.author, fallbackPost.author),
      url: toText(item?.url, fallbackPost.url) || '#',
      image: toText(item?.image, fallbackPost.image),
      content: content.length ? content : fallbackPost.content,
    };
  };

  const categories = toList(rawBlogsPage?.categories, 12).map((item) => toText(item)).filter(Boolean);

  const posts = toList(rawBlogsPage?.posts, 20)
    .map((item, index) => normalizePost(item, base.posts[index % base.posts.length]))
    .filter((item) => item.title && item.excerpt && item.category && item.readTime && item.publishedOn && item.author);

  return {
    hero: {
      eyebrow: toText(rawBlogsPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawBlogsPage?.hero?.title, base.hero.title),
      subtitle: toText(rawBlogsPage?.hero?.subtitle, base.hero.subtitle),
    },
    featured: normalizePost(rawBlogsPage?.featured, base.featured),
    categories: categories.length ? categories : base.categories,
    posts: posts.length ? posts : base.posts,
    newsletter: {
      title: toText(rawBlogsPage?.newsletter?.title, base.newsletter.title),
      description: toText(rawBlogsPage?.newsletter?.description, base.newsletter.description),
      buttonText: toText(rawBlogsPage?.newsletter?.buttonText, base.newsletter.buttonText),
      buttonUrl: toText(rawBlogsPage?.newsletter?.buttonUrl, base.newsletter.buttonUrl) || '#',
    },
    cta: {
      title: toText(rawBlogsPage?.cta?.title, base.cta.title),
      description: toText(rawBlogsPage?.cta?.description, base.cta.description),
      primaryText: toText(rawBlogsPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawBlogsPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
    },
  };
}

function defaultInnovationPage() {
  return {
    hero: {
      eyebrow: 'Innovation Lab',
      title: 'Research-Led RF Innovation For Strategic Missions',
      subtitle:
        'From concept validation to deployable subsystems, our innovation programs transform mission constraints into reliable RF and microwave outcomes.',
      primaryCtaText: 'Discuss Innovation Program',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Book Technical Session',
      secondaryCtaUrl: '/book-appointment',
    },
    focusAreas: [
      { title: 'Next-Gen RF Architectures', body: 'Evaluating architecture alternatives for better performance margins under contested environments.' },
      { title: 'Thermal And Power Optimization', body: 'Design experiments to improve sustained output and minimize signal degradation.' },
      { title: 'Miniaturization And Packaging', body: 'Compact subsystem designs for space-constrained platforms without compromising reliability.' },
      { title: 'Signal Integrity Engineering', body: 'Simulation-led optimization to improve selectivity, stability, and interference resilience.' },
    ],
    labCapabilities: [
      'Rapid concept prototyping and performance benchmarking',
      'Design simulation loops with measured validation feedback',
      'Subsystem reliability trials under environmental stress',
      'Interface readiness checks for downstream integration',
    ],
    pipeline: [
      { step: '01', title: 'Problem Framing', body: 'Translate mission constraints into measurable technical hypotheses.' },
      { step: '02', title: 'Prototype Iteration', body: 'Build and refine candidate designs using simulation and controlled testing.' },
      { step: '03', title: 'Validation And Transfer', body: 'Document results and move validated concepts into engineering programs.' },
    ],
    metrics: [
      { value: '120+', label: 'Innovation Experiments' },
      { value: '40+', label: 'Validated Concepts' },
      { value: '18', label: 'Active R&D Tracks' },
      { value: '24/7', label: 'Lab Readiness' },
    ],
    featuredProjects: [
      {
        title: 'Adaptive Filter Topology Study',
        problem: 'Conventional filtering approaches showed reduced resilience under dynamic interference windows.',
        approach: 'Evaluated adaptive topology variants with iterative EM simulation and bench verification.',
        outcome: 'Identified design approach with improved rejection behavior and stable insertion loss envelope.',
      },
      {
        title: 'Ruggedized Microwave Module Packaging',
        problem: 'Subsystem drift was observed during thermal and vibration stress combinations.',
        approach: 'Ran packaging and material alternatives with stress-profile-driven test loops.',
        outcome: 'Improved thermal stability and mechanical robustness in qualification simulations.',
      },
    ],
    cta: {
      title: 'Co-Create Your Next Innovation Program',
      description: 'Bring your technical challenge to our innovation team and we will define an actionable R&D pathway.',
      primaryText: 'Start Innovation Discussion',
      primaryUrl: '/contact',
      secondaryText: 'Schedule Discovery Call',
      secondaryUrl: '/book-appointment',
    },
  };
}

function normalizeInnovationPage(rawInnovationPage) {
  const base = defaultInnovationPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const focusAreas = toList(rawInnovationPage?.focusAreas, 10)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const labCapabilities = toList(rawInnovationPage?.labCapabilities, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  const pipeline = toList(rawInnovationPage?.pipeline, 10)
    .map((item) => ({ step: toText(item?.step), title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.step && item.title && item.body);

  const metrics = toList(rawInnovationPage?.metrics, 8)
    .map((item) => ({ value: toText(item?.value), label: toText(item?.label) }))
    .filter((item) => item.value && item.label);

  const featuredProjects = toList(rawInnovationPage?.featuredProjects, 12)
    .map((item) => ({
      title: toText(item?.title),
      problem: toText(item?.problem),
      approach: toText(item?.approach),
      outcome: toText(item?.outcome),
    }))
    .filter((item) => item.title && item.problem && item.approach && item.outcome);

  return {
    hero: {
      eyebrow: toText(rawInnovationPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawInnovationPage?.hero?.title, base.hero.title),
      subtitle: toText(rawInnovationPage?.hero?.subtitle, base.hero.subtitle),
      primaryCtaText: toText(rawInnovationPage?.hero?.primaryCtaText, base.hero.primaryCtaText),
      primaryCtaUrl: toText(rawInnovationPage?.hero?.primaryCtaUrl, base.hero.primaryCtaUrl) || '#',
      secondaryCtaText: toText(rawInnovationPage?.hero?.secondaryCtaText, base.hero.secondaryCtaText),
      secondaryCtaUrl: toText(rawInnovationPage?.hero?.secondaryCtaUrl, base.hero.secondaryCtaUrl) || '#',
    },
    focusAreas: focusAreas.length ? focusAreas : base.focusAreas,
    labCapabilities: labCapabilities.length ? labCapabilities : base.labCapabilities,
    pipeline: pipeline.length ? pipeline : base.pipeline,
    metrics: metrics.length ? metrics : base.metrics,
    featuredProjects: featuredProjects.length ? featuredProjects : base.featuredProjects,
    cta: {
      title: toText(rawInnovationPage?.cta?.title, base.cta.title),
      description: toText(rawInnovationPage?.cta?.description, base.cta.description),
      primaryText: toText(rawInnovationPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawInnovationPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
      secondaryText: toText(rawInnovationPage?.cta?.secondaryText, base.cta.secondaryText),
      secondaryUrl: toText(rawInnovationPage?.cta?.secondaryUrl, base.cta.secondaryUrl) || '#',
    },
  };
}

function defaultFacilitiesPage() {
  const referenceImage = '/facilities/facilities-reference.jpeg';

  return {
    hero: {
      eyebrow: 'Our Facilities',
      title: 'Advanced Infrastructure For RF And Microwave Excellence',
      subtitle:
        'From design and simulation to precision testing and integration, our facilities are built to deliver consistent, mission-ready outcomes.',
      primaryCtaText: 'Explore Facilities',
      primaryCtaUrl: '/facilities',
    },
    intro: {
      heading: 'Engineering, Validation, And Production Under One Roof',
      description:
        'Our ecosystem combines CAD engineering, RF testing labs, environmental verification, and assembly capabilities for complete lifecycle support.',
    },
    facilities: [
      {
        id: 'rf-lab',
        title: 'RF And Microwave Lab',
        summary: 'Design and prototyping for high-frequency subsystems.',
        details:
          'Simulation-led engineering with HFSS/CST workflows for filters, transceivers, and amplification chains from concept to prototype.',
        image: referenceImage,
      },
      {
        id: 'test-lab',
        title: 'Testing And Validation Lab',
        summary: 'Structured verification for repeatable RF performance.',
        details:
          'Includes RF characterization, insertion-loss profiling, thermal checks, and qualification evidence generation for program acceptance.',
        image: referenceImage,
      },
      {
        id: 'cad-center',
        title: 'CAD Design Center',
        summary: 'Mechanical and package design for integration readiness.',
        details:
          'Precision CAD workflows focused on manufacturability, thermal management, and stable fitment in mission-constrained platforms.',
        image: referenceImage,
      },
      {
        id: 'integration-bay',
        title: 'Assembly And Integration Facility',
        summary: 'Controlled build and final subsystem integration.',
        details:
          'Build, alignment, and interface integration checkpoints to ensure consistent output quality before customer deployment.',
        image: referenceImage,
      },
    ],
    cta: {
      title: 'Need A Facility Walkthrough For Your Program?',
      description: 'Talk with our team and plan a technical walkthrough aligned to your RF and microwave requirements.',
      primaryText: 'Schedule A Visit',
      primaryUrl: '/contact',
    },
  };
}

function normalizeFacilitiesPage(rawFacilitiesPage) {
  const base = defaultFacilitiesPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);
  const toId = (value) =>
    toText(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const facilities = toList(rawFacilitiesPage?.facilities, 8)
    .map((item, index) => {
      const fallback = base.facilities[index % base.facilities.length];
      const title = toText(item?.title, fallback.title);
      return {
        id: toId(item?.id || title || fallback.id) || fallback.id,
        title,
        summary: toText(item?.summary, fallback.summary),
        details: toText(item?.details, fallback.details),
        image: toText(item?.image, fallback.image),
      };
    })
    .filter((item) => item.title && item.summary && item.details);

  return {
    hero: {
      eyebrow: toText(rawFacilitiesPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawFacilitiesPage?.hero?.title, base.hero.title),
      subtitle: toText(rawFacilitiesPage?.hero?.subtitle, base.hero.subtitle),
      primaryCtaText: toText(rawFacilitiesPage?.hero?.primaryCtaText, base.hero.primaryCtaText),
      primaryCtaUrl: toText(rawFacilitiesPage?.hero?.primaryCtaUrl, base.hero.primaryCtaUrl) || '#',
    },
    intro: {
      heading: toText(rawFacilitiesPage?.intro?.heading, base.intro.heading),
      description: toText(rawFacilitiesPage?.intro?.description, base.intro.description),
    },
    facilities: facilities.length ? facilities : base.facilities,
    cta: {
      title: toText(rawFacilitiesPage?.cta?.title, base.cta.title),
      description: toText(rawFacilitiesPage?.cta?.description, base.cta.description),
      primaryText: toText(rawFacilitiesPage?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawFacilitiesPage?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
    },
  };
}

function defaultContactPage() {
  return {
    hero: {
      eyebrow: 'Contact Us',
      title: 'Get In Touch With Flic Microwaves',
      subtitle: 'Share your requirements and our team will respond quickly with the right support.',
    },
    form: {
      title: 'Send Us A Message',
      subtitle: 'Fill in the fields below and our team will get back to you.',
      submitText: 'Send Message',
      successMessage: 'Thank you. Your message has been sent successfully.',
      errorMessage: 'Unable to send your message right now. Please try again.',
    },
    formFields: [
      { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name', required: true, options: [] },
      { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name', required: true, options: [] },
      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@company.com', required: true, options: [] },
      { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 99999 99999', required: false, options: [] },
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Your company', required: false, options: [] },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Inquiry subject', required: true, options: [] },
      {
        key: 'inquiryType',
        label: 'Inquiry Type',
        type: 'select',
        placeholder: 'Select inquiry type',
        required: false,
        options: ['Product Inquiry', 'Technical Support', 'Custom Solution', 'Partnership'],
      },
      {
        key: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Please describe your requirement',
        required: true,
        options: [],
      },
    ],
    contactInfo: {
      emails: ['flicmicrowaves@flicmicrowaves.com'],
      phones: ['+91 40-24595000'],
      addressLines: ['Survey No. 75/2, Balapur(v),hyderabad'],
      hours: ['Monday - Friday: 9:00 AM - 6:00 PM'],
      responseTime: 'We typically respond within 2-4 business hours.',
      appointmentUrl: '/book-appointment',
      quickCallLabel: 'Call Now',
      quickEmailLabel: 'Email Us',
    },
    map: {
      title: 'Visit Our Team',
      subtitle: 'Meet us at our office location for technical discussions and project planning.',
      locationName: 'Flic Microwaves',
      address: 'Survey No. 75/2, Balapur(v),hyderabad',
      directionsUrl: 'https://maps.google.com',
    },
    highlights: [
      { title: 'Headquarters', body: 'Engineering and support teams available for consultations.' },
      { title: 'Visitor Access', body: 'Visits are by appointment for better technical coordination.' },
      { title: 'Fast Response', body: 'Our team prioritizes technical inquiries and project requests.' },
    ],
  };
}

function defaultHomeDarkIndustries() {
  return {
    eyebrow: 'Diverse Industries, One Goal',
    title: 'Built For Environments Where Failure Is Not An Option',
    subtitle:
      'Our RF and microwave systems support strategic sectors that demand precision, durability, and long-cycle reliability.',
    videoUrl: 'https://www.youtube.com/watch?v=HHXpnf4b3Kk',
    mediaEyebrow: 'Design & Manufacturing Solutions',
    mediaTitle: 'Customised RF, Microwave and mmWave solutions',
    mediaHighlight: 'mmWave',
    mediaDescription:
      'We deliver world-class, bespoke RF, microwave, and mmWave design services for broad applications. Our contract microelectronic manufacturing services for both microwave and mmWave technologies are second to none.',
    mediaButtonText: 'Learn More',
    mediaButtonUrl: '/solutions',
    items: [
      {
        title: 'Defence Programs',
        description: 'Mission-ready RF modules for tactical communication and surveillance workloads.',
        stat: '98.7% Stability',
        linkText: 'Explore Defence Solutions',
        linkUrl: '/industries',
      },
      {
        title: 'Satellite Systems',
        description: 'High-reliability chains for ground and payload communication across critical bands.',
        stat: 'Ku/Ka/X/C Bands',
        linkText: 'View Satellite Work',
        linkUrl: '/satellite-amplifiers',
      },
      {
        title: 'Telecom Infrastructure',
        description: 'Performance-focused components for dense network environments and backbone stability.',
        stat: '4G/5G Ready',
        linkText: 'See Telecom Capability',
        linkUrl: '/products',
      },
      {
        title: 'Industrial Electronics',
        description: 'Rugged RF assemblies built for long-life operation in harsh industrial conditions.',
        stat: '24/7 Deployment',
        linkText: 'Explore Applications',
        linkUrl: '/industries',
      },
    ],
  };
}

function normalizeHomeDarkIndustries(rawSection) {
  const base = defaultHomeDarkIndustries();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 8) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const items = toList(rawSection?.items, 8)
    .map((item, index) => {
      const fallback = base.items[index % base.items.length];
      return {
        title: toText(item?.title, fallback.title),
        description: toText(item?.description, fallback.description),
        stat: toText(item?.stat, fallback.stat),
        linkText: toText(item?.linkText, fallback.linkText),
        linkUrl: toText(item?.linkUrl, fallback.linkUrl) || '#',
      };
    })
    .filter((item) => item.title && item.description);

  return {
    eyebrow: toText(rawSection?.eyebrow, base.eyebrow),
    title: toText(rawSection?.title, base.title),
    subtitle: toText(rawSection?.subtitle, base.subtitle),
    videoUrl: toText(rawSection?.videoUrl, base.videoUrl),
    mediaEyebrow: toText(rawSection?.mediaEyebrow, base.mediaEyebrow),
    mediaTitle: toText(rawSection?.mediaTitle, base.mediaTitle),
    mediaHighlight: toText(rawSection?.mediaHighlight, base.mediaHighlight),
    mediaDescription: toText(rawSection?.mediaDescription, base.mediaDescription),
    mediaButtonText: toText(rawSection?.mediaButtonText, base.mediaButtonText),
    mediaButtonUrl: toText(rawSection?.mediaButtonUrl, base.mediaButtonUrl) || '#',
    items: items.length ? items : base.items,
  };
}

function defaultHomeAdvantage() {
  return {
    eyebrow: 'The Flicmicrowaves Advantage',
    title: 'Why leading engineers choose us',
    highlight: 'choose us',
    description:
      "With our expert team, cutting-edge technology, high-performance products, and committed customer service, we're the choice for businesses looking to push the boundaries of advanced RF and microwave engineering.",
    videoUrl: 'https://www.youtube.com/watch?v=HHXpnf4b3Kk',
    points: [
      {
        number: '01',
        title: 'Reliability redefined',
        description:
          'Our products are engineered for performance, resilience, and unmatched stability - critical in high-frequency applications where margins for error are near zero.',
      },
      {
        number: '02',
        title: 'Custom solutions',
        description:
          'We work closely with clients to develop tailored solutions that meet specific technical requirements and operational challenges across every sector.',
      },
      {
        number: '03',
        title: 'Agile culture',
        description:
          'In dynamic environments, an agile culture fuels creativity, innovation, and quick adaptation, empowering our customers to outpace rivals and capitalise on opportunities.',
      },
      {
        number: '04',
        title: 'Continuous innovation',
        description:
          'We constantly refine our processes, technologies, and products to meet the evolving needs of clients in the rapidly advancing field of RF technology.',
      },
    ],
  };
}

function normalizeHomeAdvantage(rawSection) {
  const base = defaultHomeAdvantage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 8) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const points = toList(rawSection?.points, 8)
    .map((item, index) => {
      const fallback = base.points[index % base.points.length];
      return {
        number: toText(item?.number, fallback.number) || String(index + 1).padStart(2, '0'),
        title: toText(item?.title, fallback.title),
        description: toText(item?.description, fallback.description),
      };
    })
    .filter((item) => item.title && item.description);

  return {
    eyebrow: toText(rawSection?.eyebrow, base.eyebrow),
    title: toText(rawSection?.title, base.title),
    highlight: toText(rawSection?.highlight, base.highlight),
    description: toText(rawSection?.description, base.description),
    videoUrl: toText(rawSection?.videoUrl, base.videoUrl),
    points: points.length ? points : base.points,
  };
}

function defaultHomeSuccessStories() {
  return {
    eyebrow: 'Success Stories',
    stories: [
      {
        heading: 'Real-world engineering successes',
        description:
          'From defence communication upgrades to satellite-linked deployments, our RF and microwave solutions are trusted in high-stakes programs where reliability and precision are essential.',
        buttonText: 'Read Case Studies',
        buttonUrl: '/blogs',
        imageUrl: '/facilities/facilities-reference.jpeg',
        imageAlt: 'Engineering team reviewing RF systems',
      },
    ],
  };
}

function normalizeHomeSuccessStories(rawSection) {
  const base = defaultHomeSuccessStories();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 24) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const legacyStory = {
    heading: toText(rawSection?.heading),
    description: toText(rawSection?.description),
    buttonText: toText(rawSection?.buttonText),
    buttonUrl: toText(rawSection?.buttonUrl),
    imageUrl: toText(rawSection?.imageUrl),
    imageAlt: toText(rawSection?.imageAlt),
  };

  const rawStories = toList(rawSection?.stories, 24);

  const normalizedStories = (rawStories.length ? rawStories : [legacyStory])
    .map((story, index) => {
      const fallback = base.stories[index % base.stories.length];
      return {
        heading: toText(story?.heading, fallback.heading),
        description: toText(story?.description, fallback.description),
        buttonText: toText(story?.buttonText, fallback.buttonText),
        buttonUrl: toText(story?.buttonUrl, fallback.buttonUrl) || '#',
        imageUrl: toText(story?.imageUrl, fallback.imageUrl),
        imageAlt: toText(story?.imageAlt, fallback.imageAlt),
      };
    })
    .filter((story) => story.heading && story.description);

  return {
    eyebrow: toText(rawSection?.eyebrow, base.eyebrow),
    stories: normalizedStories.length ? normalizedStories : base.stories,
  };
}

function defaultGallery() {
  return {
    eyebrow: 'Gallery',
    heading: 'Engineering Gallery',
    subtitle: 'Explore snapshots from our labs, teams, and mission-critical RF integration work.',
    images: [],
  };
}

function normalizeGallery(rawSection) {
  const base = defaultGallery();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 200) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const images = toList(rawSection?.images, 200)
    .map((item) => ({
      image: toText(item?.image),
      title: toText(item?.title),
      alt: toText(item?.alt),
    }))
    .filter((item) => item.image)
    .map((item) => ({
      ...item,
      alt: item.alt || item.title || 'Gallery image',
    }));

  return {
    eyebrow: toText(rawSection?.eyebrow, base.eyebrow),
    heading: toText(rawSection?.heading, base.heading),
    subtitle: toText(rawSection?.subtitle, base.subtitle),
    images,
  };
}

function normalizeContactPage(rawContactPage) {
  const base = defaultContactPage();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const allowedFieldTypes = ['text', 'email', 'tel', 'textarea', 'select'];

  const formFields = toList(rawContactPage?.formFields, 40)
    .map((item) => {
      const key = toText(item?.key)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');
      const type = toText(item?.type, 'text').toLowerCase();
      return {
        key,
        label: toText(item?.label),
        type: allowedFieldTypes.includes(type) ? type : 'text',
        placeholder: toText(item?.placeholder),
        required: Boolean(item?.required),
        options: toList(item?.options, 25)
          .map((opt) => toText(opt))
          .filter(Boolean),
      };
    })
    .filter((item) => item.key && item.label);

  const contactEmails = toList(rawContactPage?.contactInfo?.emails, 8)
    .map((item) => toText(item))
    .filter(Boolean);
  const contactPhones = toList(rawContactPage?.contactInfo?.phones, 8)
    .map((item) => toText(item))
    .filter(Boolean);
  const addressLines = toList(rawContactPage?.contactInfo?.addressLines, 8)
    .map((item) => toText(item))
    .filter(Boolean);
  const hours = toList(rawContactPage?.contactInfo?.hours, 10)
    .map((item) => toText(item))
    .filter(Boolean);

  const highlights = toList(rawContactPage?.highlights, 8)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  return {
    hero: {
      eyebrow: toText(rawContactPage?.hero?.eyebrow, base.hero.eyebrow),
      title: toText(rawContactPage?.hero?.title, base.hero.title),
      subtitle: toText(rawContactPage?.hero?.subtitle, base.hero.subtitle),
    },
    form: {
      title: toText(rawContactPage?.form?.title, base.form.title),
      subtitle: toText(rawContactPage?.form?.subtitle, base.form.subtitle),
      submitText: toText(rawContactPage?.form?.submitText, base.form.submitText),
      successMessage: toText(rawContactPage?.form?.successMessage, base.form.successMessage),
      errorMessage: toText(rawContactPage?.form?.errorMessage, base.form.errorMessage),
    },
    formFields: formFields.length ? formFields : base.formFields,
    contactInfo: {
      emails: contactEmails.length ? contactEmails : base.contactInfo.emails,
      phones: contactPhones.length ? contactPhones : base.contactInfo.phones,
      addressLines: addressLines.length ? addressLines : base.contactInfo.addressLines,
      hours: hours.length ? hours : base.contactInfo.hours,
      responseTime: toText(rawContactPage?.contactInfo?.responseTime, base.contactInfo.responseTime),
      appointmentUrl: toText(rawContactPage?.contactInfo?.appointmentUrl, base.contactInfo.appointmentUrl) || '#',
      quickCallLabel: toText(rawContactPage?.contactInfo?.quickCallLabel, base.contactInfo.quickCallLabel),
      quickEmailLabel: toText(rawContactPage?.contactInfo?.quickEmailLabel, base.contactInfo.quickEmailLabel),
    },
    map: {
      title: toText(rawContactPage?.map?.title, base.map.title),
      subtitle: toText(rawContactPage?.map?.subtitle, base.map.subtitle),
      locationName: toText(rawContactPage?.map?.locationName, base.map.locationName),
      address: toText(rawContactPage?.map?.address, base.map.address),
      directionsUrl: toText(rawContactPage?.map?.directionsUrl, base.map.directionsUrl) || '#',
    },
    highlights: highlights.length ? highlights : base.highlights,
  };
}

function defaultAbout() {
  return {
    overview: {
      eyebrow: 'Who We Are',
      title: 'Engineering RF Advantage',
      highlight: 'For Mission-Critical Systems',
      description: 'Flic Microwaves develops high-performance RF and microwave solutions for organizations where every decibel and deployment matters.',
      bannerImage: '',
      primaryCtaText: 'Talk To Our Team',
      primaryCtaUrl: '/contact',
      secondaryCtaText: 'Explore Capabilities',
      secondaryCtaUrl: '/products',
      stats: [
        { value: '25+', label: 'Years In RF Engineering' },
        { value: '500+', label: 'Programs Supported' },
        { value: '50+', label: 'Countries Served' },
        { value: '99.2%', label: 'On-Time Delivery Rate' },
      ],
    },
    journey: {
      eyebrow: 'Corporate Narrative',
      title: 'Built To Perform Where Failure Is Not An Option',
      paragraph1: 'Our operating philosophy combines precision design, disciplined validation, and field-led collaboration.',
      paragraph2: 'Across defence, telecom, and satellite ecosystems, our teams work as technical partners, not vendors.',
      image: '',
      highlights: [
        { title: 'Integrated Manufacturing', description: 'Prototype-to-production continuity.' },
        { title: 'Global Delivery Footprint', description: 'Responsive support across regions.' },
      ],
    },
    capabilities: {
      eyebrow: 'What We Deliver',
      title: 'Capability Areas',
      subtitle: 'A unified engineering stack for high-reliability communications and electronics programs.',
      items: [],
    },
    operatingModel: {
      eyebrow: 'How We Execute',
      title: 'Our Operating Model',
      subtitle: 'Structured for speed, precision, and accountability from concept through deployment.',
      items: [],
    },
    leadership: {
      eyebrow: 'Leadership',
      title: 'Leadership Journey Of Flic Microwaves',
      subtitle: 'Experienced leadership with engineering depth, execution discipline, and long-term customer commitment.',
      items: [],
    },
    missionVision: {
      missionTitle: 'Mission',
      missionText: '',
      visionTitle: 'Vision',
      visionText: '',
      valuesTitle: 'Core Values',
      valuesText: '',
    },
    timeline: {
      eyebrow: 'Our Journey',
      title: 'Timeline And Milestones',
      subtitle: 'A milestone view of how Flic Microwaves evolved from specialist engineering to strategic partnership.',
      items: [
        {
          year: '2001',
          title: 'Foundation Of Flic Microwaves',
          body: 'Flic Microwaves was established with a clear vision to build dependable RF and microwave solutions for critical communication systems.',
        },
        {
          year: '2005',
          title: 'First Major Program Win',
          body: 'Successfully delivered high-precision RF assemblies for demanding industrial and strategic applications, establishing early customer trust.',
        },
        {
          year: '2009',
          title: 'Expansion Into Defence Communications',
          body: 'Expanded engineering capabilities to support defence-grade reliability standards and mission-critical communication infrastructure.',
        },
        {
          year: '2013',
          title: 'Advanced Test And Validation Upgrade',
          body: 'Invested in stronger RF testing and validation workflows to ensure repeatable performance under operational stress conditions.',
        },
        {
          year: '2017',
          title: 'Satellite Solutions Portfolio Growth',
          body: 'Introduced specialized satellite communication subsystems for uplink and downlink chains across emerging satcom programs.',
        },
        {
          year: '2020',
          title: 'Global Delivery And Support Scale-Up',
          body: 'Strengthened international execution with improved program management, documentation discipline, and technical response agility.',
        },
      ],
    },
    globalPresence: {
      eyebrow: 'Global Presence',
      title: 'Trusted Across Strategic Programs Worldwide',
      points: [],
      stats: [],
    },
    awardsQuality: {
      awardsTitle: 'Awards And Recognition',
      awards: [],
      qualityTitle: 'Quality Management And Control',
      qualityPoints: [],
      certifications: [],
    },
    mdMessage: {
      title: 'Message From Managing Director',
      name: '',
      role: '',
      message: '',
      image: '',
    },
    cta: {
      eyebrow: 'Start A Conversation',
      title: 'Bring Your Next Program To Life With Flic Microwaves',
      description: 'We partner with teams that need speed, rigor, and engineering clarity from first requirement to field deployment.',
      primaryText: 'Contact Us',
      primaryUrl: '/contact',
      secondaryText: 'Schedule a Call',
      secondaryUrl: '/book-appointment',
    },
  };
}

function normalizeAbout(rawAbout) {
  const base = defaultAbout();
  const toText = (val, fallback = '') => (typeof val === 'string' ? val.trim() : fallback);
  const toList = (arr, max = 12) => (Array.isArray(arr) ? arr : []).slice(0, max);

  const overviewStats = toList(rawAbout?.overview?.stats, 6)
    .map((item) => ({ value: toText(item?.value), label: toText(item?.label) }))
    .filter((item) => item.value && item.label);

  const journeyHighlights = toList(rawAbout?.journey?.highlights, 6)
    .map((item) => ({ title: toText(item?.title), description: toText(item?.description) }))
    .filter((item) => item.title && item.description);

  const capabilities = toList(rawAbout?.capabilities?.items, 8)
    .map((item) => ({ title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.title && item.body);

  const operatingModel = toList(rawAbout?.operatingModel?.items, 8)
    .map((item) => ({ step: toText(item?.step), title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.step && item.title && item.body);

  const leadership = toList(rawAbout?.leadership?.items, 8)
    .map((item) => ({ name: toText(item?.name), role: toText(item?.role), bio: toText(item?.bio) }))
    .filter((item) => item.name && item.role && item.bio);

  const timeline = toList(rawAbout?.timeline?.items, 12)
    .map((item) => ({ year: toText(item?.year), title: toText(item?.title), body: toText(item?.body) }))
    .filter((item) => item.year && item.title && item.body);

  const globalPoints = toList(rawAbout?.globalPresence?.points, 10)
    .map((point) => toText(point))
    .filter(Boolean);

  const globalStats = toList(rawAbout?.globalPresence?.stats, 8)
    .map((item) => ({ value: toText(item?.value), label: toText(item?.label) }))
    .filter((item) => item.value && item.label);

  const awards = toList(rawAbout?.awardsQuality?.awards, 12)
    .map((item) => toText(item))
    .filter(Boolean);
  const qualityPoints = toList(rawAbout?.awardsQuality?.qualityPoints, 12)
    .map((item) => toText(item))
    .filter(Boolean);
  const certifications = toList(rawAbout?.awardsQuality?.certifications, 12)
    .map((item) => toText(item))
    .filter(Boolean);

  return {
    overview: {
      eyebrow: toText(rawAbout?.overview?.eyebrow, base.overview.eyebrow),
      title: toText(rawAbout?.overview?.title, base.overview.title),
      highlight: toText(rawAbout?.overview?.highlight, base.overview.highlight),
      description: toText(rawAbout?.overview?.description, base.overview.description),
      bannerImage: toText(rawAbout?.overview?.bannerImage, base.overview.bannerImage),
      primaryCtaText: toText(rawAbout?.overview?.primaryCtaText, base.overview.primaryCtaText),
      primaryCtaUrl: toText(rawAbout?.overview?.primaryCtaUrl, base.overview.primaryCtaUrl) || '#',
      secondaryCtaText: toText(rawAbout?.overview?.secondaryCtaText, base.overview.secondaryCtaText),
      secondaryCtaUrl: toText(rawAbout?.overview?.secondaryCtaUrl, base.overview.secondaryCtaUrl) || '#',
      stats: overviewStats.length ? overviewStats : base.overview.stats,
    },
    journey: {
      eyebrow: toText(rawAbout?.journey?.eyebrow, base.journey.eyebrow),
      title: toText(rawAbout?.journey?.title, base.journey.title),
      paragraph1: toText(rawAbout?.journey?.paragraph1, base.journey.paragraph1),
      paragraph2: toText(rawAbout?.journey?.paragraph2, base.journey.paragraph2),
      image: toText(rawAbout?.journey?.image, base.journey.image),
      highlights: journeyHighlights.length ? journeyHighlights : base.journey.highlights,
    },
    capabilities: {
      eyebrow: toText(rawAbout?.capabilities?.eyebrow, base.capabilities.eyebrow),
      title: toText(rawAbout?.capabilities?.title, base.capabilities.title),
      subtitle: toText(rawAbout?.capabilities?.subtitle, base.capabilities.subtitle),
      items: capabilities,
    },
    operatingModel: {
      eyebrow: toText(rawAbout?.operatingModel?.eyebrow, base.operatingModel.eyebrow),
      title: toText(rawAbout?.operatingModel?.title, base.operatingModel.title),
      subtitle: toText(rawAbout?.operatingModel?.subtitle, base.operatingModel.subtitle),
      items: operatingModel,
    },
    leadership: {
      eyebrow: toText(rawAbout?.leadership?.eyebrow, base.leadership.eyebrow),
      title: toText(rawAbout?.leadership?.title, base.leadership.title),
      subtitle: toText(rawAbout?.leadership?.subtitle, base.leadership.subtitle),
      items: leadership,
    },
    missionVision: {
      missionTitle: toText(rawAbout?.missionVision?.missionTitle, base.missionVision.missionTitle),
      missionText: toText(rawAbout?.missionVision?.missionText, base.missionVision.missionText),
      visionTitle: toText(rawAbout?.missionVision?.visionTitle, base.missionVision.visionTitle),
      visionText: toText(rawAbout?.missionVision?.visionText, base.missionVision.visionText),
      valuesTitle: toText(rawAbout?.missionVision?.valuesTitle, base.missionVision.valuesTitle),
      valuesText: toText(rawAbout?.missionVision?.valuesText, base.missionVision.valuesText),
    },
    timeline: {
      eyebrow: toText(rawAbout?.timeline?.eyebrow, base.timeline.eyebrow),
      title: toText(rawAbout?.timeline?.title, base.timeline.title),
      subtitle: toText(rawAbout?.timeline?.subtitle, base.timeline.subtitle),
      items: timeline.length ? timeline : base.timeline.items,
    },
    globalPresence: {
      eyebrow: toText(rawAbout?.globalPresence?.eyebrow, base.globalPresence.eyebrow),
      title: toText(rawAbout?.globalPresence?.title, base.globalPresence.title),
      points: globalPoints,
      stats: globalStats,
    },
    awardsQuality: {
      awardsTitle: toText(rawAbout?.awardsQuality?.awardsTitle, base.awardsQuality.awardsTitle),
      awards,
      qualityTitle: toText(rawAbout?.awardsQuality?.qualityTitle, base.awardsQuality.qualityTitle),
      qualityPoints,
      certifications,
    },
    mdMessage: {
      title: toText(rawAbout?.mdMessage?.title, base.mdMessage.title),
      name: toText(rawAbout?.mdMessage?.name, base.mdMessage.name),
      role: toText(rawAbout?.mdMessage?.role, base.mdMessage.role),
      message: toText(rawAbout?.mdMessage?.message, base.mdMessage.message),
      image: toText(rawAbout?.mdMessage?.image, base.mdMessage.image),
    },
    cta: {
      eyebrow: toText(rawAbout?.cta?.eyebrow, base.cta.eyebrow),
      title: toText(rawAbout?.cta?.title, base.cta.title),
      description: toText(rawAbout?.cta?.description, base.cta.description),
      primaryText: toText(rawAbout?.cta?.primaryText, base.cta.primaryText),
      primaryUrl: toText(rawAbout?.cta?.primaryUrl, base.cta.primaryUrl) || '#',
      secondaryText: toText(rawAbout?.cta?.secondaryText, base.cta.secondaryText),
      secondaryUrl: toText(rawAbout?.cta?.secondaryUrl, base.cta.secondaryUrl) || '#',
    },
  };
}

function normalizeContent(content) {
  const normalizeLinks = (items, max = 10) =>
    (Array.isArray(items) ? items : [])
      .map((item) => ({
        label: typeof item?.label === 'string' ? item.label.trim() : '',
        url: typeof item?.url === 'string' ? item.url.trim() : '',
      }))
      .filter((item) => item.label)
      .slice(0, max)
      .map((item) => ({
        ...item,
        url: item.url || '#',
      }));

  const normalizeStringList = (items, max = 12) =>
    (Array.isArray(items) ? items : [])
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
      .slice(0, max);

  const normalizeOfficeLocations = (items, max = 8) =>
    (Array.isArray(items) ? items : [])
      .map((item) => ({
        title: typeof item?.title === 'string' ? item.title.trim() : '',
        lines: normalizeStringList(item?.lines, 6),
      }))
      .filter((item) => item.title && item.lines.length)
      .slice(0, max);

  const base = defaultContent();
  const rawWhyChoose = content?.whyChoose || {};
  const rawSolutions = content?.solutions || {};
  const rawSolutionsPage = content?.solutionsPage || {};
  const rawIndustriesPage = content?.industriesPage || {};
  const rawCareersPage = content?.careersPage || {};
  const rawBlogsPage = content?.blogsPage || {};
  const rawInnovationPage = content?.innovationPage || {};
  const rawFacilitiesPage = content?.facilitiesPage || {};
  const rawContactPage = content?.contactPage || {};
  const rawHomeDarkIndustries = content?.homeDarkIndustries || {};
  const rawHomeAdvantage = content?.homeAdvantage || {};
  const rawHomeSuccessStories = content?.homeSuccessStories || {};
  const rawProcess = content?.process || {};
  const rawIndustries = content?.industries || {};
  const rawFeaturedProducts = content?.featuredProducts || {};
  const rawInnovation = content?.innovation || {};
  const rawGallery = content?.gallery || {};
  const rawFooter = content?.footer || {};
  const rawAbout = content?.about || {};
  const rawWhyChooseItems = Array.isArray(rawWhyChoose.items) ? rawWhyChoose.items : [];
  const rawSolutionItems = Array.isArray(rawSolutions.items) ? rawSolutions.items : [];
  const rawProcessItems = Array.isArray(rawProcess.items) ? rawProcess.items : [];
  const rawIndustryItems = Array.isArray(rawIndustries.items) ? rawIndustries.items : [];
  const rawFeaturedItems = Array.isArray(rawFeaturedProducts.items) ? rawFeaturedProducts.items : [];
  const rawInnovationPoints = Array.isArray(rawInnovation.points) ? rawInnovation.points : [];

  const whyChooseItems = rawWhyChooseItems
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 6);

  const solutionItems = rawSolutionItems
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
      buttonText: typeof item?.buttonText === 'string' ? item.buttonText.trim() : '',
      buttonUrl: typeof item?.buttonUrl === 'string' ? item.buttonUrl.trim() : '',
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      buttonText: item.buttonText || 'Learn More',
      buttonUrl: item.buttonUrl || '#',
    }));

  const processItems = rawProcessItems
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 8);

  const industryItems = rawIndustryItems
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 6);

  const featuredItems = rawFeaturedItems
    .map((item) => ({
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      description: typeof item?.description === 'string' ? item.description.trim() : '',
      buttonText: typeof item?.buttonText === 'string' ? item.buttonText.trim() : '',
      buttonUrl: typeof item?.buttonUrl === 'string' ? item.buttonUrl.trim() : '',
      image: typeof item?.image === 'string' ? item.image.trim() : '',
    }))
    .filter((item) => item.title && item.description)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      buttonText: item.buttonText || 'View Details',
      buttonUrl: item.buttonUrl || '#',
    }));

  const innovationPoints = rawInnovationPoints
    .map((point) => (typeof point === 'string' ? point.trim() : ''))
    .filter((point) => !!point)
    .slice(0, 8);
  const footerSolutionsLinks = normalizeLinks(rawFooter.solutionsLinks, 12);
  const footerCompanyLinks = normalizeLinks(rawFooter.companyLinks, 12);
  const footerBottomLinks = normalizeLinks(rawFooter.bottomLinks, 12);
  const footerSocialLinks = normalizeLinks(rawFooter.socialLinks, 10);
  const footerProductsLinks = normalizeLinks(rawFooter.productsLinks, 18);
  const footerAboutSiteLinks = normalizeLinks(rawFooter.aboutSiteLinks, 12);
  const footerQualityBadges = normalizeStringList(rawFooter.qualityBadges, 12);
  const footerOfficeLocations = normalizeOfficeLocations(rawFooter.officeLocations, 8);

  return {
    whyChoose: {
      heading: typeof rawWhyChoose.heading === 'string' ? rawWhyChoose.heading.trim() : base.whyChoose.heading,
      subtitle:
        typeof rawWhyChoose.subtitle === 'string' ? rawWhyChoose.subtitle.trim() : base.whyChoose.subtitle,
      items: whyChooseItems,
    },
    solutions: {
      heading:
        typeof rawSolutions.heading === 'string' ? rawSolutions.heading.trim() : base.solutions.heading,
      subtitle:
        typeof rawSolutions.subtitle === 'string' ? rawSolutions.subtitle.trim() : base.solutions.subtitle,
      items: solutionItems,
    },
    solutionsPage: normalizeSolutionsPage(rawSolutionsPage),
    industriesPage: normalizeIndustriesPage(rawIndustriesPage),
    careersPage: normalizeCareersPage(rawCareersPage),
    blogsPage: normalizeBlogsPage(rawBlogsPage),
    innovationPage: normalizeInnovationPage(rawInnovationPage),
    facilitiesPage: normalizeFacilitiesPage(rawFacilitiesPage),
    contactPage: normalizeContactPage(rawContactPage),
    homeDarkIndustries: normalizeHomeDarkIndustries(rawHomeDarkIndustries),
    homeAdvantage: normalizeHomeAdvantage(rawHomeAdvantage),
    homeSuccessStories: normalizeHomeSuccessStories(rawHomeSuccessStories),
    process: {
      heading: typeof rawProcess.heading === 'string' ? rawProcess.heading.trim() : base.process.heading,
      subtitle:
        typeof rawProcess.subtitle === 'string' ? rawProcess.subtitle.trim() : base.process.subtitle,
      items: processItems,
    },
    industries: {
      heading:
        typeof rawIndustries.heading === 'string' ? rawIndustries.heading.trim() : base.industries.heading,
      subtitle:
        typeof rawIndustries.subtitle === 'string'
          ? rawIndustries.subtitle.trim()
          : base.industries.subtitle,
      image: typeof rawIndustries.image === 'string' ? rawIndustries.image.trim() : base.industries.image,
      items: industryItems,
    },
    featuredProducts: {
      heading:
        typeof rawFeaturedProducts.heading === 'string'
          ? rawFeaturedProducts.heading.trim()
          : base.featuredProducts.heading,
      subtitle:
        typeof rawFeaturedProducts.subtitle === 'string'
          ? rawFeaturedProducts.subtitle.trim()
          : base.featuredProducts.subtitle,
      items: featuredItems,
    },
    innovation: {
      heading:
        typeof rawInnovation.heading === 'string'
          ? rawInnovation.heading.trim()
          : base.innovation.heading,
      description:
        typeof rawInnovation.description === 'string'
          ? rawInnovation.description.trim()
          : base.innovation.description,
      points: innovationPoints,
      buttonText:
        typeof rawInnovation.buttonText === 'string' && rawInnovation.buttonText.trim()
          ? rawInnovation.buttonText.trim()
          : 'View Research',
      buttonUrl:
        typeof rawInnovation.buttonUrl === 'string' && rawInnovation.buttonUrl.trim()
          ? rawInnovation.buttonUrl.trim()
          : '#',
      image: typeof rawInnovation.image === 'string' ? rawInnovation.image.trim() : base.innovation.image,
    },
    gallery: normalizeGallery(rawGallery),
    footer: {
      description:
        typeof rawFooter.description === 'string'
          ? rawFooter.description.trim()
          : base.footer.description,
      email: typeof rawFooter.email === 'string' ? rawFooter.email.trim() : base.footer.email,
      phone: typeof rawFooter.phone === 'string' ? rawFooter.phone.trim() : base.footer.phone,
      address: typeof rawFooter.address === 'string' ? rawFooter.address.trim() : base.footer.address,
      backgroundImage:
        typeof rawFooter.backgroundImage === 'string'
          ? rawFooter.backgroundImage.trim()
          : base.footer.backgroundImage,
      qualityBadges: footerQualityBadges,
      socialLinks: footerSocialLinks,
      officeLocations: footerOfficeLocations,
      productsLinks: footerProductsLinks,
      aboutSiteLinks: footerAboutSiteLinks,
      registeredOfficeLabel:
        typeof rawFooter.registeredOfficeLabel === 'string'
          ? rawFooter.registeredOfficeLabel.trim()
          : base.footer.registeredOfficeLabel,
      registeredOfficeAddress:
        typeof rawFooter.registeredOfficeAddress === 'string'
          ? rawFooter.registeredOfficeAddress.trim()
          : base.footer.registeredOfficeAddress,
      helpText:
        typeof rawFooter.helpText === 'string'
          ? rawFooter.helpText.trim()
          : base.footer.helpText,
      helpUrl:
        typeof rawFooter.helpUrl === 'string' && rawFooter.helpUrl.trim()
          ? rawFooter.helpUrl.trim()
          : '#',
      creditLine:
        typeof rawFooter.creditLine === 'string'
          ? rawFooter.creditLine.trim()
          : base.footer.creditLine,
      solutionsLinks: footerSolutionsLinks,
      companyLinks: footerCompanyLinks,
      bottomLinks: footerBottomLinks,
      copyright:
        typeof rawFooter.copyright === 'string'
          ? rawFooter.copyright.trim()
          : base.footer.copyright,
    },
    about: normalizeAbout(rawAbout),
  };
}

function readContent() {
  try {
    const raw = fs.readFileSync(contentPath, 'utf8');
    return normalizeContent(JSON.parse(raw));
  } catch {
    return defaultContent();
  }
}

function writeContent(content) {
  fs.writeFileSync(contentPath, JSON.stringify(normalizeContent(content), null, 2));
}

router.get('/why-choose', (_req, res) => {
  const content = readContent();
  res.json(content.whyChoose);
});

router.put('/why-choose', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    whyChoose: {
      heading: req.body.heading,
      subtitle: req.body.subtitle,
      items: req.body.items,
    },
  });

  writeContent(next);
  res.json(next.whyChoose);
});

router.get('/solutions', (_req, res) => {
  const content = readContent();
  res.json(content.solutions);
});

router.put('/solutions', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    solutions: {
      heading: req.body.heading,
      subtitle: req.body.subtitle,
      items: req.body.items,
    },
  });

  writeContent(next);
  res.json(next.solutions);
});

router.get('/solutions-page', (_req, res) => {
  const content = readContent();
  res.json(content.solutionsPage || defaultSolutionsPage());
});

router.put('/solutions-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    solutionsPage: req.body,
  });

  writeContent(next);
  res.json(next.solutionsPage);
});

router.get('/solutions-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const solutionsPage = content.solutionsPage || defaultSolutionsPage();

  if (!(section in solutionsPage)) {
    return res.status(404).json({ error: 'Unknown solutions page section' });
  }

  return res.json(solutionsPage[section]);
});

router.put('/solutions-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const solutionsPage = content.solutionsPage || defaultSolutionsPage();

  if (!(section in solutionsPage)) {
    return res.status(404).json({ error: 'Unknown solutions page section' });
  }

  const next = normalizeContent({
    ...content,
    solutionsPage: {
      ...solutionsPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.solutionsPage[section]);
});

router.delete('/solutions-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const solutionsPage = content.solutionsPage || defaultSolutionsPage();
  const defaults = defaultSolutionsPage();

  if (!(section in solutionsPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown solutions page section' });
  }

  const next = normalizeContent({
    ...content,
    solutionsPage: {
      ...solutionsPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.solutionsPage[section]);
});

router.delete('/solutions-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    solutionsPage: defaultSolutionsPage(),
  });

  writeContent(next);
  return res.json(next.solutionsPage);
});

router.get('/industries-page', (_req, res) => {
  const content = readContent();
  res.json(content.industriesPage || defaultIndustriesPage());
});

router.put('/industries-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    industriesPage: req.body,
  });

  writeContent(next);
  res.json(next.industriesPage);
});

router.get('/industries-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const industriesPage = content.industriesPage || defaultIndustriesPage();

  if (!(section in industriesPage)) {
    return res.status(404).json({ error: 'Unknown industries page section' });
  }

  return res.json(industriesPage[section]);
});

router.put('/industries-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const industriesPage = content.industriesPage || defaultIndustriesPage();

  if (!(section in industriesPage)) {
    return res.status(404).json({ error: 'Unknown industries page section' });
  }

  const next = normalizeContent({
    ...content,
    industriesPage: {
      ...industriesPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.industriesPage[section]);
});

router.delete('/industries-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const industriesPage = content.industriesPage || defaultIndustriesPage();
  const defaults = defaultIndustriesPage();

  if (!(section in industriesPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown industries page section' });
  }

  const next = normalizeContent({
    ...content,
    industriesPage: {
      ...industriesPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.industriesPage[section]);
});

router.delete('/industries-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    industriesPage: defaultIndustriesPage(),
  });

  writeContent(next);
  return res.json(next.industriesPage);
});

router.get('/careers-page', (_req, res) => {
  const content = readContent();
  res.json(content.careersPage || defaultCareersPage());
});

router.put('/careers-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    careersPage: req.body,
  });

  writeContent(next);
  res.json(next.careersPage);
});

router.get('/careers-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const careersPage = content.careersPage || defaultCareersPage();

  if (!(section in careersPage)) {
    return res.status(404).json({ error: 'Unknown careers page section' });
  }

  return res.json(careersPage[section]);
});

router.put('/careers-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const careersPage = content.careersPage || defaultCareersPage();

  if (!(section in careersPage)) {
    return res.status(404).json({ error: 'Unknown careers page section' });
  }

  const next = normalizeContent({
    ...content,
    careersPage: {
      ...careersPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.careersPage[section]);
});

router.delete('/careers-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const careersPage = content.careersPage || defaultCareersPage();
  const defaults = defaultCareersPage();

  if (!(section in careersPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown careers page section' });
  }

  const next = normalizeContent({
    ...content,
    careersPage: {
      ...careersPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.careersPage[section]);
});

router.delete('/careers-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    careersPage: defaultCareersPage(),
  });

  writeContent(next);
  return res.json(next.careersPage);
});

router.get('/blogs-page', (_req, res) => {
  const content = readContent();
  res.json(content.blogsPage || defaultBlogsPage());
});

router.put('/blogs-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    blogsPage: req.body,
  });

  writeContent(next);
  res.json(next.blogsPage);
});

router.get('/blogs-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const blogsPage = content.blogsPage || defaultBlogsPage();

  if (!(section in blogsPage)) {
    return res.status(404).json({ error: 'Unknown blogs page section' });
  }

  return res.json(blogsPage[section]);
});

router.put('/blogs-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const blogsPage = content.blogsPage || defaultBlogsPage();

  if (!(section in blogsPage)) {
    return res.status(404).json({ error: 'Unknown blogs page section' });
  }

  const next = normalizeContent({
    ...content,
    blogsPage: {
      ...blogsPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.blogsPage[section]);
});

router.delete('/blogs-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const blogsPage = content.blogsPage || defaultBlogsPage();
  const defaults = defaultBlogsPage();

  if (!(section in blogsPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown blogs page section' });
  }

  const next = normalizeContent({
    ...content,
    blogsPage: {
      ...blogsPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.blogsPage[section]);
});

router.delete('/blogs-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    blogsPage: defaultBlogsPage(),
  });

  writeContent(next);
  return res.json(next.blogsPage);
});

router.get('/innovation-page', (_req, res) => {
  const content = readContent();
  res.json(content.innovationPage || defaultInnovationPage());
});

router.put('/innovation-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    innovationPage: req.body,
  });

  writeContent(next);
  res.json(next.innovationPage);
});

router.get('/innovation-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const innovationPage = content.innovationPage || defaultInnovationPage();

  if (!(section in innovationPage)) {
    return res.status(404).json({ error: 'Unknown innovation page section' });
  }

  return res.json(innovationPage[section]);
});

router.put('/innovation-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const innovationPage = content.innovationPage || defaultInnovationPage();

  if (!(section in innovationPage)) {
    return res.status(404).json({ error: 'Unknown innovation page section' });
  }

  const next = normalizeContent({
    ...content,
    innovationPage: {
      ...innovationPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.innovationPage[section]);
});

router.delete('/innovation-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const innovationPage = content.innovationPage || defaultInnovationPage();
  const defaults = defaultInnovationPage();

  if (!(section in innovationPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown innovation page section' });
  }

  const next = normalizeContent({
    ...content,
    innovationPage: {
      ...innovationPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.innovationPage[section]);
});

router.delete('/innovation-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    innovationPage: defaultInnovationPage(),
  });

  writeContent(next);
  return res.json(next.innovationPage);
});

router.get('/facilities-page', (_req, res) => {
  const content = readContent();
  res.json(content.facilitiesPage || defaultFacilitiesPage());
});

router.put('/facilities-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    facilitiesPage: req.body,
  });

  writeContent(next);
  res.json(next.facilitiesPage);
});

router.get('/facilities-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const facilitiesPage = content.facilitiesPage || defaultFacilitiesPage();

  if (!(section in facilitiesPage)) {
    return res.status(404).json({ error: 'Unknown facilities page section' });
  }

  return res.json(facilitiesPage[section]);
});

router.put('/facilities-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const facilitiesPage = content.facilitiesPage || defaultFacilitiesPage();

  if (!(section in facilitiesPage)) {
    return res.status(404).json({ error: 'Unknown facilities page section' });
  }

  const next = normalizeContent({
    ...content,
    facilitiesPage: {
      ...facilitiesPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.facilitiesPage[section]);
});

router.delete('/facilities-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const facilitiesPage = content.facilitiesPage || defaultFacilitiesPage();
  const defaults = defaultFacilitiesPage();

  if (!(section in facilitiesPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown facilities page section' });
  }

  const next = normalizeContent({
    ...content,
    facilitiesPage: {
      ...facilitiesPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.facilitiesPage[section]);
});

router.delete('/facilities-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    facilitiesPage: defaultFacilitiesPage(),
  });

  writeContent(next);
  return res.json(next.facilitiesPage);
});

router.get('/contact-page', (_req, res) => {
  const content = readContent();
  res.json(content.contactPage || defaultContactPage());
});

router.put('/contact-page', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    contactPage: req.body,
  });

  writeContent(next);
  res.json(next.contactPage);
});

router.get('/contact-page/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const contactPage = content.contactPage || defaultContactPage();

  if (!(section in contactPage)) {
    return res.status(404).json({ error: 'Unknown contact page section' });
  }

  return res.json(contactPage[section]);
});

router.put('/contact-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const contactPage = content.contactPage || defaultContactPage();

  if (!(section in contactPage)) {
    return res.status(404).json({ error: 'Unknown contact page section' });
  }

  const next = normalizeContent({
    ...content,
    contactPage: {
      ...contactPage,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.contactPage[section]);
});

router.delete('/contact-page/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const contactPage = content.contactPage || defaultContactPage();
  const defaults = defaultContactPage();

  if (!(section in contactPage) || !(section in defaults)) {
    return res.status(404).json({ error: 'Unknown contact page section' });
  }

  const next = normalizeContent({
    ...content,
    contactPage: {
      ...contactPage,
      [section]: defaults[section],
    },
  });

  writeContent(next);
  return res.json(next.contactPage[section]);
});

router.delete('/contact-page', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    contactPage: defaultContactPage(),
  });

  writeContent(next);
  return res.json(next.contactPage);
});

router.get('/home-dark-industries', (_req, res) => {
  const content = readContent();
  res.json(content.homeDarkIndustries || defaultHomeDarkIndustries());
});

router.put('/home-dark-industries', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    homeDarkIndustries: req.body,
  });

  writeContent(next);
  res.json(next.homeDarkIndustries);
});

router.delete('/home-dark-industries', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    homeDarkIndustries: defaultHomeDarkIndustries(),
  });

  writeContent(next);
  return res.json(next.homeDarkIndustries);
});

router.get('/home-advantage', (_req, res) => {
  const content = readContent();
  res.json(content.homeAdvantage || defaultHomeAdvantage());
});

router.put('/home-advantage', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    homeAdvantage: req.body,
  });

  writeContent(next);
  res.json(next.homeAdvantage);
});

router.delete('/home-advantage', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    homeAdvantage: defaultHomeAdvantage(),
  });

  writeContent(next);
  return res.json(next.homeAdvantage);
});

router.get('/home-success-stories', (_req, res) => {
  const content = readContent();
  res.json(content.homeSuccessStories || defaultHomeSuccessStories());
});

router.put('/home-success-stories', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    homeSuccessStories: req.body,
  });

  writeContent(next);
  res.json(next.homeSuccessStories);
});

router.delete('/home-success-stories', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    homeSuccessStories: defaultHomeSuccessStories(),
  });

  writeContent(next);
  return res.json(next.homeSuccessStories);
});

router.get('/gallery', (_req, res) => {
  const content = readContent();
  res.json(content.gallery || defaultGallery());
});

router.put('/gallery', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    gallery: req.body,
  });

  writeContent(next);
  res.json(next.gallery);
});

router.delete('/gallery', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    gallery: defaultGallery(),
  });

  writeContent(next);
  return res.json(next.gallery);
});

router.post('/contact-page/submit', async (req, res) => {
  const content = readContent();
  const contactPage = content.contactPage || defaultContactPage();
  const fields = Array.isArray(contactPage.formFields) ? contactPage.formFields : [];
  const payload = req.body && typeof req.body.values === 'object' ? req.body.values : req.body;
  const values = payload && typeof payload === 'object' ? payload : {};

  const requiredMissing = fields
    .filter((field) => field.required)
    .some((field) => {
      const value = values[field.key];
      return typeof value !== 'string' || !value.trim();
    });

  if (requiredMissing) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(500).json({ error: 'Email service is not configured on server.' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const recipient = 'flicmicrowaves@flicmicrowaves.com';
  const from = process.env.SMTP_FROM || smtpUser;
  const replyTo = typeof values.email === 'string' && values.email.trim() ? values.email.trim() : undefined;

  const lines = fields.map((field) => {
    const rawValue = values[field.key];
    const value = typeof rawValue === 'string' ? rawValue.trim() : '';
    return `${field.label}: ${value || '-'}`;
  });

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const messageSubjectValue = typeof values.subject === 'string' ? values.subject.trim() : '';
  const subject = messageSubjectValue
    ? `Contact Form: ${messageSubjectValue}`
    : 'Contact Form Submission - Flic Microwaves';

  try {
    await transporter.sendMail({
      from,
      to: recipient,
      replyTo,
      subject,
      text: `New contact form submission\n\n${lines.join('\n')}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tbody>
            ${lines
              .map((line) => {
                const splitIndex = line.indexOf(':');
                const label = splitIndex > -1 ? line.slice(0, splitIndex) : line;
                const value = splitIndex > -1 ? line.slice(splitIndex + 1).trim() : '';
                return `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value || '-')}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
      `,
    });

    return res.json({ ok: true, message: contactPage?.form?.successMessage || 'Message sent successfully.' });
  } catch (error) {
    return res.status(500).json({ error: contactPage?.form?.errorMessage || 'Unable to send your message.' });
  }
});

router.get('/process', (_req, res) => {
  const content = readContent();
  res.json(content.process);
});

router.put('/process', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    process: {
      heading: req.body.heading,
      subtitle: req.body.subtitle,
      items: req.body.items,
    },
  });

  writeContent(next);
  res.json(next.process);
});

router.get('/industries', (_req, res) => {
  const content = readContent();
  res.json(content.industries);
});

router.put('/industries', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    industries: {
      heading: req.body.heading,
      subtitle: req.body.subtitle,
      image: typeof req.body.image === 'string' ? req.body.image : current.industries?.image || '',
      items: req.body.items,
    },
  });

  writeContent(next);
  res.json(next.industries);
});

router.post('/industries/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const current = readContent();
  const oldImage = current.industries?.image;
  const next = normalizeContent({
    ...current,
    industries: {
      ...current.industries,
      image: req.file.filename,
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.industries);
});

router.get('/featured-products', (_req, res) => {
  const content = readContent();
  res.json(content.featuredProducts);
});

router.put('/featured-products', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    featuredProducts: {
      heading: req.body.heading,
      subtitle: req.body.subtitle,
      items: req.body.items,
    },
  });

  writeContent(next);
  res.json(next.featuredProducts);
});

router.post('/featured-products/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  return res.json({ image: req.file.filename });
});

router.get('/innovation', (_req, res) => {
  const content = readContent();
  res.json(content.innovation);
});

router.put('/innovation', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    innovation: {
      heading: req.body.heading,
      description: req.body.description,
      points: req.body.points,
      buttonText: req.body.buttonText,
      buttonUrl: req.body.buttonUrl,
      image: typeof req.body.image === 'string' ? req.body.image : current.innovation?.image || '',
    },
  });

  writeContent(next);
  res.json(next.innovation);
});

router.post('/innovation/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const current = readContent();
  const oldImage = current.innovation?.image;
  const next = normalizeContent({
    ...current,
    innovation: {
      ...current.innovation,
      image: req.file.filename,
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.innovation);
});

router.post('/gallery/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  return res.json({ image: req.file.filename });
});

router.post('/upload/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  return res.json({ image: req.file.filename });
});

router.get('/footer', (_req, res) => {
  const content = readContent();
  res.json(content.footer);
});

router.put('/footer', auth, (req, res) => {
  const current = readContent();
  const next = normalizeContent({
    ...current,
    footer: {
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      backgroundImage:
        typeof req.body.backgroundImage === 'string'
          ? req.body.backgroundImage
          : current.footer?.backgroundImage || '',
      qualityBadges: req.body.qualityBadges,
      socialLinks: req.body.socialLinks,
      officeLocations: req.body.officeLocations,
      productsLinks: req.body.productsLinks,
      aboutSiteLinks: req.body.aboutSiteLinks,
      registeredOfficeLabel: req.body.registeredOfficeLabel,
      registeredOfficeAddress: req.body.registeredOfficeAddress,
      helpText: req.body.helpText,
      helpUrl: req.body.helpUrl,
      creditLine: req.body.creditLine,
      solutionsLinks: req.body.solutionsLinks,
      companyLinks: req.body.companyLinks,
      bottomLinks: req.body.bottomLinks,
      copyright: req.body.copyright,
    },
  });

  writeContent(next);
  res.json(next.footer);
});

router.post('/footer/background', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const current = readContent();
  const oldImage = current.footer?.backgroundImage;
  const next = normalizeContent({
    ...current,
    footer: {
      ...current.footer,
      backgroundImage: req.file.filename,
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.footer);
});

router.get('/about', (_req, res) => {
  const content = readContent();
  res.json(normalizeContent(content).about || defaultAbout());
});

router.get('/about/:section', (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const about = normalizeContent(content).about || defaultAbout();

  if (!(section in about)) {
    return res.status(404).json({ error: 'Unknown about section' });
  }

  return res.json(about[section]);
});

router.delete('/about', auth, (_req, res) => {
  const content = readContent();
  const next = normalizeContent({
    ...content,
    about: defaultAbout(),
  });

  writeContent(next);
  return res.json(next.about);
});

router.put('/about/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const about = content.about || defaultAbout();

  if (!(section in about)) {
    return res.status(404).json({ error: 'Unknown about section' });
  }

  const next = normalizeContent({
    ...content,
    about: {
      ...about,
      [section]: req.body,
    },
  });

  writeContent(next);
  return res.json(next.about[section]);
});

router.delete('/about/:section', auth, (req, res) => {
  const content = readContent();
  const section = req.params.section;
  const about = content.about || defaultAbout();
  const aboutDefaults = defaultAbout();

  if (!(section in about) || !(section in aboutDefaults)) {
    return res.status(404).json({ error: 'Unknown about section' });
  }

  const next = normalizeContent({
    ...content,
    about: {
      ...about,
      [section]: aboutDefaults[section],
    },
  });

  writeContent(next);
  return res.json(next.about[section]);
});

router.post('/about/overview-banner', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const content = readContent();
  const currentAbout = content.about || defaultAbout();
  const oldImage = currentAbout.overview?.bannerImage;
  const next = normalizeContent({
    ...content,
    about: {
      ...currentAbout,
      overview: {
        ...currentAbout.overview,
        bannerImage: req.file.filename,
      },
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.about.overview);
});

router.post('/about/journey-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const content = readContent();
  const currentAbout = content.about || defaultAbout();
  const oldImage = currentAbout.journey?.image;
  const next = normalizeContent({
    ...content,
    about: {
      ...currentAbout,
      journey: {
        ...currentAbout.journey,
        image: req.file.filename,
      },
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.about.journey);
});

router.post('/about/md-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const content = readContent();
  const currentAbout = content.about || defaultAbout();
  const oldImage = currentAbout.mdMessage?.image;
  const next = normalizeContent({
    ...content,
    about: {
      ...currentAbout,
      mdMessage: {
        ...currentAbout.mdMessage,
        image: req.file.filename,
      },
    },
  });

  writeContent(next);

  if (oldImage && oldImage !== req.file.filename && !oldImage.startsWith('http')) {
    const oldPath = path.join(uploadsDir, oldImage);
    if (fs.existsSync(oldPath)) {
      try {
        fs.unlinkSync(oldPath);
      } catch {
        // ignore file cleanup failures
      }
    }
  }

  return res.json(next.about.mdMessage);
});

module.exports = router;
