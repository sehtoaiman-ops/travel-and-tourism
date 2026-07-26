"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAiRecommendations = exports.calculateCarbonFootprint = exports.submitContactMessage = exports.subscribeNewsletter = exports.getFaqs = exports.getTestimonials = exports.addComment = exports.getBlogDetails = exports.getBlogs = exports.addReview = exports.toggleWishlist = exports.getMyWishlist = exports.getActivities = exports.getHotelDetails = exports.getHotels = exports.getPackageDetails = exports.getPackages = exports.getDestinationDetails = exports.getDestinations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ==========================================
// DESTINATIONS
// ==========================================
const getDestinations = async (req, res, next) => {
    try {
        const destinations = await prisma.destination.findMany({
            include: { country: true },
        });
        res.status(200).json({ status: 'success', data: { destinations } });
    }
    catch (error) {
        next(error);
    }
};
exports.getDestinations = getDestinations;
const getDestinationDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const destination = await prisma.destination.findUnique({
            where: { id },
            include: { country: true, packages: true, hotels: true, activities: true },
        });
        if (!destination) {
            res.status(404).json({ message: 'Destination not found.' });
            return;
        }
        res.status(200).json({ status: 'success', data: { destination } });
    }
    catch (error) {
        next(error);
    }
};
exports.getDestinationDetails = getDestinationDetails;
// ==========================================
// PACKAGES (TOURS)
// ==========================================
const getPackages = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice, difficulty, rating } = req.query;
        const filter = {};
        if (search) {
            filter.OR = [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } },
            ];
        }
        if (category) {
            filter.category = { slug: String(category) };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.gte = parseFloat(String(minPrice));
            if (maxPrice)
                filter.price.lte = parseFloat(String(maxPrice));
        }
        if (difficulty) {
            filter.difficulty = String(difficulty);
        }
        if (rating) {
            filter.rating = { gte: parseFloat(String(rating)) };
        }
        const packages = await prisma.package.findMany({
            where: filter,
            include: { destination: { include: { country: true } }, category: true },
        });
        res.status(200).json({ status: 'success', results: packages.length, data: { packages } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPackages = getPackages;
const getPackageDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pkg = await prisma.package.findUnique({
            where: { id },
            include: {
                destination: { include: { country: true } },
                category: true,
                reviews: { include: { user: { select: { name: true, avatar: true } } } },
            },
        });
        if (!pkg) {
            res.status(404).json({ message: 'Tour package not found.' });
            return;
        }
        res.status(200).json({ status: 'success', data: { package: pkg } });
    }
    catch (error) {
        next(error);
    }
};
exports.getPackageDetails = getPackageDetails;
// ==========================================
// HOTELS & ECO-RESORTS
// ==========================================
const getHotels = async (req, res, next) => {
    try {
        const { destinationId, type } = req.query;
        const filter = {};
        if (destinationId)
            filter.destinationId = String(destinationId);
        if (type)
            filter.type = String(type);
        const hotels = await prisma.hotel.findMany({
            where: filter,
            include: { destination: true, rooms: true },
        });
        res.status(200).json({ status: 'success', data: { hotels } });
    }
    catch (error) {
        next(error);
    }
};
exports.getHotels = getHotels;
const getHotelDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            include: { destination: true, rooms: true },
        });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found.' });
            return;
        }
        res.status(200).json({ status: 'success', data: { hotel } });
    }
    catch (error) {
        next(error);
    }
};
exports.getHotelDetails = getHotelDetails;
// ==========================================
// ACTIVITIES
// ==========================================
const getActivities = async (req, res, next) => {
    try {
        const { destinationId } = req.query;
        const filter = {};
        if (destinationId)
            filter.destinationId = String(destinationId);
        const activities = await prisma.activity.findMany({
            where: filter,
            include: { destination: true },
        });
        res.status(200).json({ status: 'success', data: { activities } });
    }
    catch (error) {
        next(error);
    }
};
exports.getActivities = getActivities;
// ==========================================
// WISHLIST
// ==========================================
const getMyWishlist = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Please log in.' });
            return;
        }
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: req.user.id },
            include: { package: { include: { destination: true } } },
        });
        res.status(200).json({ status: 'success', data: { wishlist } });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyWishlist = getMyWishlist;
