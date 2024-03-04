import { Transition } from "@headlessui/react";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { listStatus } from "../../data/status";
import { formatMoney } from "../../utils/common";
import FeedsDetail from "./FeedsDetail";

const JobDetailPopup = (job) => {
  const { t } = useTranslation();
  const [open, setOpenPopup] = useState(false);
  const { masterDatas } = useSelector((state) => state.masterDatas);

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

  return {
    setOpenPopup,
    renderPopup: (
      <>
        <Transition.Root show={open} as={Fragment}>
          <div className="pointer-events-none  inset-y-0 left-0 z-[2] flex max-w-full overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen">
                <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                  <div
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    style={{ maxHeight: "calc(100vh - 132px)" }}
                  >
                    <div className="space-y-2 border-b border-gray-200 bg-white p-4 shadow-sm">
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
                    <div className="relative flex flex-1 flex-col overflow-auto bg-gray-200">
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
                            <p>
                              {t(getCargoName(job?.commodity?.typeOfGoods))}
                            </p>
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
                          <div className="flex items-start justify-between gap-28">
                            <p>{t("tripType")}</p>
                            <p className="text-right">
                              {job?.commodity?.tripType === 1
                                ? t("singleTrip")
                                : t("roundTrip")}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p>{t("attachments")}</p>
                            {job?.commodity?.attachments ? (
                              <p>{job?.commodity?.attachments[0]}</p>
                            ) : (
                              t("none")
                            )}
                          </div>
                        </div>

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
                            <p>
                              {formatMoney(job?.salesOrder?.transportFee)} THB
                            </p>
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

                        <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                          <p className="font-semibold">
                            {t("driverAndTruckInformation")}
                          </p>
                          <div className="flex items-center justify-between">
                            <p>{t("fullName")}</p>
                            <p>
                              {job?.driverName ? job?.driverName : t("none")}
                            </p>
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

                        <div className="mx-4 rounded-lg bg-white p-4 shadow-sm">
                          <p className="font-semibold">{t("history")}</p>
                          {job?.histories?.map((item, index) => (
                            <div
                              key={index + "h"}
                              className="flex items-center justify-between"
                            >
                              <p>{t(item?.action)}</p>
                              <p>
                                {dayjs(item?.createdAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="m-4 rounded-lg bg-white p-4 shadow-sm">
                          <p className="font-semibold">{t("route")}</p>
                          <FeedsDetail data={job} />
                        </div>
                      </PerfectScrollbar>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Transition.Root>
      </>
    ),
  };
};

export default JobDetailPopup;
