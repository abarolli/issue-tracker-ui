import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ROUTES from "../configs/routes";

function PrivateRoute() {
  const token = sessionStorage.getItem("jwt");
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} />;
}

export default PrivateRoute;
