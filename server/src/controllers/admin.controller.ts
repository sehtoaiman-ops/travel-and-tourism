import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// ANALYTICS & STATS
// ==========================================
export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();
    
    // Revenue sum
    const confirmedBookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      select: { totalPrice: true, package: { select: { carbonFootprint: true } } },
    });
    
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Carbon offset total (metric tons CO2)
    const totalCarbonOffset = confirmedBookings.reduce((sum, b) => {
      if (b.package) {
        return sum + b.package.carbonFootprint;
      }
      return sum;
    }, 0);

    const totalPackages = await prisma.package.count();
    const totalHotels = await prisma.hotel.count();

    // Dataset for Revenue chart (last 6 bookings or mock monthly distribution)
    const bookingsOverTime = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      take: 8,
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        totalPrice: true,
      },
    });

    const chartData = bookingsOverTime.map(b => ({
      date: b.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: b.totalPrice,
    }));

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalBookings,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalCarbonOffset: parseFloat(totalCarbonOffset.toFixed(2)),
          totalPackages,
          totalHotels,
        },
        chartData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// USER MANAGEMENT
// ==========================================
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, roleName } = req.body;

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      res.status(404).json({ message: 'Role not found.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
      include: { role: true },
    });

    res.status(200).json({ status: 'success', data: { user: updated } });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PACKAGE CRUD
// ==========================================
export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      categoryId,
      destinationId,
      durationDays,
      price,
      maxGuests,
      image,
      difficulty,
      carbonFootprint,
      highlights,
      itinerary,
      inclusions,
      exclusions,
      capacity,
      dates,
    } = req.body;

    const pkg = await prisma.package.create({
      data: {
        name,
        description,
        categoryId,
        destinationId,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests),
        image: image || 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800',
        difficulty,
        carbonFootprint: parseFloat(carbonFootprint) || 0.1,
        highlights: highlights || 'Organic food;Eco transit',
        itinerary: itinerary || 'Day 1: Arrival;Day 2: Wilderness Tour',
        inclusions: inclusions || 'All food;Accommodation',
        exclusions: exclusions || 'Flights',
        capacity: parseInt(capacity) || 10,
        dates: dates || '2026-10-15',
      },
    });

    res.status(201).json({ status: 'success', data: { package: pkg } });
  } catch (error) {
    next(error);
  }
};

export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.durationDays) updateData.durationDays = parseInt(updateData.durationDays);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.maxGuests) updateData.maxGuests = parseInt(updateData.maxGuests);
    if (updateData.carbonFootprint) updateData.carbonFootprint = parseFloat(updateData.carbonFootprint);
    if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);

    const pkg = await prisma.package.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ status: 'success', data: { package: pkg } });
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.package.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Package deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// HOTEL CRUD
// ==========================================
export const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, destinationId, image, type, amenities, pricePerNight, latitude, longitude } = req.body;

    const hotel = await prisma.hotel.create({
      data: {
        name,
        description,
        destinationId,
        image: image || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        type,
        amenities: amenities || 'Solar power;Filtered water',
        pricePerNight: parseFloat(pricePerNight),
        latitude: parseFloat(latitude) || 0.0,
        longitude: parseFloat(longitude) || 0.0,
      },
    });

    res.status(201).json({ status: 'success', data: { hotel } });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// BOOKING MANAGEMENT
// ==========================================
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        package: true,
        hotel: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: { bookings } });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ status: 'success', data: { booking: updated } });
  } catch (error) {
    next(error);
  }
};
