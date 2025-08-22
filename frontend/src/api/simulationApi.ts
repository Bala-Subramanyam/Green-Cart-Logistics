import { api } from "./api";
import type { SimulationResult } from "@/types";
export const latestSimulation={
    latestResult:async ():Promise<SimulationResult>=>{
        const res=await  api.get('/simulation/latest');
        return res.data.data;
    }
}