import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import SourcesPage from "@/pages/SourcesPage";
import OutputsPage from "@/pages/OutputsPage";
import PlaygroundPage from "@/pages/PlaygroundPage";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

const ProtectedRoutes = () => {
  return (
    <OrganizationProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/outputs" element={<OutputsPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </OrganizationProvider>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

export default App;
