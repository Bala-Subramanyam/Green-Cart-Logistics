import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ✅ Only import the needed icons explicitly
import { TrendingUp, Gauge } from "lucide-react";
import { latestSimulation } from "@/api/simulationApi";
import { useQuery } from "@tanstack/react-query";
import type { SimulationResult } from "@/types";


const COLORS = ["#4CAF50", "#FF5722"];

const Dashboard = () => {
  

  const { data, isLoading, isError, error } = useQuery<SimulationResult,Error>({
    queryKey: ["latestSimulation"],
    queryFn:()=> latestSimulation.latestResult(),
    refetchInterval: 10000, // optional: auto-refresh every 10s
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Error loading data: {(error as any).message}</div>;

  if (!data) return <div>Loading dashboard...</div>;

  const pieData = [
    { name: "On-time", value: data.on_time_deliveries },
    { name: "Late", value: data.late_deliveries },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profit Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Total Profit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₹{data.total_profit.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Efficiency Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            Efficiency Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{data.efficiency_score.toFixed(2)}%</p>
        </CardContent>
      </Card>

      {/* On-time vs Late Deliveries Chart */}
      <Card>
        <CardHeader>
          <CardTitle>On-time vs Late Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fuel Cost Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.fuel_cost_breakdown}>
              <XAxis dataKey="driver_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fuel_cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Driver Performance Table */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Driver Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>On-time Deliveries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.details.map((d) => (
                <TableRow key={d.driver_name}>
                  <TableCell>{d.driver_name}</TableCell>
                  <TableCell>{d.assigned_orders}</TableCell>
                  <TableCell>₹{d.profit.toFixed(2)}</TableCell>
                  <TableCell>{d.on_time_deliveries}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
