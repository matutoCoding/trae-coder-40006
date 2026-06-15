import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Orders from "@/pages/Orders/Orders";
import Material from "@/pages/Material/Material";
import Machine from "@/pages/Machine/Machine";
import Molding from "@/pages/Molding/Molding";
import Quality from "@/pages/Quality/Quality";
import Mold from "@/pages/Mold/Mold";
import Energy from "@/pages/Energy/Energy";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="material" element={<Material />} />
          <Route path="machine" element={<Machine />} />
          <Route path="molding" element={<Molding />} />
          <Route path="quality" element={<Quality />} />
          <Route path="mold" element={<Mold />} />
          <Route path="energy" element={<Energy />} />
        </Route>
      </Routes>
    </Router>
  );
}
