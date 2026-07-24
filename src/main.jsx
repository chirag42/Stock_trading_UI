import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import Watchlist from "./pages/Watchlist";
import ComingSoon from "./pages/ComingSoon";
import { getToken } from "./api";
import "./styles.css";

function ProtectedLayout() {
  return getToken() ? <Layout /> : <Navigate to="/login" />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/retirement" element={<ComingSoon title="Retirement" />} />
        <Route path="/finance" element={<ComingSoon title="Finance" />} />
        <Route path="/budgeting" element={<ComingSoon title="Budgeting" />} />
        <Route path="/stock/:ticker" element={<StockDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);
