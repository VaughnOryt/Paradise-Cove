
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import { 
    HomeIcon, 
    PhotoIcon, 
    BuildingLibraryIcon, 
    PresentationChartBarIcon, 
    TagIcon as OfferIcon, 
    CalendarDaysIcon,
    BookOpenIcon,
    SparklesIcon,
} from '../Icons';

const AdminSidebar: React.FC = () => {
  const { t } = useTranslation();
  
  const navItems = [
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarDaysIcon },
    { to: '/admin/home', label: 'Home Page', icon: HomeIcon },
    { to: '/admin/amenities', label: 'Amenities', icon: SparklesIcon },
    { to: '/admin/accommodations', label: 'Accommodations', icon: BuildingLibraryIcon },
    { to: '/admin/dining', label: 'Dining', icon: BookOpenIcon },
    { to: '/admin/offers', label: 'Offers', icon: OfferIcon },
    { to: '/admin/gallery', label: 'Gallery', icon: PhotoIcon },
    { to: '/admin/events', label: 'Events', icon: PresentationChartBarIcon },
  ];

  const linkClass = "flex items-center px-4 py-3 text-gray-700 hover:bg-brand-accent/20 hover:text-brand-primary rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-brand-accent/20 text-brand-primary font-semibold";

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-serif text-brand-primary">Admin Panel</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map(item => (
            <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? `${linkClass} ${activeLinkClass}` : linkClass)}
            >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
            </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
