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
            await login(email, password);
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
        <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

            {/* Background textures */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/70 blur-sm" />
            <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-sm" />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50/80 to-transparent" />

            {/* Decorative grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">

                <div className="flex items-center gap-3">

                    <div className="relative flex h-11 w-11 items-end justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-emerald-400 shadow-lg shadow-blue-200">

                        <div className="flex items-end gap-[2px] pb-2">
                            <span className="h-4 w-1.5 rounded-t-sm bg-white/90" />
                            <span className="h-7 w-1.5 rounded-t-sm bg-white" />
                            <span className="h-5 w-1.5 rounded-t-sm bg-white/90" />
                            <span className="h-9 w-1.5 rounded-t-sm bg-white" />
                        </div>

                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                            City <span className="text-blue-600">Digital Twin</span>
                        </h1>

                        <p className="hidden text-xs text-slate-400 sm:block">
                            Smart city management platform
                        </p>
                    </div>

                </div>

                <div className="hidden items-center gap-3 text-sm text-slate-500 sm:flex">
                    <span>Smarter Cities</span>
                    <span className="h-1 w-1 rounded-full bg-blue-500" />
                    <span>Better Tomorrow</span>
                </div>

            </header>

            {/* Main */}
            <main className="relative z-10 flex min-h-[calc(100vh-104px)] items-center justify-center px-4 pb-10 pt-4 sm:px-6 lg:px-10">

                <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 shadow-[0_25px_80px_rgba(37,99,235,0.18)]">

                    {/* Login section */}
                    <section className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">

                        {/* Soft decorative circles */}
                        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-50" />
                        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-[80px] bg-emerald-50" />

                        <div className="relative">

                            {/* Logo */}
                            <div className="mb-5 flex justify-center">

                                <div className="relative flex h-16 w-16 items-end justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-400 shadow-xl shadow-blue-200">

                                    <div className="flex items-end gap-1 pb-3">
                                        <span className="h-5 w-2 rounded-t bg-white/90" />
                                        <span className="h-9 w-2 rounded-t bg-white" />
                                        <span className="h-6 w-2 rounded-t bg-white/90" />
                                        <span className="h-11 w-2 rounded-t bg-white" />
                                    </div>

                                    <div className="absolute -bottom-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-emerald-300/70 blur-sm" />

                                </div>

                            </div>

                            <div className="mb-8 text-center">

                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    City <span className="text-blue-600">Digital Twin</span>
                                </h2>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                                    Sign in to monitor and manage your smart city
                                </p>

                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
                                    {error}
                                </div>
                            )}

                            <form
    onSubmit={handleSubmit}
    className="relative space-y-5 rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_15px_45px_rgba(37,99,235,0.10)] transition-all duration-300 hover:shadow-[0_20px_55px_rgba(37,99,235,0.14)] sm:p-7"
>

                                {/* Email */}
                                <div>

                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-bold tracking-wide text-blue-700"
                                    >
                                        Email
                                    </label>

                                    <div className="group relative">

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            placeholder="you@example.com"
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-200 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>

                                {/* Password */}
                                <div>

                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-bold tracking-wide text-blue-700"
                                    >
                                        Password
                                    </label>

                                    <div className="group relative">

                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            placeholder="••••••••"
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-blue-200 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>

                                {/* Sign in */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-400 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                >

                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {loading ? (
                                            <>
                                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign In</span>

                                                <svg
                                                    width="19"
                                                    height="19"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M5 12h13" />
                                                    <path d="m13 6 6 6-6 6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>

                                    <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />

                                </button>

                            </form>

                            {/* Register */}
                            <div className="mt-8 flex items-center gap-4">

                                <div className="h-px flex-1 bg-slate-200" />

                                <span className="text-xs text-slate-400">
                                    Don't have an account?
                                </span>

                                <div className="h-px flex-1 bg-slate-200" />

                            </div>

                            <div className="mt-4 text-center">

                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
                                >
                                    Register

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M5 12h13" />
                                        <path d="m13 6 6 6-6 6" />
                                    </svg>

                                </Link>

                            </div>

                        </div>

                    </section>



                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 pb-5 text-center text-xs text-slate-400">
                © 2026 City Digital Twin. Smart Management • Sustainable Future
            </footer>

        </div>
    );
}

export default Login;
