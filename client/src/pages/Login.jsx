import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                email,
                password
            );

            navigate("/");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">

            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

                <div className="mb-8 text-center">

                    <div className="mb-3 text-4xl">
                        🌆
                    </div>

                    <h1 className="text-3xl font-bold">
                        City Digital Twin
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Sign in to monitor your city
                    </p>

                </div>


                {error && (
                    <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                    </div>


                    <div>

                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-blue-400 hover:text-blue-300"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;