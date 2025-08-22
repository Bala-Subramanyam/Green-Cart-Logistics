import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {  runSimulation } from "@/api/simulationApi";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Dashboard from "./DashboardPage"; // reuse the dashboard view

// Schema for validation
const simulationSchema = z.object({
  number_of_drivers: z.number().min(1, "Must be at least 1"),
  route_start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
  max_hours_per_driver: z.number().min(1).max(24),
});

type SimulationForm = z.infer<typeof simulationSchema>;

const SimulationPage = () => {
  const [showResult, setShowResult] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SimulationForm>({
    resolver: zodResolver(simulationSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SimulationForm) => runSimulation.start(data),
    onSuccess: () => setShowResult(true),
  });

  const onSubmit = (data: SimulationForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Run Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Number of Drivers */}
            <div>
              <Label htmlFor="drivers">Number of Drivers</Label><br />
              <Input type="number" id="drivers" {...register("number_of_drivers", { valueAsNumber: true })} />
              {errors.number_of_drivers && <p className="text-red-500 text-sm">{errors.number_of_drivers.message}</p>}
            </div>

            {/* Route Start Time */}
            <div>
              <Label htmlFor="start">Route Start Time (HH:MM)</Label><br />
              <Input type="text" id="start" placeholder="09:00" {...register("route_start_time")} />
              {errors.route_start_time && <p className="text-red-500 text-sm">{errors.route_start_time.message}</p>}
            </div>

            {/* Max Hours */}
            <div>
              <Label htmlFor="hours">Max Hours per Driver</Label><br />
              <Input type="number" id="hours" {...register("max_hours_per_driver", { valueAsNumber: true })} />
              {errors.max_hours_per_driver && <p className="text-red-500 text-sm">{errors.max_hours_per_driver.message}</p>}
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Running..." : "Run Simulation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Show results by reusing dashboard */}
      {showResult && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Dashboard />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationPage;
