import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { packageId, hotelId, roomId, checkInDate, checkOutDate, guestsCount } = req.body;

    if (!guestsCount) {
      res.status(400).json({ message: 'Please specify the number of guests.' });
      return;
    }

    let totalPrice = 0;
    let basePricePerGuest = 0;
    
    // 1. Calculate Package Price if applicable
    if (packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (!pkg) {
        res.status(404).json({ message: 'Tour package not found.' });
        return;
      }
      basePricePerGuest += pkg.price;
    }

    // 2. Calculate Lodging Price if applicable
    let hotelPrice = 0;
    if (hotelId && roomId && checkInDate && checkOutDate) {
      const room = await prisma.room.findFirst({
        where: { id: roomId, hotelId },
      });

      if (!room) {
        res.status(404).json({ message: 'Room not found in this hotel.' });
        return;
      }

      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      hotelPrice = room.pricePerNight * diffDays;
    }

    totalPrice = (basePricePerGuest * parseInt(guestsCount)) + hotelPrice;

    // Create the booking in PENDING state
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        packageId: packageId || null,
        hotelId: hotelId || null,
        roomId: roomId || null,
        checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
        checkOutDate: checkOutDate ? new Date(checkOutDate) : new Date(),
        guestsCount: parseInt(guestsCount),
        totalPrice,
        status: 'PENDING',
      },
      include: {
        package: true,
        hotel: true,
        room: true,
      },
    });

    // Generate Stripe mock checkout URL
    const checkoutSessionUrl = `http://localhost:3000/checkout?bookingId=${booking.id}&total=${totalPrice}`;

    res.status(201).json({
      status: 'success',
      data: {
        booking,
        checkoutUrl: checkoutSessionUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        package: { include: { destination: true } },
        hotel: true,
        room: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const confirmBookingPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { bookingId, paymentMethod } = req.body;

    if (!bookingId) {
      res.status(400).json({ message: 'Booking ID is required.' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found.' });
      return;
    }

    if (booking.userId !== req.user.id) {
      res.status(403).json({ message: 'You do not own this booking.' });
      return;
    }

    const transactionId = `txn_${crypto.randomBytes(8).toString('hex')}`;
    const qrCodeContent = `ECOV-TKT-${booking.id}-${transactionId}`;

    // Update booking status and save payment record in a transaction
    const [updatedBooking, payment] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          stripePaymentId: transactionId,
          qrCode: qrCodeContent,
        },
        include: {
          package: true,
          hotel: true,
          room: true,
        },
      }),
      prisma.payment.create({
        data: {
          bookingId,
          amount: booking.totalPrice,
          currency: 'USD',
          status: 'SUCCESS',
          method: paymentMethod || 'STRIPE',
          transactionId,
        },
      }),
      prisma.notification.create({
        data: {
          userId: req.user.id,
          title: 'Booking Confirmed!',
          message: `Your booking for ${booking.packageId ? 'eco tour' : 'resort'} is confirmed. Transaction ID: ${transactionId}.`,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed successfully.',
      data: {
        booking: updatedBooking,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};
