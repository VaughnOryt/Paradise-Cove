
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { EventInfo, EventPackage, Venue, LanguageCode, MultilingualString } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';

const ManageEvents: React.FC = () => {
    const { t, supportedLanguages, language } = useTranslation();
    const { events, updateEvent } = useAppData();
    const [editingItem, setEditingItem] = useState<EventInfo | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');
    
    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleEdit = (event: EventInfo) => {
        setEditingItem(JSON.parse(JSON.stringify(event)));
    };

    const handleMLChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'title' | 'description') => {
        if (!editingItem) return;
        const { value } = e.target;
        setEditingItem({ ...editingItem, [field]: { ...editingItem[field], [activeLang]: value } });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingItem) return;
        setEditingItem({ ...editingItem, image: e.target.value });
    };

    // Package Handlers
    const handlePackageChange = (pkgIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        const packages = [...editingItem.packages];
        (packages[pkgIndex][name as keyof EventPackage] as MultilingualString)[activeLang] = value;
        setEditingItem({ ...editingItem, packages });
    };
    const addPackage = () => {
        if (!editingItem) return;
        const newPackage: EventPackage = { name: { en: 'New Package' }, description: { en: 'Description' }, features: [] };
        setEditingItem({ ...editingItem, packages: [...editingItem.packages, newPackage] });
    };
    const removePackage = (pkgIndex: number) => {
        if (!editingItem) return;
        const packages = [...editingItem.packages];
        packages.splice(pkgIndex, 1);
        setEditingItem({ ...editingItem, packages });
    };

    // Venue Handlers
    const handleVenueChange = (venIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        const venues = [...editingItem.venues];
        if (name === 'name' || name === 'description') {
            (venues[venIndex][name] as MultilingualString)[activeLang] = value;
        } else {
            (venues[venIndex] as any)[name] = value;
        }
        setEditingItem({ ...editingItem, venues });
    };
     const addVenue = () => {
        if (!editingItem) return;
        const newVenue: Venue = { name: { en: 'New Venue' }, description: { en: 'Description' }, capacity: '50', image: '' };
        setEditingItem({ ...editingItem, venues: [...editingItem.venues, newVenue] });
    };
    const removeVenue = (venIndex: number) => {
        if (!editingItem) return;
        const venues = [...editingItem.venues];
        venues.splice(venIndex, 1);
        setEditingItem({ ...editingItem, venues });
    };


    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            updateEvent(editingItem);
            setIsSaving(false);
            setEditingItem(null);
            setShowSuccess('Event content saved successfully!');
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    if (editingItem) {
        return (
             <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">Editing Event: {getMLString(editingItem.title)}</h2>
                
                <div className="flex border-b mb-6">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <button key={code} onClick={() => setActiveLang(code as LanguageCode)}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                            {name}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* General Info */}
                    <div className="p-4 border rounded-md">
                        <h3 className="text-xl font-serif text-brand-primary mb-4">General Information ({supportedLanguages[activeLang]})</h3>
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input type="text" value={editingItem.title[activeLang] || ''} onChange={e => handleMLChange(e, 'title')} className="mt-1 block w-full input" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Description</label>
                            <textarea value={editingItem.description[activeLang] || ''} onChange={e => handleMLChange(e, 'description')} rows={3} className="mt-1 block w-full input" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Header Image URL</label>
                            <input type="text" value={editingItem.image} onChange={handleImageChange} className="mt-1 block w-full input" />
                            {editingItem.image && <img src={editingItem.image} alt="preview" className="mt-2 rounded-md shadow-sm h-32 w-full object-cover"/>}
                        </div>
                    </div>

                    {/* Packages */}
                    <div className="p-4 border rounded-md">
                        <h3 className="text-xl font-serif text-brand-primary mb-4">Packages ({supportedLanguages[activeLang]})</h3>
                        <div className="space-y-4">
                            {editingItem.packages.map((pkg, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-md relative">
                                    <button onClick={() => removePackage(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium">Package Name</label>
                                            <input name="name" type="text" value={pkg.name[activeLang] || ''} onChange={e => handlePackageChange(index, e)} className="w-full input text-sm" />
                                        </div>
                                         <div>
                                            <label className="block text-xs font-medium">Description</label>
                                            <textarea name="description" value={pkg.description[activeLang] || ''} onChange={e => handlePackageChange(index, e)} rows={2} className="w-full input text-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addPackage} className="mt-4 text-sm font-medium text-white bg-brand-accent py-1 px-3 rounded hover:opacity-90">Add Package</button>
                    </div>

                    {/* Venues */}
                    <div className="p-4 border rounded-md">
                        <h3 className="text-xl font-serif text-brand-primary mb-4">Venues ({supportedLanguages[activeLang]})</h3>
                        <div className="space-y-4">
                             {editingItem.venues.map((venue, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-md relative">
                                     <button onClick={() => removeVenue(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium">Venue Name</label>
                                            <input name="name" type="text" value={venue.name[activeLang] || ''} onChange={e => handleVenueChange(index, e)} className="w-full input text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium">Image URL</label>
                                            <input name="image" type="text" value={venue.image} onChange={e => handleVenueChange(index, e)} className="w-full input text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium">Capacity</label>
                                            <input name="capacity" type="text" value={venue.capacity} onChange={e => handleVenueChange(index, e)} className="w-full input text-sm" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-xs font-medium">Description</label>
                                            <textarea name="description" value={venue.description[activeLang] || ''} onChange={e => handleVenueChange(index, e)} rows={2} className="w-full input text-sm" />
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addVenue} className="mt-4 text-sm font-medium text-white bg-brand-accent py-1 px-3 rounded hover:opacity-90">Add Venue</button>
                    </div>

                </div>
                <div className="mt-8 flex space-x-4">
                    <button onClick={handleSave} disabled={isSaving} className="bg-brand-accent text-white px-6 py-2 rounded-md hover:opacity-90 disabled:bg-gray-400">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                    <button onClick={() => setEditingItem(null)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        );
    }


    return (
        <div>
            <h1 className="text-4xl font-serif text-brand-primary mb-8">Manage Events</h1>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {events.map(event => (
                        <li key={event.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={event.image} alt={getMLString(event.title)} className="w-24 h-16 object-cover rounded-md"/>
                                <div>
                                    <h3 className="font-semibold text-lg text-brand-primary">{getMLString(event.title)}</h3>
                                    <p className="text-sm text-gray-600">{getMLString(event.description)}</p>
                                </div>
                            </div>
                            <button onClick={() => handleEdit(event)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-accent transition-colors">Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageEvents;
