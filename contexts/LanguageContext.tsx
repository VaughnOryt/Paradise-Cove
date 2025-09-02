import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

type LanguageCode = 'en' | 'ar' | 'ja' | 'ko' | 'zh';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: string) => void;
  translations: any;
  supportedLanguages: Record<LanguageCode, string>;
  // FIX: Allow `t` function to return any type to support objects/arrays for translations.
  t: (key: string, options?: any) => any;
}

const supportedLanguages: Record<LanguageCode, string> = {
  en: 'English',
  ar: 'العربية',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  // FIX: Set initial state type to `any` to avoid incorrect inference to `{}` which causes type errors.
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const loadTranslations = async (lang: LanguageCode) => {
      try {
        // Use fetch to load the JSON file, which is more robust for data resources
        // than dynamic import in some environments.
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
        return true;
      } catch (error) {
        console.error(`Could not load translations for ${lang}`, error);
        return false;
      }
    };

    const loadWithFallback = async () => {
      const success = await loadTranslations(language);
      if (!success && language !== 'en') {
        console.warn(`Translations for '${language}' not found. Falling back to English.`);
        await loadTranslations('en');
      }
    };

    loadWithFallback();
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = `lang-${language}`;
  }, [language]);

  const setLanguage = (lang: string) => {
    if (Object.keys(supportedLanguages).includes(lang)) {
        setLanguageState(lang as LanguageCode);
    }
  };
  
  const t = useCallback((key: string, options?: any) => {
    let keys = key.split('.');
    let result = translations;

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key if translation is not found
      }
    }
    
    // Handle pluralization
    if (options?.count !== undefined) {
        if (options.count !== 1) {
            const pluralKey = `${key}_plural`;
            let pluralResult = translations;
            for (const k of pluralKey.split('.')) {
                pluralResult = pluralResult?.[k];
                if (pluralResult === undefined) {
                    break;
                }
            }
            if (pluralResult) result = pluralResult;
        }
    }
    
    // If the consumer wants an object and we have one, we return it directly.
    // This must happen before we try to process it as a string.
    if (options?.returnObjects && typeof result === 'object' && result !== null) {
        return result;
    }

    // If the result is not a string at this point, it indicates a mismatch
    // (e.g., an object was found but not requested). Fallback to the key.
    if (typeof result !== 'string') {
        return key;
    }

    // We now have a string to work with. Handle interpolations.
    let finalString = result;
    if (options) {
      Object.keys(options).forEach(optKey => {
        // Use a regex for global replacement to handle multiple occurrences.
        const regex = new RegExp(`\\{${optKey}\\}`, 'g');
        finalString = finalString.replace(regex, options[optKey]);
      });
    }

    return finalString;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, supportedLanguages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};