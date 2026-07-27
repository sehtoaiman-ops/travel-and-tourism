import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import * as auth from '../controllers/auth.controller';
import * as travel from '../controllers/travel.controller';
import * as booking from '../controllers/booking.controller';
import * as admin from '../controllers/admin.controller';

const router = Router();

// ==========================================
// AUTHENTICATION MODULE
// ==========================================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.getMe);

// ==========================================
// SUSTAINABILITY & HELPERS
// ==========================================
router.post('/carbon/calculate', travel.calculateCarbonFootprint);
router.post('/ai/recommend', travel.getAiRecommendations);
router.post('/newsletter/subscribe', travel.subscribeNewsletter);
router.post('/contact', travel.submitContactMessage);

// ==========================================
// DESTINATIONS
// ==========================================
router.get('/destinations', travel.getDestinations);
router.get('/destinations/:id', travel.getDestinationDetails);

// ==========================================
// TOURS & PACKAGES
// ==========================================
router.get('/packages', travel.getPackages);
router.get('/packages/:id', travel.getPackageDetails);

// ==========================================
// ECO-LODGING & ACTIVITIES
// ==========================================
router.get('/hotels', travel.getHotels);
router.get('/hotels/:id', travel.getHotelDetails);
router.get('/activities', travel.getActivities);

// ==========================================
// BLOGS & FAQS & TESTIMONIALS
// ==========================================
router.get('/blogs', travel.getBlogs);
router.get('/blogs/:id', travel.getBlogDetails);
router.post('/blogs/comment', protect, travel.addComment);

router.get('/testimonials', travel.getTestimonials);
router.get('/faqs', travel.getFaqs);

// ==========================================
// WISHLIST & REVIEWS (PROTECTED CLIENT ACTIONS)
// ==========================================
router.get('/wishlist', protect, travel.getMyWishlist);
router.post('/wishlist/toggle', protect, travel.toggleWishlist);
router.post('/reviews/add', protect, travel.addReview);

// ==========================================
// CUSTOMER RESERVATIONS & PAYMENT MOCK
// ==========================================
router.post('/bookings/create', protect, booking.createBooking);
router.get('/bookings/my', protect, booking.getMyBookings);
router.post('/bookings/confirm', protect, booking.confirmBookingPayment);

// ==========================================
// ENTERPRISE ADMINISTRATOR PORTAL (ADMIN ROLE REQUIRED)
// ==========================================
router.get('/admin/stats', protect, restrictTo('ADMIN'), admin.getAdminStats);
router.get('/admin/users', protect, restrictTo('ADMIN'), admin.getAllUsers);
router.post('/admin/users/role', protect, restrictTo('ADMIN'), admin.updateUserRole);

router.post('/admin/packages', protect, restrictTo('ADMIN'), admin.createPackage);
router.put('/admin/packages/:id', protect, restrictTo('ADMIN'), admin.updatePackage);
router.delete('/admin/packages/:id', protect, restrictTo('ADMIN'), admin.deletePackage);

router.post('/admin/hotels', protect, restrictTo('ADMIN'), admin.createHotel);

router.get('/admin/bookings', protect, restrictTo('ADMIN'), admin.getAllBookings);
router.put('/admin/bookings/:id/status', protect, restrictTo('ADMIN'), admin.updateBookingStatus);

export default router;
