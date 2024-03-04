import { XIcon } from "@heroicons/react/outline";
import Backdrop from "@mui/material/Backdrop";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { exportWaybill, getJobDetail, getLocationByPlate, getRatingByJob } from "../../api";
import { listStatus } from "../../data/status";
import { formatMoney } from "../../utils/common";
import AssignDriver from "./AssignDriver";
import AssignTruck from "./AssignTruck";
import FeedsDetail from "./FeedsDetail";
import LoadingButton from "@mui/lab/LoadingButton";
import { deepOrange, indigo } from "@mui/material/colors";
import Rating from '@mui/material/Rating';
import svgIcon from "./images/car.png";
import { get } from "lodash";
import Pods from "./Pods";
import { Divider } from "@mui/material";
import AddStaff from "./AddStaff";
import { TrashIcon } from "@heroicons/react/solid";
import AddExpense from "./AddExpense";

const JobDetails = ({ job, setSelectedJob, refetch }) => {
  const { t } = useTranslation();
  const { masterDatas } = useSelector((state) => state.masterDatas);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(2);
  const [cooridinate, setCooridinate] = useState({
    lat: 21.037247766943338,
    lng: 105.83492418984048,
  });
  const [carCooridinate, setCarCooridinate] = useState({});
  const [directionResponse, setDirectionResponse] = useState(null);
  const [rating, setRating] = useState({
    ratingPoint: null,
    ratingComment: "",
  });

  const [pods, setPods] = useState([])

  useEffect(() => {
    if (!job.jobId) return;
    const getLocation = async () => {
      if (job.truckPlateLicence) {
        try {
          const response = await getLocationByPlate({
            license_plate: job.truckPlateLicence
          })
          setCarCooridinate({
            lat: Number(response?.data?.x),
            lng: Number(response?.data?.y),
          })
        } catch (error) {
          setCarCooridinate({})
          console.log(error);
        }
      }
    }
    const getRating = async () => {
      try {
        const response = await getRatingByJob(job.jobId);
        setRating(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getPods = async () => {
      try {
        const response = await getJobDetail(job.jobId);
        const result = get(response, 'data.pods.hehe', [])
        setPods([...result]);
        // setRating(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPods()
    getLocation()
    getRating();
  }, [job.jobId]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const onExportWaybill = async () => {
    setLoading(true);
    try {
      const response = await exportWaybill(job?.jobId);
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
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

  useEffect(() => {
    handleOpen();
    renderDirections(job.locations);
  }, [job]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="absolute flex h-full w-full items-center justify-center">
          <div className="pointer-events-auto mx-4 w-screen max-w-[1600px] overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 py-6 px-4">
              <h2 className="text-xl font-medium">{t("jobDetail")}</h2>
              <div className="flex items-center justify-center gap-4">
                {job && (
                  <>
                    {[2, 4, 5, 6, 7, 8, 9, 10].includes(job?.jobStatus) ? (
                      <>
                        {/* <Button
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
                          jobId={job.jobId}
                        /> */}
                      </>
                    ) : (
                        <Fragment>
                      <button
                        className="dialog-job-detail--button__assign flex items-center"
                        style={{ backgroundColor: deepOrange[500] }}
                      >
                        <AssignTruck jobId={job.jobId} groupId={job.groupId} refetch={refetch} />
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
                          {t("assignTruck")}
                        </span>
                      </button>
                      <button
                        className="dialog-job-detail--button__assign flex items-center"
                        style={{ backgroundColor: indigo[500] }}
                      >
                        <AssignDriver jobId={job.jobId} groupId={job.groupId} refetch={refetch} />
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
                          {t("assignDriver")}
                        </span>
                      </button>

                        </Fragment>
                    )}
                  </>
                )}
                <LoadingButton
                  onClick={onExportWaybill}
                  className="capitalize"
                  variant="outlined"
                  color="warning"
                  startIcon={
                    <img src="/images/pdf.png" alt="pdf" className="h-5 w-5" />
                  }
                  loading={loading}
                >
                  {t("exportWaybill")}
                </LoadingButton>
                <XIcon
                  className="h-6 w-6 cursor-pointer text-gray-500"
                  aria-hidden="true"
                  onClick={handleClose}
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-[60%]">
                <div className="space-y-2 rounded-lg border-b border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    {job?.groupName && (
                      <Chip
                        label={`${t("fleetName")}: ${job?.groupName}`}
                        color="primary"
                        size="small"
                      />
                    )}
                    <Chip
                      label={t(
                        listStatus.find((x) => x.intValue === job?.jobStatus)
                          ?.text
                      )}
                      className={`${listStatus.find((x) => x.intValue === job?.jobStatus)
                        ?.color
                        } text-white`}
                      size="small"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-orange-500">
                      ID: {job?.jobId}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {dayjs(job?.histories[0]?.createdAt).format(
                        "HH:mm DD/MM/YYYY"
                      )}
                    </span>
                  </div>
                </div>
                <div className="relative flex h-[calc(100vh_-_200px)] flex-col overflow-auto bg-gray-200">
                  <PerfectScrollbar>
                    <div className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">
                        {t("commodityInformation")}
                      </p>
                      <div className="flex items-center justify-between">
                        <p>{t("nameOfGoods")}</p>
                        <p>{job?.commodity?.nameOfGoods}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("typeOfGoods")}</p>
                        <p>{t(getCargoName(job?.commodity?.typeOfGoods))}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("weight")}</p>
                        <p>{job?.commodity?.cargoWeight}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("unit")}</p>
                        <p>{t(getUnitName(job?.commodity?.unit))}</p>
                      </div>
                      <div className="flex items-start justify-between gap-28">
                        <p>{t("note")}</p>
                        <p className="text-right">{job?.commodity?.note}</p>
                      </div>
                      {/* <div className="flex items-start justify-between gap-28">
                        <p>{t("tripType")}</p>
                        <p className="text-right">
                          {job?.commodity?.tripType === 1
                            ? t("singleTrip")
                            : t("roundTrip")}
                        </p>
                      </div> */}
                      <div className="flex items-center justify-between">
                        <p>{t("attachments")}</p>
                        {job?.commodity?.attachments ? (
                          <p>{job?.commodity?.attachments[0]}</p>
                        ) : (
                          t("none")
                        )}
                      </div>
                    </div>
                    {/* <div className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">{t("salesOrder")}</p>
                      <div className="flex items-center justify-between">
                        <p>{t("orderCode")}</p>
                        <p>{job?.salesOrder?.orderCode}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("nameOfGoods")}</p>
                        <p>{job?.salesOrder?.nameOfGoods}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("loadingWeight")}</p>
                        <p>{job?.salesOrder?.loadingWeight}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("transportFee")}</p>
                        <p>{formatMoney(job?.salesOrder?.transportFee)} THB</p>
                      </div>
                      <div className="flex items-start justify-between gap-28">
                        <p>{t("paymentStatus")}</p>
                        <p
                          className={`text-right ${
                            job?.salesOrder?.paymentStatus === 0
                              ? "text-red-500"
                              : "text-primary-500"
                          }`}
                        >
                          {job?.salesOrder?.paymentStatus === 0
                            ? t("unpaid")
                            : t("paid")}
                        </p>
                      </div>
                    </div> */}

                    <div className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-sm">
                      {/* <p className="font-semibold">{t("salesOrder")}</p> */}
                      <div className="flex items-center justify-between">
                        <p>{t("documentType")}</p>
                        <p>{job?.documentType}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("calculation")}</p>
                        <p>{job?.calculation}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("deliveryStatus")}</p>
                        <p>{job?.deliveryStatus}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("invoiceNo")}</p>
                        <p>{job?.invoiceNo}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("saleOrderNo")}</p>
                        <p>{job?.saleOrderNo}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("sizeType")}</p>
                        <p>{job?.sizeType}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("loadingValue")}</p>
                        <p>{job?.loadingSize}</p>
                      </div>

                    </div>

                    <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">
                        {t("driverAndTruckInformation")}
                      </p>
                      <div className="flex items-center justify-between">
                        <p>{t("fullName")}</p>
                        <p>{job?.driverName ? job?.driverName : t("none")}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("licensePlate")}</p>
                        <p>
                          {job?.truckPlateLicence
                            ? job?.truckPlateLicence
                            : t("none")}
                        </p>
                      </div>
                    </div>

                    <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">
                        {/* {t("driverAndTruckInformation")} */}
                        Staff
                      </p>
                      <div className="flex items-center justify-between">
                        <p>Type</p>
                        <p>HELPER</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Staff ID</p>
                        <p>4712487</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Citizen ID</p>
                        <p>00312371283712</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Name</p>
                        <p>Mr. Nam Nguyen</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p></p>
                        <p className="text-red-500 group-hover:text-white flex text-[14px] cursor-pointer">     
                            <TrashIcon className="w-[14px] mr-1" />
                            Remove
                        </p>
                      </div>
                      <Divider className="my-2"/>
                      <div className="flex items-center justify-between">
                        <p>Type</p>
                        <p>HELPER</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Staff ID</p>
                        <p>4712487</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Citizen ID</p>
                        <p>00312371283712</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Name</p>
                        <p>Mr. Nam Nguyen</p>
                      </div>
                      <Divider className="my-2"/>
                      <div>
                        <AddStaff jobId={job.jobId} refetch={refetch} />
                      </div>
                    </div>

                    <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">
                        {/* {t("driverAndTruckInformation")} */}
                        Expense
                      </p>
                      <div className="flex items-center justify-between">
                        <p>Type</p>
                        <p>Fuel</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Detail</p>
                        <p>Fue 312jk 312 l</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Amount Cost</p>
                        <p>100.000</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Quantity</p>
                        <p>39L</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Description</p>
                        <p>Lorem is sum</p>
                      </div>
                      <div>
                        <AddExpense jobId={job.jobId} refetch={refetch} />
                        {/* <p className="text-[#377EF0] cursor-pointer text-[13px] mt-3">+ Add Expense</p> */}
                      </div>
                    </div>


                    {rating && <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">{t("rating")}</p>
                      <div className="flex items-center justify-between">
                        <p>{t("ratingPoint")}</p>
                        <Rating name="read-only" value={rating.ratingPoint} readOnly />
                      </div>
                      <div className="flex items-center justify-between">
                        <p>{t("ratingComment")}</p>
                        <p>
                          {rating.ratingComment}
                        </p>
                      </div>
                    </div>}

                    <div className="mx-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">{t("history")}</p>
                      {job?.histories?.map((item, index) => (
                        <div
                          key={index + "h"}
                          className="flex items-center justify-between"
                        >
                          <p>{t(item?.action)}</p>
                          <p>
                            {dayjs(item?.createdAt).format("HH:mm DD/MM/YYYY")}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">{t("pods")}</p>
                      <Pods data={pods} />
                    </div>

                    <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                      <p className="font-semibold">{t("route")}</p>
                      <FeedsDetail data={job} />
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>
              <div className="flex-1">
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
                  <Marker position={carCooridinate} icon={{
                    url: svgIcon,
                    scaledSize: new window.google.maps.Size(40, 40), // Kích thước biểu tượng
                  }} />

                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default JobDetails;
