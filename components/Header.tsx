import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { GlobeIcon, ArrowRightOnRectangleIcon } from './Icons';

const Header: React.FC = () => {
  const { t, setLanguage, language, supportedLanguages } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const linkClassName = ({ isActive }: { isActive: boolean }) => 
    `nav-link text-brand-primary hover:text-brand-accent transition-colors duration-300 ${isActive ? 'active' : ''}`;

  const scrollToBook = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
        const bookSection = document.getElementById('book');
        if (bookSection) {
            bookSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback for direct navigation
            navigate('/#book');
        }
    }, 100);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center space-x-3">
            <span className="text-3xl font-serif text-brand-primary tracking-wider">
              Paradise Cove
            </span>
          </NavLink>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8 text-base">
              <NavLink
                to="/"
                className={linkClassName}
              >
                {t('header.home')}
              </NavLink>
              <NavLink
                to="/accommodations"
                className={linkClassName}
              >
                {t('header.accommodations')}
              </NavLink>
              <NavLink
                to="/dining"
                className={linkClassName}
              >
                {t('header.dining')}
              </NavLink>
              <NavLink
                to="/gallery"
                className={linkClassName}
              >
                {t('header.gallery')}
              </NavLink>
              <NavLink
                to="/offers"
                className={linkClassName}
              >
                {t('header.offers')}
              </NavLink>
              <NavLink
                to="/events"
                className={linkClassName}
              >
                {t('header.events')}
              </NavLink>
              <NavLink
                to="/admin"
                className={linkClassName}
              >
                {t('header.admin')}
              </NavLink>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="relative">
                 <GlobeIcon className="w-5 h-5 text-gray-500 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none"/>
                 <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    aria-label={t('header.languageSelectorLabel')}
                  >
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
              </div>
              {isAuthenticated ? (
                 <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-brand-primary text-white font-medium py-2 px-6 rounded-sm hover:opacity-90 transition-opacity duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                    <span>{t('header.logout')}</span>
                  </button>
              ) : (
                <a
                  href="#book"
                  onClick={scrollToBook}
                  className="bg-brand-accent text-white font-medium py-2 px-6 rounded-sm hover:opacity-90 transition-opacity duration-300"
                >
                  {t('header.bookNow')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;