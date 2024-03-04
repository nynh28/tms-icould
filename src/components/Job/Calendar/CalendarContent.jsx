import React, { Fragment } from "react";
import Day from "./Day";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FaTruck } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";

const CalendarContent = ({ trucks, weekIndex, isLoading, isFetching }) => {
  const { t } = useTranslation();
  const { masterDatas } = useSelector((state) => state.masterDatas);

  const getTruckName = (value) => {
    let name = "";
    const truck = masterDatas?.find(
      (x) => x.type === "TRUCK" && x.intValue === value
    );
    if (truck) name = truck?.name;

    return name;
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto max-h-[calc(100vh_-_230px)]">
      <PerfectScrollbar>
        {isLoading || isFetching ? (
          <div className="flex h-full items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid h-full grid-cols-7 gap-px">
            {trucks?.map((truck, index) => (
              <Fragment key={index}>
                <Day truck={truck} weekIndex={weekIndex} />
                <div
                  className="flex items-center justify-start gap-4 bg-white p-2 text-gray-500 h-[80px]"
                  style={{ gridColumn: -1, width: 250 }}
                >
                  <Avatar className="border-b-200 border bg-white">
                    <FaTruck className="text-gray-900" />
                  </Avatar>
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {truck.licencePlate}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {t(getTruckName(truck.truckType))}
                      </p>
                      <p className="text-gray-90 truncate text-sm">
                        {truck.driverName}
                      </p>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
            {trucks?.length < 10
              ? Array(10 - trucks?.length)
                  .fill([])
                  .map(() => {
                    return Array(8)
                      .fill([])
                      .map((_, index) => (
                        <div key={index} className="bg-white relative px-2 py-3"></div>
                      ));
                  })
              : null}
          </div>
        )}
      </PerfectScrollbar>
    </div>
  );
};

export default CalendarContent;
