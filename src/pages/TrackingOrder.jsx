import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatMoney } from "../utils/common";
import dayjs from "dayjs";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { StarIcon } from "@heroicons/react/outline";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAddRatingMutation } from "../services/apiSlice";
import TextField from "@mui/material/TextField";
import { getRatingByJob } from "../api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterDatas } from "../features/masterDatas/masterDatasSlice";
import FeedsDetail from "../components/Job/FeedsDetail";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const TrackingOrder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { id } = useParams();
  const [addRating, { isLoading }] = useAddRatingMutation();
  const { masterDatas } = useSelector((state) => state.masterDatas);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [isRating, setIsRating] = useState(false);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    dispatch(fetchMasterDatas());
    document.title = "HINO CONNECT"
  }, [dispatch]);

  const getCargoName = (value) => {
    if (value) {
      return masterDatas?.find(
        (x) => x.type === "CARGO" && x.intValue === value
      )?.name;
    }
  };

  const getUnitName = (value) => {
    if (value) {
      return masterDatas?.find((x) => x.type === "UNIT" && x.intValue === value)
        ?.name;
    }
  };

  const getTruckName = (value) => {
    let name = "";
    const truck = masterDatas?.find(
      (x) => x.type === "TRUCK" && x.intValue === value
    );
    if (truck) name = truck?.name;

    return name;
  };

  useEffect(() => {
    const getJob = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/public/job/detail/${id}`
        );
        console.log(response.data);
        setJob(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getJob();
  }, []);

  const getRating = async () => {
    try {
      const response = await getRatingByJob(id);
      if (response.data) {
        const { ratingPoint, ratingComment } = response.data;
        setValue(ratingPoint);
        setRatingComment(ratingComment);
        setIsRating(true);
      } else {
        setIsRating(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRating();
  }, []);

  const onRating = async () => {
    try {
      await addRating({
        jobId: job.jobId,
        ratingPoint: value,
        ratingComment,
      }).unwrap();
      toast.success(t("message.success.add", { field: t("rating") }));
      getRating();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-500 py-2 text-center text-xl font-semibold text-white">
        {t("trackingOrder")}
      </div>

      {job && (
        <div className="px-6 py-6 gap-4 flex-1">
          {/* {![2, 4, 5, 6, 7, 8, 9].includes(job?.jobStatus) && (
            <div className="my-2 text-right">
              <Button variant="contained" onClick={() => setOpenRating(true)}>
                {t("rating")}
              </Button>
              <RatingJob
                openRating={openRating}
                setOpenRating={setOpenRating}
                jobId={id}
              />
            </div>
          )} */}
          <div className="grid grid-cols-3 gap-10 h-full">
            <div className="space-y-8 flex flex-col">
              <div className="border border-gray-500">
                <div className="divide-y divide-gray-200">
                  <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                    {t("customerInformation")}
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("fullName")}</p>
                    <p className="text-right">
                      {job.salesOrder?.customer?.fullName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("phoneNumber")}</p>
                    <p className="text-right">
                      {job.salesOrder?.customer?.phoneNumber}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("email")}</p>
                    <p className="text-right">
                      {job.salesOrder?.customer?.email}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("idCard")}</p>
                    <p className="text-right">
                      {job.salesOrder?.customer?.idCard}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("taxCode")}</p>
                    <p className="text-right">
                      {job.salesOrder?.customer?.taxCode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-500">
                <div className="divide-y divide-gray-200">
                  <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                    {t("salesOrderInformation")}
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("orderId")}</p>
                    <p className="text-right">{job.salesOrder?.orderId}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("dateCreated")}</p>
                    <p className="text-right">
                      {dayjs(job.salesOrder?.createdAt).format(
                        "HH:mm DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("paymentMethod")}</p>
                    <p className="text-right">
                      {job.salesOrder?.paymentMethod === 1
                        ? t("card")
                        : t("bankTransfer")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("transportFee")}</p>
                    <p className="text-right">
                      {formatMoney(job.salesOrder?.transportFee)} THB
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("paymentStatus")}</p>
                    <p
                      className={`text-right ${
                        job.salesOrder?.paymentStatus === 0
                          ? "text-red-500"
                          : "text-primary-500"
                      }`}
                    >
                      {job.salesOrder?.paymentStatus === 0
                        ? t("unpaid")
                        : t("paid")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-500 flex-1">
                <div className="divide-y divide-gray-200">
                  <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                    {t("jobInformation")}
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("jobId")}</p>
                    <p className="text-right">{job.jobId}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("dateCreated")}</p>
                    <p className="text-right">
                      {dayjs(job.histories[0].createdAt).format(
                        "HH:mm DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("driverName")}</p>
                    <p className="text-right">{job.driverName}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("licensePlate")}</p>
                    <p className="text-right">{job.truckPlateLicence}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("vehicleType")}</p>
                    <p className="text-right">
                      {t(getTruckName(job.truckType))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8 flex flex-col">
              <div className="border border-gray-500">
                <div className="divide-y divide-gray-200">
                  <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                    {t("commodityInformation")}
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("nameOfGoods")}</p>
                    <p className="text-right">{job?.commodity?.nameOfGoods}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("typeOfGoods")}</p>
                    <p className="text-right">
                      {t(getCargoName(job?.commodity?.typeOfGoods))}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("loadingWeight")}</p>
                    <p className="text-right">
                      {formatMoney(job?.commodity?.cargoWeight)} {t(getUnitName(job?.commodity?.unit))}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("note")}</p>
                    <p className="text-right">{job?.commodity?.note || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 py-2 px-3">
                    <p>{t("tripType")}</p>
                    <p className="text-right">
                      {job?.commodity?.tripType === 1
                        ? t("singleTrip")
                        : t("roundTrip")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-500 flex-1">
                <div className="divide-y divide-gray-200">
                  <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                    {t("route")}
                  </div>
                  <div className="p-4 flex-1">
                    <FeedsDetail data={job} />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative border border-gray-500">
              <div className="border-b border-gray-500 bg-gray-200 py-4 px-6 font-semibold capitalize">
                {t("jobStatus")}
              </div>
              <div className="px-6 pb-4">
                <div className="space-y-2 divide-y divide-gray-200">
                  {job.histories.map((item, index) => (
                    <div className="flex gap-4 pt-4" key={index}>
                      <div className="mt-1.5 h-3 w-3 rounded-full bg-primary-500" />
                      <div>
                        <p className="font-semibold">{t(item.action)}</p>
                        <p className="text-sm text-gray-500">
                          {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-0 left-0 w-full space-y-2 py-4 px-6 text-center">
                    <p className="text-xl font-medium">
                      {!isRating ? "Please rate our service" : "Rating History"}
                    </p>
                    <div className="flex items-center justify-center">
                      <Rating
                        value={value}
                        precision={0.5}
                        size="large"
                        getLabelText={getLabelText}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                          setHover(newHover);
                        }}
                        emptyIcon={<StarIcon className="w-7" />}
                        readOnly={isRating}
                      />
                      {value !== null && (
                        <Box sx={{ ml: 2 }}>
                          {labels[hover !== -1 ? hover : value]}
                        </Box>
                      )}
                    </div>
                    <TextField
                      id="standard-multiline-static"
                      label="Comment"
                      multiline
                      rows={4}
                      variant="standard"
                      className="w-full"
                      disabled={isRating}
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                    />
                    {!isRating && (
                      <LoadingButton
                        variant="contained"
                        loading={isLoading}
                        onClick={onRating}
                      >
                        {t("confirm")}
                      </LoadingButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingOrder;
