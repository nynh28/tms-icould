import {
    MenuIcon,
    MinusIcon,
    PlusIcon,
    SearchIcon,
} from "@heroicons/react/outline";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import {
    fetchTruckDetail1,
    getDetailTrackingDriver,
    getDetailTrackingTruck,
    getDetailTrackingTruckJob,
    getDriversTracking,
    getTrucksTracking,
} from "../../api";
import { ROLES } from "../../constants/constants";
import { groupBy } from "../../utils/common";
import GroupDriverByFleet from "./GroupDriverByFleet";
import GroupTruckByFleet from "./GroupTruckByFleet";
import TrackingDetail from "./TrackingDetail";
import axios from "axios";
import { selectTruck, updateTruckPosition } from "../../features/truck/truckSlice";
import { setInitialVehicles } from "../../features/maptracking/mapTrackingSlice";
import { useDebounce } from "../../utils/common";

const TrucksAndDrivers = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const [openDetail, setOpenDetail] = useState(false);
    const [value, setValue] = useState("1");
    const [valueDetail, setValueDetail] = useState("1");
    const [trucksGroup, setTrucksGroup] = useState([]);
    const [driversGroup, setDriversGroup] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [detailTruck, setDetailTruck] = useState(null);
    const [detailTruckJob, setDetailTruckJob] = useState([]);
    const [listLicensePlate, setListLicensePlate] = useState([]);
    const [detailDriver, setDetailDriver] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [search, setSearch] = useState('');

    const user = useSelector((state) => state.auth);
    const { role } = user?.user;
    const dispatch = useDispatch();
    const truckSelector = useSelector(state => state.truck.selected);
    const initialVehiclesData = useSelector(state => state.mapTracking.initialVehiclesData);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        // console.log(initialVehiclesData)
        if(!search){
            if(initialVehiclesData && initialVehiclesData.length > 0){
                const groupByFleet = groupBy(initialVehiclesData, "groupName");
                setTrucksGroup(groupByFleet);
            }else{
                setTrucksGroup([])
            }
        }
    }, [initialVehiclesData])

    const handleChangeTabDetail = (event, newValue) => {
        setValueDetail(newValue);
    };

    useDebounce(() => {
        if(search){
            let _initialVehiclesData = initialVehiclesData.filter(i => i.plateLicence.includes(search))
            const groupByFleet = groupBy(_initialVehiclesData, "groupName");
            setTrucksGroup(groupByFleet);
        }else{
            const groupByFleet = groupBy(initialVehiclesData, "groupName");
            setTrucksGroup(groupByFleet);
        }
      }, [search], 800
    );
  
    const handleSearch = (e) => setSearch(e.target.value);


    useEffect(() => {
        const fetchDrivers = async () => {
            let url = "";
            if (role === ROLES.Carrier) {
                url = "/api/carrier/tracking/driver";
            } else if (role === ROLES.Company) {
                url = "/api/company/tracking/driver";
            }

            try {
                const response = await getDriversTracking(url, {});
                const newData = [...response.data?.content];
                const groupByFleet = groupBy(newData, "groupName");
                setDriversGroup(groupByFleet);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDrivers();
    }, []);

    const openDetailHandle = () => {
        setOpenDetail(true);
    };

    const closeDetailHandle = () => {
        setOpenDetail(false);
    };

    useEffect(() => {
        if (!selectedDriver) return;

        const getDetailDriver = async () => {
            try {
                const response = await getDetailTrackingDriver(selectedDriver.driverId);
                setDetailDriver(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getDetailDriver();
    }, [selectedDriver]);

    return (
        <div
            className={`absolute inset-y-0 right-0 w-full max-w-lg border-y border-gray-200 bg-white transition-all duration-700 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                } `}
        >
            <div className="absolute top-0 left-0 -ml-16 flex flex-col gap-4 pt-4 pr-2">
                <IconButton
                    className="h-12 w-12 bg-primary-500 p-3 text-white"
                    onClick={() => setOpen(!open)}
                >
                    <MenuIcon />
                </IconButton>
                {/* <IconButton
                    className="h-12 w-12 bg-gray-400 p-3 text-white"
                    onClick={() => setOpen(!open)}
                >
                    <PlusIcon />
                </IconButton>
                <IconButton
                    className="h-12 w-12 bg-gray-400 p-3 text-white"
                    onClick={() => setOpen(!open)}
                >
                    <MinusIcon />
                </IconButton> */}
            </div>
            <div className="relative h-full">
                <div className="px-6 pt-8 pb-4">
                    <h2 className="text-xl font-semibold">{t("drivers")}</h2>
                </div>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={handleChangeTab}
                            aria-label="lab API tabs example"
                        >
                            <Tab label={t("trucks")} value="1" />
                            <Tab label={t("drivers")} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TextField
                            id="outlined-start-adornment"
                            size="small"
                            fullWidth
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="w-5" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="mt-4">
                            <SimpleBar className="max-h-[calc(100vh_-_360px)]">
                                {trucksGroup?.map((trucks, index) => (
                                    <GroupTruckByFleet
                                        key={index}
                                        trucks={trucks}
                                        index={index}
                                        expanded={expanded}
                                        handleChange={handleChange}
                                        openDetailHandle={openDetailHandle}
                                        setSelectedTruck={setSelectedTruck}
                                    />
                                ))}
                            </SimpleBar>
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                        <TextField
                            id="outlined-start-adornment"
                            size="small"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon className="w-5" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="mt-4">
                            <SimpleBar className="max-h-[calc(100vh_-_320px)]">
                                {driversGroup?.map((drivers, index) => (
                                    <GroupDriverByFleet
                                        key={index}
                                        drivers={drivers}
                                        index={index}
                                        expanded={expanded}
                                        handleChange={handleChange}
                                        openDetailHandle={openDetailHandle}
                                        setSelectedDriver={setSelectedDriver}
                                    />
                                ))}
                            </SimpleBar>
                        </div>
                    </TabPanel>
                </TabContext>
                <TrackingDetail
                    openDetail={openDetail}
                    valueDetail={valueDetail}
                    closeDetailHandle={closeDetailHandle}
                    handleChangeTabDetail={handleChangeTabDetail}
                    truck={selectedTruck}
                    setSelectedTruck={setSelectedTruck}
                    detailTruck={detailTruck}
                    detailTruckJob={detailTruckJob}
                />
            </div>
        </div>
    );
};

export default TrucksAndDrivers;
