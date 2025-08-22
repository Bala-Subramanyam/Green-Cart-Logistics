import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import SimulationPage from "@/pages/SimulationPage";
import ProtectedLayout from "@/components/layout/protectedLayout";
import DriversPage from "@/pages/DriversPage";
import OrdersPage from "@/pages/OrdersPage";
import RoutesPage from "@/pages/RoutesPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/simulation" element={<ProtectedLayout />}>
          <Route index element={<SimulationPage />} />
        </Route>
        <Route path="/drivers" element={<ProtectedLayout />}>
          <Route index element={<DriversPage />} />
        </Route>
        <Route path="/orders" element={<ProtectedLayout />}>
          <Route index element={<OrdersPage/>} />
        </Route>
        <Route path="*" element={<LoginPage />} />
        <Route path="/routes" element={<ProtectedLayout />}>
          <Route index element={<RoutesPage/>} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
