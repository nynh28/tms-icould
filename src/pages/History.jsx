import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CustomAsyncSelect } from "../components";
import { listStatus } from "../data/status";
import {
    useGetDriversQuery,
    useGetFleetCarriersQuery,
    useGetJobsQuery,
    useGetTrucksQuery,
} from "../services/apiSlice";
import { BsFilter } from "react-icons/bs";
import Button from "@mui/material/Button";
import * as XLSX from "xlsx";
import LoadingButton from '@mui/lab/LoadingButton';
import AssignJob from "../components/Job/AssignJob";
import { deepOrange } from "@mui/material/colors";
import JobDetailPopup from "../components/Job/JobDetailPopup";
import Dialog from "@mui/material/Dialog";
import { XIcon } from "@heroicons/react/outline";
import {
    DirectionsRenderer,
    GoogleMap,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { exportWaybill } from "../api";
import "../components/Job/styles/ListJob.css";
import JobDetailPopup2 from "../components/Job/JobDetailPopup2";
import { Card, CardContent, CardHeader, Divider, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const History = () => {
    let { id } = useParams();

    const { t } = useTranslation();
    const [bodyData, setBodyData] = useState({
        page: 0,
        rowsPerPage: 25,
        groupId: "",
    });
    const [jobId, setJobId] = useState("");
    const [status, setStatus] = useState("");
    const [truck, setTruck] = useState("");
    const [driver, setDriver] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const { renderPopup, setOpenPopup } = JobDetailPopup2(selectedJob);
    const [openPopupJobDetail, setOpenPopupJobDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);

    const { data, error, isLoading, isSuccess, isFetching, refetch } = useGetJobsQuery(bodyData);

    useEffect(() => {
        console.log(id)
    }, [id])

    const { data: dataFilterJob } = useGetJobsQuery({
        ...bodyData,
        page: 0,
        rowsPerPage: 1000,
    });

    const { data: dataExportJob } = useGetJobsQuery({
        ...bodyData,
        page: 0,
        rowsPerPage: 1000,
    });
    const { data: dataTruck } = useGetTrucksQuery({
        ...bodyData,
        page: 0,
        rowsPerPage: 1000,
    });
    const { data: dataDriver } = useGetDriversQuery({
        ...bodyData,
        page: 0,
        rowsPerPage: 1000,
    });

    const newDataFilterJob = dataFilterJob?.content.map((item) => ({
        label: item.jobId,
        id: item.jobId,
    }));

    const {
        data: dataFleet,
        isLoading: isLoadingFleet,
        isFetching: isFetchingFleet,
    } = useGetFleetCarriersQuery({ ...bodyData, page: 0, rowsPerPage: 1000 });

    const handleChangePage = (event, newPage) => {
        setBodyData({ ...bodyData, page: newPage });
    };

    const handleChange = (value) => {
        setBodyData({ ...bodyData, page: 0, groupId: value ? value : null });
    };

    const handleChangeJobId = (value) => {
        setBodyData({ ...bodyData, page: 0, jobId: value ? value : null });
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
        setBodyData({
            ...bodyData,
            page: 0,
            jobStatus: event.target.value ? Number(event.target.value) : null,
        });
    };

    const handleChangeTruck = (event) => {
        setTruck(event.target.value);
        setBodyData({
            ...bodyData,
            page: 0,
            truckId: event.target.value ? event.target.value : null,
        });
    };

    const handleChangeDriver = (event) => {
        setDriver(event.target.value);
        setBodyData({
            ...bodyData,
            page: 0,
            driverId: event.target.value ? event.target.value : null,
        });
    };

    const getCargoName = (value) => {
        if (value) {
          return masterDatas?.find(
            (x) => x.type === "CARGO" && x.intValue === value
          ).name;
        }
      };
    
      const getUnitName = (value) => {
        if (value) {
          return masterDatas?.find((x) => x.type === "UNIT" && x.intValue === value)
            .name;
        }
      };

    const onExport = () => {
        const newData = dataExportJob?.content.map((item) => {
            let data1 = {
                "Job ID": item.jobId,
                Status: t(listStatus.find((x) => x.intValue === item.jobStatus)?.text),
                "Group ID": item.groupId,
                "Group Name": item.groupName,
                "Truck Plate License": item.truckPlateLicence,
                "Driver": ""
            };

            const array1 = [...item.locations];
            array1
                .filter((x) => x.locationType === 1)
                .map((location, index) => {
                    let locationName = `Pickup Point ${index + 1}`;
                    let senderName = `Sender's name ${index + 1}`;
                    let senderPhone = `Sender's phone ${index + 1}`;
                    data1[locationName] = location.locationAddress;
                    data1[senderName] = location.contactName;
                    data1[senderPhone] = location.contactPhone;
                });

            const array2 = [...item.locations];
            array2
                .filter((x) => x.locationType === 2)
                .map((location, index) => {
                    let locationName = `Delivery Point ${index + 1}`;
                    let receiverName = `Receiver's name ${index + 1}`;
                    let receiverPhone = `Receiver's phone ${index + 1}`;
                    data1 = {
                        ...data1,
                        [locationName]: location.locationAddress,
                        [receiverName]: location.contactName,
                        [receiverPhone]: location.contactPhone,
                    };
                });

            return data1;
        });

        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(newData);
        XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
        XLSX.writeFile(wb, dayjs().format("[./report_job_-]HHmmssMMDDYYYY[.xlsx]"));
    };

    const handleClickOpenPopupJobDetail = () => {
        setOpenPopupJobDetail(true);
    };

    const handleClosePopupJobDetail = () => {
        setOpenPopupJobDetail(false);
    };

    const onExportWaybill = async () => {
        setLoading(true);
        try {
            const response = await exportWaybill(selectedJob?.jobId);
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEYS,
        libraries: ["places"],
    });

    const [cooridinate, setCooridinate] = useState({
        lat: 21.037247766943338,
        lng: 105.83492418984048,
    });

    const [directionResponse, setDirectionResponse] = useState(null);

    const renderDirections = (locations) => {
        let lastDirection = locations.length - 1;
        const waypoints = [];
        if (locations.length > 2) {
            for (let i = 1; i < locations.length; i++) {
                waypoints.push({
                    location: new window.google.maps.LatLng(
                        locations[i].locationLatitude,
                        locations[i].locationLongitude
                    ),
                    stopover: true,
                });
            }
        }

        const DirectionsService = new window.google.maps.DirectionsService();
        DirectionsService.route(
            {
                origin: new window.google.maps.LatLng(
                    locations[0].locationLatitude,
                    locations[0].locationLongitude
                ),
                destination: new window.google.maps.LatLng(
                    locations[lastDirection].locationLatitude,
                    locations[lastDirection].locationLongitude
                ),
                waypoints,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirectionResponse(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    return (
        <div className="h-full px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-full lg:px-8">
            <div className="flex h-full flex-col rounded-lg bg-white shadow-sm">
                <div className="p-7 sm:flex sm:items-center">
                    <div className="w-full justify-between sm:flex">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {t("jobManagement")}
                        </h1>
                        <Button
                            variant="outlined"
                            component="span"
                            onClick={onExport}
                            startIcon={<img src="/images/excel.svg" className="h-6 w-6" />}
                        >
                            {t("exportExcel")}
                        </Button>
                    </div>
                </div>
                <div className="border-y border-gray-200 px-7 pb-4 pt-2">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="w-full">
                                <CustomAsyncSelect
                                    label="branchName"
                                    data={dataFleet?.content.map((item) => ({
                                        id: item.groupId,
                                        text: item.groupName,
                                    }))}
                                    isFetching={isFetchingFleet}
                                    isLoading={isLoadingFleet}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-full">
                                <FormControl variant="standard" sx={{ m: 0, width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {t("driver")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={driver}
                                        onChange={handleChangeDriver}
                                        label={t("driver")}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {dataDriver?.content.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {t(item.fullName)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full">
                                <FormControl variant="standard" sx={{ m: 0, width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {t("status")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={status}
                                        onChange={handleChangeStatus}
                                        label={t("status")}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {listStatus.map((item) => (
                                            <MenuItem
                                                key={item.intValue}
                                                value={item.intValue}
                                                className={item.colorText}
                                            >
                                                {t(item.text)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="w-full">
                                <FormControl variant="standard" sx={{ m: 0, width: "100%" }}>
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {t("truck")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={truck}
                                        onChange={handleChangeTruck}
                                        label={t("truck")}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {dataTruck?.content.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {t(item.plateLicence)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-jobid"
                                    value={jobId}
                                    onChange={(event, newValue) => {
                                        setJobId(newValue);
                                        handleChangeJobId(newValue?.id);
                                    }}
                                    options={newDataFilterJob || []}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t("jobId")}
                                            variant="standard"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <BsFilter className="h-7 w-7" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="-my-2 overflow-x-auto">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div>
                                {isLoading || isFetching ? (
                                    <div className="flex h-full items-center justify-center">
                                        <CircularProgress />
                                    </div>
                                ) : isSuccess ? (
                                    <table className="min-w-full" style={{ borderSpacing: 0 }}>
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-6 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("status")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("jobId")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("pickupPoint")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("delivery")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter sm:table-cell"
                                                >
                                                    {t("truck")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10  border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter lg:table-cell"
                                                >
                                                    {t("driver")}
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("branchName")}
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-center font-medium capitalize backdrop-blur backdrop-filter"
                                                >
                                                    {t("action")}
                                                </th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {data?.content.map((job, index) => (
                                                <tr
                                                    key={index}
                                                    className="cursor-pointer hover:bg-gray-200"
                                                    onClick={() => {
                                                        console.log(job);
                                                        setSelectedJob(job);
                                                        renderDirections(job.locations);
                                                        setOpenPopup(true);
                                                        handleClickOpenPopupJobDetail();
                                                    }}
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 text-left text-gray-500">
                                                        <Chip
                                                            label={t(
                                                                listStatus.find(
                                                                    (x) => x.intValue === job?.jobStatus
                                                                )?.text
                                                            )}
                                                            className={`${listStatus.find(
                                                                (x) => x.intValue === job?.jobStatus
                                                            )?.color
                                                                } text-white`}
                                                            size="small"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 px-3 text-left">
                                                        {job.jobId}
                                                    </td>
                                                    <td className="py-4 pr-3 pl-3 text-gray-900">
                                                        <div className="flex flex-col">
                                                            {job.locations.length > 0
                                                                ? job.locations[0].locationAddress
                                                                : ""}

                                                            {job.locations.length > 0 &&
                                                                job.locations[0]?.locationDateTime && (
                                                                    <span className="whitespace-nowrap text-left text-gray-500">
                                                                        {dayjs(
                                                                            job.locations[0]?.locationDateTime
                                                                        ).format("HH:mm DD/MM/YYYY")}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pr-3 pl-3 text-gray-900">
                                                        <div className="flex flex-col">
                                                            {job.locations.length > 0
                                                                ? job.locations[job.locations.length - 1]
                                                                    .locationAddress
                                                                : ""}

                                                            {job.locations.length > 0 &&
                                                                job.locations[job.locations.length - 1]
                                                                    ?.locationDateTime && (
                                                                    <span className="whitespace-nowrap text-left text-gray-500">
                                                                        {dayjs(
                                                                            job.locations[job.locations.length - 1]
                                                                                ?.locationDateTime
                                                                        ).format("HH:mm DD/MM/YYYY")}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-left text-gray-500">
                                                        {job.truckPlateLicence}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-left text-gray-500">
                                                        {job.driverName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-left text-gray-500">
                                                        {job.groupName}
                                                    </td>
                                                    {/* <td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-3 text-center font-medium"></td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {isSuccess && (
                    <div>
                        <TablePagination
                            component="div"
                            count={data?.totalElements}
                            page={data?.number}
                            onPageChange={handleChangePage}
                            rowsPerPage={data?.size}
                            rowsPerPageOptions={[10]}
                        />
                    </div>
                )}
            </div>

            <Dialog
                open={openPopupJobDetail}
                onClose={handleClosePopupJobDetail}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="xl"
            >
                <div className="dialog-job-detail">
                    <div className="border-b border-gray-200 py-6 px-4">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-2">
                                <h2 className="text-lg font-medium">{t("jobDetail")}</h2>
                            </div>

                            <div className="ml-3 flex h-7 items-center justify-center gap-4">
                                <div className="dialog-job-detail--button">
                                    <div className="flex items-center space-x-2">
                                        {selectedJob && (
                                            <>
                                                {[2, 4, 5, 6, 7, 8, 9, 10].includes(selectedJob?.jobStatus) ? (
                                                    ""
                                                ) : (
                                                    <button
                                                        className="dialog-job-detail--button__assign flex items-center"
                                                        style={{ backgroundColor: deepOrange[500] }}
                                                    >
                                                        <AssignJob
                                                            jobId={selectedJob.jobId}
                                                            refetch={refetch}
                                                        />
                                                        <span className="flex items-center text-sm">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M17.2298 12.0426C16.7686 11.8234 16.298 11.6345 15.8192 11.4763C17.37 10.3123 18.375 8.45883 18.375 6.375C18.375 2.85984 15.5152 0 12 0C8.48478 0 5.62498 2.85984 5.62498 6.375C5.62498 8.46113 6.63223 10.3164 8.1859 11.4802C6.7624 11.9489 5.4267 12.6781 4.25764 13.6397C2.11395 15.403 0.623466 17.8625 0.0608257 20.5651C-0.115518 21.412 0.0957476 22.2818 0.640341 22.9515C1.18226 23.6178 1.98584 24 2.84497 24H14.3906C14.9084 24 15.3281 23.5803 15.3281 23.0625C15.3281 22.5447 14.9084 22.125 14.3906 22.125H2.84497C2.44475 22.125 2.20329 21.9016 2.09501 21.7685C1.90803 21.5385 1.83565 21.2393 1.89645 20.9473C2.86934 16.2741 6.99134 12.8603 11.7515 12.7452C11.8339 12.7484 11.9167 12.75 12 12.75C12.084 12.75 12.1677 12.7484 12.2509 12.7451C13.7097 12.7793 15.1127 13.1123 16.4249 13.7361C16.8926 13.9583 17.4518 13.7595 17.6741 13.2918C17.8963 12.8242 17.6975 12.2649 17.2298 12.0426ZM12.2286 10.8692C12.1526 10.8679 12.0763 10.8672 12 10.8672C11.9243 10.8672 11.8487 10.8679 11.7731 10.8693C9.39678 10.7508 7.49998 8.78025 7.49998 6.375C7.49998 3.89367 9.51865 1.875 12 1.875C14.4813 1.875 16.5 3.89367 16.5 6.375C16.5 8.77964 14.6041 10.7498 12.2286 10.8692Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M23.0625 18.6094H20.4844V16.0312C20.4844 15.5135 20.0647 15.0938 19.5469 15.0938C19.0291 15.0938 18.6094 15.5135 18.6094 16.0312V18.6094H16.0312C15.5135 18.6094 15.0938 19.0291 15.0938 19.5469C15.0938 20.0647 15.5135 20.4844 16.0312 20.4844H18.6094V23.0625C18.6094 23.5803 19.0291 24 19.5469 24C20.0647 24 20.4844 23.5803 20.4844 23.0625V20.4844H23.0625C23.5803 20.4844 24 20.0647 24 19.5469C24 19.0291 23.5803 18.6094 23.0625 18.6094Z"
                                                                    fill="white"
                                                                />
                                                            </svg>
                                                            {t("assign")}
                                                        </span>
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <LoadingButton
                                            onClick={onExportWaybill}
                                            className="capitalize"
                                            variant="outlined"
                                            color="warning"
                                            startIcon={
                                                <img
                                                    src="/images/pdf.png"
                                                    alt="pdf"
                                                    className="h-5 w-5"
                                                />
                                            }
                                            loading={loading}
                                        >
                                            {t("exportWaybill")}
                                        </LoadingButton>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <XIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                        onClick={handleClosePopupJobDetail}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="dialog-job-detail--body flex-col pt-3">
                        <div className="flex flex-1 px-2 py-2 text-[13px]">
                            <div className="w-[15%]">
                                <h5 className="mb-2">Pickup Address</h5>    
                                <div>
                                    <p>Name: {selectedJob?.locations[0]?.contactName}</p>
                                    <p>Address: {selectedJob?.locations[0]?.locationAddress}</p>
                                    <p>Phone: {selectedJob?.locations[0]?.contactPhone}</p>
                                    <p>Note: {selectedJob?.locations[0]?.note}</p>
                                </div>
                            </div>
                            <div className="w-[2%]"></div>
                            <div className="w-[15%]">
                                <h5 className="mb-2">Delivery Address</h5>    
                                <div>
                                    <p>Name: {selectedJob?.locations[1]?.contactName}</p>
                                    <p>Address: {selectedJob?.locations[1]?.locationAddress}</p>
                                    <p>Phone: {selectedJob?.locations[1]?.contactPhone}</p>
                                    <p>Note: {selectedJob?.locations[1]?.note}</p>
                                </div>
                            </div>
                            <div className="w-[8%]"></div>
                            <div className="w-[15%]">
                                <h5 className="mb-2">Billing Address</h5>    
                                <div>
                                    <p>Name: </p>
                                    <p>Address: </p>
                                    <p>Phone: </p>
                                    <p>Note: </p>
                                </div>
                            </div>
                            <div className="w-[8%]"></div>
                            <div className="flex-1 flex">
                                <div>
                                    <h5 className="mb-2">Driver Information/Tracking Link</h5>    
                                    <div className="flex gap-[10px]">
                                        <div className="driver-avatar p-1 border rounded-[5px]">
                                            <img src="https://placeholder.com/100x100" alt="" />
                                        </div>
                                        <div className="driver-information">
                                            <p>Name: {selectedJob?.driverName}</p>
                                            <p>Email: </p>
                                            <p>Phone: </p>
                                            <p>Tracking ID: </p>
                                            <p><a href="#">Tracking Link</a></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <LoadingButton
                                        onClick={onExportWaybill}
                                        className="btn btn-success rounded-[5px] text-[12px] text-white bg-[#0fd260]"
                                        variant="fill"
                                        color="success"
                                        loading={loading}
                                    >
                                        {/* {t("exportWaybill")} */}
                                        Shipping Label
                                    </LoadingButton>
                                </div>
                            </div>
                        </div>
                        <div className="flex job-detail p-2 bg-gray-200 gap-[10px]">
                            <Card className="flex-1">
                                <CardHeader title="ITEM DETAILS" 
                                    titleTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 500
                                    }}
                                    classes={{
                                        root: 'bg-[#dedede] p-3 '
                                    }}
                                    
                                />
                                    
                                <Divider sx={{ borderBottomWidth: 2, borderColor: '#bdbdbd' }}/>
                                <CardContent classes={{
                                    root: 'text-[13px]'
                                }}>
                                    <div className="p-2">
                                        <div className="border rounded-[2px] px-2 py-4">
                                            <button className="rounded-[2px] px-2 py-1 font-medium bg-[#c2c9f0] text-[#4229cf]">LOAD 1</button>
                                            <div className="flex mt-4">
                                                <div className="flex-1">
                                                    <p className="text-[#999]">{t("nameOfGoods")}</p>
                                                    <p>{selectedJob?.commodity?.nameOfGoods}</p>
                                                </div>
                                            </div>
                                            <div className="flex mt-2">
                                                <div className="flex-1">
                                                    <p className="text-[#999]">{t("typeOfGoods")}</p>
                                                    <p> {t(getCargoName(selectedJob?.commodity?.typeOfGoods))}</p>
                                                </div>
                                            </div>
                                            <div className="flex mt-2 md:flex-col lg:flex-row">
                                                <div className="flex-1 ">
                                                    <p className="text-[#999]">{t("weight")}</p>
                                                    <p>{selectedJob?.commodity?.cargoWeight}</p>
                                                </div>
                                                <div className="flex-1 lg:text-right md:text-left">
                                                    <p className="text-[#999]">{t("unit")}</p>
                                                    <p>{t(getUnitName(selectedJob?.commodity?.unit))}</p>
                                                </div>
                                                
                                            </div>
                                            <div className="flex mt-2 md:flex-col lg:flex-row">
                                                <div className="flex-1 ">
                                                    <p className="text-[#999]">{t("tripType")}</p>
                                                    <p> {selectedJob?.commodity?.tripType === 1
                                                    ? t("singleTrip")
                                                    : t("roundTrip")}</p>
                                                </div>
                                                <div className="flex-1 lg:text-right md:text-left">
                                                    <p className="text-[#999]">{t("attachments")}</p>
                                                    <p>{selectedJob?.commodity?.attachments ? selectedJob?.commodity?.attachments[0] : t("none")}</p>
                                                </div>
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-[#999]">Photos Of Shipment</p>
                                        <div className="img-list p-2 mt-2">
                                            <div className="img-item">
                                                <img src="https://placeholder.com/50x50" alt="" />
                                                <p className="mt-1 text-[#777]">Image 1</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-[#999]">Notes</p>
                                        <div className="mt-2">
                                            <p> {selectedJob?.commodity?.note} </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardHeader title="Payment Details" 
                                    titleTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 500
                                    }}
                                    classes={{
                                        root: 'bg-[#dedede] p-3 '
                                    }}
                                    
                                />
                                    
                                <Divider sx={{ borderBottomWidth: 2, borderColor: '#bdbdbd' }}/>
                                <CardContent classes={{
                                    root: 'text-[13px]'
                                }}>
                                    <div className="py-2">
                                        <div>

                                            <p>Value of Goods</p>
                                            <p>Value of goods paid by Receiver: No</p>
                                            <div className="text-[12px] flex mt-3 mb-2 gap-[10px]">
                                                <p className="flex-1 text-[#777]">Value of Goods</p>
                                                <p className="flex-1 text-[#777] text-right">THB 0.0</p>
                                            </div>
                                            <Divider/>
                                            <div className="mt-2 text-[16px] mb-1 flex gap-[10px]">
                                                <p className="flex-1 ">Total</p>
                                                <p className="flex-1  text-right">THB 0.0</p>
                                            </div>
                                            <div className="text-[12px] flex gap-[10px]">
                                                <p className="flex-1 text-[#777]">Payment Method</p>
                                                <p className="flex-1 text-[#777] text-right"></p>
                                            </div>
                                            <div className="text-[12px] flex mb-2 gap-[10px]">
                                                <p className="flex-1 ">cash: THB0.0</p>
                                                <p className="flex-1 text-[#777] text-right"></p>
                                            </div>
                                        </div>
                                        <Divider sx={{ borderBottomWidth: 3, }}/>
                                        <div className="mt-3">
                                            <p>Delivery Fee Payment Details</p>
                                            <div className="text-[12px] flex mt-2 gap-[10px]">
                                                <p className="flex-1 ">Delivery fee paid by sender: Yes</p>
                                            </div>
                                            <div className="text-[12px] flex gap-[10px]">
                                                <p className="flex-1 text-[#777]">Delivery Fee</p>
                                                <p className="flex-1 text-right">THB 0.0</p>
                                            </div>
                                            <div className="text-[12px] flex mt-2 mb-2 gap-[10px]">
                                                <p className="flex-1 text-[#777]">Tax</p>
                                                <p className="flex-1 text-right">THB 0.0</p>
                                            </div>
                                            <Divider/>
                                            <div className="mt-2 text-[16px] mb-1 flex gap-[10px]">
                                                <p className="flex-1 ">Total</p>
                                                <p className="flex-1  text-right">THB 0.000</p>
                                            </div>
                                            <div className="text-[12px] flex gap-[10px]">
                                                <p className="flex-1 text-[#777]">Payment Method</p>
                                                <p className="flex-1 text-[#777] text-right"></p>
                                            </div>
                                            <div className="text-[12px] flex mb-2 gap-[10px]">
                                                <p className="flex-1 ">cash: THB0.0</p>
                                                <p className="flex-1 text-[#777] text-right"></p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardHeader title="Proof of Pickup" 
                                    titleTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 500
                                    }}
                                    classes={{
                                        root: 'bg-[#dedede] p-3 '
                                    }}
                                    
                                />
                                    
                                <Divider sx={{ borderBottomWidth: 2, borderColor: '#bdbdbd' }}/>
                                <CardContent classes={{
                                    root: 'text-[13px] px-0'
                                }}>
                                    <div className="py-2 px-3">
                                        <div>
                                            <p className="text-[#777]">Photos of shipment</p>
                                            <div className="flex mt-1 mb-2 gap-[10px] list-proof">
                                                <div className="item-proof">
                                                    <img src="https://placeholder.com/50x50" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4"> 
                                            <p className="text-[#777]">Notes</p>
                                            <div className="text-[14px] mt-1 mb-2">
                                                <p>Enter  proof note in here?/</p>
                                            </div>
                                        </div>
                                    </div>
                                        <Divider sx={{ borderBottomWidth: 35 }}/>
                                    <div className="py-2 px-3">
                                        <div>
                                            <p className="text-[#777]">Photos of shipment</p>
                                            <div className="flex mt-1 mb-2 gap-[10px] list-proof">
                                                <div className="item-proof">
                                                    <img src="https://placeholder.com/50x50" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4"> 
                                            <p className="text-[#777]">Notes</p>
                                            <div className="text-[14px] mt-1 mb-2">
                                                <p>Enter  proof note in here?/</p>
                                            </div>
                                        </div>
                                    </div>
                                        <Divider sx={{ borderBottomWidth: 35 }}/>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardHeader title="TRACKING" 
                                    titleTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 500
                                    }}
                                    classes={{
                                        root: 'bg-[#dedede] p-3'
                                    }}
                                    
                                />
                                    
                                <Divider sx={{ borderBottomWidth: 2, borderColor: '#bdbdbd' }}/>
                                <CardContent classes={{
                                    root: 'text-[13px]'
                                }}>
                                    <div>

                                    <Stepper orientation="vertical" activeStep={(selectedJob?.histories.length || 0) +1} >
                                        {selectedJob?.histories.map((item, index) => (
                                            <Step key={index} active = {true} >
                                                <StepLabel classes={{
                                                    label: 'text-[#0fd260]'
                                                }}>{t(item?.action)}</StepLabel>
                                                <StepContent classes={{
                                                    root: 'text-[#0fd260]'
                                                }}>
                                                {dayjs(item?.createdAt).format(
                                                    "HH:mm DD/MM/YYYY"
                                                )}
                                                </StepContent>
                                            </Step>
                                        ))}
                                         <Step key="last" active = {true} ></Step>
                                        </Stepper>

                                    <div className="mt-3">
                                        <GoogleMap
                                            center={cooridinate}
                                            zoom={12}
                                            mapContainerStyle={{ width: "100%", height: "200px" }}
                                            options={{
                                                zoomControl: false,
                                                streetViewControl: false,
                                                mapTypeControl: false,
                                                fullscreenControl: false,
                                            }}
                                        >
                                            {directionResponse && (
                                                <DirectionsRenderer directions={directionResponse} />
                                            )}
                                        </GoogleMap>
                                    </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                        </div>
                        {/* <div className="dialog-job-detail--body__left">{renderPopup}</div>
                        <div className="dialog-job-detail--body__right">
                            <GoogleMap
                                center={cooridinate}
                                zoom={12}
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                options={{
                                    zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}
                            >
                                {directionResponse && (
                                    <DirectionsRenderer directions={directionResponse} />
                                )}
                            </GoogleMap>
                        </div> */}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default History;
