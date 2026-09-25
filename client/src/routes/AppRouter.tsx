import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import HomePage from '../views/pages/HomePage'
import LoginPage from '../views/pages/LoginPage'
import RegisterPage from '../views/pages/RegisterPage'
import VerifyEmailPage from '../views/pages/VerifyEmailPage'
import ForgotPasswordPage from '../views/pages/ForgotPasswordPage'
import ResetPasswordPage from '../views/pages/ResetPasswordPage'
import DashboardPage from '../views/pages/DashboardPage'
import UnauthorizedPage from '../views/pages/UnauthorizedPage'
import ProtectedRoute from '../views/components/ProtectedRoute'
import RoleRoute from '../views/components/RoleRoute'
import RoleDashboardPage from '../views/pages/RoleDashboardPage'
import PublicProfilePage from '../views/pages/PublicProfilePage'
import EditProfilePage from '../views/pages/EditProfilePage'
import AppLayout from '../views/layouts/AppLayout'
import NotFoundPage from '../views/pages/NotFoundPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/u/:username"
          element={<PublicProfilePage />}
        />
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
          <Route
            path="/profile/edit"
            element={<EditProfilePage />}
          />
        </Route>
        <Route
          element={
            <RoleRoute
              allowedRoles={['student', 'teacher']}
            />
          }
        >
          <Route
            path="/student"
            element={
              <RoleDashboardPage role="student" />
            }
          />
          <Route
            path="/teacher"
            element={
              <RoleDashboardPage role="teacher" />
            }
          />
        </Route>
        <Route
          element={
            <RoleRoute allowedRoles={['reviewer']} />
          }
        >
          <Route
            path="/reviewer"
            element={
              <RoleDashboardPage role="reviewer" />
            }
          />
        </Route>
        <Route
          element={<RoleRoute allowedRoles={['admin']} />}
        >
          <Route
            path="/admin"
            element={
              <RoleDashboardPage role="admin" />
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter