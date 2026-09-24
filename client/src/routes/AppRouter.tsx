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

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
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
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
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
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter