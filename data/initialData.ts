

import type { Booking, Accommodation, DiningOption, Offer, GalleryImage, EventInfo, HomePageContent, Testimonial, Amenity } from '../types';
import { BookingStatus } from '../types';

// This type is used to ensure our initial data matches what an API would send (dates as strings)
type RawBooking = Omit<Booking, 'startDate' | 'endDate'> & { startDate: string; endDate: string; };

export const initialBookings: RawBooking[] = [
  {
    id: '1',
    guestName: 'John Doe',
    email: 'john.doe@example.com',
    accommodationId: 'acc1',
    accommodationName: 'Oceanfront Villa',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
    status: BookingStatus.Confirmed,
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    email: 'jane.smith@example.com',
    accommodationId: 'acc3',
    accommodationName: 'Lagoon Bungalow',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 9).toISOString(),
    status: BookingStatus.Pending,
  },
];

export const initialAccommodations: Accommodation[] = [
  {
    id: 'acc1',
    name: { en: "Oceanfront Villa" },
    description: { en: "Wake up to the sound of waves in our luxurious villas, offering direct beach access and unparalleled ocean views." },
    longDescription: { en: "Our Oceanfront Villas are the pinnacle of luxury and privacy. Spanning 1500 sq ft, each villa boasts a private infinity plunge pool overlooking the turquoise ocean. The spacious bedroom features a plush king-size bed, while the open-plan living area flows seamlessly onto a furnished sun deck. An outdoor rain shower and a deep soaking tub complete this idyllic sanctuary." },
    features: [
        { en: "Private Plunge Pool" }, 
        { en: "King Size Bed" },
        { en: "Oceanfront Balcony" },
        { en: "Outdoor Shower" }
    ],
    occupancy: { en: "2 Adults, 1 Child" },
    amenities: ['ac', 'espresso', 'minibar', 'wifi', 'safe', 'luxuryToiletries'],
    image: 'https://picsum.photos/600/400?random=3',
    gallery: [
      'https://picsum.photos/800/600?random=20',
      'https://picsum.photos/800/600?random=21',
      'https://picsum.photos/800/600?random=22',
      'https://picsum.photos/800/600?random=23',
    ],
    price: 950,
  },
  {
    id: 'acc2',
    name: { en: "Rainforest Retreat" },
    description: { en: "Immerse yourself in nature. Our retreats are nestled within the lush tropical rainforest, offering peace and privacy." },
    longDescription: { en: "Find tranquility amidst the canopy in our Rainforest Retreats. These 1200 sq ft havens are built on stilts with minimal environmental impact, offering breathtaking views of the lush jungle. A wrap-around veranda with a hanging daybed invites you to relax and listen to the sounds of nature. The interior features natural wood finishes, a king-size bed, and a spa-like bathroom with a rainfall shower." },
    features: [
        { en: "Secluded Location" },
        { en: "Nature Views" },
        { en: "Modern Amenities" },
        { en: "Large Soaking Tub" }
    ],
    occupancy: { en: "2 Adults" },
    amenities: ['fan_ac', 'yoga', 'organicToiletries', 'wifi', 'coffee', 'speaker'],
    image: 'https://picsum.photos/600/400?random=4',
    gallery: [
      'https://picsum.photos/800/600?random=24',
      'https://picsum.photos/800/600?random=25',
      'https://picsum.photos/800/600?random=26',
      'https://picsum.photos/800/600?random=27',
    ],
    price: 750,
  },
  {
    id: 'acc3',
    name: { en: "Lagoon Bungalow" },
    description: { en: "Perched over the crystal-clear lagoon, these bungalows feature glass floor panels and direct water access." },
    longDescription: { en: "Experience the magic of sleeping over the water in our iconic Lagoon Bungalows. At 1000 sq ft, these bungalows offer unparalleled access to the vibrant marine life below through a glass floor panel. Descend from your private deck directly into the warm lagoon for a swim or snorkel. Inside, a comfortable king-size bed, a cozy seating area, and modern amenities ensure a memorable stay." },
    features: [
        { en: "Overwater Hammock" },
        { en: "Direct Lagoon Access" },
        { en: "Glass Floor Panels" },
        { en: "Sunset Views" }
    ],
    occupancy: { en: "2 Adults" },
    amenities: ['lagoonAccess', 'glassFloor', 'hammock', 'ac', 'minibar', 'wifi'],
    image: 'https://picsum.photos/600/400?random=5',
    gallery: [
        'https://picsum.photos/800/600?random=28',
        'https://picsum.photos/800/600?random=29',
        'https://picsum.photos/800/600?random=30',
        'https://picsum.photos/800/600?random=31',
    ],
    price: 1150,
  },
];

