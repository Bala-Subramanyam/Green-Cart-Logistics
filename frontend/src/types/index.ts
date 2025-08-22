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