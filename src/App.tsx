import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
  },

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "*",
    element: <NotFound />
  }
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
