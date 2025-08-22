// src/pages/RoutesPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Routes } from "@/api/managementApi";
import type { Route } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const routeSchema = z.object({
  distance_km: z.number().min(1),
  traffic_level: z.string().min(1),
  base_time_min: z.number().min(1),
});

type RouteForm = z.infer<typeof routeSchema>;

const RoutesPage = () => {
  const queryClient = useQueryClient();
  const [searchId, setSearchId] = useState("");
  const [searchedId, setSearchedId] = useState(""); // ✅ keep last searched ID
  const [foundRoute, setFoundRoute] = useState<Route | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch all routes
  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ["routes"],
    queryFn: Routes.getAll,
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (route: RouteForm) => Routes.create(route),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routes"] }),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (route_id: number) => Routes.delete(route_id),
    onSuccess: (_, route_id) => {
      queryClient.setQueryData<Route[]>(["routes"], (old) =>
        old ? old.filter((r) => r.route_id !== route_id) : []
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RouteForm>({
    resolver: zodResolver(routeSchema),
  });

  const onSubmit = (data: RouteForm) => {
    createMutation.mutate(data);
    reset();
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setSearchedId(searchId); // ✅ update searchedId
    try {
      const route = await Routes.getOneById(Number(searchId));
      setFoundRoute(route);
      setNotFound(false);
    } catch {
      setFoundRoute(null);
      setNotFound(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Create Route */}
      <Card>
        <CardHeader>
          <CardTitle>Create Route</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="number"
              placeholder="Distance (km)"
              {...register("distance_km", { valueAsNumber: true })}
            />
            {errors.distance_km && (
              <p className="text-red-500">{errors.distance_km.message}</p>
            )}

            <Input placeholder="Traffic Level" {...register("traffic_level")} />
            {errors.traffic_level && (
              <p className="text-red-500">{errors.traffic_level.message}</p>
            )}

            <Input
              type="number"
              placeholder="Base Time (min)"
              {...register("base_time_min", { valueAsNumber: true })}
            />
            {errors.base_time_min && (
              <p className="text-red-500">{errors.base_time_min.message}</p>
            )}

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Route"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Route */}
      <Card>
        <CardHeader>
          <CardTitle>Search Route by Route ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <Input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Route ID"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>

        {/* ✅ one clean conditional block */}
        <CardContent>
          {foundRoute ? (
            <>
              <p><b>Route ID:</b> {foundRoute.route_id}</p>
              <p><b>Distance:</b> {foundRoute.distance_km} km</p>
              <p><b>Traffic Level:</b> {foundRoute.traffic_level}</p>
              <p><b>Base Time:</b> {foundRoute.base_time_min} min</p>
            </>
          ) : notFound ? (
            <Alert className="text-red-600">
                <AlertTriangle/>
                <AlertTitle>
                    Not Found any Route with Id {searchedId}
                </AlertTitle>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Distance (km)</TableHead>
                  <TableHead>Traffic Level</TableHead>
                  <TableHead>Base Time (min)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes?.map((route) => (
                  <TableRow key={route.route_id}>
                    <TableCell>{route.route_id}</TableCell>
                    <TableCell>{route.distance_km}</TableCell>
                    <TableCell>{route.traffic_level}</TableCell>
                    <TableCell>{route.base_time_min}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(route.route_id)}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutesPage;
