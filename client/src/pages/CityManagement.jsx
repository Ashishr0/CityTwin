import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CityManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const canManage =
        user?.role === "ADMIN" ||
        user?.role === "CITY_OPERATOR";

    if (!canManage) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold">
                    Access Denied
                </h1>

                <p className="mt-3 text-slate-400">
                    You do not have permission to manage city data.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">
                City Management
            </h1>

            <p className="mt-2 text-slate-400">
                Welcome, {user.name} ({user.role})
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                {/* BUILDINGS */}

                <div className="rounded-xl bg-slate-800 p-6">
                    <h2 className="text-xl font-semibold">
                        Buildings
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Manage city buildings.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/management/buildings")
                        }
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                    >
                        Manage
                    </button>
                </div>


                {/* TRAFFIC */}

                <div className="rounded-xl bg-slate-800 p-6">
                    <h2 className="text-xl font-semibold">
                        Traffic
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Manage traffic data.
                    </p>

                    <button
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                    >
                        Manage
                    </button>
                </div>


                {/* VEHICLES */}

                <div className="rounded-xl bg-slate-800 p-6">
                    <h2 className="text-xl font-semibold">
                        Vehicles
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Manage city vehicles.
                    </p>

                    <button
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                    >
                        Manage
                    </button>
                </div>


                {/* INCIDENTS */}

                <div className="rounded-xl bg-slate-800 p-6">
                    <h2 className="text-xl font-semibold">
                        Incidents
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Manage city incidents.
                    </p>

                   <button
    onClick={() => navigate("/management/traffic")}
    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
>
    Manage
</button>
                </div>

            </div>
        </div>
    );
};

export default CityManagement;