
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';
import AccommodationDetailModal from './AccommodationDetailModal';
import { CheckCircleIcon } from './Icons';
import type { Accommodation, LanguageCode, MultilingualString } from '../types';

const AccommodationsPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { accommodations: rawAccommodations } = useAppData();
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
    const navigate = useNavigate();
    
    const getMLString = (mlString: MultilingualString | undefined): string => {
      if (!mlString) return '';
      return mlString[language as LanguageCode] || mlString['en'] || '';
    };

    // FIX: Removed the pre-translating useMemo to avoid type mismatches.
    // Translations will now be done at render time.
    const accommodations = rawAccommodations;

    const handleBook = () => {
        setSelectedAccommodation(null);
        navigate('/');
        setTimeout(() => {
            const bookSection = document.getElementById('book');
            if (bookSection) {
                bookSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };
    
    return (
        <>
            <section className="py-24 bg-brand-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl font-serif text-brand-primary mb-4">{t('accommodationsPage.title')}</h1>
                    <p className="text-lg text-gray-600">{t('accommodationsPage.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {accommodations.map((acc) => (
                        <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                        <div className="relative overflow-hidden h-64">
                            {/* FIX: Translate alt text at render time. */}
                            <img src={acc.image} alt={getMLString(acc.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            {/* FIX: Translate name and description at render time. */}
                            <h3 className="text-2xl font-serif text-brand-primary mb-3">{getMLString(acc.name)}</h3>
                            <p className="text-gray-600 mb-4 flex-grow">{getMLString(acc.description)}</p>
                            <ul className="space-y-2 mb-6">
                            {/* FIX: Translate features at render time. */}
                            {acc.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                <CheckCircleIcon className="w-5 h-5 text-brand-accent me-2 flex-shrink-0"/>
                                <span>{getMLString(feature)}</span>
                                </li>
                            ))}
                            </ul>
                            <button 
                              onClick={() => setSelectedAccommodation(acc)}
                              className="mt-auto w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-brand-accent transition-colors duration-300"
                            >
                              {t('accommodationsPage.viewDetailsButton')}
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </section>
            
            {/* FIX: Pass the original `selectedAccommodation` object, which is now of the correct type. */}
            {selectedAccommodation && (
                <AccommodationDetailModal
                    accommodation={selectedAccommodation}
                    onClose={() => setSelectedAccommodation(null)}
                    onBook={handleBook}
                />
            )}
        </>
    );
};

export default AccommodationsPage;