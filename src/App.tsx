import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoutes from "./routes/routeGuards/ProtectedRoutes";
import PublicOnlyRoute from "./routes/routeGuards/PublicRoutes";
import AuthRedirect from "./components/AuthDirect";
const LoginPage = lazy(() => import("./pages/Login"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const ProfilePage = lazy(() => import("./pages/employee/Profile"));
const EmployeeLeavePage = lazy(() => import("./pages/employee/EmployeeLeavePage"));
const EmployeeDetails = lazy(() => import("./pages/admin/EmployeeDetails"));
const LeaveTypePage = lazy(() => import("./pages/admin/LeaveType"));
const LeaveRequestPage = lazy(() => import("./pages/admin/LeaveRequest"));

function App() {

  return (
    <>
      <Router>
        <AuthRedirect />
        <Suspense fallback={<div>loading...</div>}>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />

            {/* Employee routes */}
            <Route element={<ProtectedRoutes allowedRoles={["employee"]} />}>
              <Route element={<DashboardPage />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/employee-leave" element={<EmployeeLeavePage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route element={<DashboardPage />}>
                <Route path="/employee-details" element={<EmployeeDetails />} />
                <Route path="/leave-type" element={<LeaveTypePage />} />
                <Route path="/leave-request" element={<LeaveRequestPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App;
