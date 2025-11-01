import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/mainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Wrap all pages inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