export const initialDiningOptions: DiningOption[] = [
  {
    id: 'dine1',
    name: { en: "The Azure Grill" },
    description: { en: "Savor the catch of the day, grilled to perfection, with your feet in the sand. A starlit dining experience." },
    longDescription: { en: "The Azure Grill offers a quintessential island dining experience... The gentle sound of the waves provides a soothing soundtrack, while tiki torches cast a romantic glow, creating an unforgettable atmosphere." },
    cuisine: { en: "Seafood & Grill" },
    ambiance: { en: "Beachfront, Casual Elegance" },
    dressCode: { en: "Resort Casual" },
    gallery: [
      'https://picsum.photos/seed/dine1/600/400',
      'https://picsum.photos/seed/food1/600/400',
      'https://picsum.photos/seed/beachdine/600/400',
      'https://picsum.photos/seed/grill/600/400',
    ],
    menu: [
        { category: { en: "Starters" }, items: [{ en: "Grilled Octopus with Lemon & Oregano" }, { en: "Tuna Tartare with Avocado and Wasabi Tobiko" }] },
        { category: { en: "From the Grill" }, items: [{ en: "Whole Grilled Red Snapper with Tropical Salsa" }, { en: "24oz Bone-in Ribeye Steak" }] },
        { category: { en: "Desserts" }, items: [{ en: "Grilled Pineapple with Coconut Ice Cream" }, { en: "Key Lime Pie" }] }
    ],
    reviews: [
        { name: "John D.", rating: 5, comment: { en: "Absolutely magical! The grilled snapper was the best I have ever had." } }
    ]
  },
  {
    id: 'dine2',
    name: { en: "Banyan Grove" },
    description: { en: "An elegant treetop setting offering a fusion of local flavors and international cuisine." },
    longDescription: { en: "Dine amidst the branches of an ancient, sacred banyan tree... The subtle sounds of the jungle provide a serene backdrop to your meal." },
    cuisine: { en: "Asian Fusion & Local Delicacies" },
    ambiance: { en: "Treetop, Sophisticated" },
    dressCode: { en: "Smart Casual" },
    gallery: [
      'https://picsum.photos/seed/dine2/600/400',
      'https://picsum.photos/seed/treetop/600/400',
    ],
    menu: [
        { category: { en: "Appetizers" }, items: [{ en: "Crispy Spring Rolls" }, { en: "Tom Yum Goong Soup" }] },
        { category: { en: "Main Courses" }, items: [{ en: "Pan-Seared Duck Breast" }, { en: "Massaman Curry with Lamb" }] }
    ],
    reviews: [
        { name: "Maria S.", rating: 5, comment: { en: "The ambiance is out of this world. Felt like we were in a fairytale." } }
    ]
  },
  {
    id: 'dine3',
    name: { en: "The Lagoon Bar" },
    description: { en: "Casual, all-day dining with stunning lagoon views. Perfect for a light lunch and tropical cocktails." },
    longDescription: { en: "As the social heart of Paradise Cove, The Lagoon Bar is the perfect spot to unwind... It's the ultimate setting for casual relaxation." },
    cuisine: { en: "Light Fare & Cocktails" },
    ambiance: { en: "Poolside, Relaxed" },
    dressCode: { en: "Swimwear & Casual" },
    gallery: [
      'https://picsum.photos/seed/dine3/600/400',
      'https://picsum.photos/seed/cocktails/600/400',
    ],
    menu: [
        { category: { en: "Light Bites" }, items: [{ en: "Classic Caesar Salad" }, { en: "Crispy Calamari" }] },
        { category: { en: "Gourmet Sandwiches" }, items: [{ en: "Club Sandwich" }, { en: "Black Angus Beef Burger" }] }
    ],
    reviews: [
        { name: "Emily R.", rating: 4, comment: { en: "Perfect spot for lunch and cocktails by the pool. The burger was delicious!" } }
    ]
  },
];

