import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Groups from './pages/Groups'
import Roles from './pages/Roles'
import Heirarchy from './pages/Heirarchy'
import Resources from './pages/Resources'
import Locations from './pages/Locations'
import NotFound from './pages/NotFound'
import LoginPage from './pages/Login'
import PrivateRoute from './components/auth/PrivateRoute'
import { Navigate } from 'react-router-dom' 

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
      <Route path="/hierarchy" element={<PrivateRoute><Heirarchy /></PrivateRoute>} />
      <Route path="/locations" element={<PrivateRoute><Locations /></PrivateRoute>} />
      <Route path="/roles" element={<PrivateRoute><Roles /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;