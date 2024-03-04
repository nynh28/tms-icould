import { Transition } from "@headlessui/react";
import {
  XIcon
} from "@heroicons/react/outline";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import FeedsDetail from "./FeedsDetail";

const JobDetail = (job) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { masterDatas } = useSelector((state) => state.masterDatas);

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
        .name;
    }
  };

  return {
    setOpen,
    render: (
      <>
        <Transition.Root show={open} as={Fragment}>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] flex max-w-full overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-2xl">
                <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="border-b border-gray-200 py-6 px-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                          <h2 className="text-lg font-medium">
                            {t("jobDetail")}
                          </h2>
                          {job?.groupName && (
                            <Chip
                              label={`${t("fleetName")}: ${job?.groupName}`}
                              color="primary"
                              size="small"
                            />
                          )}
                        </div>
                        <div className="ml-3 flex h-7 items-center justify-center gap-4">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 bg-white p-4 shadow-sm border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold">{t("order")}</h2>
                        <Chip
                          label={
                            [1].includes(job?.jobStatus)
                              ? t("unAssigned")
                              : [2, 4, 5, 6, 7, 8].includes(job?.jobStatus)
                              ? t("assigned")
                              : t("completed")
                          }
                          className={
                            [1].includes(job?.jobStatus)
                              ? undefined
                              : [2, 4, 5, 6, 7, 8].includes(job?.jobStatus)
                              ? "bg-blue-500 text-white"
                              : "bg-primary-500 text-white"
                          }
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
                          <div className="flex items-center justify-between">
                            <p>{t("attachments")}</p>
                            {job?.commodity?.attachments ? (
                              <p>{job?.commodity?.attachments[0]}</p>
                            ) : (
                              t("none")
                            )}
                          </div>
                        </div>

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

export default JobDetail;
