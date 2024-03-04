import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import { StarIcon, XIcon } from "@heroicons/react/outline";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import RadioGroup from "@mui/material/RadioGroup";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomTextField from "../FormField/CustomTextField";
import { useAddRatingMutation } from "../../services/apiSlice";
import toast from "react-hot-toast";
import { getRatingByJob } from "../../api";
import { ratingOptions, improveOptions } from '../../data/rating';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  minWidth: 500,
  borderRadius: 4,
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 4,
};

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const RatingJob = ({ openRating, setOpenRating, jobId }) => {
  const { t } = useTranslation();
  const [hover, setHover] = useState(-1);
  const [isRating, setIsRating] = useState(false);
  const [addRating, { isLoading }] = useAddRatingMutation();

  // Validation
  const schema = yup.object().shape({});

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      jobId,
      ratingPoint: 5,
      ratingList: [],
      improveList: [],
      ratingComment: "",
      improveComment: "",
      recommend: 1,
      opinion: "",
    },
  });

  useEffect(() => {
    const getRating = async () => {
      try {
        const response = await getRatingByJob(jobId);
        if (response.data) {
          const {
            ratingPoint,
            ratingList,
            improveList,
            ratingComment,
            improveComment,
            recommend,
            opinion,
          } = response.data;
          setValue("ratingPoint", ratingPoint);
          setValue("ratingComment", ratingComment);
          setValue("improveComment", improveComment);
          setValue("recommend", recommend);
          setValue("opinion", opinion);
          setValue(
            "ratingList",
            ratingList.split(",").map((str) => Number(str))
          );
          setValue(
            "improveList",
            improveList.split(",").map((str) => Number(str))
          );
          setIsRating(true);
        } else {
          setIsRating(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getRating();
  }, [jobId]);

  const onSubmit = async (data) => {
    let newRatingList = "";
    let newImproveList = "";
    if (data.ratingList.length > 0) {
      newRatingList = data.ratingList.join(",");
    }

    if (data.improveList.length > 0) {
      newImproveList = data.improveList.join(",");
    }

    let newData = {
      ...data,
      ratingList: newRatingList,
      improveList: newImproveList,
    };

    try {
      await addRating(newData).unwrap();
      toast.success(t("message.success.add", { field: t("rating") }));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    reset();
    clearErrors();
    setOpenRating(false);
  };

  return (
    <Modal
      hideBackdrop
      open={openRating}
      onClose={onClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style }} className="focus:outline-none">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="absolute right-3 top-3 cursor-pointer">
            <XIcon
              className="h-6 w-6 text-gray-300 hover:text-gray-400"
              onClick={onClose}
            />
          </div>
          <div>
            <FormLabel component="legend" className="mb-1">
              {t("ratingPoint")}
            </FormLabel>
            <Controller
              name="ratingPoint"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Box
                  sx={{
                    width: 200,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    value={value}
                    precision={0.5}
                    size="large"
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={<StarIcon className="w-7" />}
                  />
                  {value !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : value]}
                    </Box>
                  )}
                </Box>
              )}
            />
          </div>

          <FormControl component="fieldset">
            <FormLabel component="legend">{t("shipmentRating")}</FormLabel>
            <FormGroup row>
              <Controller
                name="ratingList"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {ratingOptions.map((ratingOption) => (
                      <FormControlLabel
                        key={ratingOption.value}
                        label={t(ratingOption.label)}
                        control={
                          <Checkbox
                            value={ratingOption.value}
                            checked={value.some(
                              (existingValue) =>
                                existingValue === ratingOption.value
                            )}
                            onChange={(event, checked) => {
                              if (checked) {
                                onChange([
                                  ...value,
                                  Number(event.target.value),
                                ]);
                              } else {
                                onChange(
                                  value.filter(
                                    (value) =>
                                      value !== Number(event.target.value)
                                  )
                                );
                              }
                            }}
                          />
                        }
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t("shipmentImprove")}</FormLabel>
            <FormGroup row>
              <Controller
                name="improveList"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {improveOptions.map((improveOption) => (
                      <FormControlLabel
                        key={improveOption.value}
                        label={t(improveOption.label)}
                        control={
                          <Checkbox
                            value={improveOption.value}
                            checked={value.some(
                              (existingValue) =>
                                existingValue === improveOption.value
                            )}
                            onChange={(event, checked) => {
                              if (checked) {
                                onChange([
                                  ...value,
                                  Number(event.target.value),
                                ]);
                              } else {
                                onChange(
                                  value.filter(
                                    (value) =>
                                      value !== Number(event.target.value)
                                  )
                                );
                              }
                            }}
                          />
                        }
                      />
                    ))}
                  </>
                )}
              />
            </FormGroup>
          </FormControl>
          <CustomTextField
            name="ratingComment"
            label="ratingComment"
            variant="outlined"
            control={control}
            errors={errors.ratingComment}
            multiline
            rows={4}
          />
          <CustomTextField
            name="improveComment"
            label="improveComment"
            variant="outlined"
            control={control}
            errors={errors.improveComment}
            multiline
            rows={4}
          />
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              {t("recommened")}
            </FormLabel>
            <Controller
              control={control}
              name="recommend"
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label={t("yes")}
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label={t("maybe")}
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label={t("no")}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <CustomTextField
            name="opinion"
            label="opinion"
            variant="outlined"
            control={control}
            errors={errors.opinion}
            multiline
            rows={4}
          />
          <div className="flex justify-end space-x-4">
            <Button variant="outlined" onClick={() => setOpenRating(false)}>
              {t("cancel")}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              className={isRating ? "hidden" : ""}
            >
              {t("confirm")}
            </LoadingButton>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default RatingJob;
