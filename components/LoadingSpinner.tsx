import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-brand-secondary z-50 flex flex-col justify-center items-center space-y-4">
      <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl text-brand-primary font-serif">{t('loadingSpinner.message')}</p>
    </div>
  );
};

export default LoadingSpinner;
