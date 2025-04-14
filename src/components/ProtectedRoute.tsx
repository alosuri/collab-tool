import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router"

const ProtectedRoute = ({ children }: { children: React.ReactNode } ) => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (<div>Loading...</div>);

  if (!session) {
    navigate('/login');
    return null;
  };

  return <>{children}</>
}

export default ProtectedRoute
