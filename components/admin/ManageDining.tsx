
import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { DiningOption, MenuItem, Review, LanguageCode, MultilingualString } from '../../types';
import { PlusIcon, TrashIcon, StarIcon } from '../Icons';

const getNewDiningOptionTemplate = (): Omit<DiningOption, 'id'> => ({
    name: { en: "New Restaurant" },
    description: { en: "A brief description of this new dining option." },
    longDescription: { en: "A longer, more detailed description." },
    cuisine: { en: "Cuisine Type" },
    ambiance: { en: "Ambiance" },
    dressCode: { en: "Dress Code" },
    gallery: [`https://picsum.photos/seed/dine${Date.now()}/600/400`],
    menu: [{ category: { en: "Starters" }, items: [{ en: "New Dish" }] }],
    reviews: [{ name: "A. Guest", rating: 5, comment: { en: "Wonderful!" } }],
});

const ManageDining: React.FC = () => {
    const { t, supportedLanguages, language } = useTranslation();
    const { diningOptions, updateDiningOption, addDiningOption, deleteDiningOption } = useAppData();
    const [editingItem, setEditingItem] = useState<DiningOption | Omit<DiningOption, 'id'> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');
    const [activeLang, setActiveLang] = useState<LanguageCode>('en');

    const getMLString = (mlString: MultilingualString): string => mlString[language as LanguageCode] || mlString['en'] || '';

    const handleEdit = (item: DiningOption) => {
        setIsCreating(false);
        setEditingItem(JSON.parse(JSON.stringify(item)));
    };

    const handleAddNew = () => {
        setIsCreating(true);
        setEditingItem(getNewDiningOptionTemplate());
    };

    const handleMLChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof DiningOption) => {
        if (!editingItem) return;
        const { value } = e.target;
        const currentField = editingItem[field] as MultilingualString;
        setEditingItem({ ...editingItem, [field]: { ...currentField, [activeLang]: value } });
    };

    const handleGalleryChange = (index: number, value: string) => {
        if (!editingItem) return;
        const gallery = [...editingItem.gallery];
        gallery[index] = value;
        setEditingItem({ ...editingItem, gallery });
    };

    const addGalleryItem = () => {
        if (!editingItem) return;
        setEditingItem({ ...editingItem, gallery: [...editingItem.gallery, ''] });
    };

    const removeGalleryItem = (index: number) => {
        if (!editingItem) return;
        const gallery = [...editingItem.gallery];
        gallery.splice(index, 1);
        setEditingItem({ ...editingItem, gallery });
    };
    
    // Menu Handlers
    const handleMenuCategoryChange = (catIndex: number, value: string) => {
        if (!editingItem) return;
        const menu = [...editingItem.menu];
        menu[catIndex].category[activeLang] = value;
        setEditingItem({ ...editingItem, menu });
    }
    const handleMenuItemChange = (catIndex: number, itemIndex: number, value: string) => {
        if (!editingItem) return;
        const menu = [...editingItem.menu];
        menu[catIndex].items[itemIndex][activeLang] = value;
        setEditingItem({ ...editingItem, menu });
    }
    const addMenuCategory = () => {
        if (!editingItem) return;
        const newCategory: MenuItem = { category: { en: 'New Category' }, items: [{ en: 'New Item' }] };
        setEditingItem({ ...editingItem, menu: [...editingItem.menu, newCategory] });
    }
    const addMenuItem = (catIndex: number) => {
        if (!editingItem) return;
        const menu = [...editingItem.menu];
        menu[catIndex].items.push({ en: 'New Item' });
        setEditingItem({ ...editingItem, menu });
    }
    const removeMenuCategory = (catIndex: number) => {
        if (!editingItem) return;
        const menu = [...editingItem.menu];
        menu.splice(catIndex, 1);
        setEditingItem({ ...editingItem, menu });
    }
     const removeMenuItem = (catIndex: number, itemIndex: number) => {
        if (!editingItem) return;
        const menu = [...editingItem.menu];
        menu[catIndex].items.splice(itemIndex, 1);
        setEditingItem({ ...editingItem, menu });
    }
    
    // Review Handlers
    const handleReviewChange = (revIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const {name, value} = e.target;
        const reviews = [...editingItem.reviews];
        if (name === 'comment') {
            reviews[revIndex].comment[activeLang] = value;
        } else if (name === 'rating') {
            reviews[revIndex].rating = parseInt(value, 10);
        } else {
            reviews[revIndex].name = value;
        }
        setEditingItem({ ...editingItem, reviews });
    }
    const addReview = () => {
        if (!editingItem) return;
        const newReview: Review = { name: "Guest", rating: 5, comment: { en: "A new comment." } };
        setEditingItem({ ...editingItem, reviews: [...editingItem.reviews, newReview] });
    }
    const removeReview = (revIndex: number) => {
        if (!editingItem) return;
        const reviews = [...editingItem.reviews];
        reviews.splice(revIndex, 1);
        setEditingItem({ ...editingItem, reviews });
    }


    const handleSave = () => {
        if (!editingItem) return;
        setIsSaving(true);
        setTimeout(() => {
            if (isCreating) {
                addDiningOption(editingItem as Omit<DiningOption, 'id'>);
                setShowSuccess('New dining option added!');
            } else {
                updateDiningOption(editingItem as DiningOption);
                setShowSuccess('Dining option updated!');
            }
            setIsSaving(false);
            setEditingItem(null);
            setIsCreating(false);
            setTimeout(() => setShowSuccess(''), 3000);
        }, 500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this dining option?')) {
            deleteDiningOption(id);
            setShowSuccess('Dining option deleted!');
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };
    
    if (editingItem) {
        return (
             <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                <h2 className="text-3xl font-serif text-brand-primary mb-6">
                    {isCreating ? 'Create New Dining Option' : `Editing: ${getMLString(editingItem.name)}`}
                </h2>
                
                <div className="flex border-b mb-6">
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <button key={code} onClick={() => setActiveLang(code as LanguageCode)}
                            className={`px-4 py-2 -mb-px border-b-2 ${activeLang === code ? 'border-brand-accent text-brand-accent font-semibold' : 'border-transparent text-gray-500 hover:text-brand-primary'}`}>
                            {name}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* Text Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md">
                        <h3 className="md:col-span-2 text-xl font-serif text-brand-primary">Details ({supportedLanguages[activeLang]})</h3>
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" value={editingItem.name?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'name')} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cuisine</label>
                            <input type="text" value={editingItem.cuisine?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'cuisine')} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Ambiance</label>
                            <input type="text" value={editingItem.ambiance?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'ambiance')} className="mt-1 block w-full input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Dress Code</label>
                            <input type="text" value={editingItem.dressCode?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'dressCode')} className="mt-1 block w-full input" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Short Description</label>
                            <textarea value={editingItem.description?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'description')} rows={2} className="mt-1 block w-full input" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Long Description</label>
                            <textarea value={editingItem.longDescription?.[activeLang] || ''} onChange={(e) => handleMLChange(e, 'longDescription')} rows={4} className="mt-1 block w-full input" />
                        </div>
                    </div>
                    
                    {/* Gallery */}
                    <div className="p-4 border rounded-md">
                        <h3 className="text-xl font-serif text-brand-primary mb-4">Gallery</h3>
                        {editingItem.gallery.map((url, index) => (
                             <div key={index} className="flex items-center space-x-2 mt-2">
                                <input type="text" value={url} onChange={e => handleGalleryChange(index, e.target.value)} className="w-full input" />
                                {url && <img src={url} alt="preview" className="h-10 w-16 object-cover rounded"/>}
                                <button onClick={() => removeGalleryItem(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button onClick={addGalleryItem} className="mt-2 text-sm text-brand-accent hover:underline">Add Image URL</button>
                    </div>

                    {/* Menu */}
                    <div className="p-4 border rounded-md">
                         <h3 className="text-xl font-serif text-brand-primary mb-4">Menu ({supportedLanguages[activeLang]})</h3>
                         <div className="space-y-4">
                            {editingItem.menu.map((cat, catIndex) => (
                                <div key={catIndex} className="p-3 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-2">
                                        <input type="text" value={cat.category[activeLang] || ''} onChange={e => handleMenuCategoryChange(catIndex, e.target.value)} className="w-full input font-semibold" placeholder="Category Name" />
                                        <button onClick={() => removeMenuCategory(catIndex)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                    <div className="pl-4 mt-2 space-y-2">
                                        {cat.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center space-x-2">
                                                 <input type="text" value={item[activeLang] || ''} onChange={e => handleMenuItemChange(catIndex, itemIndex, e.target.value)} className="w-full input" placeholder="Menu Item" />
                                                 <button onClick={() => removeMenuItem(catIndex, itemIndex)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addMenuItem(catIndex)} className="text-sm text-brand-accent hover:underline">Add Menu Item</button>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <button onClick={addMenuCategory} className="mt-4 text-sm font-medium text-white bg-brand-accent py-1 px-3 rounded hover:opacity-90">Add Category</button>
                    </div>

                    {/* Reviews */}
                    <div className="p-4 border rounded-md">
                        <h3 className="text-xl font-serif text-brand-primary mb-4">Reviews ({supportedLanguages[activeLang]})</h3>
                         <div className="space-y-4">
                            {editingItem.reviews.map((rev, revIndex) => (
                                <div key={revIndex} className="p-3 bg-gray-50 rounded grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" name="name" value={rev.name} onChange={e => handleReviewChange(revIndex, e)} className="input" placeholder="Guest Name" />
                                    <select name="rating" value={rev.rating} onChange={e => handleReviewChange(revIndex, e as any)} className="input">
                                        {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r>1 && 's'}</option>)}
                                    </select>
                                    <textarea name="comment" value={rev.comment[activeLang] || ''} onChange={e => handleReviewChange(revIndex, e)} className="sm:col-span-2 input" placeholder="Comment" rows={2}></textarea>
                                    <div className="sm:col-span-3 text-right">
                                       <button onClick={() => removeReview(revIndex)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <button onClick={addReview} className="mt-4 text-sm font-medium text-white bg-brand-accent py-1 px-3 rounded hover:opacity-90">Add Review</button>
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
                <h1 className="text-4xl font-serif text-brand-primary">Manage Dining</h1>
                 <button onClick={handleAddNew} className="flex items-center space-x-2 bg-brand-accent text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add New</span>
                </button>
            </div>
            {showSuccess && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{showSuccess}</div>}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                    {diningOptions.map(option => (
                        <li key={option.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <img src={option.gallery[0]} alt={getMLString(option.name)} className="w-24 h-16 object-cover rounded-md"/>
                                <div>
                                    <h3 className="font-semibold text-lg text-brand-primary">{getMLString(option.name)}</h3>
                                    <p className="text-sm text-gray-600">{getMLString(option.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleEdit(option)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-accent transition-colors">Edit</button>
                                <button onClick={() => handleDelete(option.id)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors" aria-label={`Delete ${getMLString(option.name)}`}>
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

export default ManageDining;
