import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import Roles from "./pages/Roles";
import Heirarchy from "./pages/Heirarchy";
import Resources from "./pages/Resources";
import Locations from "./pages/Locations";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/heirarchy" element={<Heirarchy />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/locations" element={<Locations />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
