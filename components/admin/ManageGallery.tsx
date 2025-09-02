
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { GalleryImage, LanguageCode, MultilingualString } from '../../types';
import Modal from '../Modal';
import { TrashIcon, PlusIcon } from '../Icons';

const ManageGallery: React.FC = () => {
    const { t, supportedLanguages, language } = useTranslation();
    const { galleryImages, updateGalleryImage, addGalleryImage, deleteGalleryImage } = useAppData();
    const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'>>({ src: '', category: 'Scenery', alt: { en: '' } });
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');

    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewImage({ ...newImage, [name]: value });
    };
    
    const handleNewAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewImage({ ...newImage, alt: { ...newImage.alt, [activeLang]: e.target.value } });
    };

    const handleEditAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingItem) return;
        setEditingItem({ ...editingItem, alt: { ...editingItem.alt, [activeLang]: e.target.value } });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingItem) return;
        setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            updateGalleryImage(editingItem);
            setIsSaving(false);
            setEditingItem(null);
            setShowSuccess('Image updated successfully!');
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newImage.src || !newImage.alt.en) {
            alert("Image URL and English Alt Text are required.");
            return;
        }
        addGalleryImage(newImage);
        setNewImage({ src: '', category: 'Scenery', alt: { en: '' } });
        setShowSuccess('Image added successfully!');
        setTimeout(() => setShowSuccess(''), 3000);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            deleteGalleryImage(id);
            setShowSuccess('Image deleted successfully!');
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };
    
    const categories = ['Accommodations', 'Dining', 'Facilities', 'Events', 'Scenery', 'Activities'];

    return (
        <div>
            <h1 className="text-4xl font-serif text-brand-primary mb-8">Manage Gallery</h1>
            {showSuccess && <div className="mb-4 bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-serif text-brand-primary mb-4">Add New Image</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="src" value={newImage.src} onChange={handleNewChange} required className="mt-1 block w-full input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" value={newImage.category} onChange={handleNewChange} className="mt-1 block w-full input">
                           {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                        <div className="flex border-b mb-2">
                            {Object.entries(supportedLanguages).map(([code, name]) => (
                                <button key={code} type="button" onClick={() => setActiveLang(code as LanguageCode)}
                                    className={`px-3 py-1 -mb-px border-b-2 text-sm ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                                    {name}
                                </button>
                            ))}
                        </div>
                        <input type="text" value={newImage.alt[activeLang] || ''} onChange={handleNewAltChange} placeholder={`Alt text in ${supportedLanguages[activeLang]}`} required={activeLang === 'en'} className="w-full input" />
                    </div>
                    <button type="submit" className="flex items-center space-x-2 bg-brand-accent text-white px-4 py-2 rounded-md hover:opacity-90">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Add Image</span>
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-serif text-brand-primary mb-4">Existing Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryImages.map(image => (
                        <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm group relative">
                            <img src={image.src} alt={getMLString(image.alt)} className="w-full h-32 object-cover"/>
                            <div className="p-2">
                                <p className="text-sm font-medium truncate">{getMLString(image.alt)}</p>
                                <p className="text-xs text-gray-500">{image.category}</p>
                            </div>
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingItem(image)} className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(image.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingItem && (
                 <Modal title="Edit Image" onClose={() => setEditingItem(null)} size="2xl">
                    <div className="space-y-4">
                        <img src={editingItem.src} alt="preview" className="w-full h-48 object-cover rounded-md"/>
                        <div>
                            <label className="block text-sm font-medium">Image URL</label>
                            <input type="text" name="src" value={editingItem.src} onChange={handleEditChange} className="mt-1 block w-full input"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Category</label>
                            <select name="category" value={editingItem.category} onChange={handleEditChange} className="mt-1 block w-full input">
                               {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                            <div className="flex border-b mb-2">
                                {Object.entries(supportedLanguages).map(([code, name]) => (
                                    <button key={code} type="button" onClick={() => setActiveLang(code as LanguageCode)}
                                        className={`px-3 py-1 -mb-px border-b-2 text-sm ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                                        {name}
                                    </button>
                                ))}
                            </div>
                            <input type="text" value={editingItem.alt[activeLang] || ''} onChange={handleEditAltChange} placeholder={`Alt text in ${supportedLanguages[activeLang]}`} required={activeLang === 'en'} className="w-full input" />
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <button onClick={handleSave} disabled={isSaving} className="bg-brand-accent text-white px-4 py-2 rounded-md hover:opacity-90">{isSaving ? 'Saving...' : 'Save'}</button>
                            <button onClick={() => setEditingItem(null)} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageGallery;
