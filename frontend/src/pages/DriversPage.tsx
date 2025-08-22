// src/pages/Drivers.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drivers } from "../api/managementApi";
import type { Driver } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const driverSchema = z.object({
  name: z.string().min(1),
  shift_hours: z.number().min(1),
  past_week_hours: z.string().regex(/^(\d+\|){6}\d+$/, "Must be 7 values separated by |"),
});

type DriverForm = z.infer<typeof driverSchema>;

const DriversPage = () => {
  const queryClient = useQueryClient();
  const [searchName, setSearchName] = useState("");
  const [searchedName, setSearchedName] = useState(""); // ✅ store last searched name
  const [foundDriver, setFoundDriver] = useState<Driver | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch all drivers
  const { data: drivers, isLoading } = useQuery<Driver[]>({
    queryKey: ["drivers"],
    queryFn: Drivers.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (driver: DriverForm) => Drivers.create(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => Drivers.delete(name),
    onSuccess: (_, name) => {
      queryClient.setQueryData<Driver[]>(["drivers"], (old) =>
        old ? old.filter((d) => d.name !== name) : []
      );
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema),
  });

  const onSubmit = (data: DriverForm) => {
    createMutation.mutate(data);
    reset();
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    setSearchedName(searchName); // ✅ keep what we searched for
    try {
      const driver = await Drivers.getSingleDriver(searchName);
      setFoundDriver(driver);
      setNotFound(false);
    } catch (err) {
      setFoundDriver(null);
      setNotFound(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Create Driver */}
      <Card>
        <CardHeader>
          <CardTitle>Create Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Input type="number" placeholder="Shift Hours" {...register("shift_hours", { valueAsNumber: true })} />
            {errors.shift_hours && <p className="text-red-500">{errors.shift_hours.message}</p>}

            <Input placeholder="Past week hours (e.g., 7|10|7|7|9|9|8)" {...register("past_week_hours")} />
            {errors.past_week_hours && <p className="text-red-500">{errors.past_week_hours.message}</p>}

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Driver"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Driver */}
      <Card>
        <CardHeader>
          <CardTitle>Search Driver</CardTitle>
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
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter driver name"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>

        {/* ✅ Found or Not Found */}
        {(foundDriver || notFound) && (
          <CardContent>
            {foundDriver ? (
              <>
                <p><b>Name:</b> {foundDriver.name}</p>
                <p><b>Shift Hours:</b> {foundDriver.shift_hours}</p>
                <p><b>Past Week Hours:</b> {foundDriver.past_week_hours}</p>
              </>
            ) : (
              <Alert className="text-red-600">
                <AlertTriangle/>
                <AlertTitle>
                    Not Found any Driver with name {searchedName}
                </AlertTitle>
            </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Driver List */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Shift Hours</TableHead>
                  <TableHead>Past Week Hours</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers?.map((driver) => (
                  <TableRow key={driver.name}>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.shift_hours}</TableCell>
                    <TableCell>{driver.past_week_hours}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(driver.name)}
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

export default DriversPage;
