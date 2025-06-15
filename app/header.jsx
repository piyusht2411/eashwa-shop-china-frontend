"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="bg-none">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Logo */}
        <Link href={isLoggedIn ? "/cards" : "/"}>
          <img src="/logo.png" alt="logo" className="w-16 h-12 cursor-pointer" />
        </Link>

        {/* Right Side - Login / Logout */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-orange-600 border border-orange-600 px-4 py-1 rounded-md hover:bg-orange-600 hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-orange-600 border border-orange-600 px-4 py-1 rounded-md hover:bg-orange-600 hover:text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
