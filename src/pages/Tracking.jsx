import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map, SpeedDialTracking, TrucksAndDrivers } from "../components";
import Map3 from "../components/Tracking/Map3";

const Tracking = () => {
    const { t } = useTranslation();
    // const [selectedTruck, setSelectedTruck] = useState(null)
    // const [trucksGroup, setTrucksGroup] = useState([]);
    // const [listTruck, setListTruck] = useState([]);
    

    return (
        <div className="relative min-h-[calc(100vh_-_150px)] w-full overflow-hidden">
            <SpeedDialTracking />
            <Map3/>
            <TrucksAndDrivers />
        </div>
    );
};

export default Tracking;
