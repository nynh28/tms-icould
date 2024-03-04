import React, { useState } from "react";
import JobDetailByDay from "./JobDetailByDay";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Day = ({ truck, weekIndex }) => {
  const calendar = useSelector((state) => state.calendar);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedDate, setSelectedDate] = useState(null);

  let countJobs = Object.keys(truck?.jobs).map((key) => {
    return {
      date: key,
      count: truck?.jobs[key],
    };
  });
  countJobs.sort((a, b) =>
    dayjs(a.date, "DD-MM-YYYY").isAfter(dayjs(b.date, "DD-MM-YYYY")) ? 1 : -1
  );

  function getCurrentDay(day) {
    if (calendar?.selectedDay) {
      return dayjs(day, "DD-MM-YYYY").format("MM-DD-YYYY") ===
        calendar?.selectedDay
        ? "bg-indigo-100"
        : "bg-white";
    } else {
      return day === dayjs().format("DD-MM-YYYY") ? "bg-[#DAFDDF]" : "bg-white";
    }
  }

  return (
    <>
      {countJobs?.map((item, index) => {
        return (
          <div
            className={`relative px-2 py-3 flex items-center justify-center text-gray-500 ${getCurrentDay(
              item.date
            )}`}
            key={index}
          >
            <div
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full font-semibold text-white ${
                item.count > 0 ? "bg-primary-500 " : "bg-gray-500/50"
              }`}
              onClick={() => {
                handleOpen();
                setSelectedDate(item.date);
              }}
            >
              {item.count}
            </div>
          </div>
        );
      })}

      <JobDetailByDay
        open={open}
        handleClose={handleClose}
        truckId={truck?.truckId}
        day={selectedDate}
        weekIndex={weekIndex}
      />
    </>
  );
};

export default Day;
