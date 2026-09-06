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


            // Store historical data
            setHistory(previousHistory => {

                const newEntry = {
                    timestamp: new Date(data.timestamp),

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


    return (
        <CityContext.Provider
            value={{
                cityData,
                history,
                connected
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