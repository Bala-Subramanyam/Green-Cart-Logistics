export interface SimulationResult {
  simulation_id: string;
  total_profit: string;
  efficiency_score: string;
  on_time_deliveries: number;
  late_deliveries: number;
  fuel_cost_breakdown: {
    driver_name: string;
    fuel_cost: string;
  }[];
  details: {
    driver_name: string;
    assigned_orders: number;
    total_time_min: number;
    profit: number;
    on_time_deliveries: number;
  }[];
}