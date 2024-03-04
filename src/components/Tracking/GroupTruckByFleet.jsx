import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Truck from "./Truck";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchDetailVehicle } from "../../features/maptracking/mapTrackingSlice";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:first-of-type": {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  "&:last-child": {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  "& .MuiAccordionSummary-content": {
    margin: "0 !important",
  },
  "& .MuiAccordionSummary-root": {
    padding: "0 8px !important",
  },
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ChevronDownIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  "&.MuiAccordionDetails-root": {
    padding: "0 !important",
  },
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const GroupTruckByFleet = ({
  trucks,
  index,
  expanded,
  handleChange,
  openDetailHandle,
  setSelectedTruck,
  detailTruck,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  return (
    <Accordion
      defaultExpanded={true}
      // expanded={expanded === `panel${index}`}
      // onChange={handleChange(`panel${index}`)}
    >
      <AccordionSummary
        expandIcon={<ChevronDownIcon className="h-5 w-5" />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <div className="flex items-center justify-between">
          <Checkbox defaultChecked />
          <p className="ml-px font-semibold">{trucks[0].groupName}</p>{" "}
          <span className="ml-2 font-semibold text-blue-500">
            ({trucks.length} {t("vehicle")})
          </span>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <ul role="list" className="divide-y divide-gray-200">
          {trucks?.map((truck, index) => (
            <Truck
              key={index}
              truck={truck}
              openDetailHandle={openDetailHandle}
              // setSelectedTruck={dispatch(fetchDetailVehicle({ plate: truck.licenseplate, callFrom: "List" }))}
              detailTruck={detailTruck}
            />
          ))}
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default GroupTruckByFleet;
