
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Accommodation, LanguageCode, MultilingualString } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';

const getNewAccommodationTemplate = (): Omit<Accommodation, 'id'> => ({
    name: { en: "New Accommodation" },
    description: { en: "A brief description of this new accommodation." },
    longDescription: { en: "A longer, more detailed description for the details view." },
    occupancy: { en: "2 Adults" },
    features: [{ en: "New Feature 1" }],
    amenities: ['wifi', 'ac'],
    image: `https://picsum.photos/600/400?random=${Date.now()}`,
    gallery: [`https://picsum.photos/800/600?random=${Date.now() + 1}`],
    price: 500,
});

const ManageAccommodations: React.FC = () => {
    const { t, supportedLanguages, language } = useTranslation();
    const { accommodations, updateAccommodation, addAccommodation, deleteAccommodation } = useAppData();
    const [editingItem, setEditingItem] = useState<Accommodation | Omit<Accommodation, 'id'> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');

    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleEdit = (item: Accommodation) => {
        setIsCreating(false);
        setEditingItem(JSON.parse(JSON.stringify(item)));
    };

    const handleAddNew = () => {
        setIsCreating(true);
        setEditingItem(getNewAccommodationTemplate());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        if (['price'].includes(name)) {
            setEditingItem({ ...editingItem, [name]: parseFloat(value) || 0 });
        } else {
            setEditingItem({ ...editingItem, [name]: value });
        }
    };
    
    const handleMLChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Accommodation) => {
        if (!editingItem) return;
        const { value } = e.target;
        const currentField = editingItem[field] as MultilingualString;
        setEditingItem({ ...editingItem, [field]: { ...currentField, [activeLang]: value } });
    };
    
    const handleDynamicListChange = (index: number, value: string, field: 'gallery' | 'amenities') => {
        if (!editingItem) return;
        const list = [...(editingItem[field] as string[])];
        list[index] = value;
        setEditingItem({ ...editingItem, [field]: list });
    };
    
    const handleMLListChange = (index: number, value: string, field: 'features') => {
        if (!editingItem) return;
        const list = [...(editingItem[field] as MultilingualString[])];
        list[index] = { ...list[index], [activeLang]: value };
        setEditingItem({ ...editingItem, [field]: list });
    };

    const addListItem = (field: 'gallery' | 'amenities' | 'features') => {
        if (!editingItem) return;
        const list = [...(editingItem[field] as any[])];
        const newItem = field === 'features' ? { en: '' } : '';
        setEditingItem({ ...editingItem, [field]: [...list, newItem] });
    };

    const removeListItem = (index: number, field: 'gallery' | 'amenities' | 'features') => {
        if (!editingItem) return;
        const list = [...(editingItem[field] as any[])];
        list.splice(index, 1);
        setEditingItem({ ...editingItem, [field]: list });
    };

    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            if (isCreating) {
                addAccommodation(editingItem as Omit<Accommodation, 'id'>);
                setShowSuccess('New accommodation added!');
            } else {
                updateAccommodation(editingItem as Accommodation);
                setShowSuccess('Accommodation updated!');
            }
            setIsSaving(false);
            setEditingItem(null);
            setIsCreating(false);
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this accommodation?')) {
            deleteAccommodation(id);
            setShowSuccess('Accommodation deleted!');
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };

    if (editingItem) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">
                    {isCreating ? 'Create New Accommodation' : `Editing: ${getMLString(editingItem.name)}`}
                </h2>
                
                <div className="flex border-b mb-6">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <button key={code} onClick={() => setActiveLang(code as LanguageCode)}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                            {name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Multilingual Fields */}
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" value={editingItem.name?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'name')} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Short Description</label>
                            <textarea value={editingItem.description?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'description')} rows={2} className="mt-1 block w-full input" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Long Description</label>
                            <textarea value={editingItem.longDescription?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'longDescription')} rows={4} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Occupancy</label>
                            <input type="text" value={editingItem.occupancy?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'occupancy')} className="mt-1 block w-full input" />
                        </div>
                    </div>
                    
                     {/* Non-lingual Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                        <input type="number" name="price" value={editingItem.price} onChange={handleChange} className="mt-1 block w-full input" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                        <input type="text" name="image" value={editingItem.image} onChange={handleChange} className="mt-1 block w-full input" />
                        {editingItem.image && <img src={editingItem.image} alt="preview" className="mt-2 rounded-md shadow-sm h-32 w-full object-cover"/>}
                    </div>
                    
                    {/* Dynamic Lists */}
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800">Features ({supportedLanguages[activeLang]})</h3>
                            {(editingItem.features as MultilingualString[]).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <input type="text" value={feature[activeLang] || ''} onChange={e => handleMLListChange(index, e.target.value, 'features')} className="w-full input" />
                                    <button onClick={() => removeListItem(index, 'features')} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                            <button onClick={() => addListItem('features')} className="mt-2 text-sm text-brand-accent hover:underline">Add Feature</button>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium text-gray-800">Gallery Images</h3>
                            {(editingItem.gallery as string[]).map((url, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <input type="text" value={url} onChange={e => handleDynamicListChange(index, e.target.value, 'gallery')} className="w-full input" />
                                    <button onClick={() => removeListItem(index, 'gallery')} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             <button onClick={() => addListItem('gallery')} className="mt-2 text-sm text-brand-accent hover:underline">Add Gallery Image</button>
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
                <h1 className="text-4xl font-serif text-brand-primary">Manage Accommodations</h1>
                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-brand-accent text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add New</span>
                </button>
            </div>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {accommodations.map(acc => (
                        <li key={acc.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={acc.image} alt={getMLString(acc.name)} className="w-24 h-16 object-cover rounded-md"/>
                                <div>
                                    <h3 className="font-semibold text-lg text-brand-primary">{getMLString(acc.name)}</h3>
                                    <p className="text-sm text-gray-600">{getMLString(acc.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(acc)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-accent transition-colors">Edit</button>
                                <button onClick={() => handleDelete(acc.id)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors" aria-label={`Delete ${getMLString(acc.name)}`}>
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

export default ManageAccommodations;
