import { XIcon } from "@heroicons/react/outline";
import LoadingButton from "@mui/lab//LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { importCustomer } from "../../api";
import { ImageConfig } from "./ImageConfig";
import "./importCustomerFromExcel.css";

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

const ImportFromExcel = ({ refetch }) => {
  const { masterDatas } = useSelector((state) => state.masterDatas);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState(null);

  const onFileChange = (files) => {
    console.log(files);
  };

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFileList(newFile);
      onFileChange(newFile);
    }
  };

  const fileRemove = () => {
    setFileList(null);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFileList(null);
    setOpen(false);
  };

  const onUploadFile = async () => {
    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", fileList);

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
      await importCustomer(fd, options);
      setUploadPercentage(100);
      setTimeout(() => setUploadPercentage(0), 1000);
      refetch();
      handleClose();
    } catch (error) {
      setUploadPercentage(0);
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  

  return (
    <>
      <div className="mt-4 flex items-center space-x-4 sm:mt-0">
        <Button
          variant="outlined"
          component="span"
          fullWidth
          onClick={handleOpen}
          startIcon={<img src="/images/excel.svg" className="h-6 w-6" />}
          className="shadow-sm"
        >
          {t("importExcel")}
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
            <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-medium capitalize">
                  {t("importExcelTitle", { field: t("customer") })}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex flex-col items-center justify-between gap-2">
                  <a
                    href="/templates/ImportCustomerTemplate.xlsx"
                    download
                    className="self-end text-indigo-500 underline"
                  >
                    {t("downloadTemplate")}
                  </a>

                  <div
                    ref={wrapperRef}
                    className="drop-file-input mt-2 w-full"
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  >
                    <div className="drop-file-input__label">
                      <img src="/images/cloud-upload.png" alt="cloud upload" />
                      <p>Drag & Drop your files here</p>
                    </div>
                    <input type="file" value="" onChange={onFileDrop} />
                  </div>
                  {fileList && (
                    <div className="drop-file-preview w-full">
                      <p className="drop-file-preview__title">
                        Ready to upload
                      </p>
                        <div className="drop-file-preview__item">
                          <img
                            src={
                              ImageConfig[fileList.type.split("/")[1]] ||
                              ImageConfig["xlsx"]
                            }
                            alt=""
                          />
                          <div className="drop-file-preview__item__info">
                            <p>{fileList.name}</p>
                            <p>{fileList.size}B</p>
                          </div>
                          <span
                            className="drop-file-preview__item__del"
                            onClick={() => fileRemove(fileList)}
                          >
                            x
                          </span>
                        </div>
                    </div>
                  )}
                </div>

                <Box
                  sx={{ width: "100%" }}
                  className={uploadPercentage > 0 ? "opacity-100" : "opacity-0"}
                >
                  <LinearProgressWithLabel value={uploadPercentage} />
                </Box>
              </div>
            </div>
            <div className=" flex items-center justify-end gap-4">
              <Button variant="outlined" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <LoadingButton
                variant="contained"
                onClick={onUploadFile}
                disabled={fileList ? false : true}
                loading={isLoading}
              >
                {t("import")}
              </LoadingButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImportFromExcel;
