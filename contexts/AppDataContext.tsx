

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { Booking, Accommodation, DiningOption, Offer, GalleryImage, EventInfo, HomePageContent, Testimonial, Amenity } from '../types';
import { BookingStatus } from '../types';
import { 
    initialBookings, 
    initialAccommodations, 
    initialDiningOptions, 
    initialOffers, 
    initialGalleryImages,
    initialEvents,
    initialHomePageContent,
    initialTestimonials,
    initialAmenities,
} from '../data/initialData';

// Placeholder for a real email sending service
const sendConfirmationEmail = (booking: Booking) => {
  console.log('--- Sending Confirmation Email ---');
  console.log(`To: ${booking.email}`);
  console.log(`Subject: Your Booking at Paradise Cove Resort is Confirmed!`);
  console.log(`
    Hello ${booking.guestName},

    We are delighted to confirm your booking at Paradise Cove Resort.

    Booking Details:
    Check-in: ${booking.startDate.toLocaleDateString()}
    Check-out: ${booking.endDate.toLocaleDateString()}

    Thank you for choosing us for your getaway. We look forward to welcoming you!

    Sincerely,
    The Paradise Cove Resort Team
  `);
  console.log('---------------------------------');
};


interface AppDataContextType {
  isLoading: boolean;
  bookings: Booking[];
  addBooking: (newBooking: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  
  accommodations: Accommodation[];
  updateAccommodation: (updated: Accommodation) => void;
  addAccommodation: (newItem: Omit<Accommodation, 'id'>) => void;
  deleteAccommodation: (id: string) => void;
  
  diningOptions: DiningOption[];
  updateDiningOption: (updated: DiningOption) => void;
  addDiningOption: (newItem: Omit<DiningOption, 'id'>) => void;
  deleteDiningOption: (id: string) => void;

  offers: Offer[];
  updateOffer: (updated: Offer) => void;
  addOffer: (newItem: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: string) => void;

  galleryImages: GalleryImage[];
  updateGalleryImage: (updated: GalleryImage) => void;
  addGalleryImage: (newImage: Omit<GalleryImage, 'id'>) => void;
  deleteGalleryImage: (id: string) => void;

  events: EventInfo[];
  updateEvent: (updated: EventInfo) => void;

  homePageContent: HomePageContent;
  updateHomePageContent: (updated: HomePageContent) => void;

  testimonials: Testimonial[];
  updateTestimonials: (updated: Testimonial[]) => void;
  addTestimonial: (newItem: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;

  amenities: Amenity[];
  updateAmenity: (updated: Amenity) => void;
  addAmenity: (newItem: Omit<Amenity, 'id'>) => void;
  deleteAmenity: (id: string) => void;
}

export const AppContext = createContext<AppDataContextType | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>(initialAccommodations);
  const [diningOptions, setDiningOptions] = useState<DiningOption[]>(initialDiningOptions);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [events, setEvents] = useState<EventInfo[]>(initialEvents);
  const [homePageContent, setHomePageContent] = useState<HomePageContent>(initialHomePageContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  
  // STEP 3: Refactor React App to fetch data
  // This useEffect simulates fetching initial data from your backend API when the app loads.
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      console.log("Simulating: Fetching initial bookings from the backend...");
      
      // In a real app, you would fetch from your Cloud Function URL
      // const response = await fetch('YOUR_CLOUD_FUNCTION_URL/getBookings');
      // const data = await response.json();
      
      // For now, we simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1200));
      const data = initialBookings;

      // When fetching from a JSON API, dates will be strings. We need to convert them back to Date objects.
      const bookingsWithDates = data.map(b => ({
          ...b,
          startDate: new Date(b.startDate),
          endDate: new Date(b.endDate)
      }));

      setBookings(bookingsWithDates);
      // Here you would also fetch accommodations, offers, etc.
      // For now, we only focus on bookings as requested.
      setIsLoading(false);
    };

    fetchBookings();
  }, []);


  const addBooking = useCallback(async (newBooking: Omit<Booking, 'id' | 'status'>) => {
    console.log("Simulating: Sending new booking to the backend API...");
    // In a real app, you would make a POST request to your API
    // const response = await fetch('YOUR_CLOUD_FUNCTION_URL/addBooking', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newBooking),
    // });
    // const savedBooking = await response.json(); // The backend would return the new booking with an ID
    
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 500));
    const savedBooking = {
      ...newBooking,
      id: new Date().getTime().toString(),
      status: BookingStatus.Pending,
    };
    
    // Update local state for instant UI feedback
    setBookings(prev => [...prev, savedBooking]);
  }, []);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    console.log(`Simulating: Updating booking ${id} status to ${status} on the backend...`);
    // In a real app, you would make a POST or PUT request
    // await fetch(`YOUR_CLOUD_FUNCTION_URL/updateBookingStatus/${id}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status }),
    // });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update local state
    setBookings(prev => {
        const newBookings = prev.map(booking =>
            booking.id === id ? { ...booking, status } : booking
        );
        if (status === BookingStatus.Confirmed) {
            const confirmedBooking = newBookings.find(b => b.id === id);
            if (confirmedBooking) {
                sendConfirmationEmail(confirmedBooking);
            }
        }
        return newBookings;
    });
  }, []);

  const updateAccommodation = (updated: Accommodation) => {
    setAccommodations(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  
  const addAccommodation = useCallback((newItem: Omit<Accommodation, 'id'>) => {
    setAccommodations(prev => [...prev, { ...newItem, id: `acc${new Date().getTime()}` }]);
  }, []);

  const deleteAccommodation = useCallback((id: string) => {
    setAccommodations(prev => prev.filter(item => item.id !== id));
  }, []);


  const updateDiningOption = (updated: DiningOption) => {
    setDiningOptions(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  
  const addDiningOption = useCallback((newItem: Omit<DiningOption, 'id'>) => {
    setDiningOptions(prev => [...prev, { ...newItem, id: `dine${new Date().getTime()}` }]);
  }, []);

  const deleteDiningOption = useCallback((id: string) => {
    setDiningOptions(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const updateOffer = (updated: Offer) => {
    setOffers(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const addOffer = useCallback((newItem: Omit<Offer, 'id'>) => {
    setOffers(prev => [...prev, { ...newItem, id: `offer${new Date().getTime()}` }]);
  }, []);

  const deleteOffer = useCallback((id: string) => {
    setOffers(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const updateGalleryImage = (updated: GalleryImage) => {
    setGalleryImages(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const addGalleryImage = (newImage: Omit<GalleryImage, 'id'>) => {
    setGalleryImages(prev => [...prev, { ...newImage, id: new Date().getTime().toString() }]);
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(item => item.id !== id));
  }
  
  const updateEvent = (updated: EventInfo) => {
    setEvents(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const updateHomePageContent = (updated: HomePageContent) => {
    setHomePageContent(updated);
  };

  const updateTestimonials = (updated: Testimonial[]) => {
    setTestimonials(updated);
  };

  const addTestimonial = useCallback((newItem: Omit<Testimonial, 'id'>) => {
    setTestimonials(prev => [...prev, { ...newItem, id: `test${new Date().getTime()}` }]);
  }, []);

  const deleteTestimonial = useCallback((id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateAmenity = (updated: Amenity) => {
    setAmenities(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const addAmenity = useCallback((newItem: Omit<Amenity, 'id'>) => {
    setAmenities(prev => [...prev, { ...newItem, id: `amen${new Date().getTime()}` }]);
  }, []);

  const deleteAmenity = useCallback((id: string) => {
    setAmenities(prev => prev.filter(item => item.id !== id));
  }, []);


  const value = {
    isLoading,
    bookings, addBooking, updateBookingStatus,
    accommodations, updateAccommodation, addAccommodation, deleteAccommodation,
    diningOptions, updateDiningOption, addDiningOption, deleteDiningOption,
    offers, updateOffer, addOffer, deleteOffer,
    galleryImages, updateGalleryImage, addGalleryImage, deleteGalleryImage,
    events, updateEvent,
    homePageContent, updateHomePageContent,
    testimonials, updateTestimonials, addTestimonial, deleteTestimonial,
    amenities, updateAmenity, addAmenity, deleteAmenity
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};