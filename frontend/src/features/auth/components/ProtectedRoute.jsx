import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { LogoMark } from "../../../components/Logo.jsx";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector(state => state.auth);

    if (loading) {
        return (
            <div className="boot" aria-busy="true">
                <span className="wordmark"><LogoMark /></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
