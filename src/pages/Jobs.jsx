import React, { useEffect } from "react";
import { Calendar, ListJob, ListTruck } from "../components";
import { useLocation } from "react-router-dom";

const Jobs = () => {
  const location = useLocation();
  let weekIndex = location.state?.weekIndex;
  useEffect(() => {
    // Applying on mount
    document.body.style.overflow = "hidden";
    // Applying on unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    window.history.replaceState({}, document.title)
  }, [])

  return (
    <div className="mt-[1px] flex h-[calc(100vh_-_100px)] w-full divide-x divide-gray-200">
      <ListJob />
      <div className="flex min-h-[768px] flex-1 flex-col divide-y divide-gray-200 bg-white">
        <Calendar weekIndexHistory={weekIndex} />
      </div>
      {/* <ListTruck /> */}
    </div>
  );
};

export default Jobs;