const toggleWishlist = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Please log in.' });
            return;
        }
        const { packageId } = req.body;
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_packageId: { userId: req.user.id, packageId },
            },
        });
        if (existing) {
            await prisma.wishlist.delete({
                where: { id: existing.id },
            });
            res.status(200).json({ status: 'success', action: 'removed', message: 'Package removed from wishlist.' });
        }
        else {
            await prisma.wishlist.create({
                data: { userId: req.user.id, packageId },
            });
            res.status(200).json({ status: 'success', action: 'added', message: 'Package saved to wishlist.' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.toggleWishlist = toggleWishlist;
// ==========================================
// REVIEWS
// ==========================================
const addReview = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Please log in.' });
            return;
        }
        const { packageId, rating, comment } = req.body;
        if (!packageId || !rating || !comment) {
            res.status(400).json({ message: 'Please provide packageId, rating, and comment.' });
            return;
        }
        const review = await prisma.review.upsert({
            where: {
                userId_packageId: { userId: req.user.id, packageId },
            },
            update: { rating: parseInt(rating), comment },
            create: {
                userId: req.user.id,
                packageId,
                rating: parseInt(rating),
                comment,
            },
        });
        // Update package rating average
        const allReviews = await prisma.review.findMany({ where: { packageId } });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await prisma.package.update({
            where: { id: packageId },
            data: { rating: parseFloat(avgRating.toFixed(2)) },
        });
        res.status(200).json({ status: 'success', data: { review } });
    }
    catch (error) {
        next(error);
    }
};
exports.addReview = addReview;
// ==========================================
// BLOGS & COMMENTS
// ==========================================
const getBlogs = async (req, res, next) => {
    try {
        const { category } = req.query;
        const filter = {};
        if (category)
            filter.category = String(category);
        const blogs = await prisma.blog.findMany({
            where: filter,
            include: {
                author: { select: { name: true, avatar: true } },
                comments: { include: { user: { select: { name: true, avatar: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ status: 'success', data: { blogs } });
    }
    catch (error) {
        next(error);
    }
};
exports.getBlogs = getBlogs;
const getBlogDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: {
                author: { select: { name: true, avatar: true } },
                comments: {
                    include: { user: { select: { name: true, avatar: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!blog) {
            res.status(404).json({ message: 'Blog post not found.' });
            return;
        }
        res.status(200).json({ status: 'success', data: { blog } });
    }
    catch (error) {
        next(error);
    }
};
exports.getBlogDetails = getBlogDetails;
const addComment = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Please log in.' });
            return;
        }
        const { blogId, content } = req.body;
        if (!blogId || !content) {
            res.status(400).json({ message: 'Please provide blogId and content.' });
            return;
        }
        const comment = await prisma.comment.create({
            data: {
                blogId,
                userId: req.user.id,
                content,
            },
            include: { user: { select: { name: true, avatar: true } } },
        });
        res.status(201).json({ status: 'success', data: { comment } });
    }
    catch (error) {
        next(error);
    }
};
exports.addComment = addComment;
// ==========================================
// TESTIMONIALS & FAQS
// ==========================================
const getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await prisma.testimonial.findMany();
        res.status(200).json({ status: 'success', data: { testimonials } });
    }
    catch (error) {
        next(error);
    }
};
exports.getTestimonials = getTestimonials;
const getFaqs = async (req, res, next) => {
    try {
        const faqs = await prisma.faq.findMany();
        res.status(200).json({ status: 'success', data: { faqs } });
    }
    catch (error) {
        next(error);
    }
};
exports.getFaqs = getFaqs;
// ==========================================
// NEWSLETTER & CONTACT
// ==========================================
const subscribeNewsletter = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required.' });
            return;
        }
        await prisma.newsletterSubscription.upsert({
            where: { email },
            update: {},
            create: { email },
        });
        res.status(200).json({ status: 'success', message: 'Subscribed successfully to EcoVoyage Gazette!' });
    }
    catch (error) {
        next(error);
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const submitContactMessage = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.status(400).json({ message: 'Please provide all message details.' });
            return;
        }
        const contact = await prisma.contactMessage.create({
            data: { name, email, subject, message },
        });
        res.status(201).json({ status: 'success', data: { contact } });
    }
    catch (error) {
        next(error);
    }
};
exports.submitContactMessage = submitContactMessage;
// ==========================================
// CARBON OFFSET CALCULATOR
// ==========================================
const calculateCarbonFootprint = (req, res) => {
    const { transportType, flightHours, accommodationDays } = req.body;
    // Basic calculations (metric tons of CO2 equivalent)
    // Flight: ~0.15 tons per hour
    // Driving: ~0.02 tons per day
    // Hotel: ~0.015 tons per day
    let flightOffset = (parseFloat(flightHours) || 0) * 0.15;
    let accommodationOffset = (parseInt(accommodationDays) || 0) * 0.015;
    let transportOffset = 0;
    if (transportType === 'SUV' || transportType === 'CAR') {
        transportOffset = 0.05;
    }
    else if (transportType === 'ELECTRIC') {
        transportOffset = 0.005;
    }
    const totalCarbon = parseFloat((flightOffset + accommodationOffset + transportOffset).toFixed(3));
    // Cost to offset: $15 per metric ton
    const offsetCost = parseFloat((totalCarbon * 15).toFixed(2));
    res.status(200).json({
        status: 'success',
        data: {
            totalCarbonTons: totalCarbon,
            offsetCostUsd: offsetCost,
            recommendedTreesCount: Math.ceil(totalCarbon * 8), // roughly 8 trees offsets 1 ton CO2
        },
    });
};
exports.calculateCarbonFootprint = calculateCarbonFootprint;
// ==========================================
// AI TRAVEL RECOMMENDATION
// ==========================================
const getAiRecommendations = async (req, res, next) => {
    try {
        const { interests, budget, duration, carbonImportance } = req.body;
        // Fallback: fetch all packages, rank based on criteria
        const packages = await prisma.package.findMany({
            include: { destination: { include: { country: true } } },
        });
        const ranked = packages.map((pkg) => {
            let score = 0;
            // Match category
            if (interests && Array.isArray(interests)) {
                interests.forEach((interest) => {
                    if (pkg.name.toLowerCase().includes(interest.toLowerCase()) ||
                        pkg.description.toLowerCase().includes(interest.toLowerCase())) {
                        score += 15;
                    }
                });
            }
            // Budget scoring
            if (budget) {
                const maxBudget = parseFloat(budget);
                if (pkg.price <= maxBudget) {
                    score += 20;
                    // closer to maximum budget gives better fit matching
                    score += (pkg.price / maxBudget) * 10;
                }
                else {
                    score -= 30; // penalty
                }
            }
            // Carbon score
            if (carbonImportance === 'HIGH') {
                // Lower footprint = higher score
                score += (1 - pkg.carbonFootprint) * 25;
            }
            // Duration scoring
            if (duration) {
                const preferredDuration = parseInt(duration);
                const diff = Math.abs(pkg.durationDays - preferredDuration);
                score += Math.max(0, 20 - diff * 4); // max 20 points
            }
            return { package: pkg, matchScore: Math.round(score) };
        });
        // Sort by matches and filter top 3
        const recommendations = ranked
            .filter((r) => r.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3);
        res.status(200).json({
            status: 'success',
            data: {
                recommendations,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAiRecommendations = getAiRecommendations;
