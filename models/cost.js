import mongoose from 'mongoose';

const costSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,

  },
  costOfLiving: {
    monthlyRent: Number,
    monthlyUtilities: Number,
    monthlyTransport: Number,
    monthlyGroceries: Number
  },
  nearbyPlaces: {
    restaurants: {
      count: Number,
      withinMiles: Number
    },
    cafes: {
      count: Number,
      withinMiles: Number
    },
    shopping: {
      count: Number,
      withinMiles: Number
    },
    publicTransport: {
      stations: Number
    }
  }
});

const Cost = mongoose.model('Cost', costSchema, 'cost');
export default Cost;