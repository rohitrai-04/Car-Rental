import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Headphones, Heart, Bell } from "lucide-react";
import logo from "/logo/logo.png"; // public/logo/logo.png

interface NavLink {
  name: string;
  path: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [city, setCity] = useState("Fetching...");
  const [error, setError] = useState<string | null>(null);

  const navLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  // 📍 Fetch live city
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "Unknown";
          setCity(cityName);
        } catch {
          setError("Unable to fetch city name");
        }
      },
      (err) => {
        if (err.code === 1) setError("Permission denied");
        else setError("Location error");
      }
    );
  }, []);

  return (
    <>
      {/* Header Section */}
      <header className="w-full bg-gray-100 px-6 md:px-12 py-3 flex items-center justify-between fixed top-0 left-0 z-40 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
       <div>
           <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            RAI TRADERS
          </h1>
          <p className="tracking-widest">TOURS & TRAVELS</p>
       </div>
        </div>

        {/* Middle: Nav — hidden below 800px */}
        <nav className="hidden md:flex items-center bg-blue-500 rounded-full px-3 py-1 gap-1 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setActive(link.path)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                active === link.path
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold text-white">
            <MapPin size={16} />
            {error ? <span>{error}</span> : <span>{city}</span>}
          </div>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-200 transition">
            <Headphones size={18} />
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-200 transition">
            <Heart size={18} />
          </button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-200 transition">
            <Bell size={18} />
          </button>
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-9 h-9 rounded-full border border-gray-300"
          />
        </div>
      </header>

      {/*  floating navbar only for small screen*/}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg z-50">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setActive(link.path)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              active === link.path
                ? "bg-white text-black"
                : "text-white hover:bg-white hover:text-black"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Header;
