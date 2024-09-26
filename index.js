const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// Home route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  const { customerName, service, date, time } = req.body;

  try {
    const newBooking = new Booking({ customerName, service, date, time });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: "Error creating booking", err });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving bookings", err });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
