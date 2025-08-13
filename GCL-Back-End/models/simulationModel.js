const mongoose = require('mongoose');

const SimulationResultSchema = mongoose.Schema({
  number_of_drivers: {
    type: Number,
    required: true,
  },
  route_start_time: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
  },
  max_hours_per_driver: {
    type: Number,
    required: true,
  },
  total_profit: {
    type: Number,
    required: true,
  },
  efficiency_score: {
    type: Number,
    required: true,
  },
  on_time_deliveries: {
    type: Number,
    required: true,
  },
  late_deliveries: {
    type: Number,
    required: true,
  },
  fuel_cost_breakdown: [
    {
      driver_name: { type: String, required: true },
      fuel_cost: { type: Number, required: true },
    },
  ],
  details: [
    {
      driver_name: { type: String, required: true },
      assigned_orders: { type: Number, required: true },
      total_time_min: { type: Number, required: true },
      profit: { type: Number, required: true },
      on_time_deliveries: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SimulationResult = mongoose.model('SimulationResult', SimulationResultSchema, 'simulationResults');
module.exports = SimulationResult;