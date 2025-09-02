import React, { useMemo } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Booking } from '../../types';
import { BookingStatus } from '../../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, CalendarDaysIcon } from '../Icons';
import BookingCalendar from './BookingCalendar';

const ManageBookings: React.FC = () => {
  const { t } = useTranslation();
  const { bookings, updateBookingStatus } = useAppData();

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [bookings]);

  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === BookingStatus.Confirmed).length,
      pending: bookings.filter(b => b.status === BookingStatus.Pending).length,
      cancelled: bookings.filter(b => b.status === BookingStatus.Cancelled).length,
    }
  }, [bookings]);

  const getStatusPill = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 me-1.5" />
            {t('admin.statusConfirmed')}
          </span>
        );
      case BookingStatus.Pending:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 me-1.5" />
            {t('admin.statusPending')}
          </span>
        );
      case BookingStatus.Cancelled:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 me-1.5" />
            {t('admin.statusCancelled')}
          </span>
        );
    }
  };
  
  const StatCard: React.FC<{title: string, value: number, icon: React.FC<{className?: string}>, color: string}> = ({title, value, icon: Icon, color}) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`rounded-full p-3 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-serif text-brand-primary">Manage Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={bookingStats.total} icon={CalendarDaysIcon} color="bg-blue-500"/>
        <StatCard title="Confirmed" value={bookingStats.confirmed} icon={CheckCircleIcon} color="bg-green-500"/>
        <StatCard title="Pending" value={bookingStats.pending} icon={ClockIcon} color="bg-yellow-500"/>
        <StatCard title="Cancelled" value={bookingStats.cancelled} icon={XCircleIcon} color="bg-red-500"/>
      </div>
      
      <div>
        <h2 className="text-3xl font-serif text-brand-primary mb-4">Booking Calendar</h2>
        <BookingCalendar bookings={bookings} />
      </div>

      <div>
        <h2 className="text-3xl font-serif text-brand-primary mb-4">All Booking Requests</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.guestName')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.guestEmail')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.accommodation')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.dates')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.status')}</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.table.actions')}</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sortedBookings.map((booking: Booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{booking.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.accommodationName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                        {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusPill(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {booking.status === BookingStatus.Pending && (
                        <>
                            <button
                            onClick={() => updateBookingStatus(booking.id, BookingStatus.Confirmed)}
                            className="text-white bg-brand-accent hover:opacity-90 font-semibold py-2 px-3 rounded-md transition-colors"
                            >
                            {t('admin.actions.confirm')}
                            </button>
                            <button
                            onClick={() => updateBookingStatus(booking.id, BookingStatus.Cancelled)}
                            className="text-white bg-gray-600 hover:bg-gray-700 font-semibold py-2 px-3 rounded-md transition-colors"
                            >
                            {t('admin.actions.cancel')}
                            </button>
                        </>
                        )}
                         {booking.status === BookingStatus.Confirmed && (
                           <button
                             onClick={() => updateBookingStatus(booking.id, BookingStatus.Cancelled)}
                             className="text-white bg-red-600 hover:bg-red-700 font-semibold py-2 px-3 rounded-md transition-colors"
                           >
                            {t('admin.actions.cancel')}
                           </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;