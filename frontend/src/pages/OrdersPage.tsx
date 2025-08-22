// src/pages/OrdersPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Orders } from "@/api/managementApi";
import type { Order } from "@/types";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const orderSchema = z.object({
  value_rs: z.number().min(1),
  route_id: z.string().min(1),
  delivery_time: z.string().min(1), // e.g. "2025-08-23T10:30:00Z"
});

type OrderForm = z.infer<typeof orderSchema>;

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [searchId, setSearchId] = useState("");
  const [searchedId, setSearchedId] = useState(""); // ✅ keep last searched ID
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch all orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: Orders.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (order: OrderForm) => Orders.create(order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (order_id: number) => Orders.delete(order_id),
    onSuccess: (_, order_id) => {
      queryClient.setQueryData<Order[]>(["orders"], (old) =>
        old ? old.filter((o) => o.order_id !== order_id) : []
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = (data: OrderForm) => {
    createMutation.mutate(data);
    reset();
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setSearchedId(searchId); // ✅ store the searched ID
    try {
      const order = await Orders.getOneByOrderId(Number(searchId));
      setFoundOrder(order);
      setNotFound(false);
    } catch {
      setFoundOrder(null);
      setNotFound(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Create Order */}
      <Card>
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="number"
              placeholder="Value (₹)"
              {...register("value_rs", { valueAsNumber: true })}
            />
            {errors.value_rs && (
              <p className="text-red-500">{errors.value_rs.message}</p>
            )}

            <Input placeholder="Route ID" {...register("route_id")} />
            {errors.route_id && (
              <p className="text-red-500">{errors.route_id.message}</p>
            )}

            <Input placeholder="Delivery Time" {...register("delivery_time")} />
            {errors.delivery_time && (
              <p className="text-red-500">{errors.delivery_time.message}</p>
            )}

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Order */}
      <Card>
        <CardHeader>
          <CardTitle>Search Order by Order ID</CardTitle>
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
              placeholder="Enter Order ID"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>

        {/* ✅ one clean conditional block */}
        {(foundOrder || notFound) && (
          <CardContent>
            {foundOrder ? (
              <>
                <p>
                  <b>Order ID:</b> {foundOrder.order_id}
                </p>
                <p>
                  <b>Value:</b> ₹{foundOrder.value_rs}
                </p>
                <p>
                  <b>Route ID:</b> {foundOrder.route_id}
                </p>
                <p>
                  <b>Delivery Time:</b> {foundOrder.delivery_time}
                </p>
              </>
            ) : (
              <Alert className="text-red-600">
                <AlertTriangle/>
                <AlertTitle>
                    Not Found any Route with Id {searchedId}
                </AlertTitle>
            </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Value (₹)</TableHead>
                  <TableHead>Route ID</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.value_rs}</TableCell>
                    <TableCell>{order.route_id}</TableCell>
                    <TableCell>{order.delivery_time}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(order.order_id)}
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

export default OrdersPage;
