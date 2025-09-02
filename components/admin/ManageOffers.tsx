
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Offer, LanguageCode, MultilingualString } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';

const getNewOfferTemplate = (): Omit<Offer, 'id'> => ({
    title: { en: "New Special Offer" },
    description: { en: "A brief description of this exciting new offer." },
    cta: { en: "Book This Offer" },
    details: [{ en: "Includes a special benefit" }],
    image: `https://picsum.photos/seed/offer${Date.now()}/600/400`,
    category: 'Seasonal',
});

const ManageOffers: React.FC = () => {
    const { t, supportedLanguages, language } = useTranslation();
    const { offers, updateOffer, addOffer, deleteOffer } = useAppData();
    const [editingItem, setEditingItem] = useState<Offer | Omit<Offer, 'id'> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');

    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleEdit = (item: Offer) => {
        setIsCreating(false);
        setEditingItem(JSON.parse(JSON.stringify(item)));
    };

    const handleAddNew = () => {
        setIsCreating(true);
        setEditingItem(getNewOfferTemplate());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: value as any });
    };

    const handleMLChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Offer) => {
        if (!editingItem) return;
        const { value } = e.target;
        const currentField = editingItem[field] as MultilingualString;
        setEditingItem({ ...editingItem, [field]: { ...currentField, [activeLang]: value } });
    };

    const handleDetailsChange = (index: number, value: string) => {
        if (!editingItem) return;
        const details = [...editingItem.details];
        details[index] = { ...details[index], [activeLang]: value };
        setEditingItem({ ...editingItem, details });
    };

    const addDetail = () => {
        if (!editingItem) return;
        setEditingItem({ ...editingItem, details: [...editingItem.details, { en: '' }] });
    };

    const removeDetail = (index: number) => {
        if (!editingItem) return;
        const details = [...editingItem.details];
        details.splice(index, 1);
        setEditingItem({ ...editingItem, details });
    };

    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            if (isCreating) {
                addOffer(editingItem as Omit<Offer, 'id'>);
                setShowSuccess('New offer added!');
            } else {
                updateOffer(editingItem as Offer);
                setShowSuccess('Offer updated!');
            }
            setIsSaving(false);
            setEditingItem(null);
            setIsCreating(false);
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            deleteOffer(id);
            setShowSuccess('Offer deleted!');
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };

    if (editingItem) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">
                    {isCreating ? 'Create New Offer' : `Editing: ${getMLString(editingItem.title)}`}
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input type="text" value={editingItem.title[activeLang] || ''} onChange={(e) => handleMLChange(e, 'title')} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea value={editingItem.description[activeLang] || ''} onChange={(e) => handleMLChange(e, 'description')} rows={3} className="mt-1 block w-full input" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Button Text (CTA)</label>
                            <input type="text" value={editingItem.cta[activeLang] || ''} onChange={(e) => handleMLChange(e, 'cta')} className="mt-1 block w-full input" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Category</label>
                            <select name="category" value={editingItem.category} onChange={handleChange} className="mt-1 block w-full input">
                                <option value="Exclusive">Exclusive</option>
                                <option value="Seasonal">Seasonal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Image URL</label>
                            <input type="text" name="image" value={editingItem.image} onChange={handleChange} className="mt-1 block w-full input" />
                            {editingItem.image && <img src={editingItem.image} alt="preview" className="mt-2 rounded-md shadow-sm h-32 w-full object-cover"/>}
                        </div>
                    </div>
                    
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Details ({supportedLanguages[activeLang]})</h3>
                        {(editingItem.details).map((detail, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                                <input type="text" value={detail[activeLang] || ''} onChange={e => handleDetailsChange(index, e.target.value)} className="w-full input" />
                                <button onClick={() => removeDetail(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button onClick={addDetail} className="mt-2 text-sm text-brand-accent hover:underline">Add Detail</button>
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
                <h1 className="text-4xl font-serif text-brand-primary">Manage Offers</h1>
                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-brand-accent text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add New</span>
                </button>
            </div>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {offers.map(offer => (
                        <li key={offer.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={offer.image} alt={getMLString(offer.title)} className="w-24 h-16 object-cover rounded-md"/>
                                <div>
                                    <h3 className="font-semibold text-lg text-brand-primary">{getMLString(offer.title)}</h3>
                                    <p className="text-sm text-gray-600">{getMLString(offer.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(offer)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-accent transition-colors">Edit</button>
                                <button onClick={() => handleDelete(offer.id)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors" aria-label={`Delete ${getMLString(offer.title)}`}>
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

export default ManageOffers;
