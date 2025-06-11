"use client";
import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    post: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Form Data:", formData);
    // API call logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center px-2">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-6 sm:mb-8">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Post */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
            <input
              type="text"
              name="post"
              placeholder="Your job title"
              value={formData.post}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
