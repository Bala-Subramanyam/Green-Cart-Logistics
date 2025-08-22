const Routes = require('../models/routeModel');

const getRoutes = async (req, res) => {
  try {
    const routes = await Routes.find().sort({ route_id: 1 });

    if (!routes || routes.length === 0) {
      return res.status(404).json({ message: "there are no routes, add a route first" });
    }

    return res.status(200).json(routes);
  } catch (err) {
    return res.status(500).json({ message: "fetching routes not successful due to server side error" });
  }
};

const getRoute = async (req, res) => {
  try {
    const { route_id } = req.params;
    const myroute = await Routes.findOne({ route_id });

    if (!myroute) {
      return res.status(404).json({ message: "there is no route with this Id" });
    }

    return res.status(200).json(myroute);
  } catch (err) {
    return res.status(500).json({ message: "server side error at getRoute" });
  }
};

const createRoute = async (req, res) => {
  try {
    const { distance_km, traffic_level, base_time_min } = req.body;

    const lastRoute = await Routes.findOne().sort({ route_id: -1 });
    const newRoute_id = lastRoute ? lastRoute.route_id + 1 : 1;

    const newRoute = await Routes.create({
      route_id: newRoute_id,
      distance_km,
      traffic_level,
      base_time_min,
    });

    return res.status(201).json({ message: "created Successfully", data: newRoute });
  } catch (err) {
    return res.status(500).json({ message: "server side error at createRoute" });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { route_id } = req.params;
    const updates = { ...req.body };
    const { __v } = req.body;

    if (__v === undefined || typeof __v !== "number") {
      return res.status(400).json({
        message: "Version (__v) is missing or invalid. Please include the current version number.",
      });
    }

    delete updates.__v;

    const route = await Routes.findOne({ route_id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const updatedRoute = await Routes.findOneAndUpdate(
      { route_id, __v },
      { $set: updates, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedRoute) {
      return res.status(409).json({
        message: "This route was updated by someone else after you fetched it, please retry after fetching again.",
      });
    }

    return res.status(200).json({ message: "updated successfully", route: updatedRoute });
  } catch (err) {
    return res.status(500).json({ message: "error at server side" });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { route_id } = req.params;
    const delRoute = await Routes.findOneAndDelete({ route_id });

    if (!delRoute) {
      return res.status(409).json({ message: `route with this id is not there` });
    }

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "server side error in the backend" });
  }
};

module.exports = {
  getRoute,
  getRoutes,
  createRoute,
  deleteRoute,
  updateRoute,
};
