import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, Building, Zap } from 'lucide-react';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BASE_URL = 'http://localhost:4001';

type ContactField = {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options: string[];
};

type ContactPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    submitText: string;
    successMessage: string;
    errorMessage: string;
  };
  formFields: ContactField[];
  contactInfo: {
    emails: string[];
    phones: string[];
    addressLines: string[];
    hours: string[];
    responseTime: string;
    appointmentUrl: string;
    quickCallLabel: string;
    quickEmailLabel: string;
  };
  map: {
    title: string;
    subtitle: string;
    locationName: string;
    address: string;
    directionsUrl: string;
  };
  highlights: Array<{ title: string; body: string }>;
};

const fallbackContent: ContactPageContent = {
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
    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Inquiry subject', required: true, options: [] },
    { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Please describe your requirement', required: true, options: [] },
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

const Contact = () => {
  const [content, setContent] = useState<ContactPageContent>(fallbackContent);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    fetch(`${BASE_URL}/api/home-content/contact-page`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load contact page');
        return res.json() as Promise<ContactPageContent>;
      })
      .then((data) => {
        if (mounted && data) {
          setContent(data);
        }
      })
      .catch(() => {
        if (mounted) setContent(fallbackContent);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setFormData((prev) => {
      const next: Record<string, string> = {};
      content.formFields.forEach((field) => {
        next[field.key] = prev[field.key] || '';
      });
      return next;
    });
  }, [content.formFields]);

  const defaultCallPhone = content.contactInfo.phones[0] || '';
  const defaultEmail = content.contactInfo.emails[0] || 'flicmicrowaves@flicmicrowaves.com';

  const requiredKeys = useMemo(
    () => content.formFields.filter((field) => field.required).map((field) => field.key),
    [content.formFields]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const missingRequired = requiredKeys.some((key) => !(formData[key] || '').trim());
    if (missingRequired) {
      setSubmitError('Please fill all required fields.');
      setSubmitSuccess('');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/api/home-content/contact-page/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: formData }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || content.form.errorMessage || 'Unable to send your message.');
      }

      setSubmitSuccess(data.message || content.form.successMessage);
      setFormData((prev) => {
        const cleared: Record<string, string> = {};
        Object.keys(prev).forEach((key) => {
          cleared[key] = '';
        });
        return cleared;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : content.form.errorMessage;
      setSubmitError(message || 'Unable to send your message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const bannerSrc = useCmsBanner();

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      <section className="relative bg-gradient-to-r from-black/20 via-black/10 to-transparent min-h-[350px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {bannerSrc && (
            <img
              src={bannerSrc}
              alt="Flic Microwaves banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-goldenrod/80 via-goldenrod/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/85 font-semibold mb-3">{content.hero.eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {content.hero.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed font-opensans">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl border border-goldenrod/20 shadow-lg">
                <h2 className="text-3xl font-bold text-black mb-2">{content.form.title}</h2>
                <p className="text-black/65 mb-6 font-opensans">{content.form.subtitle}</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {content.formFields.map((field) => {
                      const isTextarea = field.type === 'textarea';
                      const wrapperClass = isTextarea ? 'md:col-span-2' : '';
                      const value = formData[field.key] || '';
                      const commonClassName =
                        'w-full px-4 py-3 border border-goldenrod/30 rounded-lg focus:ring-2 focus:ring-goldenrod focus:border-goldenrod transition-all duration-300 font-opensans';

                      return (
                        <div key={field.key} className={wrapperClass}>
                          <label htmlFor={field.key} className="block text-sm font-semibold text-black mb-2">
                            {field.label} {field.required ? '*' : ''}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.key}
                              name={field.key}
                              value={value}
                              onChange={handleInputChange}
                              required={field.required}
                              rows={6}
                              className={`${commonClassName} resize-none`}
                              placeholder={field.placeholder}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              id={field.key}
                              name={field.key}
                              value={value}
                              onChange={handleInputChange}
                              required={field.required}
                              className={commonClassName}
                            >
                              <option value="">{field.placeholder || `Select ${field.label}`}</option>
                              {(field.options || []).map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || 'text'}
                              id={field.key}
                              name={field.key}
                              value={value}
                              onChange={handleInputChange}
                              required={field.required}
                              className={commonClassName}
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{submitError}</p>
                  )}
                  {submitSuccess && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{submitSuccess}</p>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-goldenrod text-white px-12 py-4 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                      <Send className="w-5 h-5" />
                      {submitting ? 'Sending...' : content.form.submitText}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-goldenrod/20 shadow-lg sticky top-24">
                <div className="mb-8">
                  <img
                    src="/images/flicmicrowaves.png"
                    alt="Flic Microwaves"
                    className="h-16 w-16 object-contain"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-4">Contact Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-goldenrod" />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">Email</p>
                          {content.contactInfo.emails.map((email) => (
                            <p key={email} className="text-black/70 text-sm font-opensans">{email}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-goldenrod" />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">Phone</p>
                          {content.contactInfo.phones.map((phone) => (
                            <p key={phone} className="text-black/70 text-sm font-opensans">{phone}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-goldenrod" />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">Address</p>
                          {content.contactInfo.addressLines.map((line, index) => (
                            <p key={`${line}-${index}`} className="text-black/70 text-sm font-opensans">{line}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-goldenrod" />
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">Business Hours</p>
                          {content.contactInfo.hours.map((line, index) => (
                            <p key={`${line}-${index}`} className="text-black/70 text-sm font-opensans">{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-goldenrod/20">
                    <h3 className="text-lg font-bold text-black mb-4">Quick Contact</h3>
                    <div className="space-y-3">
                      <a
                        href={`tel:${defaultCallPhone.replace(/\s+/g, '')}`}
                        className="w-full bg-goldenrod text-white py-3 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {content.contactInfo.quickCallLabel}
                      </a>
                      <a
                        href={`mailto:${defaultEmail}`}
                        className="w-full border-2 border-goldenrod text-goldenrod py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {content.contactInfo.quickEmailLabel}
                      </a>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-goldenrod/20">
                    <div className="bg-goldenrod/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-black text-sm mb-2">Response Time</h4>
                      <p className="text-black/70 text-sm font-opensans">
                        {content.contactInfo.responseTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-goldenrod/20">
                  <a
                    href={content.contactInfo.appointmentUrl || '/book-appointment'}
                    className="w-full bg-goldenrod/10 text-goldenrod py-4 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border-2 border-goldenrod"
                  >
                    <Clock className="w-5 h-5" />
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-goldenrod/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              {content.map.title}
            </h2>
            <p className="text-lg text-black/70 max-w-2xl mx-auto font-opensans">
              {content.map.subtitle}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-goldenrod/20 shadow-lg overflow-hidden">
            <div className="w-full h-96 bg-goldenrod/10 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-goldenrod mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">{content.map.locationName}</h3>
                <p className="text-black/70 font-opensans">{content.map.address}</p>
                <a href={content.map.directionsUrl || '#'} className="inline-flex mt-4 bg-goldenrod text-white px-6 py-2 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300">
                  Get Directions
                </a>
              </div>
              
              <div className="absolute top-6 left-6 bg-white p-4 rounded-lg shadow-lg border border-goldenrod/20 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-goldenrod rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-black">{content.map.locationName}</span>
                </div>
                <p className="text-black/70 text-sm mb-2 font-opensans">{content.map.address}</p>
                <p className="text-goldenrod text-sm font-semibold font-opensans">{content.contactInfo.hours[0] || 'Working Hours Available In Contact Info'}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {content.highlights.map((item, index) => {
              const Icon = index === 0 ? Building : index === 1 ? User : MapPin;
              return (
                <div key={`${item.title}-${index}`} className="bg-white p-6 rounded-xl border border-goldenrod/20 text-center">
                  <Icon className="w-8 h-8 text-goldenrod mx-auto mb-3" />
                  <h3 className="font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-black/70 text-sm font-opensans">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;