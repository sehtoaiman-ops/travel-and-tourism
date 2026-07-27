import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: 'all_access',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      permissions: 'read,book,review,wishlist',
    },
  });

  const guideRole = await prisma.role.upsert({
    where: { name: 'GUIDE' },
    update: {},
    create: {
      name: 'GUIDE',
      permissions: 'read,manage_tours',
    },
  });

  // 2. Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecovoyage.com' },
    update: {},
    create: {
      email: 'admin@ecovoyage.com',
      password: hashedPassword,
      name: 'Eleanor Vance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      roleId: adminRole.id,
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'traveler@ecovoyage.com' },
    update: {},
    create: {
      email: 'traveler@ecovoyage.com',
      password: hashedPassword,
      name: 'Sebastian Cole',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      roleId: userRole.id,
    },
  });

  const guideUser = await prisma.user.upsert({
    where: { email: 'guide@ecovoyage.com' },
    update: {},
    create: {
      email: 'guide@ecovoyage.com',
      password: hashedPassword,
      name: 'Marcus Thorne',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      roleId: guideRole.id,
    },
  });

  // 3. Countries
  const costaRica = await prisma.country.create({
    data: { name: 'Costa Rica', continent: 'North America' }
  });
  const switzerland = await prisma.country.create({
    data: { name: 'Switzerland', continent: 'Europe' }
  });
  const tanzania = await prisma.country.create({
    data: { name: 'Tanzania', continent: 'Africa' }
  });
  const japan = await prisma.country.create({
    data: { name: 'Japan', continent: 'Asia' }
  });
  const Australia = await prisma.country.create({
    data: { name: 'Australia', continent: 'Australia' }
  });

  // 4. Cities
  const sanJose = await prisma.city.create({
    data: { name: 'San Jose', countryId: costaRica.id }
  });
  const zermatt = await prisma.city.create({
    data: { name: 'Zermatt', countryId: switzerland.id }
  });
  const arusha = await prisma.city.create({
    data: { name: 'Arusha', countryId: tanzania.id }
  });
  const kyoto = await prisma.city.create({
    data: { name: 'Kyoto', countryId: japan.id }
  });

  // 5. Destinations
  const destCloudForest = await prisma.destination.create({
    data: {
      name: 'Monteverde Cloud Forest',
      description: 'An otherworldly sanctuary shrouded in mist, hosting 2.5% of worldwide biodiversity, rare orchids, and ancient hanging bridges.',
      image: '/images/dest_cloud_forest.jpg',
      latitude: 10.275,
      longitude: -84.825,
      carbonRating: 'A+',
      popular: true,
      countryId: costaRica.id
    }
  });

  const destZermatt = await prisma.destination.create({
    data: {
      name: 'Zermatt Alpine Slopes',
      description: 'A completely car-free Alpine village nestled under the magnificent Matterhorn, operating on 100% renewable solar and hydro power.',
      image: '/images/dest_zermatt.jpg',
      latitude: 46.0207,
      longitude: 7.7491,
      carbonRating: 'A',
      popular: true,
      countryId: switzerland.id
    }
  });

  const destSerengeti = await prisma.destination.create({
    data: {
      name: 'Serengeti Wildlife Plains',
      description: 'Witness the iconic Great Migration in a carbon-neutral safari vehicle, supported directly by local Maasai community conservation efforts.',
      image: '/images/dest_serengeti.jpg',
      latitude: -2.154,
      longitude: 34.6857,
      carbonRating: 'A+',
      popular: true,
      countryId: tanzania.id
    }
  });

  const destKyoto = await prisma.destination.create({
    data: {
      name: 'Kyoto Arashiyama Sanctuary',
      description: 'Walk through whispering giant bamboo forests, sustainable historic temples, and preserved traditional gardens.',
      image: '/images/dest_cloud_forest.jpg',
      latitude: 35.0116,
      longitude: 135.7681,
      carbonRating: 'B',
      popular: false,
      countryId: japan.id
    }
  });

  // 6. Categories
  const catLuxury = await prisma.category.create({ data: { name: 'Luxury Tours', slug: 'luxury' } });
  const catAdventure = await prisma.category.create({ data: { name: 'Adventure Tours', slug: 'adventure' } });
  const catEco = await prisma.category.create({ data: { name: 'Eco Tours', slug: 'eco' } });
  const catHoneymoon = await prisma.category.create({ data: { name: 'Honeymoon', slug: 'honeymoon' } });
  const catSolo = await prisma.category.create({ data: { name: 'Solo Trips', slug: 'solo' } });
  const catFamily = await prisma.category.create({ data: { name: 'Family Tours', slug: 'family' } });

  // 7. Packages
  const packMonteverde = await prisma.package.create({
    data: {
      name: 'Monteverde Canopy Luxury & Cloud Forest Retreat',
      description: 'A 5-day eco-retreat high in the Costa Rican cloud forests. Experience private suspension bridge walks, organic farm-to-table dining, and sleeping in high-end luxury canopy tree houses.',
      categoryId: catEco.id,
      destinationId: destCloudForest.id,
      durationDays: 5,
      price: 3450.00,
      maxGuests: 8,
      image: '/images/dest_cloud_forest.jpg',
      difficulty: 'Easy',
      carbonFootprint: 0.12, // Tons CO2 offset
      rating: 4.9,
      highlights: 'Private guided canopy walk;Sleep in luxury bio-domes;Farm-to-table gourmet experience;Night wildlife spotting tour',
      itinerary: 'Day 1: Arrival & Welcome Dinner;Day 2: Hanging Bridges & Sky Tram;Day 3: Organic Farm Masterclass & Reforestation Activity;Day 4: Cloud Forest Orchid Reserve & Canopy Spa;Day 5: Departure',
      inclusions: 'Luxury Treehouse Accommodation;All Organic Meals & Organic Wines;Certified Private Eco-Guides;Stripe Offset Certificate',
      exclusions: 'International Flights;Alcoholic beverages outside dinner;Personal souvenirs',
      capacity: 16,
      dates: '2026-09-12;2026-10-05;2026-11-20'
    }
  });

  const packMatterhorn = await prisma.package.create({
    data: {
      name: 'Zermatt Carbon-Free Alpine Explorer',
      description: 'A 7-day winter or summer sustainable expedition through the car-free trails of Zermatt, featuring zero-carbon ski tours, glacier caves, and stays in passive-solar designer chalets.',
      categoryId: catLuxury.id,
      destinationId: destZermatt.id,
      durationDays: 7,
      price: 5200.00,
      maxGuests: 6,
      image: '/images/dest_zermatt.jpg',
      difficulty: 'Moderate',
      carbonFootprint: 0.05,
      rating: 5.0,
      highlights: 'Alpine glacier heli-sking offset;Private Matterhorn spa chalet;100% renewable powered transit;Gourmet Swiss dining',
      itinerary: 'Day 1: Arrival via Electric Train & Alpine Tea;Day 2: Matterhorn Glacier Paradise Tour;Day 3: Sustainable Hiking & Herbal Tasting;Day 4: Guided Glacier Ridge Trekking;Day 5: Thermal Spas & Bio-Sauna;Day 6: Peak Summit Fine Dining;Day 7: Farewell Scenic Train Ride',
      inclusions: '6 Nights in Ultra-Luxe Solar Chalet;All Electric Taxi and Cog Railway passes;Michelin Star Dining;Premium Gear Rentals',
      exclusions: 'Travel Insurance;Spa massages (add-on);Airport transfers outside Switzerland',
      capacity: 12,
      dates: '2026-12-01;2026-12-15;2027-01-10'
    }
  });

  const packSerengeti = await prisma.package.create({
    data: {
      name: 'Serengeti Luxury Solar-Safari & Conservation Program',
      description: 'Immerse yourself in Tanzania’s wild plains. Travel in state-of-the-art solar-charged electric safari vehicles. Track the Great Migration and participate in local Maasai tribal reforestation.',
      categoryId: catAdventure.id,
      destinationId: destSerengeti.id,
      durationDays: 6,
      price: 6800.00,
      maxGuests: 10,
      image: '/images/dest_serengeti.jpg',
      difficulty: 'Challenging',
      carbonFootprint: 0.22,
      rating: 4.85,
      highlights: 'Solar-powered silent e-Safari;Migration tracking by expert trackers;Maasai-led preservation project;Luxury bush canvas lodge sleeping',
      itinerary: 'Day 1: Private airstrip pickup & Sunset drive;Day 2: Morning migration tracking;Day 3: Solar balloon ride (optional) & Maasai Village visit;Day 4: Anti-poaching ranger experience;Day 5: Conservation nursery tree planting;Day 6: Depart to Arusha',
      inclusions: 'Luxury Tented Suite;Eco-Safari transport;National park fees;Reforestation donation;Chef-cooked meals',
      exclusions: 'Tips for trackers;Private balloon ride ($450);Souvenirs',
      capacity: 20,
      dates: '2026-08-10;2026-09-01;2026-10-14'
    }
  });

  // 8. Hotels
  const hotelMonteverde = await prisma.hotel.create({
    data: {
      name: 'Aura Canopy Eco-Resort',
      description: 'A masterpiece of architectural glassmorphism, suspended in the forest canopy. Operated with rainwater filtration systems and biological thermal heating.',
      destinationId: destCloudForest.id,
      image: '/images/hotel_canopy.jpg',
      type: 'Tree Houses',
      rating: 4.95,
      amenities: 'Rainwater Infinity Pool;Biological Spa;Solar Heating;Organic Dining',
      pricePerNight: 750.00,
      latitude: 10.276,
      longitude: -84.824
    }
  });

  const hotelZermatt = await prisma.hotel.create({
    data: {
      name: 'The Matterhorn Solar Chalet',
      description: 'Modern luxury cabins crafted with local pine and stone, heated via geothermic loops and featuring Floor-to-ceiling glass looking out at the mountain.',
      destinationId: destZermatt.id,
      image: '/images/dest_zermatt.jpg',
      type: 'Mountain Cabins',
      rating: 5.0,
      amenities: 'Indoor Hot Springs;Matterhorn View Deck;Zero-Waste Bar;Ski-in/Ski-out Access',
      pricePerNight: 980.00,
      latitude: 46.021,
      longitude: 7.748
    }
  });

  // 9. Rooms
  await prisma.room.createMany({
    data: [
      {
        hotelId: hotelMonteverde.id,
        type: 'Orchid Canopy Suite',
        pricePerNight: 750.00,
        capacity: 2,
        image: '/images/hotel_canopy.jpg',
        amenities: 'Private Suspension Balcony;King Organic Bed;Outdoor Forest Shower'
      },
      {
        hotelId: hotelMonteverde.id,
        type: 'Emerald Canopy Villa',
        pricePerNight: 1200.00,
        capacity: 4,
        image: '/images/hotel_canopy.jpg',
        amenities: 'Private Bio-hot tub;Glass floor view;Personal chef service'
      },
      {
        hotelId: hotelZermatt.id,
        type: 'Solar Crest Deluxe Room',
        pricePerNight: 980.00,
        capacity: 2,
        image: '/images/dest_zermatt.jpg',
        amenities: 'Matterhorn view tub;Fireplace;Zero-waste minibar'
      }
    ]
  });

  // 10. Activities
  await prisma.activity.createMany({
    data: [
      {
        name: 'Cloud Forest Zipline & Skywalk',
        description: 'Soar through the canopy of Monteverde. Fully guided and using eco-friendly carbon-composite safety cabling.',
        destinationId: destCloudForest.id,
        category: 'Hiking',
        durationHours: 3.5,
        price: 120.0,
        image: '/images/dest_cloud_forest.jpg'
      },
      {
        name: 'Serengeti Hot Air Balloon Safari',
        description: 'Float silently above the plains at dawn. Watch herds of zebras, wildebeests, and gazelles wake up. We plant 10 indigenous trees for every flight.',
        destinationId: destSerengeti.id,
        category: 'Safari',
        durationHours: 2.0,
        price: 450.0,
        image: '/images/dest_serengeti.jpg'
      },
      {
        name: 'Kyoto Zen Photography Tour',
        description: 'Wander temple gardens alongside an award-winning travel photographer. Discover historic aesthetics while mastering light.',
        destinationId: destKyoto.id,
        category: 'Wildlife Photography',
        durationHours: 4.0,
        price: 180.0,
        image: '/images/blog_slow_travel.jpg'
      }
    ]
  });

  // 11. Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        userName: 'Aria Montgomery',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        rating: 5,
        comment: 'EcoVoyage completely changed my perspective on luxury travel. Sleeping in a zero-emission treehouse suspended over Monteverde cloud forest while enjoying 5-star organic dinners was unforgettable.',
        location: 'San Francisco, USA',
        isFeatured: true
      },
      {
        userName: 'David Sterling',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        rating: 5,
        comment: 'The solar safari in the Serengeti was silent, powerful, and deeply respectful of the wildlife. Seeing the Great Migration without roaring diesel engines is how safari should always be.',
        location: 'London, UK',
        isFeatured: true
      }
    ]
  });

  // 12. FAQ
  await prisma.faq.createMany({
    data: [
      {
        question: 'How do you calculate and verify the carbon offsets for tours?',
        answer: 'Each tour package has a calculated carbon footprint, covering local transfers, lodging, and activities. We partner with verified Gold Standard carbon offsetting projects to invest in community reforestation and solar initiatives, providing each booking with a verified Certificate of Neutrality.',
        category: 'Sustainability'
      },
      {
        question: 'Can I customize my eco-resort booking or add custom activities?',
        answer: 'Absolutely. EcoVoyage allows you to bundle accommodation and activities like hot air balloons, Zen photography, or private hiking guides directly in your user checkout.',
        category: 'Booking'
      },
      {
        question: 'What measures are in place to support local communities?',
        answer: 'At least 15% of all package prices are directly funnelled into local preservation networks and community employment cooperatives. We exclusively hire native, certified guides and support local organic farmers.',
        category: 'Sustainability'
      }
    ]
  });

  // 13. Blogs
  await prisma.blog.create({
    data: {
      title: 'The Art of Slow Travel: Why Eco-Luxury is the Future',
      content: 'In our fast-paced world, the travel industry is shifting. Travelers no longer seek fast-paced itineraries; they seek deep immersion, quiet elegance, and environmental harmony. This article explores how passive-solar chalets in Switzerland and rainwater eco-resorts in Costa Rica are redefining luxury tourism...',
      image: '/images/blog_slow_travel.jpg',
      category: 'Eco Tips',
      readTime: 6,
      authorId: adminUser.id
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
