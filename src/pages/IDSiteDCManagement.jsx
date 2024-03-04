import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useGetIDSiteDCQuery } from "../services/apiSlice";
import { BsFilter } from "react-icons/bs";
import { TrashIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit } from "react-icons/ai";
import { Button } from "@mui/material";
import { FiUserPlus } from "react-icons/fi";
import FormIDSiteDC from "../components/IDSiteDC/FormIDSiteDC";
import DeleteIDSiteDC from "../components/IDSiteDC/DeleteIDSiteDC";

const IDSiteDCManagement = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(2);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [criterias, setCriterias] = useState({
    page: 0,
    rowsPerPage: 25,
    // groupId: "",
    // isMapped: false,
  });
  const { data, isLoading, isFetching, isSuccess, refetch } =
    useGetIDSiteDCQuery(criterias);
  
//   const { masterDatas } = useSelector((state) => state.masterDatas);

//   const types = [
//     {id: 1, value: "HELPER"},
//     {id: 2, value: "CLERKER"},
//     {id: 3, value: "Exp. Second Driver"}
//   ]

  const handleChangePage = (event, newPage) => {
    setCriterias({ ...criterias, page: newPage });
  };

  const onShowModalDelete = (id) => {
    setSelectedItem(id);
    setOpen(true);
  };

  const onShowEdit = (staff) => {
    setSelectedEdit(staff);
    setOpenEdit(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (value) => {
    setCriterias({ ...criterias, groupId: value ? value : null });
  };

  const columns = [
    {
      field: "id",
      headerName: t("id"),
      minWidth: 150,
    },
   
    {
      field: "name",
      headerName: t("name"),
      minWidth: 200,
      flex: 1,
    },
   
    {
      field: "action",
      headerName: t("action"),
      minWidth: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Tooltip title={t("updateIDSiteDC")} placement="top-start" arrow>
                <a
                onClick={() => onShowEdit(params.row)}
                className="group cursor-pointer rounded-lg border border-gray-200 p-1 text-indigo-500 hover:bg-indigo-500"
                >
                <AiFillEdit className="h-5 w-5 group-hover:text-white" />
                </a>
            </Tooltip>
          <Tooltip title={t("delete")} placement="top-start" arrow>
            <a
              href="#"
              className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
              onClick={() => onShowModalDelete(params.row.id)}
            >
              <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full min-h-[calc(100vh_-_190px)] px-4 sm:px-6 lg:mx-auto lg:max-w-full lg:px-8">
      <div className="flex h-full flex-col rounded-lg bg-white shadow-sm">
        <div className="p-7 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              {t("idSiteDC")}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none ">
          <Button
                variant="contained"
                className="px-6 capitalize"
                startIcon={<FiUserPlus className="h-5 w-5" />}
                onClick={() => {
                    setSelectedEdit({})
                    setOpenEdit(true)
                }}
            >
                {t("addIDSiteDC")}
            </Button>
            {/* <AddStaff refetch={refetch}/> */}
          </div>
        </div>
       
        <div className="flex flex-1 flex-col p-2">
          <DataGrid
            loading={isLoading || isFetching}
            components={{
              LoadingOverlay: LinearProgress,
            }}
            getRowId={(row) => row.id}
            rows={data?.content || []}
            columns={columns}
            rowsPerPageOptions={[25, 50, 100]}
            disableSelectionOnClick
            paginationMode="server"
            rowCount={data?.totalElements || 0}
            pageSize={data?.size || 25}
          />
        </div>
        <DeleteIDSiteDC open={open} setOpen={setOpen} deleteId={selectedItem} />
        <FormIDSiteDC selectedItem={selectedEdit} openForm={openEdit} setOpenForm={setOpenEdit} refetch={refetch}></FormIDSiteDC>
      </div>
    </div>
  );
};

export default IDSiteDCManagement;

// import React, { useState } from 'react'
// import { AddTruck } from '../components'

// const TruckManagement = () => {
//   console.log("Truck Management");
//   const [number, setNumber] = useState(1);
//   return (
//     <>
//     <div>TruckManagement</div>
//     <button onClick={() => setNumber(prev => prev + 1)}>Increase</button>
//     <AddTruck />
//     </>
//   )
// }

// export default TruckManagement
