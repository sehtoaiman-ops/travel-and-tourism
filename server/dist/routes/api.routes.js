"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth = __importStar(require("../controllers/auth.controller"));
const travel = __importStar(require("../controllers/travel.controller"));
const booking = __importStar(require("../controllers/booking.controller"));
const admin = __importStar(require("../controllers/admin.controller"));
const router = (0, express_1.Router)();
// ==========================================
// AUTHENTICATION MODULE
// ==========================================
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', auth_middleware_1.protect, auth.getMe);
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
router.post('/blogs/comment', auth_middleware_1.protect, travel.addComment);
router.get('/testimonials', travel.getTestimonials);
router.get('/faqs', travel.getFaqs);
// ==========================================
// WISHLIST & REVIEWS (PROTECTED CLIENT ACTIONS)
// ==========================================
router.get('/wishlist', auth_middleware_1.protect, travel.getMyWishlist);
router.post('/wishlist/toggle', auth_middleware_1.protect, travel.toggleWishlist);
router.post('/reviews/add', auth_middleware_1.protect, travel.addReview);
// ==========================================
// CUSTOMER RESERVATIONS & PAYMENT MOCK
// ==========================================
router.post('/bookings/create', auth_middleware_1.protect, booking.createBooking);
router.get('/bookings/my', auth_middleware_1.protect, booking.getMyBookings);
router.post('/bookings/confirm', auth_middleware_1.protect, booking.confirmBookingPayment);
// ==========================================
// ENTERPRISE ADMINISTRATOR PORTAL (ADMIN ROLE REQUIRED)
// ==========================================
router.get('/admin/stats', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.getAdminStats);
router.get('/admin/users', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.getAllUsers);
router.post('/admin/users/role', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.updateUserRole);
router.post('/admin/packages', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.createPackage);
router.put('/admin/packages/:id', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.updatePackage);
router.delete('/admin/packages/:id', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.deletePackage);
router.post('/admin/hotels', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.createHotel);
router.get('/admin/bookings', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.getAllBookings);
router.put('/admin/bookings/:id/status', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('ADMIN'), admin.updateBookingStatus);
exports.default = router;
