import { CheckIcon, ThumbUpIcon, UserIcon } from "@heroicons/react/solid";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as api from "../../api";

const Pods = ({ data = [] }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);

  if (!data.length) {
    return <h1>No data...</h1>;
  }

  const getImage = async (fileName) => {
    try {
      const response = await api.downloadImage(fileName);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setImage(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flow-root">
      <ul role="list">
        {data
          ?.filter((x) => x.locationType === 1)
          .map((item) => (
            <li key={item.locationId}>
              <div className="relative pb-4">
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex items-start space-x-3">
                  <div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full">
                      <Avatar className="h-6 w-6 bg-blue-500" src={item.locationImage}>
                        <span className="text-base">P</span>
                      </Avatar>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                    <Typography className="text-base">
                      {item.locationAddress}
                    </Typography>
                    <div className="whitespace-nowrap text-gray-500">
                      <p className="w-1">
                        {t("senderName")}: {item.contactName}
                      </p>
                      <p>
                        {t("phone")}: {item.contactPhone}
                      </p>
                      <p>
                        {t("pickupDate")}:{" "}
                        {dayjs(item.locationDateTime).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                      </p>
                      <p className="whitespace-pre-wrap">
                        {t("note")}: {item.note ? item.note : t("none")}
                      </p>
                      <p>{t("attachFile")}: </p>
                      {item.attachments?.map((item, index) => (
                        <p key={index}>- {item.documentName}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}

        {data
          ?.filter((x) => x.locationType === 2)
          .map((item, index) => (
            <li key={item.locationId}>
              <div className="relative pb-4">
                {index !==
                  data?.filter((x) => x.locationType === 2).length -
                  1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full">
                      <Avatar className="h-6 w-6 border border-blue-500 bg-white text-blue-500" src={item.locationImage}>
                        <span className="text-base">D</span>
                      </Avatar>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                    <Typography className="text-base">
                      {item.locationAddress}
                    </Typography>
                    <div className="whitespace-nowrap text-gray-500">
                      <p className="w-1">
                        {t("receiverName")}: {item.contactName}
                      </p>
                      <p>
                        {t("phone")}: {item.contactPhone}
                      </p>
                      <p>
                        {t("deliveryDate")}:{" "}
                        {dayjs(item.locationDateTime).format(
                          "HH:mm DD/MM/YYYY"
                        )}
                      </p>
                      <p className="whitespace-pre-wrap">
                        {t("note")}: {item.note ? item.note : t("none")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Pods;
