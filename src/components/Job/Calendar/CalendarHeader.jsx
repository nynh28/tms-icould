import React from "react";
import { useTranslation } from "react-i18next";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { SearchIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { addDay } from "../../../features/calendar/calendarSlice";

const CalendarHeader = ({ currentWeek, weekIndex, setWeekIndex }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between py-[11px] px-4">
      <h2 className="text-lg font-medium">{t("calendar")}</h2>
      <div className="text-center">
        <p className="text-lg font-semibold">{t("week")}</p>
        <div className="flex items-center justify-center gap-4">
          <BsArrowLeftCircle
            className="cursor-pointer text-xl text-gray-500 transition duration-300 ease-in-out hover:text-primary-500"
            onClick={() => {
              setWeekIndex(weekIndex - 1);
              dispatch(addDay(null));
            }}
          />
          <span className="text-lg">
            {dayjs(currentWeek[0]).format("DD/MM")} -{" "}
            {dayjs(currentWeek[currentWeek.length - 1]).format("DD/MM/YYYY")}
          </span>
          <BsArrowRightCircle
            className="cursor-pointer text-xl text-gray-500 transition duration-300 ease-in-out hover:text-primary-500"
            onClick={() => {
              setWeekIndex(weekIndex + 1);
              dispatch(addDay(null));
            }}
          />
        </div>
      </div>
      <div>
        <TextField
          size="small"
          className="w-[285px]"
          placeholder={t("search")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="h-5 w-5" />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
