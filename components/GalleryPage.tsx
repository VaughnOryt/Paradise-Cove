
import React, { useState, useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';
import Modal from './Modal';
import type { GalleryImage, LanguageCode, MultilingualString } from '../types';

const categoryKeys = ['All', 'Accommodations', 'Dining', 'Facilities', 'Events', 'Scenery', 'Activities'];

const GalleryPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { galleryImages: rawImages } = useAppData();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const getMLString = (mlString: MultilingualString | undefined): string => {
    if (!mlString) return '';
    return mlString[language as LanguageCode] || mlString['en'] || '';
  };

  // FIX: Use raw images and translate at render time to avoid type mismatches.
  const translatedImages: GalleryImage[] = rawImages;

  const filteredImages = useMemo(() => {
    if (activeFilter === 'All') {
      return translatedImages;
    }
    return translatedImages.filter(image => image.category === activeFilter);
  }, [activeFilter, translatedImages]);

  return (
    <>
      <section className="py-24 bg-brand-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-serif text-brand-primary mb-4">{t('galleryPage.title')}</h1>
            <p className="text-lg text-gray-600">{t('galleryPage.subtitle')}</p>
          </div>

          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categoryKeys.map(categoryKey => (
              <button
                key={categoryKey}
                onClick={() => setActiveFilter(categoryKey)}
                className={`px-6 py-2 rounded-sm font-medium transition-colors duration-300 ${
                  activeFilter === categoryKey
                    ? 'bg-brand-accent text-white'
                    : 'bg-white text-brand-primary hover:bg-brand-accent/20'
                }`}
              >
                {t(`galleryPage.categories.${categoryKey.toLowerCase()}`)}
              </button>
            ))}
          </div>

          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [&>*:not(:first-child)]:mt-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setSelectedImage(image)}
                  className="block w-full group focus:outline-none focus:ring-4 focus:ring-brand-accent/50"
                  // FIX: Translate alt text here.
                  aria-label={t('galleryPage.viewImageAriaLabel', { alt: getMLString(image.alt) })}
                >
                  <img
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={image.src}
                    // FIX: Translate alt text here.
                    alt={getMLString(image.alt)}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <Modal
          // FIX: Translate title here.
          title={getMLString(selectedImage.alt)}
          onClose={() => setSelectedImage(null)}
          size="5xl"
        >
          <img
            src={selectedImage.src}
            // FIX: Translate alt text here.
            alt={getMLString(selectedImage.alt)}
            className="w-full h-auto object-contain max-h-[75vh] rounded-lg"
          />
        </Modal>
      )}
    </>
  );
};

export default GalleryPage;