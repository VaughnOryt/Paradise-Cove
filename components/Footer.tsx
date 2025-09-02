import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-primary text-brand-secondary">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p className="text-sm text-gray-400 mt-1">{t('footer.tagline')}</p>
      </div>
    </footer>
  );
};

export default Footer;