export const initialOffers: Offer[] = [
  {
    id: 'offer1',
    title: { en: "Honeymoon Bliss Package" },
    description: { en: "Celebrate your love with a romantic escape. Enjoy special amenities and unforgettable experiences designed for two." },
    details: [
        { en: "5 nights in an Oceanfront Villa" },
        { en: "Daily breakfast in-villa" },
        { en: "A private candlelit dinner on the beach" },
        { en: "Couples massage at our spa" },
    ],
    cta: { en: "Book Your Romantic Getaway" },
    image: 'https://picsum.photos/seed/offer1/600/400',
    category: 'Exclusive',
  },
  {
    id: 'offer2',
    title: { en: "Festive Season Celebration" },
    description: { en: "Join us for a magical festive season. Our resort transforms into a winter wonderland (with a tropical twist!)." },
    details: [
        { en: "Special festive-themed dinners" },
        { en: "Live entertainment and music" },
        { en: "New Year's Eve gala dinner & fireworks" },
    ],
    cta: { en: "Book Your Festive Stay" },
    image: 'https://picsum.photos/seed/offer2/600/400',
    category: 'Seasonal',
  }
];

export const initialGalleryImages: GalleryImage[] = [
  { id: 'gal1', src: 'https://picsum.photos/seed/acc1/800/600', category: 'Accommodations', alt: { en: 'Spacious villa bedroom with ocean view' } },
  { id: 'gal2', src: 'https://picsum.photos/seed/din1/600/800', category: 'Dining', alt: { en: 'Gourmet dish served at the restaurant' } },
  { id: 'gal3', src: 'https://picsum.photos/seed/fac1/800/600', category: 'Facilities', alt: { en: 'Infinity pool at sunset' } },
  { id: 'gal4', src: 'https://picsum.photos/seed/eve1/800/600', category: 'Events', alt: { en: 'Beach wedding setup' } },
  { id: 'gal5', src: 'https://picsum.photos/seed/sce1/600/800', category: 'Scenery', alt: { en: 'Palm trees on a white sand beach' } },
  { id: 'gal6', src: 'https://picsum.photos/seed/act1/800/600', category: 'Activities', alt: { en: 'Kayaking in the clear blue lagoon' } },
];

