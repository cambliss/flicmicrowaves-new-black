import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

type AdminSidebarLayoutProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  to: string;
};

const dashboardItems: NavItem[] = [
  { label: 'Product List', to: '/' },
  { label: 'Add Product', to: '/products/new' },
];

const homeItems: NavItem[] = [
  { label: 'Banner CMS', to: '/banners' },
  { label: 'Why Choose', to: '/home-content' },
  { label: 'Solutions', to: '/solutions-content' },
  { label: 'Process', to: '/process-content' },
  { label: 'Industries', to: '/industries-content' },
  { label: 'Featured Products', to: '/featured-products-content' },
  { label: 'Innovation', to: '/innovation-content' },
  { label: 'Home Dark Industries', to: '/home-dark-industries-content' },
  { label: 'Home Advantage', to: '/home-advantage-content' },
  { label: 'Home Success Stories', to: '/home-success-stories-content' },
  { label: 'Gallery', to: '/gallery-content' },
  { label: 'Footer', to: '/footer-content' },
];

const aboutItems: NavItem[] = [
  { label: 'Overview', to: '/about-content' },
  { label: 'Journey', to: '/about-content/journey' },
  { label: 'Capabilities', to: '/about-content/capabilities' },
  { label: 'Operating Model', to: '/about-content/operating-model' },
  { label: 'Leadership', to: '/about-content/leadership' },
  { label: 'Mission And Vision', to: '/about-content/mission-vision' },
  { label: 'Timeline', to: '/about-content/timeline' },
  { label: 'Global Presence', to: '/about-content/global-presence' },
  { label: 'Awards', to: '/about-content/awards' },
  { label: 'MD Message', to: '/about-content/md-message' },
  { label: 'Quality And ISO', to: '/about-content/quality-iso' },
  { label: 'CTA', to: '/about-content/cta' },
];

const solutionsPageItems: NavItem[] = [
  { label: 'Hero', to: '/solutions-page-content' },
  { label: 'Categories', to: '/solutions-page-content/categories' },
  { label: 'Applications', to: '/solutions-page-content/applications' },
  { label: 'Engineering Depth', to: '/solutions-page-content/engineering-depth' },
  { label: 'Quality And Compliance', to: '/solutions-page-content/quality-compliance' },
  { label: 'Lifecycle Support', to: '/solutions-page-content/lifecycle-support' },
  { label: 'Case Studies', to: '/solutions-page-content/case-studies' },
  { label: 'Metrics', to: '/solutions-page-content/metrics' },
  { label: 'Security', to: '/solutions-page-content/security' },
  { label: 'FAQ', to: '/solutions-page-content/faq' },
  { label: 'CTA', to: '/solutions-page-content/cta' },
];

const industriesPageItems: NavItem[] = [
  { label: 'Hero', to: '/industries-page-content' },
  { label: 'Sectors', to: '/industries-page-content/sectors' },
  { label: 'Capabilities', to: '/industries-page-content/capabilities' },
  { label: 'Compliance', to: '/industries-page-content/compliance' },
  { label: 'Deployment Model', to: '/industries-page-content/deployment-model' },
  { label: 'Featured Programs', to: '/industries-page-content/featured-programs' },
  { label: 'Metrics', to: '/industries-page-content/metrics' },
  { label: 'Coverage', to: '/industries-page-content/coverage' },
  { label: 'CTA', to: '/industries-page-content/cta' },
];

const careersPageItems: NavItem[] = [
  { label: 'Hero', to: '/careers-page-content' },
  { label: 'Why Join', to: '/careers-page-content/why-join' },
  { label: 'Open Roles', to: '/careers-page-content/open-roles' },
  { label: 'Culture', to: '/careers-page-content/culture' },
  { label: 'Hiring Process', to: '/careers-page-content/hiring-process' },
  { label: 'Benefits', to: '/careers-page-content/benefits' },
  { label: 'FAQ', to: '/careers-page-content/faq' },
  { label: 'CTA', to: '/careers-page-content/cta' },
];

const blogsPageItems: NavItem[] = [
  { label: 'Hero', to: '/blogs-page-content' },
  { label: 'Featured Post', to: '/blogs-page-content/featured' },
  { label: 'Categories', to: '/blogs-page-content/categories' },
  { label: 'Posts', to: '/blogs-page-content/posts' },
  { label: 'Newsletter', to: '/blogs-page-content/newsletter' },
  { label: 'CTA', to: '/blogs-page-content/cta' },
];

