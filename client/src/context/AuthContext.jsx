import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

const AuthContext = createContext();

const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("city_twin_token")
    );

    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Login
    // -----------------------------

    const login = async (email, password) => {

        const response = await axios.post(
            `${API_URL}/auth/login`,
            {
                email,
                password
            }
        );

        const {
            token,
            user
        } = response.data;

        localStorage.setItem(
            "city_twin_token",
            token
        );

        setToken(token);
        setUser(user);

        return user;
    };


    // -----------------------------
    // Register
    // -----------------------------

    const register = async (
        name,
        email,
        password
    ) => {

        const response = await axios.post(
            `${API_URL}/auth/register`,
            {
                name,
                email,
                password
            }
        );

        const {
            token,
            user
        } = response.data;

        localStorage.setItem(
            "city_twin_token",
            token
        );

        setToken(token);
        setUser(user);

        return user;
    };


    // -----------------------------
    // Logout
    // -----------------------------

    const logout = () => {

        localStorage.removeItem(
            "city_twin_token"
        );

        setToken(null);
        setUser(null);
    };


    // -----------------------------
    // Check existing login
    // -----------------------------

    useEffect(() => {

        const loadUser = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await axios.get(
                    `${API_URL}/auth/me`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data);

            } catch (error) {

                console.log(
                    "Authentication expired"
                );

                logout();

            } finally {

                setLoading(false);

            }
        };

        loadUser();

    }, [token]);


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};