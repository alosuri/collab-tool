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
    path: "/collab-tool/",
    element:
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
  },

  {
    path: "/collab-tool/board",
    element:
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
  },

  {
    path: "/collab-tool/settings",
    element:
      <ProtectedRoute>
        <AccountSettings />
      </ProtectedRoute>
  },

  {
    path: "/collab-tool/login",
    element: <Login />
  },

  {
    path: "/collab-tool/*",
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
