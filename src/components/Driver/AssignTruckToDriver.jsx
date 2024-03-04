import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { assignTruck } from "../../api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as api from "../../api";
import { useGetTrucksQuery } from "../../services/apiSlice";
import Tooltip from "@mui/material/Tooltip";
import { BsTruck } from "react-icons/bs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 10,
  borderRadius: 2,
  p: 3,
};

const AssignTruckToDriver = ({ driver, refetch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [criterias, setCriterias] = useState({
    groupId: driver.groupId,
    page: 0,
    isMapped: false,
  });
  const { data, isLoading, isFetching, isSuccess } =
    useGetTrucksQuery(criterias);

  const handleOpen = () => {
    setOpen(true);
  };

  const [formData, setFormData] = useState({
    truckId: "",
    driverId: driver.id,
  });

  const handleChange = (event) => {
    setFormData({ ...formData, truckId: event.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.assignDriverToTruck(formData);
      if (response.status === 200) {
        setFormData({
          truckId: "",
          driverId: driver.id,
        });
        refetch();
        toast.success(
          t("message.success.assigned", { from: t("truck"), to: t("driver") })
        );
      }
      setOpen(false);
    } catch (error) {
      toast.error(error.response.data?.title);
    }
  };

  return (
    <>
      <Tooltip title={t("assignTruck")} placement="top-start" arrow>
        <a
          onClick={handleOpen}
          className="group cursor-pointer rounded-lg border border-gray-200 p-1 text-indigo-500 hover:bg-indigo-500"
        >
          <BsTruck className="h-5 w-5 group-hover:text-white" />
        </a>
      </Tooltip>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={onSubmit}>
            <Typography variant="h6" component="h2" className="capitalize">
              {t("assignTruck")}
            </Typography>
            <div className="mt-4 space-y-4">
              <p className="font-medium">
                {t("fullName")}:{" "}
                <span className="text-orange-500">{driver.fullName}</span>
              </p>
              <FormControl variant="standard" fullWidth>
                <InputLabel>{t("fullName")}</InputLabel>
                <Select value={formData.truckId} onChange={handleChange}>
                  {data?.content?.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.plateLicence}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="text-right">
                <Button type="submit" variant="outlined">
                  {t("confirm")}
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AssignTruckToDriver;