export const initialEvents: EventInfo[] = [
    {
        id: 'event1',
        type: 'Weddings',
        title: { en: 'Begin Your Forever Story' },
        description: { en: 'From intimate beachfront ceremonies to grand ballroom receptions, Paradise Cove is where dream weddings come to life.' },
        image: 'https://picsum.photos/seed/wedding1/800/600',
        packages: [
          {
            name: { en: 'Intimate Elopement' },
            description: { en: 'A romantic package for two, including a private ceremony, couples massage, and a candlelit dinner.' },
            features: [ {en: "Ceremony Officiant"}, {en: "Bridal Bouquet & Boutonnière"} ]
          },
          {
            name: { en: 'Island Romance' },
            description: { en: 'A beautiful celebration for up to 50 guests, featuring a floral arch, cocktail hour, and a three-course dinner reception.' },
            features: [ {en: "Venue Rental"}, {en: "Catering for 50 guests"} ]
          }
        ],
        venues: [
            { name: { en: 'Oceanfront Pavilion' }, description: { en: 'A stunning open-air venue with panoramic views of the turquoise sea.' }, capacity: 'Up to 150 guests', image: 'https://picsum.photos/seed/venue1/600/400' },
            { name: { en: 'Secret Garden' }, description: { en: 'A lush, tropical setting surrounded by exotic flowers and ancient trees.' }, capacity: 'Up to 80 guests', image: 'https://picsum.photos/seed/venue2/600/400' }
        ]
    },
     {
        id: 'event2',
        type: 'Corporate',
        title: { en: 'Inspire and Innovate' },
        description: { en: 'Host your next meeting, conference, or corporate retreat in a setting that inspires creativity and focus.' },
        image: 'https://picsum.photos/seed/corporate1/800/600',
        packages: [
            { name: { en: 'Executive Retreat' }, description: { en: 'A full-day meeting package including venue, AV equipment, gourmet lunch, and two coffee breaks.' }, features: [] },
            { name: { en: 'Presidential Conference' }, description: { en: 'A multi-day package with luxury accommodations, daily meetings, and networking events.' }, features: [] }
        ],
        venues: [
            { name: { en: 'The Cove Ballroom' }, description: { en: 'A versatile and elegant space with cutting-edge technology.' }, capacity: 'Up to 250 guests', image: 'https://picsum.photos/seed/venue3/600/400' },
            { name: { en: 'Boardroom Horizon' }, description: { en: 'An exclusive meeting room with stunning ocean views for high-level sessions.' }, capacity: 'Up to 20 guests', image: 'https://picsum.photos/seed/venue4/600/400' }
        ]
    },
    {
        id: 'event3',
        type: 'Social',
        title: { en: "Celebrate Life's Moments" },
        description: { en: "Anniversaries, milestone birthdays, or family reunions deserve a spectacular setting. Let us help you create joyful memories." },
        image: 'https://picsum.photos/seed/social1/800/600',
        packages: [
            { name: { en: 'Milestone Birthday Bash' }, description: { en: 'Celebrate in style with a private venue, custom decorations, a DJ, and a personalized menu.' }, features: [] },
            { name: { en: 'Family Reunion' }, description: { en: 'Gather your loved ones for a memorable reunion with activities for all ages.' }, features: [] }
        ],
        venues: [
            { name: { en: 'Lagoon Pool Terrace' }, description: { en: 'A chic, open-air space perfect for cocktail parties and elegant evening gatherings.' }, capacity: 'Up to 100 guests', image: 'https://picsum.photos/seed/venue5/600/400' },
            { name: { en: 'The Azure Grill (Private Section)' }, description: { en: 'Host a vibrant beach party with your feet in the sand and the stars above.' }, capacity: 'Up to 75 guests', image: 'https://picsum.photos/seed/venue6/600/400' }
        ]
    }
];

