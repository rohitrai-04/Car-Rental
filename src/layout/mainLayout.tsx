import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow px-4 md:px-10 py-6">
        <Outlet /> {/* ✅ This renders the current route's content */}
      </main>
    </div>
  );
};

export default MainLayout;
