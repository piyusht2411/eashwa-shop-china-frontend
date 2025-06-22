import React from "react";
import Header from "../header";
import ProtectedRoute from "../protectedRoute";
import PiDetails from "./piDetail";

const page = () => {
  return (
    <div>
      <Header />
      <ProtectedRoute>
        <PiDetails />
      </ProtectedRoute>
    </div>
  );
};

export default page;