export const initialHomePageContent: HomePageContent = {
    hero: {
        title: { en: "An Island Sanctuary", ar: "ملاذ في جزيرة", ja: "島の聖域", ko: "섬의 성역", zh: "岛屿圣地" },
        subtitle: { en: "Where pristine sands and turquoise waters become your private retreat.", ar: "حيث تصبح الرمال النقية والمياه الفيروزية ملاذك الخاص.", ja: "純白の砂とターコイズブルーの海が、あなたのプライベートな隠れ家になります。", ko: "깨끗한 모래와 터키석 바다가 당신만의 개인적인 휴양지가 되는 곳.", zh: "在这里，原始的沙滩和碧绿的海水成为您的私人度假胜地。" },
        backgroundImages: [
            "https://picsum.photos/seed/hero1/1920/1080",
            "https://picsum.photos/seed/hero2/1920/1080",
            "https://picsum.photos/seed/hero3/1920/1080",
        ]
    },
    story: {
        title: { en: "Our Story", ar: "قصتنا", ja: "私たちの物語", ko: "우리의 이야기", zh: "我们的故事" },
        paragraph1: { en: "Nestled in a secluded corner of the world, Paradise Cove was born from a dream to create a sanctuary where luxury meets nature. Our resort is more than just a destination; it's an experience crafted with passion, designed to offer an escape from the everyday and a deep connection with the serene beauty of the island.", ar: "يقع بارادايس كوف في ركن منعزل من العالم، وقد وُلد من حلم لإنشاء ملاذ يجمع بين الفخامة والطبيعة. منتجعنا هو أكثر من مجرد وجهة؛ إنه تجربة صُنعت بشغف، ومصممة لتقديم مهرب من الحياة اليومية واتصال عميق بجمال الجزيرة الهادئ.", ja: "[JA] Nestled in a secluded corner of the world, Paradise Cove was born from a dream to create a sanctuary where luxury meets nature...", ko: "[KO] Nestled in a secluded corner of the world, Paradise Cove was born from a dream to create a sanctuary where luxury meets nature...", zh: "[ZH] Nestled in a secluded corner of the world, Paradise Cove was born from a dream to create a sanctuary where luxury meets nature..." },
        paragraph2: { en: "From our sustainably-built villas to our locally-sourced cuisine, every detail is thoughtfully considered to ensure your stay is not only unforgettable but also in harmony with our pristine environment.", ar: "من فللنا المبنية بشكل مستدام إلى مأكولاتنا المحلية المصدر، يتم النظر في كل التفاصيل بعناية لضمان أن تكون إقامتك لا تُنسى فقط، بل أيضًا في وئام مع بيئتنا النقية.", ja: "[JA] From our sustainably-built villas to our locally-sourced cuisine...", ko: "[KO] From our sustainably-built villas to our locally-sourced cuisine...", zh: "[ZH] From our sustainably-built villas to our locally-sourced cuisine..." },
        image: "https://picsum.photos/800/600?random=2"
    },
    video: {
        title: { en: "Explore Paradise Cove" },
        subtitle: { en: "Press play to embark on a visual journey through our stunning resort." },
        thumbnailUrl: "https://picsum.photos/1280/720?random=50",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" 
    },
    location: {
        title: { en: "Find Your Paradise" },
        subtitle: { en: "We are located in a pristine, secluded corner of the world, waiting to welcome you." },
        address: { en: "Motu Tehotu, Bora Bora, French Polynesia" },
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15243.91035619175!2d-151.75162496880436!3d-16.47879198642954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x76bd035352e84645%3A0x86231553b92f7194!2sFour%20Seasons%20Resort%20Bora%20Bora!5e0!3m2!1sen!2sus!4v1716315077181!5m2!1sen!2sus"
    }
};

export const initialTestimonials: Testimonial[] = [
    { id: 'test1', quote: { en: "Absolutely breathtaking. The service was impeccable and the views were something out of a dream. We will be back!" }, name: "Emily & Johnathan R.", location: "New York, USA", image: "https://picsum.photos/seed/client1/100/100" },
    { id: 'test2', quote: { en: "The most relaxing vacation of my life. The rainforest retreat was so peaceful, and the staff made us feel like family." }, name: "Maria S.", location: "Madrid, Spain", image: "https://picsum.photos/seed/client2/100/100" },
    { id: 'test3', quote: { en: "Paradise Cove exceeded all our expectations. The overwater bungalow was incredible. A truly 5-star experience from start to finish." }, name: "Chen L.", location: "Singapore", image: "https://picsum.photos/seed/client3/100/100" }
];

export const initialAmenities: Amenity[] = [
    { id: 'amen1', name: { en: "Spa & Wellness" }, description: { en: "Rejuvenate your body and soul at our world-class spa facilities." }, icon: 'SparklesIcon' },
    { id: 'amen2', name: { en: "Gourmet Dining" }, description: { en: "Savor exquisite flavors crafted from the freshest local ingredients." }, icon: 'TagIcon' },
    { id: 'amen3', name: { en: "Infinity Pool" }, description: { en: "Lounge by our stunning infinity pool with panoramic ocean views." }, icon: 'WifiIcon' },
    { id: 'amen4', name: { en: "Water Sports" }, description: { en: "Explore the vibrant marine life with our range of water activities." }, icon: 'SunIcon' },
];