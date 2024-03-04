import { XIcon } from "@heroicons/react/outline";
import LoadingButton from "@mui/lab//LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { publishJob, uploadExcelDO, uploadExcelJob } from "../../api";
import { CustomAsyncSelect } from "..";
import { useGetFleetCarriersQuery } from "../../services/apiSlice";

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

const ImportFromExcel = ({ open, setOpen, refetch }) => {
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const { t } = useTranslation();
    //   const [open, setOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const [bodyData, setBodyData] = useState({
        page: 0,
        rowsPerPage: 25,
        groupId: "",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //   const {
    //     data: dataFleet,
    //     isLoading: isLoadingFleet,
    //     isFetching: isFetchingFleet,
    //   } = useGetFleetCarriersQuery({ ...bodyData, page: 0, rowsPerPage: 1000 });

    const handleChange = (value) => {
        setBodyData({ ...bodyData, page: 0, groupId: value ? value : null });
    };


    const onUploadFile = async (e) => {
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append("file", file);

        const options = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                    setUploadPercentage(percent);
                }
            },
        };

        try {
            setIsLoading(true)
            const response = await uploadExcelDO(fd, options);
            setUploadPercentage(100);
            toast.success(t("message.success.import"));
            setTimeout(() => {
                setUploadPercentage(0);
                setIsLoading(false)
                refetch()
                handleClose()

            }, 200)
            //   const listJobs = [];
            //   for (let i = 0; i < response.data.length; i++) {
            //     listJobs.push(response.data[i].publishedJobRttRequest);
            //   }
            //   setJobs(listJobs);
        } catch (error) {
            setIsLoading(false)
            setUploadPercentage(0);
            toast.error(error.message);
        }
    };

    const onPublishJob = async () => {
        try {
            await publishJob({ groupIdHash: bodyData.groupId, jobRttExcelReqList: jobs });
            refetch();
            onClose();
            toast.success(t("message.success.published"));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onClose = () => {
        setJobs([]);
        setOpen(false);
    };

    const getCargoName = (value) => {
        let name = "";
        const cargo = masterDatas?.find(
            (x) => x.intValue === Number(value)
        );
        if (cargo) name = cargo?.name;

        return name;
    };

    const getUnitName = (value) => {
        let name = "";
        const unit = masterDatas?.find(
            (x) => x.type === "UNIT" && x.intValue === value
        );
        if (unit) name = unit?.name;

        return name;
    };

    return (
        <>
          
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-[80vw] sm:max-w-7xl sm:p-6">
                        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                            <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-white">
                                    <img src="/images/excel.svg" className="h-6 w-6" />
                                </div>
                                <span className="text-xl font-medium capitalize">
                                    {t("importExcelTitle", { field: t("jobs") })}
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3 items-end">
                                        <label htmlFor="contained-button-file">
                                            <Input
                                                id="contained-button-file"
                                                multiple
                                                type="file"
                                                className="hidden"
                                                onChange={onUploadFile}
                                            />
                                            <LoadingButton
                                                variant="outlined" component="span"
                                                loading={isLoading}
                                            >
                                                Select file
                                            </LoadingButton>
                                            {/* <Button variant="outlined" component="span">
                        Select file
                      </Button> */}
                                        </label>
                                        {/* <CustomAsyncSelect
                      label="fleetName"
                      data={dataFleet?.content.map((item) => ({
                        id: item.groupId,
                        text: item.groupName,
                      }))}
                      isFetching={isFetchingFleet}
                      isLoading={isLoadingFleet}
                      onChange={handleChange}
                    /> */}
                                    </div>
                                    <a
                                        href="/templates/ImportJobTemplate.xlsx"
                                        download
                                        className="self-end text-sm text-indigo-500 underline"
                                    >
                                        {t("downloadTemplate")}
                                    </a>
                                </div>

                                <Box
                                    sx={{ width: "100%" }}
                                    className={uploadPercentage > 0 ? "opacity-100" : "opacity-0"}
                                >
                                    <LinearProgressWithLabel value={uploadPercentage} />
                                </Box>
                            </div>


                        </div>
                        <div className="mt-5 flex items-center justify-end gap-4 sm:mt-6">
                            <Button variant="outlined" onClick={onClose}>
                                {t("cancel")}
                            </Button>
                            <LoadingButton
                                variant="contained"
                                onClick={onPublishJob}
                                disabled={jobs.length > 0 ? false : true}
                            >
                                {t("publishJobList")}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ImportFromExcel;
