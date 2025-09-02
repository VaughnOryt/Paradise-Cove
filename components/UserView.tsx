

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { useTranslation } from '../contexts/LanguageContext';
import Calendar from './Calendar';
import Modal from './Modal';
import { UserIcon, CalendarIcon, ArrowRightIcon, ArrowDownIcon, MailIcon, CheckCircleIcon, SparklesIcon, TagIcon, WifiIcon, SunIcon, QuoteIcon, PlayIcon, SpinnerIcon, BookOpenIcon, UsersGroupIcon, CurrencyDollarIcon, BriefcaseIcon, RingIcon, StarIcon, GiftIcon, MapPinIcon, MusicalNoteIcon, LifebuoyIcon, BuildingLibraryIcon } from './Icons';
import type { Booking, MultilingualString, LanguageCode, Testimonial, Amenity } from '../types';
import { BookingStatus } from '../types';

const AmenityIcon: React.FC<{icon: string, className?: string}> = ({ icon, className }) => {
    switch (icon) {
        case 'SparklesIcon': return <SparklesIcon className={className} />;
        case 'TagIcon': return <TagIcon className={className} />;
        case 'WifiIcon': return <WifiIcon className={className} />;
        case 'SunIcon': return <SunIcon className={className} />;
        case 'BookOpenIcon': return <BookOpenIcon className={className} />;
        case 'UsersGroupIcon': return <UsersGroupIcon className={className} />;
        case 'CurrencyDollarIcon': return <CurrencyDollarIcon className={className} />;
        case 'BriefcaseIcon': return <BriefcaseIcon className={className} />;
        case 'RingIcon': return <RingIcon className={className} />;
        case 'StarIcon': return <StarIcon className={className} />;
        case 'GiftIcon': return <GiftIcon className={className} />;
        case 'MapPinIcon': return <MapPinIcon className={className} />;
        case 'MusicalNoteIcon': return <MusicalNoteIcon className={className} />;
        case 'LifebuoyIcon': return <LifebuoyIcon className={className} />;
        default: return null;
    }
}

