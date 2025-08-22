import { api } from "./api";
import type { SimulationResult } from "@/types";
export const latestSimulation={
    latestResult:async ():Promise<SimulationResult>=>{
        const res=await  api.get('/simulation/latest');
        return res.data.data;
    }

};
export const runSimulation = {
  start: async (payload: {
    number_of_drivers: number;
    route_start_time: string;
    max_hours_per_driver: number;
  }) => {
    const res=await api.post('/simulation/run',payload);
    return res.data.data; // simulation result object
  },
};