import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
export default function Protect_admin() {
  const { user, loading } = useSelector((state) => state.auth_slice || {});
      if (loading?.getMe||loading.getMe==undefined) return <p>Loading...</p>;

      if (!user) return <Navigate to="/login" replace />;

      if (user?.role !== "admin") return <Navigate to="/" replace />;

      return <Outlet />;


}
