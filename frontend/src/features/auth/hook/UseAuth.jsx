import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice.js";
import { login, register, getme, logout } from "../services/auth.api.js";

export const useAuth = () => {
    const dispatch = useDispatch();

    // Returns true on success so pages can decide where to navigate.
    const loginUser = async (email, password) => {
        dispatch(setError(null));
        try {
            const data = await login(email, password);
            dispatch(setUser(data.user));
            return true;
        }
        catch (error) {
            dispatch(setError(error.message || 'Login failed'));
            return false;
        }
    };

    const registerUser = async (username, email, password) => {
        dispatch(setError(null));
        try {
            return await register(username, email, password);
        }
        catch (error) {
            dispatch(setError(error.message || 'Registration failed'));
            return null;
        }
    };

    const fetchCurrentUser = async () => {
        dispatch(setLoading(true));
        try {
            const data = await getme();
            dispatch(setUser(data.user));
        }
        catch {
            // Not being logged in is the normal case here, not an error to show.
            dispatch(setUser(null));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = async () => {
        try {
            await logout();
        }
        finally {
            dispatch(setUser(null));
        }
    };

    const clearError = () => dispatch(setError(null));

    return {
        loginUser,
        registerUser,
        fetchCurrentUser,
        logoutUser,
        clearError,
    };
}
