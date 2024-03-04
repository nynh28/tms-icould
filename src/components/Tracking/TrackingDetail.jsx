import { ChevronLeftIcon } from "@heroicons/react/outline";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import SimpleBar from "simplebar-react";
import { listStatus } from "../../data/status";
import dayjs from "dayjs";
import Feeds from "../Job/Feeds";
import Chip from "@mui/material/Chip";
import { BsPlus } from "react-icons/bs";
import { deepOrange } from "@mui/material/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TrackingDetail = ({
    openDetail,
    closeDetailHandle,
    valueDetail,
    handleChangeTabDetail,
    setSelectedTruck,
    detailTruck,
    truck,
    detailTruckJob,
}) => {

    const information = useSelector(state => state.mapTracking.information)

    // useEffect(() => {
    //     console.log(
    //         valueDetail,
    //         detailTruck,
    //         detailTruckJob,)
    // }, [])
    const { t } = useTranslation();
    return (
        <div
            className={`absolute inset-0 bg-white transition-all duration-700 ease-in-out ${openDetail ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div>
                <div
                    className="flex cursor-pointer items-center gap-2 px-6 pt-8 pb-4 font-medium text-blue-500"
                    onClick={() => {
                        closeDetailHandle();
                        setSelectedTruck(null);
                    }}
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                    <h2 className="text-2xl">{t("back")}</h2>
                </div>
                <TabContext value={valueDetail}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={handleChangeTabDetail}
                            aria-label="lab API tabs example"
                        >
                            <Tab label={t("details")} value="1" />
                            <Tab label={t("jobs")} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <SimpleBar className="max-h-[calc(100vh_-_280px)]">
                            <div className="rounded-lg border border-gray-200">
                                <div className="flex items-center py-4 px-2">
                                    <div className="flex min-w-0 flex-1 items-center">
                                        <div className="mx-4 h-4 w-4 rounded-full bg-red-500"></div>
                                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-5 md:gap-2">
                                            <div className="col-span-4">
                                                <p className="text-lg font-bold">
                                                    {information?.plateLicence}
                                                </p>
                                                <p className="mt-px flex items-center text-sm text-gray-400">
                                                    <span>{information?.truckId}</span>
                                                </p>
                                            </div>
                                            <Avatar className="flex h-12 w-12 flex-col border border-gray-200 bg-gray-100 text-gray-900">
                                                <p className="text-lg font-bold">{information?.driveInfo?.speed || '--'}</p>
                                                <p className="text-[8px]">km/h</p>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div>
                                        <DotsVerticalIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg border border-gray-200">
                                <div className="p-4">
                                    <div className="-mx-4 flex items-center justify-between border-b border-dashed border-gray-100 px-4 pb-2">
                                        <div className="">
                                            <p className="font-semibold">{t("truckInfo")}</p>
                                        </div>
                                        <div className="rounded-full bg-indigo-100 py-1 px-3 text-sm font-semibold text-indigo-500">
                                            -- {t("minutesAgo")}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p>
                                            {t("lastUpdated")}:{" "}
                                            <span className="font-semibold">{information?.driveInfo?.date_time || '--'}</span>
                                        </p>
                                        <p>
                                            {t("brand")}: <span className="font-semibold">--</span>
                                        </p>
                                        <p>
                                            {t("status")}:{" "}
                                            <span className="font-semibold text-primary-500">{information?.driveInfo?.status || '--'}</span>
                                        </p>
                                        <p>
                                            {t("speed")}:{" "}
                                            <span className="font-semibold">{information?.driveInfo?.speed || '--'} km/h</span>
                                        </p>
                                        <p>
                                            {t("distance")}:{" "}
                                            <span className="font-semibold">-- km</span>
                                        </p>
                                        <p>
                                            {t("engineRpm")}:{" "}
                                            <span className="font-semibold">-- {t("rpm")}</span>
                                        </p>
                                        <p>
                                            {t("accumulativeRunningEngine")}:{" "}
                                            <span className="font-semibold">-- {t("hour")}</span>
                                        </p>
                                        <p>
                                            {t("oilfuel")}:{" "}
                                            <span className="font-semibold">-- {t("liter")}</span>
                                        </p>
                                        <p>
                                            {t("consumptionRate")}:{" "}
                                            <span className="font-semibold">-- km/l</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg border border-gray-200">
                                <div className="p-4">
                                    <div className="-mx-4 flex items-center justify-between border-b border-dashed border-gray-100 px-4 pb-2">
                                        <div>
                                            <p className="font-semibold">{t("deviceStatus")}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p>
                                            {t("status")}:{" "}
                                            <span className="font-semibold text-primary-500">--</span>
                                        </p>
                                        <p>
                                            {t("gps")}:{" "}
                                            <span className="font-semibold text-red-500">--%</span>
                                        </p>
                                        <p>
                                            {t("gsm")}:{" "}
                                            <span className="font-semibold text-primary-500">
                                                --%
                                            </span>
                                        </p>
                                        <p>
                                            {t("location")}:{" "}
                                            <span className="font-semibold text-indigo-500">--</span>
                                        </p>
                                        <p>--</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg border border-gray-200">
                                <div className="p-4">
                                    <div className="-mx-4 flex items-center justify-between border-b border-dashed border-gray-100 px-4 pb-2">
                                        <div>
                                            <p className="font-semibold">{t("snapshots")}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between">
                                            <p>{t("images")}</p>
                                            <a className="text-indigo-500 underline">
                                                {t("viewAll")}
                                            </a>
                                        </div>
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            <div className="h-[130px] rounded-lg bg-gray-200 py-4"></div>
                                            <div className="h-[130px] rounded-lg bg-gray-200 py-4"></div>
                                            <div className="h-[130px] rounded-lg bg-gray-200 py-4"></div>
                                            <div className="h-[130px] rounded-lg bg-gray-200 py-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg border border-gray-200">
                                <div className="p-4">
                                    <div className="-mx-4 flex items-center justify-between border-b border-dashed border-gray-100 px-4 pb-2">
                                        <div>
                                            <p className="font-semibold">{t("driver")}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <p>{t("driverName")}</p>
                                                <p className="font-semibold">
                                                    {detailTruck?.driver?.fullName || t("none")}
                                                </p>
                                                <p>{t("status")}</p>
                                                <p className="font-semibold text-primary-500">
                                                    {t("running")}
                                                </p>
                                                <p>{t("distance")}</p>
                                                <p className="font-semibold">-- km</p>
                                                <p>{t("drivingTime")}</p>
                                                <p className="font-semibold">--:--:-- {t("hour")}</p>
                                                <p>{t("safeDrivingRating")}</p>
                                                <p className="font-semibold">-- {t("point")}</p>
                                                <p>{t("thriftyDrivingRating")}</p>
                                                <p className="font-semibold">-- {t("point")}</p>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-sm shadow-md">
                                                    <img
                                                        src="/images/avatar.png"
                                                        className="absolute inset-0 h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SimpleBar>
                    </TabPanel>
                    <TabPanel value="2" sx={{ p: 0 }}>
                        <div
                            style={{ height: "calc(100vh - 260px)" }}
                            className="bg-gray-100 pb-3"
                        >
                            <PerfectScrollbar>
                                {detailTruckJob.map((item, index) => (
                                    <div
                                        key={index}
                                        className="mx-4 mt-4 rounded-2xl bg-white p-4 hover:shadow-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <Chip
                                                    label={t(
                                                        listStatus.find(
                                                            (x) => x.intValue === item?.jobStatus
                                                        )?.text
                                                    )}
                                                    className={`${listStatus.find(
                                                        (x) => x.intValue === item?.jobStatus
                                                    )?.color
                                                        } text-white`}
                                                    size="small"
                                                />

                                                {item.groupName && (
                                                    <Chip
                                                        label={`${t("fleetName")}: ${item.groupName}`}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-orange-500">
                                                ID: {item.jobId}
                                            </p>
                                            <label className="text-sm text-gray-500">
                                                {dayjs(item?.histories[0].createdAt).format(
                                                    "HH:mm DD/MM/YYYY"
                                                )}
                                            </label>
                                        </div>
                                        <div className="flex cursor-pointer items-center space-x-4">
                                            {[2, 4, 5, 6, 7, 8].includes(item?.jobStatus) ? (
                                                <div className="pointer-events-none flex flex-col items-center">
                                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                                        {/* <FaTruck /> */}
                                                    </Avatar>
                                                    <span className="whitespace-nowrap text-sm">
                                                        {t("assigned")}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                                        <BsPlus className="h-8 w-8" />
                                                    </Avatar>
                                                    <span className="text-sm">{t("assign")}</span>
                                                </div>
                                            )}
                                            <div>
                                                <Feeds data={item} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </PerfectScrollbar>
                        </div>
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    );
};

export default TrackingDetail;
