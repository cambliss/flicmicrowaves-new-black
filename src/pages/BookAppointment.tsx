import React from 'react';
import { Calendar, Clock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import useCmsBanner from '../hooks/useCmsBanner';

const BookAppointment = () => {
  const bannerSrc = useCmsBanner();

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden pt-24">
      {/* Hero Section */}
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Book an <span className="text-black">Appointment</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed font-opensans">
              Schedule a consultation with our expert team to discuss your electronic solution requirements. 
              Choose a time that works best for you from our available slots.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Left Sidebar - Information */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-goldenrod/20 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-black mb-6">Meeting Details</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-goldenrod" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm mb-1">Duration</h3>
                      <p className="text-black/70 text-sm font-opensans">30-60 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-goldenrod" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm mb-1">Meeting Type</h3>
                      <p className="text-black/70 text-sm font-opensans">Video call or phone</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-goldenrod/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-goldenrod" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm mb-1">Availability</h3>
                      <p className="text-black/70 text-sm font-opensans">Monday - Friday</p>
                      <p className="text-black/70 text-sm font-opensans">8:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                </div>

                {/* What to Expect */}
                <div className="mt-8 pt-6 border-t border-goldenrod/20">
                  <h3 className="text-lg font-bold text-black mb-4">What to Expect</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-goldenrod flex-shrink-0 mt-0.5" />
                      <span className="text-black/70 text-sm font-opensans">Requirements analysis</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-goldenrod flex-shrink-0 mt-0.5" />
                      <span className="text-black/70 text-sm font-opensans">Technical consultation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-goldenrod flex-shrink-0 mt-0.5" />
                      <span className="text-black/70 text-sm font-opensans">Solution recommendations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-goldenrod flex-shrink-0 mt-0.5" />
                      <span className="text-black/70 text-sm font-opensans">Custom quote preparation</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Contact */}
                <div className="mt-8 pt-6 border-t border-goldenrod/20">
                  <h3 className="text-lg font-bold text-black mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <Link
                      to="/contact"
                      className="w-full border-2 border-goldenrod text-goldenrod py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Contact Form
                    </Link>
                    <a
                      href="tel:+15551234567"
                      className="w-full bg-goldenrod/10 text-goldenrod py-3 rounded-lg font-semibold hover:bg-goldenrod hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Call Directly
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Embed */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-goldenrod/20 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-goldenrod/20">
                  <h2 className="text-2xl font-bold text-black mb-2">Select Your Preferred Time</h2>
                  <p className="text-black/70 font-opensans">Choose from our available appointment slots below</p>
                </div>
                
                <div className="relative">
                  <iframe
                    src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3XQH-Z_jLY2MjmWvzAl3o-TX0471vA3k3EkVX3_MfOIg3iwMj5JPxvFKuldwsCDwClFPVzMNux"
                    className="w-full h-[700px] border-0"
                    title="Book Appointment with TechCorp"
                    loading="lazy"
                  />
                  
                  {/* Fallback content if iframe doesn't load */}
                  <div className="absolute inset-0 bg-goldenrod/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="text-center">
                      <Calendar className="w-16 h-16 text-goldenrod mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-black mb-2">Loading Calendar...</h3>
                      <p className="text-black/70 font-opensans">If the calendar doesn't load, please visit the link directly</p>
                      <a
                        href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3XQH-Z_jLY2MjmWvzAl3o-TX0471vA3k3EkVX3_MfOIg3iwMj5JPxvFKuldwsCDwClFPVzMNux"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-goldenrod text-white px-6 py-3 rounded-lg font-semibold hover:bg-goldenrod/90 transition-all duration-300 pointer-events-auto"
                      >
                        Open Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-goldenrod/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Preparing for Your <span className="text-goldenrod">Consultation</span>
            </h2>
            <p className="text-lg text-black/70 max-w-2xl mx-auto font-opensans">
              To make the most of our time together, here's what you can prepare beforehand
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-goldenrod/20 text-center">
              <div className="w-12 h-12 bg-goldenrod/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-goldenrod" />
              </div>
              <h3 className="font-montserrat font-bold text-black mb-2">Project Requirements</h3>
              <h3 className="font-bold text-black mb-2">Project Requirements</h3>
              <p className="text-black/70 text-sm font-opensans">Technical specifications, performance requirements, and application details</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-goldenrod/20 text-center">
              <div className="w-12 h-12 bg-goldenrod/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-goldenrod" />
              </div>
              <h3 className="font-bold text-black mb-2">Timeline & Budget</h3>
              <p className="text-black/70 text-sm font-opensans">Project timeline, budget constraints, and delivery requirements</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-goldenrod/20 text-center">
              <div className="w-12 h-12 bg-goldenrod/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-goldenrod" />
              </div>
              <h3 className="font-bold text-black mb-2">Current Challenges</h3>
              <p className="text-black/70 text-sm font-opensans">Existing system limitations and specific challenges you're facing</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;