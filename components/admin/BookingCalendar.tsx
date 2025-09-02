import React, { useState, useMemo } from 'react';
import type { Booking } from '../../types';
import { BookingStatus } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

interface BookingCalendarProps {
  bookings: Booking[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
  const { t, language } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const confirmedBookingsByDate = useMemo(() => {
    const bookingsMap = new Map<string, Booking[]>();
    bookings.forEach(booking => {
      if (booking.status !== BookingStatus.Confirmed) return;

      let current = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (current < end) {
        const dateString = current.toISOString().split('T')[0];
        const dayBookings = bookingsMap.get(dateString) || [];
        dayBookings.push(booking);
        bookingsMap.set(dateString, dayBookings);
        current.setDate(current.getDate() + 1);
      }
    });
    return bookingsMap;
  }, [bookings]);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));
  
  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const weekdays = useMemo(() => {
    const firstDay = new Date(2023, 0, 1); // A Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDay);
      day.setDate(day.getDate() + i);
      return day.toLocaleDateString(language, { weekday: 'short' });
    });
  }, [language]);

  const getDayClassName = (d: Date): string => {
    const classes = ['relative h-28 flex flex-col p-2 border-t border-r border-gray-200 transition-colors duration-200 overflow-hidden'];
    if (d.getMonth() !== currentDate.getMonth()) {
      classes.push('bg-gray-50 text-gray-400');
    } else {
      classes.push('bg-white text-gray-800');
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    if(d.getTime() === today.getTime()){
        classes.push('bg-blue-50');
    }
    return classes.join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-6 h-6" /></button>
        <h3 className="text-xl font-serif">{currentDate.toLocaleDateString(language, { month: 'long', year: 'numeric' })}</h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-6 h-6" /></button>
      </div>
      <div className="grid grid-cols-7">
        <div className="grid grid-cols-7 col-span-7 text-center text-sm text-gray-500 font-medium">
            {weekdays.map(day => <div key={day} className="py-2 border-b-2 border-gray-200">{day}</div>)}
        </div>
        {days.map((d, i) => {
          const dateString = d.toISOString().split('T')[0];
          const dayBookings = confirmedBookingsByDate.get(dateString) || [];
          return (
            <div key={i} className={getDayClassName(d)}>
              <span className="font-medium">{d.getDate()}</span>
              {dayBookings.length > 0 && (
                <div className="mt-1 space-y-1 overflow-y-auto">
                    {dayBookings.map(booking => (
                        <div key={booking.id} className="group relative">
                             <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-md truncate cursor-pointer">
                                {booking.guestName}
                             </div>
                             <div className="absolute z-10 hidden group-hover:block w-48 p-2 text-sm bg-gray-800 text-white rounded-lg shadow-lg -mt-16 ml-4">
                                <p><strong>Guest:</strong> {booking.guestName}</p>
                                <p><strong>Email:</strong> {booking.email}</p>
                                <p><strong>Stay:</strong> {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</p>
                             </div>
                        </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;