import React, { useEffect, useState } from "react";
import { getWeek } from "../../../utils/common";
import CalendarHeader from "./CalendarHeader";
import CalendarContent from "./CalendarContent";
import dayjs from "dayjs";
import { useGetCalendarTruckQuery } from "../../../services/apiSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Calendar = ({ weekIndexHistory }) => {
  const calendar = useSelector((state) => state.calendar);

  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek] = useState(
    getWeek(null, calendar?.selectedDay)
  );
  const [weekIndex, setWeekIndex] = useState(weekIndexHistory || 0);

  useEffect(() => {
    setCurrentWeek(getWeek(weekIndex));
  }, [weekIndex]);

  useEffect(() => {
    setCurrentWeek(getWeek(0, calendar?.selectedDay));
  }, [calendar?.selectedDay]);

  const { data, isLoading, isFetching } = useGetCalendarTruckQuery({
    dateFrom: dayjs(currentWeek[0]).format(),
    dateTo: dayjs(currentWeek[currentWeek.length - 1]).format(),
    rowsPerPage: 1000,
  });

  function getCurrentDay(day) {
    if (calendar?.selectedDay) {
      return calendar?.selectedDay === dayjs(day).format("MM-DD-YYYY")
        ? "bg-indigo-100"
        : "bg-white";
    } else {
      return dayjs(day).format("DD-MM-YYYY") === dayjs().format("DD-MM-YYYY")
        ? "bg-[#DAFDDF]"
        : "bg-white";
    }
  }

  return (
    <>
      <CalendarHeader
        currentWeek={currentWeek}
        weekIndex={weekIndex}
        setWeekIndex={setWeekIndex}
      />
      <div className="grid h-[49px] grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center font-medium leading-6 text-gray-500 lg:flex-none">
        {currentWeek.map((day, index) => (
          <div
            className={`flex flex-col items-center justify-center ${getCurrentDay(
              day
            )}`}
            key={index}
          >
            <p className="text-sm">{dayjs(day).format("dddd")}</p>
            <span className="text-xs font-normal">
              {dayjs(day).format("DD/MM/YYYY")}
            </span>
          </div>
        ))}

        <div
          className="flex items-center justify-center bg-white"
          style={{ gridColumn: -1, width: 250 }}
        >
          <span className="text-sm">{t("truck")}</span>
        </div>
      </div>
      <CalendarContent
        trucks={data?.content}
        isLoading={isLoading}
        isFetching={isFetching}
        weekIndex={weekIndex}
      />
    </>
  );
};

export default Calendar;
