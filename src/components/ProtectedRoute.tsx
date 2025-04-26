import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/collab-tool/login");
    }
  }, [loading, session, navigate]);

  if (loading) return <div>Loading...</div>;

  if (!session) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
