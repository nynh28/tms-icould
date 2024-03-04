import { XIcon } from "@heroicons/react/outline";
import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { deepOrange } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import Tab from "@mui/material/Tab";
import TablePagination from "@mui/material/TablePagination";
import Tabs from "@mui/material/Tabs";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsPlus } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";
import { exportWaybill } from "../../api";
import { listStatus } from "../../data/status";
import { addDay } from "../../features/calendar/calendarSlice";
import { useGetFleetsQuery, useGetJobsQuery } from "../../services/apiSlice";
import AssignJob from "./AssignJob";
import CreateJob from "./CreateJob";
import Feeds from "./Feeds";
import ImportFromExcel from "./ImportFromExcel";
import JobDetail from "./JobDetail";
import JobDetailPopup from "./JobDetailPopup";
import JobDetails from "./JobDetails";
import RatingJob from "./RatingJob";
import "./styles/ListJob.css";

const ListJob = () => {
  const { t } = useTranslation();
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const [bodyData, setBodyData] = useState({
    jobStatusList: [1],
    page: 0,
    rowsPerPage: 25,
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [value, setValue] = useState(2);
  const { render, setOpen } = JobDetail(selectedJob);
  const { renderPopup, setOpenPopup } = JobDetailPopup(selectedJob);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useGetJobsQuery(bodyData, { refetchOnMountOrArgChange: true });

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

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);

    if (Number(newValue) === 1) {
      setBodyData({ ...bodyData, jobStatusList: [1], page: 0 });
    } else if (Number(newValue) === 2)
      setBodyData({
        ...bodyData,
        jobStatusList: [2, 4, 5, 6, 7, 8, 9],
        page: 0,
      });
    else {
      setBodyData({ ...bodyData, jobStatusList: [10], page: 0 });
    }
  };

  const handleChangePage = (event, newPage) => {
    setBodyData({ ...bodyData, page: newPage });
  };

  const [openPopupJobDetail, setOpenPopupJobDetail] = useState(false);

  const handleClickOpenPopupJobDetail = () => {
    setOpenPopupJobDetail(true);
  };

  const handleClosePopupJobDetail = () => {
    setOpenPopupJobDetail(false);
  };

  const dispatch = useDispatch();
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
    <div className="pointer-events-none inset-y-0 left-0 z-[2] flex max-w-full overflow-hidden max-w-md">
      <div className="pointer-events-auto w-screen max-w-xl">
        <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-gray-200 py-6 px-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{t("tabMap_1")}</h2>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setOpenCreateJob(true)}
                    className="capitalize"
                  >
                    + {t("createJob")}
                  </Button>
                  {open && (
                    <CreateJob
                      open={openCreateJob}
                      setOpen={setOpenCreateJob}
                    />
                  )}
                  <ImportFromExcel refetch={refetch} />
                </div>
              </div>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                onChange={handleChangeTab}
                variant="fullWidth"
                value={tabValue}
              >
                <Tab label={t("unAssigned")} value={1} />
                <Tab label={t("assigned")} value={2} />
                <Tab label={t("completed")} value={10} />
              </Tabs>
            </Box>
            <div
              style={{ height: "calc(100vh - 280px)" }}
              className="bg-gray-100 py-3"
            >
              <PerfectScrollbar>
                <div className="relative flex h-full flex-1 flex-col space-y-3">
                  {isLoading || isFetching ? (
                    <div className="flex h-full items-center justify-center">
                      <CircularProgress />
                    </div>
                  ) : isSuccess ? (
                    data?.content.map((item, index) => (
                      <div
                        key={index}
                        className="mx-4 space-y-2 rounded-2xl bg-white p-4 hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
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
                          <p
                            className="cursor-pointer text-sm font-medium text-indigo-500"
                            onClick={() => {
                              setSelectedJob(item);
                              renderDirections(item.locations);
                              // setOpenPopup(true);
                              // handleClickOpenPopupJobDetail();
                            }}
                          >
                            {t("showDetail")}
                          </p>
                        </div>
                        {item.groupName && (
                          <Chip
                            label={`${t("branchName")}: ${item.groupName}`}
                            color="primary"
                            size="small"
                          />
                        )}
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
                                <FaTruck />
                              </Avatar>
                              <span className="whitespace-nowrap text-sm">
                                {t("assigned")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Avatar sx={{ bgcolor: deepOrange[500] }}>
                                <BsPlus className="h-8 w-8" />
                                <AssignJob
                                  jobId={item.jobId}
                                  groupId={item.groupId}
                                  refetch={refetch}
                                />
                              </Avatar>
                              <span className="text-sm">{t("assign")}</span>
                            </div>
                          )}
                          <div
                            onClick={() => {
                              dispatch(
                                addDay(
                                  dayjs(
                                    item.locations[0].locationDateTime
                                  ).format("MM-DD-YYYY")
                                )
                              );
                            }}
                          >
                            <Feeds data={item} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </PerfectScrollbar>
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
            {selectedJob && (
              <JobDetails
                job={selectedJob}
                setSelectedJob={setSelectedJob}
                cooridinate={cooridinate}
                directionResponse={directionResponse}
                refetch={refetch}
              />
            )}
          </div>
        </div>
      </div>

      {/* <Dialog
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
                  <div className="flex items-center gap-2">
                    {selectedJob && (
                      <>
                        {[2, 4, 5, 6, 7, 8, 9, 10].includes(
                          selectedJob?.jobStatus
                        ) ? (
                          <>
                            <Button
                              variant="contained"
                              onClick={() => setOpenRating(true)}
                            >
                              {t("rating")}
                            </Button>
                            <RatingJob
                              openRating={openRating}
                              setOpenRating={setOpenRating}
                              value={value}
                              setValue={setValue}
                              jobId={selectedJob.jobId}
                            />
                          </>
                        ) : (
                          <button
                            className="dialog-job-detail--button__assign flex items-center"
                            style={{ backgroundColor: deepOrange[500] }}
                          >
                            <AssignJob
                              jobId={selectedJob.jobId}
                              groupId={selectedJob.groupId}
                              setOpenPopupJobDetail={setOpenPopupJobDetail}
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
          <div className="dialog-job-detail--body">
            <div className="dialog-job-detail--body__left">{renderPopup}</div>
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
            </div>
          </div>
        </div>
      </Dialog> */}
    </div>
  );
};

export default ListJob;
