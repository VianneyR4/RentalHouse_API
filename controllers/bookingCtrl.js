const models = require('../models');
const asyncLib = require('async');
const moment = require('moment');

module.exports = {
  createBooking: async function (req, res) {
    console.log('Request body:', req.body);
  
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    const { propertyId, checkIn, checkOut } = req.body;
    const renterId = req.user.id;
  
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Parse the incoming ISO strings to Date objects for validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
  
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'checkIn must be before checkOut' });
    }
  
    // Generate the datesArray
    const datesArray = [];
    let currentDate = moment(checkInDate);
    const endDate = moment(checkOutDate);
  
    while (currentDate < endDate) {
      datesArray.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'days');
    }
  
    try {
      // Check for overlapping bookings
      const overlappingBookings = await models.Booking.findAll({
        where: {
          propertyId,
          status: ['pending', 'confirmed'],
          [models.Sequelize.Op.or]: [
            {
              checkIn: { [models.Sequelize.Op.between]: [checkIn, checkOut] }, // Use strings for comparison
            },
            {
              checkOut: { [models.Sequelize.Op.between]: [checkIn, checkOut] }, // Use strings for comparison
            },
            {
              [models.Sequelize.Op.and]: [
                { checkIn: { [models.Sequelize.Op.lte]: checkIn } },
                { checkOut: { [models.Sequelize.Op.gte]: checkOut } },
              ],
            },
          ],
        },
      });
  
      if (overlappingBookings.length > 0) {
        return res.status(400).json({ error: 'Property is already booked for the selected dates' });
      }
  
      // Create the booking with checkIn and checkOut as strings
      const newBooking = await models.Booking.create({
        propertyId,
        renterId,
        hostId: req.body.hostId,
        checkIn: checkIn, // Pass the string directly
        checkOut: checkOut, // Pass the string directly
        datesArray,
        status: 'pending',
      });
  
      return res.status(201).json(newBooking);
    } catch (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Unable to create booking', details: err });
    }
  },
  confirmBooking: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { bookingId } = req.params;

    try {
      const booking = await models.Booking.findOne({
        where: { id: bookingId, hostId: req.user.id },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found or unauthorized' });
      }

      if (booking.status !== 'pending') {
        return res.status(400).json({ error: 'Booking is not in a pending state' });
      }

      await booking.update({ status: 'confirmed' });

      return res.status(200).json(booking);
    } catch (err) {
      console.error('Error confirming booking:', err);
      return res.status(500).json({ error: 'Unable to confirm booking', details: err });
    }
  },

  cancelBooking: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { bookingId } = req.params;

    try {
      const booking = await models.Booking.findOne({
        where: { id: bookingId, renterId: req.user.id },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found or unauthorized' });
      }

      if (booking.status === 'canceled') {
        return res.status(400).json({ error: 'Booking is already canceled' });
      }

      await booking.update({ status: 'canceled' });

      return res.status(200).json(booking);
    } catch (err) {
      console.error('Error canceling booking:', err);
      return res.status(500).json({ error: 'Unable to cancel booking', details: err });
    }
  }, 
  getBookingsByHost: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    const hostId = req.user.id;
  
    try {
      const bookings = await models.Booking.findAll({
        where: { hostId },
        include: [
          {
            model: models.Property,
            as: 'property',
          },
          {
            model: models.User,
            as: 'Renter',
          },
        ],
      });
  
      if (bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this host.' });
      }
  
      return res.status(200).json(bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Unable to fetch bookings', details: err });
    }
  },
};