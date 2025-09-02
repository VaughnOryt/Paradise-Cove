
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslation } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';
import type { DiningOption, Review, MenuItem, LanguageCode, MultilingualString } from '../types';
import { BookOpenIcon, SparklesIcon, SpinnerIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, ChevronDownIcon } from './Icons';
import Modal from './Modal';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`text-brand-accent`}
                    aria-label={`Rated ${star} star${star > 1 ? 's' : ''}`}
                    disabled
                >
                    <StarIcon filled={star <= rating} className="w-5 h-5" />
                </button>
            ))}
        </div>
    );
};


const DiningPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { diningOptions: rawDiningOptions } = useAppData();
    const [preferences, setPreferences] = useState('');
    const [stayDuration, setStayDuration] = useState('3');
    const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<DiningOption | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const getMLString = (mlString: MultilingualString | undefined): string => {
      if (!mlString) return '';
      return mlString[language as LanguageCode] || mlString['en'] || '';
    };

    // FIX: Use raw data to avoid type mismatches. Translations are done at render time.
    const allDiningOptions: DiningOption[] = rawDiningOptions;
    
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<Record<string, boolean>>({});
    
    // FIX: Use unique ID for state key instead of translatable name.
    const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>(
        allDiningOptions.reduce((acc, option) => ({ ...acc, [option.id]: 0 }), {})
    );

    // FIX: Use unique ID for state key instead of translatable name.
    const handleImageChange = (id: string, direction: 'next' | 'prev') => {
        const gallery = allDiningOptions.find(opt => opt.id === id)?.gallery;
        if (!gallery) return;

        setCurrentImageIndexes(prev => {
            const currentIndex = prev[id];
            let nextIndex;
            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % gallery.length;
            } else {
                nextIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            }
            return { ...prev, [id]: nextIndex };
        });
    };

    const handleGeneratePlan = async () => {
        if (!preferences.trim() || !stayDuration) {
            setError(t('diningPage.concierge.errors.preferencesRequired'));
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedPlan(null);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const diningOptionsString = allDiningOptions.map(d => `${getMLString(d.name)} (${getMLString(d.cuisine)}): ${getMLString(d.longDescription)}`).join('\n');
        
        const prompt = t('diningPage.concierge.gemini.prompt', {
            stayDuration: stayDuration,
            preferences: preferences,
            diningOptions: diningOptionsString,
        });

        const schema = {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              description: "A daily dining itinerary for the guest's stay.",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER, description: "The day number of the stay (e.g., 1, 2, 3)." },
                  title: { type: Type.STRING, description: "A creative title for the day's dining experience." },
                  breakfast: {
                    type: Type.OBJECT,
                    properties: {
                      recommendation: { type: Type.STRING, description: "Recommendation for breakfast, e.g., 'In-Villa Dining'." },
                      reason: { type: Type.STRING, description: "A brief, enticing reason for the recommendation." },
                    }
                  },
                  lunch: {
                    type: Type.OBJECT,
                    properties: {
                      restaurant: { type: Type.STRING, description: "The name of the recommended restaurant for lunch." },
                      dishes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific dishes to try." },
                      reason: { type: Type.STRING, description: "A brief, enticing reason for the recommendation." },
                    }
                  },
                  dinner: {
                    type: Type.OBJECT,
                    properties: {
                      restaurant: { type: Type.STRING, description: "The name of the recommended restaurant for dinner." },
                      dishes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific dishes to try." },
                      reason: { type: Type.STRING, description: "A brief, enticing reason for the recommendation." },
                    }
                  },
                }
              }
            }
          },
          required: ["itinerary"]
        };

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const jsonText = response.text.trim();
            const parsedPlan = JSON.parse(jsonText);
            setGeneratedPlan(parsedPlan);
            setShowPlanModal(true);
        } catch (e) {
            console.error(e);
            setError(t('diningPage.concierge.errors.apiError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <section className="py-24 bg-brand-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl font-serif text-brand-primary mb-4">{t('diningPage.title')}</h1>
                    <p className="text-lg text-gray-600">{t('diningPage.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {allDiningOptions.map((option) => (
                        <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                           <div className="relative overflow-hidden h-64 group">
                                <img
                                    src={option.gallery[currentImageIndexes[option.id]]}
                                    alt={getMLString(option.name)}
                                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                                />
                                <button
                                    onClick={() => handleImageChange(option.id, 'prev')}
                                    className="absolute top-1/2 start-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={t('diningPage.previousImageLabel')}
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleImageChange(option.id, 'next')}
                                    className="absolute top-1/2 end-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={t('diningPage.nextImageLabel')}
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {option.gallery.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndexes[option.id] ? 'bg-white shadow-md' : 'bg-white/50'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-2xl font-serif text-brand-primary mb-2">{getMLString(option.name)}</h3>
                                <p className="text-gray-500 text-sm mb-3 font-medium tracking-wide">{getMLString(option.cuisine)}</p>
                                <div className="mb-4">
                                    <p className="text-gray-600">
                                        {isDescriptionExpanded[option.id]
                                            ? getMLString(option.longDescription)
                                            : `${getMLString(option.longDescription).substring(0, 200)}...`}
                                    </p>
                                    <button
                                        onClick={() => setIsDescriptionExpanded(prev => ({ ...prev, [option.id]: !prev[option.id] }))}
                                        className="text-sm font-medium text-brand-accent hover:underline mt-2"
                                    >
                                        {isDescriptionExpanded[option.id] ? t('diningPage.showLess') : t('diningPage.showMore')}
                                    </button>
                                </div>
                                <div className="text-sm space-y-2 my-4">
                                    <p><span className="font-semibold">{t('diningPage.ambiance')}:</span> {getMLString(option.ambiance)}</p>
                                    <p><span className="font-semibold">{t('diningPage.dressCode')}:</span> {getMLString(option.dressCode)}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedMenu(option);
                                        const initialCollapseState = option.menu.reduce((acc, menu) => ({...acc, [getMLString(menu.category)]: false }), {});
                                        setExpandedCategories(initialCollapseState);
                                    }}
                                    className="mt-auto w-full bg-brand-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-brand-accent transition-colors duration-300 flex items-center justify-center space-x-2">
                                    <BookOpenIcon className="w-5 h-5" />
                                    <span>{t('diningPage.viewMenuButton')}</span>
                                </button>
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="text-lg font-serif text-brand-primary mb-4">{t('diningPage.reviews.title')}</h4>
                                    <div className="space-y-4">
                                        {option.reviews.length > 0 ? option.reviews.map((review, index) => (
                                            <div key={index} className="border-s-4 border-brand-accent/30 ps-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-gray-800">{review.name}</p>
                                                    <StarRating rating={review.rating} />
                                                </div>
                                                <p className="text-gray-600 italic">"{getMLString(review.comment)}"</p>
                                            </div>
                                        )) : <p className="text-gray-500 text-sm">{t('diningPage.reviews.noReviews')}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-brand-secondary p-8 md:p-12 rounded-lg shadow-lg">
                    <div>
                        <h2 className="text-4xl font-serif text-brand-primary mb-4">{t('diningPage.concierge.title')}</h2>
                        <p className="text-gray-600 mb-6">{t('diningPage.concierge.subtitle')}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">{t('diningPage.concierge.preferencesLabel')}</label>
                                <textarea
                                    id="preferences"
                                    rows={3}
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                    placeholder={t('diningPage.concierge.preferencesPlaceholder')}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">{t('diningPage.concierge.durationLabel')}</label>
                                <input
                                    type="number"
                                    id="duration"
                                    min="1"
                                    max="14"
                                    value={stayDuration}
                                    onChange={(e) => setStayDuration(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                            <button
                                onClick={handleGeneratePlan}
                                disabled={isLoading}
                                className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-300 disabled:bg-brand-accent/70 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5 animate-spin" />
                                        <span>{t('diningPage.concierge.loadingButton')}</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        <span>{t('diningPage.concierge.generateButton')}</span>
                                    </>
                                )}
                            </button>
                            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img src="https://picsum.photos/seed/concierge/600/800" alt={t('diningPage.concierge.imageAlt')} className="rounded-lg shadow-md object-cover w-full h-full"/>
                    </div>
                </div>
            </div>
        </section>

        {showPlanModal && generatedPlan && (
            <Modal title={t('diningPage.planModal.title')} onClose={() => setShowPlanModal(false)} size="4xl">
                <div className="space-y-6">
                    {generatedPlan.itinerary.map((day: any) => (
                        <div key={day.day} className="p-4 border rounded-lg bg-gray-50/50">
                            <h3 className="text-2xl font-serif text-brand-primary mb-3">{t('diningPage.planModal.dayTitle', { day: day.day, title: day.title })}</h3>
                            <div className="space-y-4 ps-4 border-s-2 border-brand-accent/50">
                                {/* Breakfast */}
                                <div className="relative">
                                     <div className="absolute -start-6 top-1.5 w-3 h-3 bg-brand-accent rounded-full border-2 border-white"></div>
                                    <p className="font-semibold text-gray-800">{t('diningPage.planModal.breakfast')}: {day.breakfast.recommendation}</p>
                                    <p className="text-gray-600 italic text-sm">"{day.breakfast.reason}"</p>
                                </div>
                                {/* Lunch */}
                                <div className="relative">
                                    <div className="absolute -start-6 top-1.5 w-3 h-3 bg-brand-accent rounded-full border-2 border-white"></div>
                                    <p className="font-semibold text-gray-800">{t('diningPage.planModal.lunch', { restaurant: day.lunch.restaurant })}</p>
                                    <p className="text-gray-600 text-sm mb-1">{t('diningPage.planModal.try')}: {day.lunch.dishes.join(', ')}</p>
                                    <p className="text-gray-600 italic text-sm">"{day.lunch.reason}"</p>
                                </div>
                                {/* Dinner */}
                                <div className="relative">
                                    <div className="absolute -start-6 top-1.5 w-3 h-3 bg-brand-accent rounded-full border-2 border-white"></div>
                                    <p className="font-semibold text-gray-800">{t('diningPage.planModal.dinner', { restaurant: day.dinner.restaurant })}</p>
                                    <p className="text-gray-600 text-sm mb-1">{t('diningPage.planModal.recommend')}: {day.dinner.dishes.join(', ')}</p>
                                    <p className="text-gray-600 italic text-sm">"{day.dinner.reason}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-center text-gray-400 mt-6">{t('diningPage.planModal.generatedBy')}</p>
            </Modal>
        )}

        {selectedMenu && (
            <Modal title={t('diningPage.menuModal.title', { name: getMLString(selectedMenu.name) })} onClose={() => setSelectedMenu(null)} size="2xl">
                <div className="space-y-2">
                    {selectedMenu.menu.map(menuCategory => (
                        <div key={getMLString(menuCategory.category)} className="border-b last:border-b-0 py-2">
                            <button
                                onClick={() => setExpandedCategories(prev => ({ ...prev, [getMLString(menuCategory.category)]: !prev[getMLString(menuCategory.category)] }))}
                                className="w-full flex justify-between items-center text-start py-2"
                            >
                                <h4 className="text-xl font-serif text-brand-primary">{getMLString(menuCategory.category)}</h4>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedCategories[getMLString(menuCategory.category)] ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategories[getMLString(menuCategory.category)] ? 'max-h-96' : 'max-h-0'}`}>
                                <ul className="space-y-2 text-gray-600 pt-3 pb-2 ps-2">
                                    {menuCategory.items.map(item => (
                                        <li key={getMLString(item)}>{getMLString(item)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        )}
        </>
    );
};

export default DiningPage;