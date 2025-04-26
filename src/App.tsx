import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AccountSettings from "./pages/AccountSettings";

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
  },

  {
    path: "/board",
    element:
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
  },

  {
    path: "/settings",
    element:
      <ProtectedRoute>
        <AccountSettings />
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
