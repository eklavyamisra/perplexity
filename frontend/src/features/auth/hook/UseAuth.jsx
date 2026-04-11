import { useDispatch } from "react-redux";
import {setUser , setLoading, setError } from "../auth.slice.js";
import { login, register, getme } from "../services/auth.api.js";

export const useAuth = () => {
    const dispatch = useDispatch();

    const loginUser = async (email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await login(email, password);
            dispatch(setUser(data.user));
        }
        catch (error) {
            dispatch(setError(error.message || 'Login failed'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    const registerUser = async (username, email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await register(username, email, password);
            dispatch(setUser(data.user));
        }
        catch (error) {
            dispatch(setError(error.message || 'Registration failed'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    const fetchCurrentUser = async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getme();
            dispatch(setUser(data.user));
        }
        catch (error) {
            dispatch(setError(error.message || 'Failed to fetch user data'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    return {
        loginUser,
        registerUser,
        fetchCurrentUser,
    };
}
