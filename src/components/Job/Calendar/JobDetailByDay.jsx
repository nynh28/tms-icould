import { useRef, useCallback } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { LoadingButton } from "@mui/lab";
import Backdrop from "@mui/material/Backdrop";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  assignDriver,
  assignMultiJob,
  getListJobTruckByDate,
  getListJobUnassignedByDate,
  reAssignDriver,
} from "../../../api";
import { listStatus } from "../../../data/status";
import Feeds from "../Feeds";
import Dialog from "@mui/material/Dialog";
import JobDetails from "../JobDetails";
import PerfectScrollbar from "react-perfect-scrollbar";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const JobDetailByDay = ({ open, handleClose, day, truckId, weekIndex }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { masterDatas } = useSelector((state) => state.masterDatas);
  const [jobs, setJobs] = useState([]);
  const [unAssignedJob, setUnAssignedJob] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAssignJob, setLoadingAssignJob] = useState(false);
  const [loadingOnAssignJob, setLoadingOnAssignJob] = useState(false);
  const [loadingOnReAssignJob, setLoadingOnReAssignJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageAssign, setPageAssign] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [hasMoreAssign, setHasMoreAssign] = useState(false);

  const observer = useRef();
  const lastJobElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const observer2 = useRef();
  const lastJobElementRef2 = useCallback(
    (node) => {
      if (loading) return;
      if (observer2.current) observer2.current.disconnect();
      observer2.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreAssign) {
          setPageAssign((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer2.current.observe(node);
    },
    [loadingAssignJob, hasMoreAssign]
  );

  useEffect(() => {
    if (!day || !truckId) return;

    let cancel;
    const getListJobUnassigned = async () => {
      if (!truckId) return;
      if (loadingOnAssignJob || loadingOnReAssignJob) return;
      setLoadingAssignJob(true);
      try {
        const response = await getListJobUnassignedByDate(
          {
            pickUpDate: day,
            truckId,
            page,
            rowsPerPage: 25,
          },
          {
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          }
        );
        if (page === 0) {
          setUnAssignedJob(response.data.content);
        } else {
          setUnAssignedJob((prev) => [...prev, ...response.data.content]);
        }
        setHasMore(response.data.content.length > 0);
      } catch (error) {
        console.log(error.response);
        if (axios.isCancel(error)) return;
      }
      setLoadingAssignJob(false);
    };

    getListJobUnassigned();
    return () => {
      if (cancel) cancel();
    };
  }, [day, truckId, page, loadingOnAssignJob, loadingOnReAssignJob]);

  useEffect(() => {
    if (!day || !truckId) return;
    if (loadingOnAssignJob || loadingOnReAssignJob) return;

    let cancel;
    const onGetJob = async () => {
      if (!day || !truckId) return;
      setLoading(true);
      try {
        const response = await getListJobTruckByDate(
          {
            pickUpDate: day,
            truckId,
            page: pageAssign,
            rowsPerPage: 25,
          },
          {
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          }
        );
        setJobs((prev) => [...prev, ...response.data.content]);
        setHasMoreAssign(response.data.content.length > 0);
      } catch (error) {
        console.log(error);
        if (axios.isCancel(error)) return;
      }
      setLoading(false);
    };

    onGetJob();
    return () => cancel();
  }, [day, truckId, pageAssign, loadingOnAssignJob, loadingOnReAssignJob]);

  const onAssignJob = async (job) => {
    setLoadingOnAssignJob(true);
    try {
      const data = {
        jobIds: [job],
        truckId,
      };
      const response = await assignMultiJob(data);
      setPage(0);
      setPageAssign(0);
      toast.success(response.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.title);
    }
    setLoadingOnAssignJob(false);
  };

  const onReAssignJob = async (job) => {
    setLoadingOnReAssignJob(true);
    try {
      const data = {
        jobId: job,
        truckId,
      };
      const response = await reAssignDriver(data);
      setPage(0);
      setPageAssign(0);
      toast.success(response.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.title);
    }
    setLoadingOnReAssignJob(false);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
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
          <div className="w-full max-w-7xl rounded-lg bg-gray-100 p-3 pb-7 shadow-lg">
            <div className="mb-5 grid grid-cols-3 gap-2">
              <div
                className="flex cursor-pointer items-center gap-2 text-gray-500"
                onClick={() => {
                  handleClose();
                }}
              >
                <ArrowLeftIcon className="h-5 w-5" />
                {t("back")}
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-white">
                  <img src="/images/completed-task.png" className="h-8 w-8" />
                </div>
                <span className="text-xl font-medium capitalize">
                  {t("jobListOn")}{" "}
                  {dayjs(day, "DD-MM-YYYY").format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex-1">
                <h3 className="ml-4 mb-2 text-lg font-semibold">
                  {t("unAssigned")}
                </h3>
                <PerfectScrollbar className="max-h-[80vh] space-y-3">
                  {unAssignedJob.length > 0 ? (
                    unAssignedJob.map((item, index) => {
                      if (unAssignedJob.length === index + 1)
                        return (
                          <div
                            key={index}
                            ref={lastJobElementRef}
                            className="mx-4 rounded-2xl bg-white p-4 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Chip
                                  label={t(
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.text
                                  )}
                                  className={`${
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.color
                                  } text-white`}
                                  size="small"
                                />

                                {item.groupName && (
                                  <Chip
                                    label={`${t("fleetName")}: ${
                                      item.groupName
                                    }`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </div>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-orange-500"
                                onClick={() => onAssignJob(item.jobId)}
                              >
                                {t("assign")}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                              <p className="text-sm font-medium text-orange-500">
                                ID: {item.jobId}
                              </p>
                              <label className="flex-1 text-sm text-gray-500">
                                {dayjs(item?.histories[0].createdAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </label>
                              <p
                                className="cursor-pointer text-sm font-medium text-indigo-500"
                                onClick={() => {
                                  setSelectedJob(item);
                                  renderDirections(item.locations);
                                }}
                              >
                                {t("showDetail")}
                              </p>
                            </div>
                            <div>
                              <Feeds data={item} />
                            </div>
                          </div>
                        );
                      else {
                        return (
                          <div
                            key={index}
                            className="mx-4 rounded-2xl bg-white p-4 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Chip
                                  label={t(
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.text
                                  )}
                                  className={`${
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.color
                                  } text-white`}
                                  size="small"
                                />

                                {item.groupName && (
                                  <Chip
                                    label={`${t("fleetName")}: ${
                                      item.groupName
                                    }`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </div>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-orange-500"
                                onClick={() => onAssignJob(item.jobId)}
                                disabled={loadingOnAssignJob}
                              >
                                {t("assign")}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                              <p className="text-sm font-medium text-orange-500">
                                ID: {item.jobId}
                              </p>
                              <label className="flex-1 text-sm text-gray-500">
                                {dayjs(item?.histories[0].createdAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </label>
                              <p
                                className="cursor-pointer text-sm font-medium text-indigo-500"
                                onClick={() => {
                                  setSelectedJob(item);
                                  renderDirections(item.locations);
                                }}
                              >
                                {t("showDetail")}
                              </p>
                            </div>
                            <div>
                              <Feeds data={item} />
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : !loadingAssignJob ? (
                    <div className="mx-4 mt-3 rounded-2xl bg-white p-4">
                      No data
                    </div>
                  ) : null}
                  <div className="w-full px-10">
                    {loadingAssignJob && <LinearProgress />}
                  </div>
                </PerfectScrollbar>
              </div>

              <div className="flex-1">
                <h3 className="ml-4 mb-2 text-lg font-semibold">
                  {t("assigned")}
                </h3>
                <PerfectScrollbar className="max-h-[80vh] space-y-3">
                  {jobs.length > 0 ? (
                    jobs.map((item, index) => {
                      if (jobs.length === index + 1)
                        return (
                          <div
                            key={index}
                            ref={lastJobElementRef2}
                            className="mx-4 rounded-2xl bg-white p-4 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Chip
                                  label={t(
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.text
                                  )}
                                  className={`${
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.color
                                  } text-white`}
                                  size="small"
                                />

                                {item.groupName && (
                                  <Chip
                                    label={`${t("fleetName")}: ${
                                      item.groupName
                                    }`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </div>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-blue-500"
                                onClick={() => onReAssignJob(item.jobId)}
                              >
                                {t("reAssign")}
                              </Button>
                              
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                              <p className="text-sm font-medium text-orange-500">
                                ID: {item.jobId}
                              </p>
                              <label className="text-sm text-gray-500 flex-1">
                                {dayjs(item?.histories[0].createdAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </label>
                              <p
                                className="cursor-pointer text-sm font-medium text-indigo-500"
                                onClick={() => {
                                  setSelectedJob(item);
                                  renderDirections(item.locations);
                                }}
                              >
                                {t("showDetail")}
                              </p>
                            </div>
                            <div>
                              <Feeds data={item} />
                            </div>
                          </div>
                        );
                      else {
                        return (
                          <div
                            key={index}
                            className="mx-4 rounded-2xl bg-white p-4 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Chip
                                  label={t(
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.text
                                  )}
                                  className={`${
                                    listStatus.find(
                                      (x) => x.intValue === item?.jobStatus
                                    )?.color
                                  } text-white`}
                                  size="small"
                                />

                                {item.groupName && (
                                  <Chip
                                    label={`${t("fleetName")}: ${
                                      item.groupName
                                    }`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </div>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-blue-500"
                                onClick={() => onReAssignJob(item.jobId)}
                              >
                                {t("reAssign")}
                              </Button>
                              
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                              <p className="text-sm font-medium text-orange-500">
                                ID: {item.jobId}
                              </p>
                              <label className="text-sm text-gray-500 flex-1">
                                {dayjs(item?.histories[0].createdAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </label>
                              <p
                                className="cursor-pointer text-sm font-medium text-indigo-500"
                                onClick={() => {
                                  setSelectedJob(item);
                                  renderDirections(item.locations);
                                }}
                              >
                                {t("showDetail")}
                              </p>
                            </div>
                            <div>
                              <Feeds data={item} />
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : !loading ? (
                    <div className="mx-4 mt-3 rounded-2xl bg-white p-4">
                      No data
                    </div>
                  ) : null}
                  <div className="w-full px-10">
                    {loading && <LinearProgress />}
                  </div>
                </PerfectScrollbar>
              </div>
            </div>

            {selectedJob && (
              <JobDetails job={selectedJob} setSelectedJob={setSelectedJob} />
            )}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default JobDetailByDay;
