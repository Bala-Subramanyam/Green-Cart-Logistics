const Driver = require('../models/driverModel');
const Order = require('../models/orderModel');
const Route = require('../models/routeModel');
const SimulationResult = require('../models/simulationModel');

// Utility function to convert HH:MM to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Utility function to calculate potential profit for an order
const calculatePotentialProfit = (order, route) => {
  const delivery_time_min = timeToMinutes(order.delivery_time);
  const is_on_time = delivery_time_min <= route.base_time_min + 10;
  const penalty = is_on_time ? 0 : 50;
  const bonus = order.value_rs > 1000 && is_on_time ? order.value_rs * 0.1 : 0;
  const fuel_cost = route.traffic_level === 'High' ? route.distance_km * (5 + 2) : route.distance_km * 5;
  return order.value_rs + bonus - penalty - fuel_cost;
};

// Simulation Endpoint
const runSimulation = async (req, res) => {
  try {
    // 1. Validate inputs
    const { number_of_drivers, route_start_time, max_hours_per_driver } = req.body;

    // Validate number_of_drivers
    if (!Number.isInteger(number_of_drivers) || number_of_drivers <= 0) {
      return res.status(400).json({ message: 'Number of drivers must be a positive integer' });
    }
    const totalDrivers = await Driver.countDocuments();
    if (number_of_drivers > totalDrivers) {
      return res.status(400).json({ message: `Number of drivers cannot exceed available drivers (${totalDrivers})` });
    }

    // Validate route_start_time (HH:MM format)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!route_start_time || !timeRegex.test(route_start_time)) {
      return res.status(400).json({ message: 'Route start time must be in HH:MM format (e.g., 09:00)' });
    }

    // Validate max_hours_per_driver
    if (typeof max_hours_per_driver !== 'number' || max_hours_per_driver <= 0 || max_hours_per_driver > 24) {
      return res.status(400).json({ message: 'Max hours per driver must be a positive number not exceeding 24' });
    }

    // 2. Fetch data using Mongoose
    const drivers = await Driver.find().limit(number_of_drivers);
    const orders = await Order.find();
    const routeIds = [...new Set(orders.map((order) => order.route_id))];
    const routes = await Route.find({ route_id: { $in: routeIds } });

    if (!drivers.length || !orders.length || !routes.length) {
      return res.status(404).json({ message: 'No drivers, orders, or routes found' });
    }

    // Create route map for quick lookup
    const routeMap = routes.reduce((map, route) => {
      map[route.route_id] = {
        distance_km: route.distance_km,
        traffic_level: route.traffic_level,
        base_time_min: route.base_time_min,
      };
      return map;
    }, {});

    // 3. Calculate potential profit for each order and sort
    const ordersWithProfit = orders
      .map((order) => {
        const route = routeMap[order.route_id];
        if (!route) return null;
        return {
          order,
          route,
          potential_profit: calculatePotentialProfit(order, route),
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => b.potential_profit - a.potential_profit); // Sort by profit descending

    // 4. Reallocate orders to maximize profit
    const driverAssignments = drivers.map((driver) => ({
      name: driver.name,
      orders: [],
      total_time_min: 0,
      isFatigued: parseInt(driver.past_week_hours.split('|').slice(-1)[0]) > 8,
      fuel_cost: 0,
    }));

    for (const { order, route } of ordersWithProfit) {
      // Find driver with least total time who can take this order
      const availableDriver = driverAssignments
        .filter((d) => d.total_time_min + (d.isFatigued ? route.base_time_min * 1.3 : route.base_time_min) <= max_hours_per_driver * 60)
        .sort((a, b) => a.total_time_min - b.total_time_min)[0];

      if (availableDriver) {
        const adjusted_time = availableDriver.isFatigued ? route.base_time_min * 1.3 : route.base_time_min;
        availableDriver.orders.push(order);
        availableDriver.total_time_min += adjusted_time;
        availableDriver.fuel_cost += route.traffic_level === 'High' ? route.distance_km * (5 + 2) : route.distance_km * 5;
      }
    }

    // 5. Calculate KPIs
    let total_profit = 0;
    let on_time_deliveries = 0;
    const total_assigned_orders = driverAssignments.reduce((sum, d) => sum + d.orders.length, 0);

    const kpi_details = driverAssignments.map((driver) => {
      let driver_profit = 0;
      let driver_on_time = 0;

      for (const order of driver.orders) {
        const route = routeMap[order.route_id];
        const delivery_time_min = timeToMinutes(order.delivery_time);
        const is_on_time = delivery_time_min <= route.base_time_min + 10;

        // Late Delivery Penalty
        const penalty = is_on_time ? 0 : 50;

        // High-Value Bonus
        const bonus = order.value_rs > 1000 && is_on_time ? order.value_rs * 0.1 : 0;

        // Fuel Cost
        const fuel_cost = route.traffic_level === 'High' ? route.distance_km * (5 + 2) : route.distance_km * 5;

        // Order Profit
        const order_profit = order.value_rs + bonus - penalty - fuel_cost;
        driver_profit += order_profit;

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
      };
    });

    // Efficiency Score
    const efficiency_score = total_assigned_orders > 0 ? (on_time_deliveries / total_assigned_orders) * 100 : 0;

    // 6. Save simulation result to database
    const simulationResult = await SimulationResult.create({
      number_of_drivers,
      route_start_time,
      max_hours_per_driver,
      total_profit,
      efficiency_score,
      on_time_deliveries,
      late_deliveries: total_assigned_orders - on_time_deliveries,
      fuel_cost_breakdown: driverAssignments.map((d) => ({
        driver_name: d.name,
        fuel_cost: d.fuel_cost,
      })),
      details: kpi_details,
      createdAt: new Date(),
    });

    // 7. Return results
    res.status(200).json({
      message: 'Simulation completed successfully',
      data: {
        simulation_id: simulationResult._id,
        total_profit: total_profit.toFixed(2),
        efficiency_score: efficiency_score.toFixed(2),
        on_time_deliveries,
        late_deliveries: total_assigned_orders - on_time_deliveries,
        fuel_cost_breakdown: driverAssignments.map((d) => ({
          driver_name: d.name,
          fuel_cost: d.fuel_cost.toFixed(2),
        })),
        details: kpi_details,
      },
    });
  } catch (err) {
    console.error('❌ Error running simulation:', err.message);
    res.status(500).json({ message: 'Server error during simulation', error: err.message });
  }
};

const getLatestSimulationResult=async (req,res)=>{
    try{
        const latestResult=await SimulationResult.findOne().sort({createdAt:-1});
        if(!latestResult){
            res.status(404).json({message:"no simulation results found"});
        }
        res.status(200).json({data:latestResult});

    }catch(err){
        res.status(500).json({message:"server side error during fetching latest simulation",error:err.message});
    }
}

module.exports = { runSimulation,getLatestSimulationResult };