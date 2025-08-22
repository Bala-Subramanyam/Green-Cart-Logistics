export interface SimulationResult {
  total_profit: number;
  efficiency_score: number;
  on_time_deliveries: number;
  late_deliveries: number;
  number_of_drivers: number;
  max_hours_per_driver: number;
  route_start_time: string;
  fuel_cost_breakdown: {
    driver_name: string;
    fuel_cost: number;
  }[];
  details: {
    driver_name: string;
    assigned_orders: number;
    total_time_min: number;
    profit: number;
    on_time_deliveries: number;
  }[];
}

export interface Driver{
  name:string,
  shift_hours:number,
  past_week_hours:string
}

export interface Order {
  _id: string;
  order_id: number;
  value_rs: number;
  route_id: string;
  delivery_time: string; // could be Date if backend sends ISO string
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// src/types.ts

export interface Route {
  _id: string;
  route_id: number;
  distance_km: number;
  traffic_level: string;
  base_time_min: number;
  __v: number;
  createdAt?: string;
  updatedAt?: string;
}

