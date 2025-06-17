"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://eashwa-china-backend.vercel.app/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save user & token correctly
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.authToken); // ✅ Use authToken

      // ✅ Redirect after login
      router.push("/cards");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-orange-100 flex items-center justify-center px-2">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-6 sm:mb-8">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              name="email"
              placeholder="Enter email or username"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-300"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
