

import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Amenity, LanguageCode, MultilingualString } from '../../types';
import { PlusIcon, TrashIcon, SparklesIcon, TagIcon, WifiIcon, SunIcon, BookOpenIcon, UsersGroupIcon, CurrencyDollarIcon, BriefcaseIcon, RingIcon, StarIcon, ChevronDownIcon, GiftIcon, MapPinIcon, MusicalNoteIcon, LifebuoyIcon } from '../Icons';

const getNewAmenityTemplate = (): Omit<Amenity, 'id'> => ({
    name: { en: "New Amenity" },
    description: { en: "A brief description of this new amenity." },
    icon: 'SparklesIcon',
});

const iconOptions: Amenity['icon'][] = ['SparklesIcon', 'TagIcon', 'WifiIcon', 'SunIcon', 'BookOpenIcon', 'UsersGroupIcon', 'CurrencyDollarIcon', 'BriefcaseIcon', 'RingIcon', 'StarIcon', 'GiftIcon', 'MapPinIcon', 'MusicalNoteIcon', 'LifebuoyIcon'];

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

const ManageAmenities: React.FC = () => {
    const { supportedLanguages, language } = useTranslation();
    const { amenities, updateAmenity, addAmenity, deleteAmenity } = useAppData();
    const [editingItem, setEditingItem] = useState<Amenity | Omit<Amenity, 'id'> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleEdit = (item: Amenity) => {
        setIsCreating(false);
        setEditingItem(JSON.parse(JSON.stringify(item)));
    };

    const handleAddNew = () => {
        setIsCreating(true);
        setEditingItem(getNewAmenityTemplate());
    };
    
    const handleMLChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Amenity) => {
        if (!editingItem) return;
        const { value } = e.target;
        const currentField = editingItem[field] as MultilingualString;
        setEditingItem({ ...editingItem, [field]: { ...currentField, [activeLang]: value } });
    };

    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            if (isCreating) {
                addAmenity(editingItem as Omit<Amenity, 'id'>);
                setShowSuccess('New amenity added!');
            } else {
                updateAmenity(editingItem as Amenity);
                setShowSuccess('Amenity updated!');
            }
            setIsSaving(false);
            setEditingItem(null);
            setIsCreating(false);
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this amenity?')) {
            deleteAmenity(id);
            setShowSuccess('Amenity deleted!');
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };

    if (editingItem) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">
                    {isCreating ? 'Create New Amenity' : `Editing: ${getMLString(editingItem.name)}`}
                </h2>
                
                <div className="flex border-b mb-6">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <button key={code} onClick={() => setActiveLang(code as LanguageCode)}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                            {name}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={editingItem.name?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'name')} className="mt-1 block w-full input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={editingItem.description?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'description')} rows={2} className="mt-1 block w-full input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Icon</label>
                         <div className="relative mt-1">
                             <button type="button" onClick={() => setIsIconPickerOpen(!isIconPickerOpen)} className="relative w-full cursor-default rounded-md border border-gray-300 bg-white p-3 text-left shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent sm:text-sm">
                                <span className="flex items-center">
                                    <AmenityIcon icon={editingItem.icon} className="h-6 w-6 flex-shrink-0 text-brand-primary" />
                                    <span className="ml-3 block truncate">{editingItem.icon}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isIconPickerOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </span>
                            </button>
                            {isIconPickerOpen && (
                                <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {iconOptions.map(icon => (
                                        <li key={icon}
                                            onClick={() => {
                                                if(editingItem) setEditingItem({ ...editingItem, icon: icon as Amenity['icon'] });
                                                setIsIconPickerOpen(false);
                                            }}
                                            className="text-gray-900 relative cursor-pointer select-none p-3 hover:bg-brand-accent/10"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <AmenityIcon icon={icon} className="h-6 w-6 flex-shrink-0 text-brand-primary" />
                                                <span className="font-normal block truncate">{icon}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-brand-primary">Manage Amenities</h1>
                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-brand-accent text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add New Amenity</span>
                </button>
            </div>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {amenities.map(amenity => (
                        <li key={amenity.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="text-brand-accent">
                                   <AmenityIcon icon={amenity.icon} className="w-8 h-8"/>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-brand-primary">{getMLString(amenity.name)}</h3>
                                    <p className="text-sm text-gray-600">{getMLString(amenity.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(amenity)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-accent transition-colors">Edit</button>
                                <button onClick={() => handleDelete(amenity.id)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors" aria-label={`Delete ${getMLString(amenity.name)}`}>
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageAmenities;