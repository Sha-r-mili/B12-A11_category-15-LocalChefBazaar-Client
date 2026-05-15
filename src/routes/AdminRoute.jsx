import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then((res) => {
        setRole(res.data?.role);
        setRoleLoading(false);
      });
    }
  }, [user]);

  if (loading || roleLoading) return <LoadingSpinner />;
  if (role === "admin") return children;
  return <Navigate to="/" replace />;
};

export default AdminRoute;