const UserView: React.FC = () => {
  const { t, language } = useTranslation();
  const { 
      bookings, addBooking, 
      accommodations: rawAccommodations,
      homePageContent, 
      testimonials: rawTestimonials, 
      amenities: rawAmenities, 
      galleryImages: homeGalleryImages 
  } = useAppData();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [accommodationId, setAccommodationId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<Omit<Booking, 'id' | 'status' | 'email'> | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  
  const getMLString = (mlString: MultilingualString | undefined): string => {
    if (!mlString) return '';
    return mlString[language as LanguageCode] || mlString['en'] || '';
  };

  const accommodations = rawAccommodations;
  const galleryImages = useMemo(() => homeGalleryImages.slice(0, 8).map(img => img.src), [homeGalleryImages]);
  const amenities = rawAmenities;
  const testimonials = rawTestimonials;
  
  const testimonialPages = Math.ceil(testimonials.length / 3);
  
  useEffect(() => {
    if (testimonialPages <= 1) return;
    const timer = setInterval(() => {
        setCurrentTestimonialPage(prev => (prev + 1) % testimonialPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonialPages]);


  useEffect(() => {
    if (homePageContent.hero.backgroundImages.length <= 1) return;
    const timer = setInterval(() => {
        setCurrentHeroSlide(prev => (prev + 1) % homePageContent.hero.backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [homePageContent.hero.backgroundImages.length]);

  const handleDateSelect = (date: Date) => {
    if (errors.dates || errors.availability) {
        setErrors(prev => {
            const next = {...prev};
            delete next.dates;
            delete next.availability;
            return next;
        });
    }
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };
  
  const validateForm = (): boolean => {
      const newErrors: { [key: string]: string } = {};
      if (!guestName.trim()) {
        newErrors.guestName = t('userView.booking.errors.nameRequired');
      }
      if (!email.trim()) {
        newErrors.email = t('userView.booking.errors.emailRequired');
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = t('userView.booking.errors.emailInvalid');
      }
      if (!accommodationId) {
        newErrors.accommodation = t('userView.booking.errors.accommodationRequired');
      }
      if (!startDate || !endDate) {
        newErrors.dates = t('userView.booking.errors.datesRequired');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleBooking = () => {
    if (!validateForm()) {
      return;
    }

    setIsBooking(true);

    setTimeout(() => {
        const selectedAccommodation = accommodations.find(a => a.id === accommodationId);
        if (!selectedAccommodation) {
            setErrors({ accommodation: 'Selected accommodation not found.' });
            setIsBooking(false);
            return;
        }

        const isOverlapping = bookings.some(booking => {
            if (booking.status === BookingStatus.Cancelled || booking.accommodationId !== accommodationId) return false;
            
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            bookingStart.setHours(0,0,0,0);
            bookingEnd.setHours(0,0,0,0);
            return (startDate! < bookingEnd && endDate! > bookingStart);
        });

        if(isOverlapping){
            setErrors({ availability: t('userView.booking.errors.datesUnavailable') });
            setIsBooking(false);
            return;
        }
        
        const accommodationName = getMLString(selectedAccommodation.name);
        const newBooking = { guestName, email, startDate: startDate!, endDate: endDate!, accommodationId, accommodationName };
        addBooking(newBooking);
        setConfirmedBookingDetails({ guestName, startDate: startDate!, endDate: endDate!, accommodationId, accommodationName });
        setShowSuccessModal(true);

        setStartDate(null);
        setEndDate(null);
        setGuestName('');
        setEmail('');
        setAccommodationId('');
        setErrors({});
        setIsBooking(false);
    }, 1500);
  };
  
  const scrollToBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const bookSection = document.getElementById('book');
    if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const nights = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) : 0;
  
  const displayedTestimonials = testimonials.length <= 3 
    ? testimonials 
    : testimonials.slice(currentTestimonialPage * 3, (currentTestimonialPage + 1) * 3);


  return (
    <div>
      <section className="relative h-screen min-h-[700px] flex flex-col justify-center items-center text-white overflow-hidden">
        {homePageContent.hero.backgroundImages.map((img, index) => (
            <div
                key={index}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url(${img})`, opacity: index === currentHeroSlide ? 1 : 0 }}
            />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight mb-4">{getMLString(homePageContent.hero.title)}</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl">{getMLString(homePageContent.hero.subtitle)}</p>
        </div>
        <div className="absolute bottom-20 z-10 flex space-x-3">
            {homePageContent.hero.backgroundImages.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => setCurrentHeroSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentHeroSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                />
            ))}
        </div>
        <button onClick={scrollToBook} aria-label={t('userView.hero.scrollLabel')} className="absolute bottom-5 z-10 animate-bounce">
            <ArrowDownIcon className="w-8 h-8 text-white"/>
        </button>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <h2 className="text-5xl font-serif text-brand-primary mb-6">{getMLString(homePageContent.story.title)}</h2>
                <p className="text-lg text-gray-600 mb-4">
                {getMLString(homePageContent.story.paragraph1)}
                </p>
                <p className="text-lg text-gray-600">
                {getMLString(homePageContent.story.paragraph2)}
                </p>
            </div>
            <div className="order-1 md:order-2">
                <img src={homePageContent.story.image} alt={t('userView.story.imageAlt')} className="rounded-lg shadow-lg object-cover w-full h-full" />
            </div>
            </div>
        </div>
      </section>
      
       <section className="py-24 bg-brand-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-5xl font-serif text-brand-primary mb-4">{t('userView.amenities.title')}</h2>
                    <p className="text-lg text-gray-600">{t('userView.amenities.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {amenities.map(amenity => (
                        <div key={amenity.id} className="text-center p-8 bg-white/50 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                            <AmenityIcon icon={amenity.icon} className="w-12 h-12 text-brand-accent mb-4 mx-auto"/>
                            <h3 className="text-2xl font-serif text-brand-primary mb-2">{getMLString(amenity.name)}</h3>
                            <p className="text-gray-600">{getMLString(amenity.description)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-5xl font-serif text-brand-primary mb-4">{getMLString(homePageContent.video.title)}</h2>
                    <p className="text-lg text-gray-600">{getMLString(homePageContent.video.subtitle)}</p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setIsVideoModalOpen(true)} className="relative aspect-video rounded-lg shadow-2xl overflow-hidden group w-full focus:outline-none focus:ring-4 focus:ring-brand-accent/50">
                        <img src={homePageContent.video.thumbnailUrl} alt={getMLString(homePageContent.video.title)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 group-hover:bg-white/50 transition-all duration-300">
                               <PlayIcon className="w-16 h-16 md:w-20 md:h-20 text-white" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </section>


        <section className="py-24 bg-brand-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-5xl font-serif text-brand-primary mb-4">{t('userView.testimonials.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayedTestimonials.map((testimonial: Testimonial) => (
                        <div key={testimonial.id} className="bg-white/50 p-8 rounded-lg shadow-md flex flex-col">
                            <QuoteIcon className="w-10 h-10 text-brand-accent/50 mb-4" />
                            <p className="text-gray-600 italic mb-6 flex-grow">"{getMLString(testimonial.quote)}"</p>
                            <div className="mt-auto flex items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover me-4 border-2 border-brand-accent/50"/>
                                <div>
                                    <p className="font-semibold text-brand-primary">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {testimonialPages > 1 && (
                    <div className="flex justify-center space-x-3 mt-12">
                        {Array.from({ length: testimonialPages }).map((_, index) => (
                             <button 
                                key={index} 
                                onClick={() => setCurrentTestimonialPage(index)}
                                aria-label={`Go to testimonials page ${index + 1}`}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentTestimonialPage ? 'bg-brand-accent' : 'bg-brand-primary/20 hover:bg-brand-primary/40'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>


      <section id="book" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl font-serif text-brand-primary mb-4">{t('userView.booking.title')}</h2>
            <p className="text-lg text-gray-600">{t('userView.booking.subtitle')}</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3 bg-white p-2 sm:p-4 rounded-lg shadow-md border">
                <Calendar
                    selectedStartDate={startDate}
                    selectedEndDate={endDate}
                    onDateSelect={handleDateSelect}
                    bookings={bookings.filter(b => b.accommodationId === accommodationId)}
                />
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md sticky top-28 border">
              <h3 className="text-3xl font-serif text-brand-primary mb-6">{t('userView.booking.detailsTitle')}</h3>
              <div className="space-y-5">
                <div>
                  <div className="relative">
                    <BuildingLibraryIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1.2" />
                    <select
                      value={accommodationId}
                      onChange={(e) => {
                          setAccommodationId(e.target.value);
                          if (errors.accommodation) setErrors(prev => { const next = {...prev}; delete next.accommodation; return next; });
                          // Reset dates when accommodation changes to re-check availability
                          setStartDate(null);
                          setEndDate(null);
                      }}
                      className={`w-full ps-11 pe-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition ${errors.accommodation ? 'border-red-500' : 'border-gray-300'} ${!accommodationId ? 'text-gray-500' : 'text-gray-900'}`}
                      aria-invalid={!!errors.accommodation}
                      aria-describedby="accommodation-error"
                    >
                        <option value="" disabled>{t('userView.booking.accommodationPlaceholder')}</option>
                        {accommodations.map(acc => (
                            <option key={acc.id} value={acc.id}>{getMLString(acc.name)}</option>
                        ))}
                    </select>
                  </div>
                  {errors.accommodation && <p id="accommodation-error" className="text-red-600 text-sm mt-1">{errors.accommodation}</p>}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="text-center">
                    <span className="text-sm text-gray-500">{t('userView.booking.checkIn')}</span>
                    <p className="font-semibold text-lg">{startDate ? startDate.toLocaleDateString() : t('userView.booking.selectDate')}</p>
                  </div>
                  <ArrowRightIcon className="w-6 h-6 text-brand-accent" />
                  <div className="text-center">
                    <span className="text-sm text-gray-500">{t('userView.booking.checkOut')}</span>
                    <p className="font-semibold text-lg">{endDate ? endDate.toLocaleDateString() : t('userView.booking.selectDate')}</p>
                  </div>
                </div>
                 {nights > 0 && (
                    <div className="text-center font-medium text-gray-700 py-2 bg-brand-accent/20 rounded-md">
                        {t('userView.booking.totalStay', { count: nights })}
                    </div>
                )}
                
                <div>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1.2" />
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => {
                          setGuestName(e.target.value);
                          if (errors.guestName) setErrors(prev => { const next = {...prev}; delete next.guestName; return next; });
                      }}
                      placeholder={t('userView.booking.namePlaceholder')}
                      className={`w-full ps-11 pe-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition ${errors.guestName ? 'border-red-500' : 'border-gray-300'}`}
                      aria-invalid={!!errors.guestName}
                      aria-describedby="guestName-error"
                    />
                  </div>
                  {errors.guestName && <p id="guestName-error" className="text-red-600 text-sm mt-1">{errors.guestName}</p>}
                </div>

                <div>
                  <div className="relative">
                    <MailIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1.2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => { const next = {...prev}; delete next.email; return next; });
                      }}
                      placeholder={t('userView.booking.emailPlaceholder')}
                      className={`w-full ps-11 pe-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      aria-label={t('userView.booking.emailPlaceholder')}
                      aria-invalid={!!errors.email}
                      aria-describedby="email-error"
                    />
                  </div>
                  {errors.email && <p id="email-error" className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-300 disabled:bg-brand-accent/70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isBooking ? (
                    <>
                      <SpinnerIcon className="w-5 h-5 animate-spin" />
                      <span>{t('userView.booking.processing')}</span>
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-5 h-5" />
                      <span>{t('userView.booking.requestButton')}</span>
                    </>
                  )}
                </button>
                 {(errors.dates || errors.availability) && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                        {errors.dates || errors.availability}
                    </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-5xl font-serif text-brand-primary mb-4">{getMLString(homePageContent.location.title)}</h2>
                <p className="text-lg text-gray-600">{getMLString(homePageContent.location.subtitle)}</p>
                <div className="flex items-center justify-center mt-4 text-gray-700">
                    <MapPinIcon className="w-5 h-5 me-2 text-brand-accent"/>
                    <span>{getMLString(homePageContent.location.address)}</span>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="aspect-video rounded-lg shadow-2xl overflow-hidden border-4 border-white">
                    <iframe
                        src={homePageContent.location.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Resort Location Map"
                    ></iframe>
                </div>
            </div>
        </div>
      </section>

       <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-5xl font-serif text-brand-primary mb-4">{t('userView.moments.title')}</h2>
                    <p className="text-lg text-gray-600">{t('userView.moments.subtitle')}</p>
                </div>
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [&>*:not(:first-child)]:mt-4">
                    {galleryImages.map((src, index) => (
                         <div key={index} className="rounded-lg shadow-md overflow-hidden">
                           <button 
                                onClick={() => setSelectedGalleryImage(src)}
                                className="block w-full group focus:outline-none focus:ring-4 focus:ring-brand-accent/50"
                                aria-label={t('userView.moments.viewImageLabel', { index: index + 1 })}
                            >
                                <img 
                                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                    src={src} 
                                    alt={t('userView.moments.imageAlt', { index: index + 1 })}
                                />
                            </button>
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/gallery')}
                        className="bg-brand-accent text-white font-medium py-3 px-8 rounded-sm hover:opacity-90 transition-opacity duration-300 text-lg"
                    >
                        {t('userView.moments.viewGalleryButton')}
                    </button>
                </div>
            </div>
        </section>

      {showSuccessModal && confirmedBookingDetails && (
        <Modal title={t('userView.successModal.title')} onClose={() => setShowSuccessModal(false)}>
            <div className="text-center text-gray-600">
                <p className="mb-4">{t('userView.successModal.message', { guestName: confirmedBookingDetails.guestName })}</p>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-start space-y-1">
                    <p><span className="font-semibold text-gray-800">{t('userView.successModal.accommodation')}:</span> {confirmedBookingDetails.accommodationName}</p>
                    <p><span className="font-semibold text-gray-800">{t('userView.booking.checkIn')}:</span> {confirmedBookingDetails.startDate.toLocaleDateString()}</p>
                    <p><span className="font-semibold text-gray-800">{t('userView.booking.checkOut')}:</span> {confirmedBookingDetails.endDate.toLocaleDateString()}</p>
                </div>
            </div>
        </Modal>
      )}

      {selectedGalleryImage && (
        <Modal 
          title={t('userView.galleryModal.title', { current: galleryImages.indexOf(selectedGalleryImage) + 1, total: galleryImages.length })} 
          onClose={() => setSelectedGalleryImage(null)} 
          size="5xl"
        >
            <img 
                src={selectedGalleryImage} 
                alt={t('userView.galleryModal.imageAlt')}
                className="w-full h-auto object-contain max-h-[75vh] rounded-lg"
            />
        </Modal>
      )}

      {isVideoModalOpen && (
        <Modal title={getMLString(homePageContent.video.title)} onClose={() => setIsVideoModalOpen(false)} size="4xl">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={homePageContent.video.videoUrl} controls autoPlay className="w-full h-full">
                    Your browser does not support the video tag.
                </video>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default UserView;