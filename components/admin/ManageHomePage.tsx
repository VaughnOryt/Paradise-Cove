

import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Testimonial, HomePageContent, LanguageCode } from '../../types';
import { TrashIcon, PlusIcon } from '../Icons';


const ManageHomePage: React.FC = () => {
    const { supportedLanguages } = useTranslation();
    const { homePageContent, updateHomePageContent, testimonials, updateTestimonials } = useAppData();
    
    const [hpc, setHpc] = useState<HomePageContent>(JSON.parse(JSON.stringify(homePageContent)));
    const [tm, setTm] = useState<Testimonial[]>(JSON.parse(JSON.stringify(testimonials)));
    
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');

    const handleHpcFieldChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: keyof Omit<HomePageContent, 'hero'>,
        field: string
    ) => {
        const { value } = e.target;
        setHpc(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            },
        }));
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setHpc(prev => {
            const newBackgroundImages = [...prev.hero.backgroundImages];
            newBackgroundImages[index] = value;
            return { ...prev, hero: { ...prev.hero, backgroundImages: newBackgroundImages } };
        });
    };

    const addHpcBackgroundImage = () => {
        setHpc(prev => ({
            ...prev,
            hero: { ...prev.hero, backgroundImages: [...prev.hero.backgroundImages, ''] }
        }));
    };
    
    const removeHpcBackgroundImage = (index: number) => {
        setHpc(prev => ({
            ...prev,
            hero: { ...prev.hero, backgroundImages: prev.hero.backgroundImages.filter((_, i) => i !== index) }
        }));
    };
    
    const handleHpcMLChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
        section: keyof HomePageContent, 
        field: string
    ) => {
        const { value } = e.target;
        setHpc((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: {
                    ...prev[section][field],
                    [activeLang]: value || ''
                }
            }
        }));
    };
    
    const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const newTm = [...tm];
        (newTm[index] as any)[name] = value;
        setTm(newTm);
    }

    const handleTestimonialMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, field: 'quote') => {
        const { value } = e.target;
        const newTm = [...tm];
        newTm[index][field] = { ...newTm[index][field], [activeLang]: value };
        setTm(newTm);
    }

    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            id: `new-${Date.now()}`,
            quote: { en: 'A fantastic new testimonial.' },
            name: 'New Guest',
            location: 'City, Country',
            image: 'https://picsum.photos/seed/new-client/100/100'
        };
        setTm([...tm, newTestimonial]);
    };

    const deleteTestimonial = (index: number) => {
        const newTm = [...tm];
        newTm.splice(index, 1);
        setTm(newTm);
    };
    
    const handleSave = (section: 'hpc' | 'testimonials') => {
        setIsSaving(true);
        setTimeout(() => {
            if (section === 'hpc') {
                updateHomePageContent(hpc);
            } else if (section === 'testimonials') {
                updateTestimonials(tm);
            }
            setIsSaving(false);
            setShowSuccess(`${section === 'hpc' ? 'Home Page' : 'Testimonials'} content saved!`);
            setTimeout(() => setShowSuccess(''), 2500);
        }, 500);
    };

    const langTabs = (
        <div className="flex border-b mb-4">
            {Object.entries(supportedLanguages).map(([code, name]) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setActiveLang(code as LanguageCode)}
                    className={`px-4 py-2 -mb-px border-b-2 text-sm sm:text-base ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}
                >
                    {name}
                </button>
            ))}
        </div>
    );
    
    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-serif text-brand-primary">Manage Home Page</h1>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">Page Content</h2>
                
                <div className="border-b pb-6 mb-6">
                    <h3 className="text-2xl font-serif text-brand-primary mb-4">Hero Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image Slideshow</label>
                            <div className="space-y-3">
                                {hpc.hero.backgroundImages.map((url, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input 
                                            type="text" 
                                            value={url} 
                                            onChange={(e) => handleHeroImageChange(e, index)} 
                                            className="w-full input"
                                            placeholder="Image URL"
                                        />
                                        {url && <img src={url} alt="preview" className="h-10 w-16 object-cover rounded"/>}
                                        <button onClick={() => removeHpcBackgroundImage(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addHpcBackgroundImage} className="mt-3 text-sm text-brand-accent hover:underline flex items-center space-x-1">
                                <PlusIcon className="w-4 h-4"/>
                                <span>Add Image</span>
                            </button>
                        </div>
                        
                        <div className="pt-2">
                           <label className="block text-sm font-medium text-gray-700 mb-2">Content Translations</label>
                           {langTabs}
                           <div className="space-y-4">
                                <div>
                                    <label htmlFor="hero-title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input id="hero-title" type="text" value={hpc.hero.title[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'hero', 'title')} className="mt-1 block w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="hero-subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                                    <textarea id="hero-subtitle" value={hpc.hero.subtitle[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'hero', 'subtitle')} rows={2} className="mt-1 block w-full input" />
                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="border-b pb-6 mb-6">
                    <h3 className="text-2xl font-serif text-brand-primary mb-4">Story Section</h3>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="story-img" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input id="story-img" type="text" name="image" value={hpc.story.image} onChange={(e) => handleHpcFieldChange(e, 'story', 'image')} className="w-full input" />
                            {hpc.story.image && <img src={hpc.story.image} alt="Story image preview" className="mt-2 rounded-md shadow-md max-h-40 object-cover" />}
                        </div>
                        <div className="pt-2">
                           <label className="block text-sm font-medium text-gray-700 mb-2">Content Translations</label>
                           {langTabs}
                           <div className="space-y-4">
                                <div>
                                    <label htmlFor="story-title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input id="story-title" type="text" value={hpc.story.title[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'story', 'title')} className="mt-1 block w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="story-p1" className="block text-sm font-medium text-gray-700">Paragraph 1</label>
                                    <textarea id="story-p1" value={hpc.story.paragraph1[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'story', 'paragraph1')} rows={4} className="mt-1 block w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="story-p2" className="block text-sm font-medium text-gray-700">Paragraph 2</label>
                                    <textarea id="story-p2" value={hpc.story.paragraph2[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'story', 'paragraph2')} rows={4} className="mt-1 block w-full input" />
                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="border-b pb-6 mb-6">
                    <h3 className="text-2xl font-serif text-brand-primary mb-4">Video Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-1">Video URL (.mp4, .webm)</label>
                            <input id="video-url" type="text" name="videoUrl" value={hpc.video.videoUrl} onChange={(e) => handleHpcFieldChange(e, 'video', 'videoUrl')} className="w-full input" />
                        </div>
                         <div>
                            <label htmlFor="thumbnail-url" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
                            <input id="thumbnail-url" type="text" name="thumbnailUrl" value={hpc.video.thumbnailUrl} onChange={(e) => handleHpcFieldChange(e, 'video', 'thumbnailUrl')} className="w-full input" />
                            {hpc.video.thumbnailUrl && <img src={hpc.video.thumbnailUrl} alt="Thumbnail preview" className="mt-2 rounded-md shadow-md max-h-40 object-cover" />}
                        </div>
                         <div className="pt-2">
                           <label className="block text-sm font-medium text-gray-700 mb-2">Content Translations</label>
                           {langTabs}
                           <div className="space-y-4">
                                <div>
                                    <label htmlFor="video-title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input id="video-title" type="text" value={hpc.video.title[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'video', 'title')} className="mt-1 block w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="video-subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                                    <textarea id="video-subtitle" value={hpc.video.subtitle[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'video', 'subtitle')} rows={2} className="mt-1 block w-full input" />
                                </div>
                           </div>
                        </div>
                    </div>
                </div>

                 <div className="border-b pb-6 mb-6">
                    <h3 className="text-2xl font-serif text-brand-primary mb-4">Location Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="location-embedUrl" className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                            <input id="location-embedUrl" type="text" name="embedUrl" value={hpc.location.embedUrl} onChange={(e) => handleHpcFieldChange(e, 'location', 'embedUrl')} className="w-full input" />
                            <p className="text-xs text-gray-500 mt-1">Go to Google Maps, find your location, click "Share", then "Embed a map". Copy the `src` URL from the iframe code and paste it here.</p>
                        </div>
                         <div className="pt-2">
                           <label className="block text-sm font-medium text-gray-700 mb-2">Content Translations</label>
                           {langTabs}
                           <div className="space-y-4">
                                <div>
                                    <label htmlFor="location-title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input id="location-title" type="text" value={hpc.location.title[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'location', 'title')} className="mt-1 block w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="location-subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                                    <textarea id="location-subtitle" value={hpc.location.subtitle[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'location', 'subtitle')} rows={2} className="mt-1 block w-full input" />
                                </div>
                                 <div>
                                    <label htmlFor="location-address" className="block text-sm font-medium text-gray-700">Address Line</label>
                                    <input id="location-address" type="text" value={hpc.location.address[activeLang] || ''} onChange={(e) => handleHpcMLChange(e, 'location', 'address')} className="mt-1 block w-full input" />
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
                
                 <button onClick={() => handleSave('hpc')} disabled={isSaving} className="bg-brand-accent text-white px-6 py-2 rounded-md hover:opacity-90 disabled:bg-gray-400">{isSaving ? 'Saving...' : 'Save Page Content'}</button>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-serif text-brand-primary mb-4">Testimonials</h2>
                <p className="text-sm text-gray-600 mb-4">Edit guest testimonials. Use the tabs to provide translations for the quote.</p>
                
                {langTabs}
                
                <div className="space-y-4 mt-4">
                     {tm.map((testimonial: Testimonial, index: number) => (
                        <div key={testimonial.id} className="p-4 border rounded-md relative">
                           <button onClick={() => deleteTestimonial(index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                               <TrashIcon className="w-5 h-5" />
                           </button>
                           <div className="space-y-3">
                                <div>
                                    <label htmlFor={`quote-${testimonial.id}`} className="block text-sm font-medium text-gray-700">Quote</label>
                                    <textarea 
                                        id={`quote-${testimonial.id}`} 
                                        rows={3}
                                        value={testimonial.quote[activeLang] || ''} 
                                        onChange={(e) => handleTestimonialMLChange(e, index, 'quote')} 
                                        className="mt-1 block w-full input" 
                                    />
                                </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor={`name-${testimonial.id}`} className="block text-sm font-medium text-gray-700">Name</label>
                                        <input id={`name-${testimonial.id}`} type="text" name="name" value={testimonial.name} onChange={(e) => handleTestimonialChange(e, index)} className="mt-1 block w-full input" />
                                    </div>
                                    <div>
                                        <label htmlFor={`location-${testimonial.id}`} className="block text-sm font-medium text-gray-700">Location</label>
                                        <input id={`location-${testimonial.id}`} type="text" name="location" value={testimonial.location} onChange={(e) => handleTestimonialChange(e, index)} className="mt-1 block w-full input" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor={`image-${testimonial.id}`} className="block text-sm font-medium text-gray-700">Client Image URL</label>
                                        <div className="flex items-center space-x-2">
                                            <input id={`image-${testimonial.id}`} type="text" name="image" value={testimonial.image} onChange={(e) => handleTestimonialChange(e, index)} className="mt-1 block w-full input" />
                                            {testimonial.image && <img src={testimonial.image} alt="client" className="w-12 h-12 rounded-full object-cover"/>}
                                        </div>
                                    </div>
                                 </div>
                           </div>
                        </div>
                    ))}
                    <div className="pt-2">
                        <button onClick={addTestimonial} className="flex items-center space-x-2 bg-gray-200 text-gray-800 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Testimonial</span>
                        </button>
                    </div>
                    <button onClick={() => handleSave('testimonials')} disabled={isSaving} className="bg-brand-accent text-white px-4 py-2 rounded-md hover:opacity-90 disabled:bg-gray-400">{isSaving ? 'Saving...' : 'Save Testimonials'}</button>
                </div>
            </div>
            
        </div>
    );
};

export default ManageHomePage;