import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import DashboardPage from "../features/chat/pages/DashboardPage.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />
    }
]);
