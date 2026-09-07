import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import socket from "../services/socket";

const CityContext = createContext();

export const CityProvider = ({ children }) => {

    const [cityData, setCityData] = useState(null);

    const [history, setHistory] = useState([]);

    const [connected, setConnected] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [alertHistory, setAlertHistory] = useState([]);


    useEffect(() => {

        socket.connect();


        const handleConnect = () => {

            console.log(
                "Connected to City Twin Socket.IO"
            );

            setConnected(true);
        };


        const handleDisconnect = () => {

            console.log(
                "Disconnected from City Twin"
            );

            setConnected(false);
        };


        const handleCityUpdate = (data) => {

            console.log(
                "Live city update:",
                data
            );

            setCityData(data);
            setAlerts(data.alerts || []);

            const incomingAlerts = (data.alerts || []).map(alert => ({
                ...alert,
                id: `${alert.type}-${alert.sourceId}`,
                timestamp: new Date(data.timestamp),
                read: false
            }));

            setAlertHistory(previousHistory => {
                const existingIds = new Set(
                    previousHistory.map(alert => alert.id)
                );

                const newAlerts = incomingAlerts.filter(
                    alert => existingIds.has(alert.id) === false
                );

                return [
                    ...newAlerts,
                    ...previousHistory
                ].slice(0, 50);
            });


            // Store historical data
            setHistory(previousHistory => {

                const newEntry = {
                    timestamp: new Date(data.timestamp),
                read: false,

                    traffic:
                        calculateAverage(
                            data.data?.traffic,
                            "congestion"
                        ),

                    speed:
                        calculateAverage(
                            data.data?.traffic,
                            "averageSpeed"
                        ),

                    aqi:
                        calculateAverage(
                            data.data?.environment,
                            "aqi"
                        ),

                    temperature:
                        calculateAverage(
                            data.data?.environment,
                            "temperature"
                        ),

                    energy:
                        data.data?.energy?.consumption || 0,

                    renewable:
                        data.data?.energy?.renewablePercentage || 0,

                    waterLevel:
                        data.data?.water?.reservoirLevel || 0,

                    waterConsumption:
                        data.data?.water?.dailyConsumption || 0,

                    waste:
                        calculateAverage(
                            data.data?.waste,
                            "fillLevel"
                        )
                };


                const updatedHistory = [
                    ...previousHistory,
                    newEntry
                ];


                // Keep only last 20 updates
                return updatedHistory.slice(-20);
            });
        };


        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "city_update",
            handleCityUpdate
        );


    return () => {

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "city_update",
                handleCityUpdate
            );

            socket.disconnect();
        };

    }, []);

    const markAlertAsRead = (id) => {
        setAlertHistory(previousHistory =>
            previousHistory.map(alert =>
                alert.id === id ? { ...alert, read: true } : alert
            )
        );
    };

    const markAllAlertsAsRead = () => {
        setAlertHistory(previousHistory =>
            previousHistory.map(alert => ({ ...alert, read: true }))
        );
    };

    const clearAlert = (id) => {
        setAlertHistory(previousHistory =>
            previousHistory.filter(alert => alert.id !== id)
        );
    };

    const unreadAlertCount = alertHistory.filter(alert => alert.read === false).length;

    return (
        <CityContext.Provider
            value={{
                cityData,
                history,
                connected,
                alerts,
                alertHistory,
                markAlertAsRead,
                markAllAlertsAsRead,
                clearAlert,
                unreadAlertCount
            }}
        >
            {children}
        </CityContext.Provider>
    );
};


// ======================================================
// HELPER
// ======================================================

const calculateAverage = (
    array = [],
    property
) => {

    if (!array.length) {
        return 0;
    }


    const total = array.reduce(
        (sum, item) => {

            return sum +
                Number(item[property] || 0);

        },
        0
    );


    return Number(
        (total / array.length).toFixed(2)
    );
};


export const useCity = () => {

    return useContext(CityContext);
};