import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetRatingQuery } from "../services/apiSlice";
import Rating from "@mui/material/Rating";
import { ratingOptions, improveOptions } from "../data/rating";

const RatingManagement = () => {
  const { t } = useTranslation();
  const [criterias, setCriterias] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const { data, isLoading, isFetching, isError, error } =
    useGetRatingQuery(criterias);

  let counter = 0;
  let rows = [];
  if (data) {
    rows = data?.content.map((item) => {
      counter += 1;
      let no = data?.size * data?.number + counter;
      return { ...item, no };
    });
  }

  const getShipmentRating = (params) => {
    let list = params.row.ratingList.split(",");
    let name = "";

    for (let i = 0; i < list.length; i++) {
      const findItem = ratingOptions.find((x) => x.value === Number(list[i]));
      if (findItem) {
        list[i] = t(findItem.label);
      }
    }

    name = list.join(", ");
    return name;
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);

  const columns = [
    { field: "no", headerName: t("no"), width: 50 },
    {
      field: "ratingId",
      headerName: t("ratingId"),
      minWidth: 100,
    },
    {
      field: "ratingList",
      headerName: t("shipmentRating"),
      minWidth: 150,
      renderCell: getShipmentRating,
    },
    {
      field: "ratingPoint",
      headerName: t("ratingPoint"),
      minWidth: 200,
      renderCell: (params) => (
        <Rating name="read-only" value={params.row.ratingPoint} readOnly />
      ),
    },
    {
      field: "ratingComment",
      headerName: t("ratingComment"),
      minWidth: 200,
    },
    {
      field: "jobId",
      headerName: t("jobId"),
      minWidth: 200,
    },
    {
      field: "improveComment",
      headerName: t("improveComment"),
      minWidth: 200,
    },
    {
      field: "improveList",
      headerName: t("shipmentImprove"),
      minWidth: 200,
    },
    {
      field: "carrierName",
      headerName: t("carrierName"),
      minWidth: 200,
    },
    {
      field: "nameOfGoods",
      headerName: t("nameOfGoods"),
      minWidth: 200,
    },
    {
      field: "opinion",
      headerName: t("opinion"),
      minWidth: 200,
    },
    {
      field: "recommend",
      headerName: t("recommend"),
      minWidth: 200,
    },
    {
      field: "userId",
      headerName: t("userId"),
      minWidth: 200,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setCriterias({ ...criterias, page: newPage });
  };

  return (
    <div className="h-full px-4 sm:px-6 lg:mx-auto lg:max-w-full lg:px-8">
      <div className="flex h-full flex-col rounded-lg bg-white shadow-sm">
        <div className="p-7 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {t("rating")}
            </h1>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <DataGrid
            loading={isLoading || isFetching}
            getRowId={(row) => row.ratingId}
            rows={rows || []}
            columns={columns}
            rowsPerPageOptions={[25, 50, 100]}
            checkboxSelection
            disableSelectionOnClick
            paginationMode="server"
            rowCount={data?.totalElements || 0}
            pageSize={data?.size || 25}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingManagement;
