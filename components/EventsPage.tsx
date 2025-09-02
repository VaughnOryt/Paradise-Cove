
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslation } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';
import type { EventInfo, Venue, EventPackage, LanguageCode, MultilingualString } from '../types';
import { SparklesIcon, SpinnerIcon, CheckCircleIcon, RingIcon, BriefcaseIcon, UsersGroupIcon } from './Icons';
import Modal from './Modal';

const eventTypeKeys: ('Weddings' | 'Corporate' | 'Social')[] = ['Weddings', 'Corporate', 'Social'];

const EventIcon: React.FC<{type: string, className?: string}> = ({ type, className }) => {
    switch (type) {
        case 'Weddings': return <RingIcon className={className} />;
        case 'Corporate': return <BriefcaseIcon className={className} />;
        case 'Social': return <UsersGroupIcon className={className} />;
        default: return null;
    }
}

const EventsPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { events: rawEvents } = useAppData();
    const [activeTab, setActiveTab] = useState<'Weddings' | 'Corporate' | 'Social'>('Weddings');
    const [eventType, setEventType] = useState<'Weddings' | 'Corporate' | 'Social'>('Weddings');
    const [guestCount, setGuestCount] = useState('50');
    const [budget, setBudget] = useState('Flexible');
    const [preferences, setPreferences] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
    const [showPlanModal, setShowPlanModal] = useState(false);

    const getMLString = (mlString: MultilingualString | undefined): string => {
        if (!mlString) return '';
        return mlString[language as LanguageCode] || mlString['en'] || '';
    };
    
    // FIX: Use raw data and translate at render time to avoid type mismatches.
    const eventData: EventInfo[] = rawEvents;

    const activeEventData = useMemo(() => eventData.find(e => e.type === activeTab), [activeTab, eventData]);

    const handleGeneratePlan = async () => {
        if (!preferences.trim() || !guestCount) {
            setError(t('eventsPage.planner.errors.preferencesRequired'));
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedPlan(null);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const resortInfo = `Paradise Cove Resort offers the following venues and packages for a "${eventType}" event:
        Venues: ${activeEventData?.venues.map(v => `${getMLString(v.name)} (Capacity: ${v.capacity}) - ${getMLString(v.description)}`).join('; ')}.
        Packages: ${activeEventData?.packages.map(p => `${getMLString(p.name)} - ${getMLString(p.description)}`).join('; ')}.`;

        const prompt = t('eventsPage.planner.gemini.prompt', {
            eventType,
            guestCount,
            budget,
            preferences,
            resortInfo,
        });

        const schema = {
            type: Type.OBJECT,
            properties: {
                proposalTitle: { type: Type.STRING, description: "A creative and elegant title for the event proposal." },
                suggestedVenue: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING, description: "Why this venue is the perfect fit for the client's vision." }
                    }
                },
                eventTheme: { type: Type.STRING, description: "A suggested theme or vibe for the event (e.g., 'Tropical Elegance', 'Modern & Minimalist')." },
                sampleItinerary: {
                    type: Type.ARRAY,
                    description: "A brief, sample itinerary with 3-5 key moments.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.STRING, description: "e.g., 'Evening', 'Afternoon', '6:00 PM'" },
                            activity: { type: Type.STRING, description: "The activity or part of the event." },
                            description: { type: Type.STRING, description: "A short, enticing description of the activity." }
                        }
                    }
                },
                cateringHighlights: {
                    type: Type.ARRAY,
                    description: "A few tantalizing suggestions for food and beverage.",
                    items: { type: Type.STRING }
                },
                enhancements: {
                    type: Type.ARRAY,
                    description: "Suggestions for special touches or activities to make the event unforgettable (e.g., 'Live Band', 'Fireworks Display', 'Guided Snorkeling').",
                    items: { type: Type.STRING }
                },
                closingStatement: { type: Type.STRING, description: "A warm closing statement inviting them to connect with the human planning team." }
            },
            required: ["proposalTitle", "suggestedVenue", "eventTheme", "sampleItinerary", "cateringHighlights", "enhancements", "closingStatement"]
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
            setError(t('eventsPage.planner.errors.apiError'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const budgetOptions = useMemo(() => ([
        'Flexible',
        '$10,000 - $25,000',
        '$25,000 - $50,000',
        '$50,000 - $100,000',
        '$100,000+'
    ]), []);

    return (
        <>
            <section className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(https://picsum.photos/seed/events-hero/1920/1080)` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-4">{t('eventsPage.hero.title')}</h1>
                    <p className="text-xl md:text-2xl font-light max-w-3xl">{t('eventsPage.hero.subtitle')}</p>
                </div>
            </section>

            <section className="py-24 bg-brand-secondary" id="planner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-5xl font-serif text-brand-primary mb-4">{t('eventsPage.vision.title')}</h2>
                        <p className="text-lg text-gray-600">{t('eventsPage.vision.subtitle')}</p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-center border-b border-gray-300 mb-12">
                            {eventData.map(event => (
                                <button
                                    key={event.type}
                                    onClick={() => setActiveTab(event.type)}
                                    className={`flex items-center space-x-2 px-4 sm:px-8 py-4 text-lg font-medium transition-colors duration-300 -mb-px border-b-2 ${activeTab === event.type ? 'text-brand-accent border-brand-accent' : 'text-gray-500 border-transparent hover:text-brand-primary'}`}
                                >
                                    <EventIcon type={event.type} className="w-6 h-6"/>
                                    <span>{t(`eventsPage.categories.${event.type.toLowerCase()}`)}</span>
                                </button>
                            ))}
                        </div>

                        {activeEventData && (
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                               <div className="lg:col-span-2">
                                    <img src={activeEventData.image} alt={getMLString(activeEventData.title)} className="rounded-lg shadow-lg object-cover w-full h-full" />
                                </div>
                                <div className="lg:col-span-3">
                                    <h3 className="text-4xl font-serif text-brand-primary mb-4">{getMLString(activeEventData.title)}</h3>
                                    <p className="text-gray-600 mb-8">{getMLString(activeEventData.description)}</p>
                                    
                                    <h4 className="text-2xl font-serif text-brand-primary mb-4">{t('eventsPage.vision.packagesTitle')}</h4>
                                    <div className="space-y-4">
                                        {activeEventData.packages.map(pkg => (
                                            <div key={getMLString(pkg.name)} className="p-4 border rounded-md bg-white/50">
                                                <h5 className="font-semibold text-brand-primary">{getMLString(pkg.name)}</h5>
                                                <p className="text-sm text-gray-600">{getMLString(pkg.description)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto bg-brand-secondary p-8 md:p-12 rounded-lg shadow-lg">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-serif text-brand-primary mb-4">{t('eventsPage.planner.title')}</h2>
                            <p className="text-gray-600">{t('eventsPage.planner.subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">{t('eventsPage.planner.eventTypeLabel')}</label>
                                <select id="eventType" value={eventType} onChange={e => setEventType(e.target.value as any)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent">
                                    {eventTypeKeys.map(key => (
                                        <option key={key} value={key}>{t(`eventsPage.categories.${key.toLowerCase()}`)}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">{t('eventsPage.planner.guestCountLabel')}</label>
                                <input type="number" id="guestCount" value={guestCount} onChange={e => setGuestCount(e.target.value)} min="2" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent" />
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">{t('eventsPage.planner.budgetLabel')}</label>
                                <select id="budget" value={budget} onChange={e => setBudget(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent">
                                    {budgetOptions.map(option => (
                                        <option key={option} value={option}>{option === 'Flexible' ? t('eventsPage.planner.budgetFlexible') : option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">{t('eventsPage.planner.preferencesLabel')}</label>
                                <textarea
                                    id="preferences"
                                    rows={4}
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                    placeholder={t('eventsPage.planner.preferencesPlaceholder')}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGeneratePlan}
                            disabled={isLoading}
                            className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-all duration-300 disabled:bg-brand-accent/70 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <><SpinnerIcon className="w-5 h-5 animate-spin" /><span>{t('eventsPage.planner.loadingButton')}</span></>
                            ) : (
                                <><SparklesIcon className="w-5 h-5" /><span>{t('eventsPage.planner.generateButton')}</span></>
                            )}
                        </button>
                        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
                    </div>
                </div>
            </section>

            {showPlanModal && generatedPlan && (
                <Modal title={generatedPlan.proposalTitle} onClose={() => setShowPlanModal(false)} size="3xl">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-serif text-brand-primary border-b pb-2 mb-3">{t('eventsPage.proposalModal.theme')}</h3>
                            <p className="text-gray-600">{generatedPlan.eventTheme}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-brand-primary border-b pb-2 mb-3">{t('eventsPage.proposalModal.venue')}</h3>
                            <p className="font-semibold text-gray-800">{generatedPlan.suggestedVenue.name}</p>
                            <p className="text-gray-600 italic text-sm">"{generatedPlan.suggestedVenue.reason}"</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-brand-primary border-b pb-2 mb-3">{t('eventsPage.proposalModal.itinerary')}</h3>
                            <ul className="space-y-3">
                                {generatedPlan.sampleItinerary.map((item: any, index: number) => (
                                    <li key={index} className="flex items-start">
                                        <div className="w-28 flex-shrink-0 font-semibold text-gray-800">{item.time}</div>
                                        <div className="text-gray-600">
                                            <p className="font-medium">{item.activity}</p>
                                            <p className="text-sm">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-brand-primary border-b pb-2 mb-3">{t('eventsPage.proposalModal.catering')}</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {generatedPlan.cateringHighlights.map((item: string, index: number) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-xl font-serif text-brand-primary border-b pb-2 mb-3">{t('eventsPage.proposalModal.touches')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {generatedPlan.enhancements.map((item: string, index: number) => (
                                    <span key={index} className="bg-brand-accent/20 text-brand-primary text-sm font-medium px-3 py-1 rounded-full">{item}</span>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 text-center">
                            <p className="text-gray-700">{generatedPlan.closingStatement}</p>
                        </div>
                    </div>
                     <p className="text-xs text-center text-gray-400 mt-6">{t('eventsPage.proposalModal.generatedBy')}</p>
                </Modal>
            )}
        </>
    );
};

export default EventsPage;