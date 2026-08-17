import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebarLayout from './components/AdminSidebarLayout';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import BannerManager from './pages/BannerManager';
import WhyChooseManager from './pages/WhyChooseManager';
import SolutionsManager from './pages/SolutionsManager';
import ProcessManager from './pages/ProcessManager';
import IndustriesManager from './pages/IndustriesManager';
import FeaturedProductsManager from './pages/FeaturedProductsManager';
import InnovationManager from './pages/InnovationManager';
import FooterManager from './pages/FooterManager.tsx';
import AboutPageManager from './pages/AboutPageManager';
import SolutionsPageManager from './pages/SolutionsPageManager';
import IndustriesPageManager from './pages/IndustriesPageManager';
import CareersPageManager from './pages/CareersPageManager';
import BlogsPageManager from './pages/BlogsPageManager';
import InnovationPageManager from './pages/InnovationPageManager';
import FacilitiesPageManager from './pages/FacilitiesPageManager';
import ContactPageManager from './pages/ContactPageManager';
import HomeDarkIndustriesManager from './pages/HomeDarkIndustriesManager';
import HomeAdvantageManager from './pages/HomeAdvantageManager';
import HomeSuccessStoriesManager from './pages/HomeSuccessStoriesManager';
import GalleryManager from './pages/GalleryManager';

function withAdminShell(element: React.ReactNode) {
  return (
    <ProtectedRoute>
      <AdminSidebarLayout>{element}</AdminSidebarLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={withAdminShell(<ProductList />)} />
        <Route path="/products/new" element={withAdminShell(<ProductForm />)} />
        <Route path="/products/:id/edit" element={withAdminShell(<ProductForm />)} />
        <Route path="/banners" element={withAdminShell(<BannerManager />)} />
        <Route path="/home-content" element={withAdminShell(<WhyChooseManager />)} />
        <Route path="/solutions-content" element={withAdminShell(<SolutionsManager />)} />
        <Route path="/process-content" element={withAdminShell(<ProcessManager />)} />
        <Route path="/industries-content" element={withAdminShell(<IndustriesManager />)} />
        <Route path="/featured-products-content" element={withAdminShell(<FeaturedProductsManager />)} />
        <Route path="/innovation-content" element={withAdminShell(<InnovationManager />)} />
        <Route path="/home-dark-industries-content" element={withAdminShell(<HomeDarkIndustriesManager />)} />
        <Route path="/home-advantage-content" element={withAdminShell(<HomeAdvantageManager />)} />
        <Route path="/home-success-stories-content" element={withAdminShell(<HomeSuccessStoriesManager />)} />
        <Route path="/gallery-content" element={withAdminShell(<GalleryManager />)} />
        <Route path="/footer-content" element={withAdminShell(<FooterManager />)} />
        <Route path="/about-content" element={withAdminShell(<AboutPageManager />)} />
        <Route path="/about-content/:section" element={withAdminShell(<AboutPageManager />)} />
        <Route path="/solutions-page-content" element={withAdminShell(<SolutionsPageManager />)} />
        <Route path="/solutions-page-content/:section" element={withAdminShell(<SolutionsPageManager />)} />
        <Route path="/industries-page-content" element={withAdminShell(<IndustriesPageManager />)} />
        <Route path="/industries-page-content/:section" element={withAdminShell(<IndustriesPageManager />)} />
        <Route path="/careers-page-content" element={withAdminShell(<CareersPageManager />)} />
        <Route path="/careers-page-content/:section" element={withAdminShell(<CareersPageManager />)} />
        <Route path="/blogs-page-content" element={withAdminShell(<BlogsPageManager />)} />
        <Route path="/blogs-page-content/:section" element={withAdminShell(<BlogsPageManager />)} />
        <Route path="/innovation-page-content" element={withAdminShell(<InnovationPageManager />)} />
        <Route path="/innovation-page-content/:section" element={withAdminShell(<InnovationPageManager />)} />
        <Route path="/facilities-page-content" element={withAdminShell(<FacilitiesPageManager />)} />
        <Route path="/facilities-page-content/:section" element={withAdminShell(<FacilitiesPageManager />)} />
        <Route path="/contact-page-content" element={withAdminShell(<ContactPageManager />)} />
        <Route path="/contact-page-content/:section" element={withAdminShell(<ContactPageManager />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
