const Driver = require('../models/driverModel');
const Order = require('../models/orderModel');
const Route = require('../models/routeModel');
const SimulationResult = require('../models/simulationModel');

// ---------- Utility Functions ----------
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const isDriverFatigued = (pastWeekHours) => {
  // Fatigue if ANY of last 7 days exceeded 8 hours
  return pastWeekHours
    .split('|')
    .some(hours => parseFloat(hours) > 8);
};

const calculatePotentialProfit = (order, route, fatigued) => {
  const travelTime = fatigued ? route.base_time_min * 1.3 : route.base_time_min;
  const is_on_time = travelTime <= route.base_time_min + 10; // company rule
  const penalty = is_on_time ? 0 : 50;
  const bonus = order.value_rs > 1000 && is_on_time ? order.value_rs * 0.1 : 0;
  const fuel_cost = route.traffic_level === 'High'
    ? route.distance_km * (5 + 2)
    : route.distance_km * 5;

  return {
    profit: order.value_rs + bonus - penalty - fuel_cost,
    is_on_time,
    fuel_cost
  };
};

// ---------- Simulation Endpoint ----------
const runSimulation = async (req, res) => {
  try {
    const { number_of_drivers, route_start_time, max_hours_per_driver } = req.body;

    // ---------- 1. Validate Inputs ----------
    if (!Number.isInteger(number_of_drivers) || number_of_drivers <= 0) {
      return res.status(400).json({ message: 'Number of drivers must be a positive integer' });
    }
    const totalDrivers = await Driver.countDocuments();
    if (number_of_drivers > totalDrivers) {
      return res.status(400).json({ message: `Number of drivers cannot exceed available drivers (${totalDrivers})` });
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!route_start_time || !timeRegex.test(route_start_time)) {
      return res.status(400).json({ message: 'Route start time must be in HH:MM format (e.g., 09:00)' });
    }

    if (typeof max_hours_per_driver !== 'number' || max_hours_per_driver <= 0 || max_hours_per_driver > 24) {
      return res.status(400).json({ message: 'Max hours per driver must be a positive number not exceeding 24' });
    }

    // ---------- 2. Fetch Required Data ----------
    const drivers = await Driver.find().limit(number_of_drivers);
    if (!drivers.length) return res.status(404).json({ message: 'No drivers found' });

    const orders = await Order.find();
    if (!orders.length) return res.status(404).json({ message: 'No orders found' });

    const routeIds = [...new Set(orders.map(order => order.route_id))];
    const routes = await Route.find({ route_id: { $in: routeIds } });
    if (!routes.length) return res.status(404).json({ message: 'No routes found for the orders' });

    // ---------- 3. Prepare Data ----------
    const routeMap = routes.reduce((map, route) => {
      map[route.route_id] = {
        distance_km: route.distance_km,
        traffic_level: route.traffic_level,
        base_time_min: route.base_time_min
      };
      return map;
    }, {});

    const startTimeMin = timeToMinutes(route_start_time);

    // ---------- 4. Prepare Driver Assignments ----------
    const driverAssignments = drivers.map(driver => ({
      name: driver.name,
      orders: [],
      total_time_min: 0,
      isFatigued: isDriverFatigued(driver.past_week_hours),
      fuel_cost: 0
    }));

    // ---------- 5. Allocate Orders (Max Profit First) ----------
    const ordersWithProfit = orders
      .map(order => {
        const route = routeMap[order.route_id];
        if (!route) return null;
        const potential = calculatePotentialProfit(order, route, false); // Initial calc for sorting
        return { order, route, potential_profit: potential.profit };
      })
      .filter(Boolean)
      .sort((a, b) => b.potential_profit - a.potential_profit);

    for (const { order, route } of ordersWithProfit) {
      const availableDriver = driverAssignments
        .filter(d => {
          const adjusted_time = d.isFatigued ? route.base_time_min * 1.3 : route.base_time_min;
          return d.total_time_min + adjusted_time <= max_hours_per_driver * 60;
        })
        .sort((a, b) => a.total_time_min - b.total_time_min)[0];

      if (availableDriver) {
        const adjusted_time = availableDriver.isFatigued ? route.base_time_min * 1.3 : route.base_time_min;
        availableDriver.orders.push(order);
        availableDriver.total_time_min += adjusted_time;
        availableDriver.fuel_cost += route.traffic_level === 'High'
          ? route.distance_km * (5 + 2)
          : route.distance_km * 5;
      }
    }

    // ---------- 6. Calculate KPIs ----------
    let total_profit = 0;
    let on_time_deliveries = 0;
    const total_assigned_orders = driverAssignments.reduce((sum, d) => sum + d.orders.length, 0);

    const kpi_details = driverAssignments.map(driver => {
      let driver_profit = 0;
      let driver_on_time = 0;

      for (const order of driver.orders) {
        const route = routeMap[order.route_id];
        const { profit, is_on_time } = calculatePotentialProfit(order, route, driver.isFatigued);

        driver_profit += profit;
        if (is_on_time) driver_on_time++;
      }

      total_profit += driver_profit;
      on_time_deliveries += driver_on_time;

      return {
        driver_name: driver.name,
        assigned_orders: driver.orders.length,
        total_time_min: driver.total_time_min,
        profit: driver_profit,
        on_time_deliveries: driver_on_time,
        fuel_cost: driver.fuel_cost,
        orders: driver.orders.map(o => o.order_id) // Save assigned orders for history
      };
    });

    const efficiency_score = total_assigned_orders > 0
      ? (on_time_deliveries / total_assigned_orders) * 100
      : 0;

    // ---------- 7. Save to DB ----------
    const simulationResult = await SimulationResult.create({
      number_of_drivers,
      route_start_time,
      max_hours_per_driver,
      total_profit,
      efficiency_score,
      on_time_deliveries,
      late_deliveries: total_assigned_orders - on_time_deliveries,
      fuel_cost_breakdown: driverAssignments.map(d => ({
        driver_name: d.name,
        fuel_cost: d.fuel_cost
      })),
      details: kpi_details,
      createdAt: new Date()
    });

    // ---------- 8. Response ----------
    res.status(200).json({
      message: 'Simulation completed successfully',
      data: {
        simulation_id: simulationResult._id,
        total_profit: total_profit.toFixed(2),
        efficiency_score: efficiency_score.toFixed(2),
        on_time_deliveries,
        late_deliveries: total_assigned_orders - on_time_deliveries,
        fuel_cost_breakdown: driverAssignments.map(d => ({
          driver_name: d.name,
          fuel_cost: d.fuel_cost.toFixed(2)
        })),
        details: kpi_details
      }
    });
  } catch (err) {
    console.error('❌ Error running simulation:', err.message);
    res.status(500).json({ message: 'Server error during simulation', error: err.message });
  }
};

// ---------- Latest Simulation Fetch ----------
const getLatestSimulationResult = async (req, res) => {
  try {
    const latestResult = await SimulationResult.findOne().sort({ createdAt: -1 });
    if (!latestResult) {
      return res.status(404).json({ message: 'No simulation results found' });
    }
    res.status(200).json({ data: latestResult });
  } catch (err) {
    console.error('❌ Error fetching latest simulation:', err.message);
    res.status(500).json({ message: 'Server side error during fetching latest simulation', error: err.message });
  }
};

module.exports = { runSimulation, getLatestSimulationResult };
