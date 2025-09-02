
import React, { useState, useMemo } from 'react';
import type { Booking } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onDateSelect: (date: Date) => void;
  bookings: Booking[];
}

const Calendar: React.FC<CalendarProps> = ({
  selectedStartDate,
  selectedEndDate,
  onDateSelect,
  bookings,
}) => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookedDatesSet = useMemo(() => {
    const dates = new Set<string>();
    bookings.forEach(booking => {
        const start = new Date(booking.startDate);
        start.setHours(0,0,0,0);
        const end = new Date(booking.endDate);
        end.setHours(0,0,0,0);
        
        let current = start;
        while(current < end) {
            dates.add(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
    });
    return dates;
  }, [bookings]);


  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isDateBooked = (date: Date) => {
    return bookedDatesSet.has(date.toISOString().split('T')[0]);
  }

  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayClassName = (d: Date): string => {
    const classes = ['w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200'];
    const dateOnly = new Date(d);
    dateOnly.setHours(0, 0, 0, 0);
    const isPast = dateOnly < today;

    if (d.getMonth() !== currentDate.getMonth()) {
      classes.push('text-gray-300');
    } else if (isPast) {
      classes.push('text-gray-400 cursor-not-allowed');
    } else {
      classes.push('text-gray-700');
    }
    
    if (isDateBooked(dateOnly)) {
      classes.push('bg-gray-200 text-gray-400 cursor-not-allowed line-through opacity-75');
      return classes.join(' ');
    }
    
    if (!isPast) {
       classes.push('hover:bg-brand-accent/20');
    }
    
    const isStartDate = selectedStartDate && dateOnly.getTime() === selectedStartDate.getTime();
    const isEndDate = selectedEndDate && dateOnly.getTime() === selectedEndDate.getTime();

    if (selectedStartDate && selectedEndDate) {
        if (dateOnly > selectedStartDate && dateOnly < selectedEndDate) {
            classes.push('bg-brand-accent/30 text-brand-primary rounded-none');
        }
    }
    
    if (isStartDate) {
      classes.push('bg-brand-accent text-white font-bold');
      if (selectedEndDate) {
        classes.push('rounded-e-none');
      }
    }

    if (isEndDate) {
      classes.push('bg-brand-accent text-white font-bold');
      if (selectedStartDate) {
        classes.push('rounded-s-none');
      }
    }

    if (dateOnly.getTime() === today.getTime() && !isStartDate && !isEndDate && !selectedStartDate) {
        classes.push('border-2 border-brand-accent');
    }
    
    return classes.join(' ');
  };

  const nights = selectedStartDate && selectedEndDate ? Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 3600 * 24)) : 0;
  
  const weekdays = useMemo(() => {
    const firstDay = new Date(2023, 0, 1); // A Sunday
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(firstDay);
        day.setDate(day.getDate() + i);
        return day.toLocaleDateString(language, { weekday: 'short' });
    });
  }, [language]);

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6" /></button>
        <h3 className="text-xl font-serif">{currentDate.toLocaleDateString(language, { month: 'long', year: 'numeric' })}</h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
            const dateOnly = new Date(d);
            dateOnly.setHours(0,0,0,0);
            const isClickable = dateOnly >= today && !isDateBooked(dateOnly);
            const isInSelectedRange = selectedStartDate && selectedEndDate && dateOnly >= selectedStartDate && dateOnly <= selectedEndDate;
            
            return (
            <div key={i} className="flex justify-center items-center relative group">
                <button
                    onClick={() => isClickable && onDateSelect(dateOnly)}
                    disabled={!isClickable}
                    className={getDayClassName(d)}
                >
                    {d.getDate()}
                </button>
                {isInSelectedRange && nights > 0 && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-brand-primary text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
                        {t('userView.booking.totalStay', { count: nights })}
                    </div>
                )}
            </div>
        )})}
      </div>
    </div>
  );
};

export default Calendar;
