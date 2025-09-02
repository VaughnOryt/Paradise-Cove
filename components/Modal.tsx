
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { XMarkIcon } from './Icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, size = 'md' }) => {
  const { t } = useTranslation();
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} mx-auto transform transition-all max-h-[90vh] flex flex-col`}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h3 className="text-2xl font-serif text-brand-primary">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('modal.closeAriaLabel')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        <div className="p-4 bg-gray-50 text-end rounded-b-lg border-t flex-shrink-0">
             <button
                onClick={onClose}
                className="bg-brand-primary text-white font-medium py-2 px-6 rounded-sm hover:opacity-90 transition-opacity duration-300"
              >
                {t('modal.closeButton')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
