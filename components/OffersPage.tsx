
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';
import type { Offer, LanguageCode, MultilingualString } from '../types';
import { CheckCircleIcon, CalendarIcon } from './Icons';

const categories: ('All' | 'Exclusive' | 'Seasonal')[] = ['All', 'Exclusive', 'Seasonal'];

const OffersPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { offers: rawOffers } = useAppData();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'All' | 'Exclusive' | 'Seasonal'>('All');

    const getMLString = (mlString: MultilingualString | undefined): string => {
        if (!mlString) return '';
        return mlString[language as LanguageCode] || mlString['en'] || '';
    };

    // FIX: Removed pre-translating useMemo to avoid type mismatches.
    const offers: Offer[] = rawOffers;

    const handleBookOffer = () => {
        navigate('/');
        setTimeout(() => {
            const bookSection = document.getElementById('book');
            if (bookSection) {
                bookSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const filteredOffers = useMemo(() => {
        if (activeFilter === 'All') {
            return offers;
        }
        return offers.filter(offer => offer.category === activeFilter);
    }, [activeFilter, offers]);


    return (
        <section className="py-24 bg-brand-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl font-serif text-brand-primary mb-4">{t('offersPage.title')}</h1>
                    <p className="text-lg text-gray-600">{t('offersPage.subtitle')}</p>
                </div>
                
                <div className="flex justify-center flex-wrap gap-4 mb-12">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-6 py-2 rounded-sm font-medium transition-colors duration-300 ${
                          activeFilter === category
                            ? 'bg-brand-accent text-white shadow'
                            : 'bg-white text-brand-primary hover:bg-brand-accent/20'
                        }`}
                      >
                        {t(`offersPage.categories.${category.toLowerCase()}`)}
                      </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredOffers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                            <div className="relative overflow-hidden h-64">
                                {/* FIX: Translate alt text at render time. */}
                                <img src={offer.image} alt={getMLString(offer.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                 <span className="absolute top-4 start-4 bg-brand-accent text-white text-sm font-medium px-3 py-1 rounded-sm">{t(`offersPage.categories.${offer.category.toLowerCase()}`)}</span>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                {/* FIX: Translate title and description at render time. */}
                                <h3 className="text-2xl font-serif text-brand-primary mb-3">{getMLString(offer.title)}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">{getMLString(offer.description)}</p>
                                <ul className="space-y-2 mb-6">
                                    {/* FIX: Translate details at render time. */}
                                    {offer.details.map((detail, i) => (
                                        <li key={i} className="flex items-center text-gray-700">
                                            <CheckCircleIcon className="w-5 h-5 text-brand-accent me-2 flex-shrink-0"/>
                                            <span>{getMLString(detail)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={handleBookOffer}
                                    className="mt-auto w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-brand-accent transition-colors duration-300 flex items-center justify-center space-x-2"
                                >
                                    <CalendarIcon className="w-5 h-5" />
                                    {/* FIX: Translate CTA at render time. */}
                                    <span>{getMLString(offer.cta)}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                 {filteredOffers.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">{t('offersPage.noOffers')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OffersPage;