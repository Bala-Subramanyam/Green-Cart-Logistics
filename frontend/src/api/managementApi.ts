// src/api/managementApi.ts
import { api } from "./api";
import type { Driver } from "@/types";
import type { Order } from "@/types";

export const Drivers = {
  // Get all drivers
  getAll: async (): Promise<Driver[]> => {
    const res = await api.get("/drivers");
    return res.data; // assuming backend sends { drivers: [...] }
  },

  // Create a driver
  create: async (driver: Driver) => {
    const res = await api.post("/drivers/create", driver);
    return res.data;
  },

  // Update driver by name
  update: async (name: string, updates: Partial<Driver>) => {
    const res = await api.put(`/drivers/update/${name}`, updates);
    return res.data;
  },

  // Delete driver by name
  delete: async (name: string) => {
    const res = await api.delete(`/drivers/delete/${name}`);
    return res.data;
  },

  // Find single driver by name
  getSingleDriver: async (name: string): Promise<Driver> => {
    const res = await api.get(`/drivers/${name}`);
    return res.data.driver; // assuming backend sends { driver: {...} }
  },
};




export const Orders = {
  getAll: async (): Promise<Order[]> => {
    const res = await api.get("/orders");
    return res.data;
  },

  getOneByOrderId: async (order_id: number): Promise<Order> => {
  const res = await api.get(`/orders/${order_id}`);
  return res.data;
},

  create: async (order: Omit<Order, "_id" | "order_id" | "__v" | "createdAt" | "updatedAt">) => {
    const res = await api.post("/orders/create", order);
    return res.data;
  },

 update: async (order_id: number, updates: Partial<Order>) => {
  const res = await api.put(`/orders/update/${order_id}`, updates);
  return res.data;
},

delete: async (order_id: number) => {
  const res = await api.delete(`/orders/delete/${order_id}`);
  return res.data;
},
};



import type { Route } from "@/types";

export const Routes = {
  // Get all routes
  getAll: async (): Promise<Route[]> => {
    const res = await api.get("/routes");
    return res.data;
  },

  // Get single route by route_id
  getOneById: async (route_id: number): Promise<Route> => {
    const res = await api.get(`/routes/${route_id}`);
    return res.data;
  },

  // Create a route
  create: async (
    route: Omit<Route, "_id" | "route_id" | "__v" | "createdAt" | "updatedAt">
  ) => {
    const res = await api.post("/routes/create", route);
    return res.data;
  },

  // Update a route by route_id
  update: async (route_id: number, updates: Partial<Route>) => {
    const res = await api.put(`/routes/update/${route_id}`, updates);
    return res.data;
  },

  // Delete a route by route_id
  delete: async (route_id: number) => {
    const res = await api.delete(`/routes/delete/${route_id}`);
    return res.data;
  },
};
