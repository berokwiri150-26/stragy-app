import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Pages/Auth/login.jsx'
import SignupPlaceholder from './Pages/Auth/SignupPlaceholder.jsx'
import ProtectedRoute from './Routes/ProtectedRoute.jsx'
import AdminPortal from './Pages/AdminPortal/aportal.jsx'
import Overview from './Pages/AdminPortal/pages/Overview.jsx'
import Users from './Pages/AdminPortal/pages/Users.jsx'
import Clans from './Pages/AdminPortal/pages/Clans.jsx'
import Moderation from './Pages/AdminPortal/pages/Moderation.jsx'
import Settings from './Pages/AdminPortal/pages/Settings.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPlaceholder />} />

        {/* Admin section — wrapped in the session guard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPortal />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="clans" element={<Clans />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
