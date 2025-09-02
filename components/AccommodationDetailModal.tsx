
import React, { useState } from 'react';
import type { Accommodation, MultilingualString, LanguageCode } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import Modal from './Modal';
import { CurrencyDollarIcon, UsersIcon, CheckCircleIcon, CalendarIcon, SpinnerIcon } from './Icons';

interface AccommodationDetailModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  onBook: () => void;
}

const AccommodationDetailModal: React.FC<AccommodationDetailModalProps> = ({ accommodation, onClose, onBook }) => {
  const { t, language } = useTranslation();
  const [activeImage, setActiveImage] = useState(accommodation.gallery[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // FIX: Added helper function to correctly resolve multilingual strings.
  const getMLString = (mlString: MultilingualString): string => {
    return mlString[language as LanguageCode] || mlString['en'] || '';
  };

  const handleBookNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onBook();
    }, 800);
  };

  return (
    // FIX: Use `getMLString` to provide a string to the `title` prop.
    <Modal title={getMLString(accommodation.name)} onClose={onClose} size="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            {/* FIX: Use `getMLString` to provide a string for the `alt` text. */}
            <img src={activeImage} alt={t('accommodationDetailModal.mainImageAlt', { name: getMLString(accommodation.name) })} className="w-full h-96 object-cover rounded-lg shadow-md" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {accommodation.gallery.map((img, index) => (
              <button key={index} onClick={() => setActiveImage(img)} className={`rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-brand-accent' : 'border-transparent'}`}>
                {/* FIX: Use `getMLString` to provide a string for the `alt` text. */}
                <img src={img} alt={t('accommodationDetailModal.galleryImageAlt', { name: getMLString(accommodation.name), index: index + 1 })} className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-4 items-center mb-4 pb-4 border-b">
            <div className="flex items-center text-lg text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                <UsersIcon className="w-6 h-6 me-2 text-brand-accent"/>
                {/* FIX: Use `getMLString` to display the translated occupancy. */}
                <span className="font-semibold">{getMLString(accommodation.occupancy)}</span>
            </div>
             <div className="flex items-center text-lg text-gray-700 bg-gray-100 px-4 py-2 rounded-md">
                <CurrencyDollarIcon className="w-6 h-6 me-2 text-brand-accent"/>
                <span className="font-semibold">{accommodation.price}</span>
                <span className="text-sm text-gray-500 ms-1">/ {t('accommodationDetailModal.perNight')}</span>
            </div>
          </div>

          {/* FIX: Use `getMLString` to display the translated long description. */}
          <p className="text-gray-600 mb-6">{getMLString(accommodation.longDescription)}</p>

          <h4 className="text-xl font-serif text-brand-primary mb-3">{t('accommodationDetailModal.amenitiesTitle')}</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {accommodation.amenities.map(amenityKey => (
              <li key={amenityKey} className="flex items-center text-gray-700">
                <CheckCircleIcon className="w-5 h-5 text-brand-accent me-2 flex-shrink-0" />
                <span>{t(`accommodationsPage.amenities.${amenityKey}`)}</span>
              </li>
            ))}
          </ul>
          
          <button
              onClick={handleBookNow}
              disabled={isProcessing}
              className="w-full mt-8 bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-300 disabled:bg-brand-accent/70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                    <SpinnerIcon className="w-5 h-5 animate-spin"/>
                    <span>{t('accommodationDetailModal.processing')}</span>
                </>
              ) : (
                <>
                    <CalendarIcon className="w-5 h-5" />
                    <span>{t('accommodationDetailModal.bookButton')}</span>
                </>
              )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AccommodationDetailModal;