const innovationPageItems: NavItem[] = [
  { label: 'Hero', to: '/innovation-page-content' },
  { label: 'Focus Areas', to: '/innovation-page-content/focus-areas' },
  { label: 'Lab Capabilities', to: '/innovation-page-content/lab-capabilities' },
  { label: 'Pipeline', to: '/innovation-page-content/pipeline' },
  { label: 'Metrics', to: '/innovation-page-content/metrics' },
  { label: 'Featured Projects', to: '/innovation-page-content/featured-projects' },
  { label: 'CTA', to: '/innovation-page-content/cta' },
];

const facilitiesPageItems: NavItem[] = [
  { label: 'Hero', to: '/facilities-page-content' },
  { label: 'Intro', to: '/facilities-page-content/intro' },
  { label: 'Facilities', to: '/facilities-page-content/facilities' },
  { label: 'CTA', to: '/facilities-page-content/cta' },
];

const contactPageItems: NavItem[] = [
  { label: 'Hero', to: '/contact-page-content' },
  { label: 'Form Settings', to: '/contact-page-content/form' },
  { label: 'Form Fields', to: '/contact-page-content/form-fields' },
  { label: 'Contact Info', to: '/contact-page-content/contact-info' },
  { label: 'Map', to: '/contact-page-content/map' },
  { label: 'Highlights', to: '/contact-page-content/highlights' },
];

function SidebarGroup({
  title,
  items,
  open,
  onToggle,
}: {
  title: string;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="admin-sidebar-group">
      <button type="button" className="admin-sidebar-group-toggle" onClick={onToggle}>
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="admin-sidebar-submenu">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-sidebar-link admin-sidebar-link-sub ${isActive ? 'admin-sidebar-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [homeOpen, setHomeOpen] = useState(
    (location.pathname.includes('content') && !location.pathname.startsWith('/about-content') && !location.pathname.startsWith('/solutions-page-content') && !location.pathname.startsWith('/industries-page-content') && !location.pathname.startsWith('/careers-page-content') && !location.pathname.startsWith('/blogs-page-content') && !location.pathname.startsWith('/innovation-page-content') && !location.pathname.startsWith('/facilities-page-content') && !location.pathname.startsWith('/contact-page-content')) ||
      location.pathname === '/banners'
  );
  const [aboutOpen, setAboutOpen] = useState(location.pathname.startsWith('/about-content'));
  const [solutionsOpen, setSolutionsOpen] = useState(location.pathname.startsWith('/solutions-page-content'));
  const [industriesOpen, setIndustriesOpen] = useState(location.pathname.startsWith('/industries-page-content'));
  const [careersOpen, setCareersOpen] = useState(location.pathname.startsWith('/careers-page-content'));
  const [blogsOpen, setBlogsOpen] = useState(location.pathname.startsWith('/blogs-page-content'));
  const [innovationPageOpen, setInnovationPageOpen] = useState(location.pathname.startsWith('/innovation-page-content'));
  const [facilitiesPageOpen, setFacilitiesPageOpen] = useState(location.pathname.startsWith('/facilities-page-content'));
  const [contactPageOpen, setContactPageOpen] = useState(location.pathname.startsWith('/contact-page-content'));

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <h2>Flic Admin</h2>
          <p>CMS Dashboard</p>
        </div>

        <div className="admin-sidebar-nav">
          <div className="admin-sidebar-section">
            {dashboardItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <SidebarGroup title="Home Page" items={homeItems} open={homeOpen} onToggle={() => setHomeOpen((prev) => !prev)} />
          <SidebarGroup title="About Us Page" items={aboutItems} open={aboutOpen} onToggle={() => setAboutOpen((prev) => !prev)} />
          <SidebarGroup title="Solutions Page" items={solutionsPageItems} open={solutionsOpen} onToggle={() => setSolutionsOpen((prev) => !prev)} />
          <SidebarGroup title="Industries Page" items={industriesPageItems} open={industriesOpen} onToggle={() => setIndustriesOpen((prev) => !prev)} />
          <SidebarGroup title="Careers Page" items={careersPageItems} open={careersOpen} onToggle={() => setCareersOpen((prev) => !prev)} />
          <SidebarGroup title="Blogs Page" items={blogsPageItems} open={blogsOpen} onToggle={() => setBlogsOpen((prev) => !prev)} />
          <SidebarGroup title="Innovation Page" items={innovationPageItems} open={innovationPageOpen} onToggle={() => setInnovationPageOpen((prev) => !prev)} />
          <SidebarGroup title="Facilities Page" items={facilitiesPageItems} open={facilitiesPageOpen} onToggle={() => setFacilitiesPageOpen((prev) => !prev)} />
          <SidebarGroup title="Contact Page" items={contactPageItems} open={contactPageOpen} onToggle={() => setContactPageOpen((prev) => !prev)} />
        </div>

        <div className="admin-sidebar-footer">
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-shell-content">{children}</main>
    </div>
  );
}
