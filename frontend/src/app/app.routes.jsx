import {createBrowserRouter} from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import DashboardPage from "../features/chat/pages/DashboardPage.jsx";
import { Navigate } from "react-router-dom";
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
        path: "/",
        element: <h1>Home Page</h1>
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
    },
    {
        path: "/dashboard",
        element:<Navigate to="/dashboard" replace />
    }
]);
