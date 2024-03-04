
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Card, CardHeader, IconButton, Menu, MenuItem } from "@mui/material";
import { IoMdMore } from "react-icons/io";
import { MdOutlineLocationOn } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../FormDisplay";
import FormSiteLocation from "./FormSiteLocation";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedLocation } from "../../features/mapLocation/mapLocationSlice";

const ItemSiteLocation = ({detail, setSelectedRow, refetch}) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const dispatch = useDispatch()

    const [image, setImage] = useState('/images/map_not_avaiable.png')
    //   const { masterDatas } = useSelector((state) => state.masterDatas);
    //   const [addStaff, { isLoading }] = useAddStaffMutation();

    
    useEffect(_ => {
        if(detail && detail.lat && detail.lng){
            let imgSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${detail.lat},${detail.lng}&zoom=10&markers=color:red%7C${detail.lat},${detail.lng}&size=150x150&maptype=normal&key=AIzaSyDrpgtKGMCTWJZQ5hGb_ArMGSG55ukUsvQ`
            setImage(imgSrc)
        }
        // console.log(detail)
    }, [detail])

    // Validation
    const handleClick = event => {
        setShowAction(event.currentTarget);
      };
    
    const  handleClose = () => {
        setShowAction(false)
    };

    const handleEdit = () => {
        setSelectedRow(detail)
        setShowAction(false)
        setOpen(true)
    }

    //https://maps.googleapis.com/maps/api/staticmap?center=29.390946,%2076.963502&zoom=12&size=600x300&maptype=normal&key=AIzaSyDrpgtKGMCTWJZQ5hGb_ArMGSG55ukUsvQ

    return (
        <>
            <Card className="shadow hover:shadow-md" >
                <CardHeader
                    sx={{
                        '.MuiCardHeader-action': {
                            alignSelf: 'center'
                        }
                    }}
                    avatar={
                        <Avatar sx={{ width: 70, height: 70 }} variant="square" src={image} aria-label="recipe" />
                    }
                    action={
                        <IconButton aria-label="settings" onClick={handleClick}>
                            <IoMdMore />
                        </IconButton>
                    }
                    title={`(${detail?.idSite}) ${detail?.siteName}`}
                    subheader={detail?.updatedAt}
                />
                <Menu
                    id="simple-menu"
                    anchorEl={showAction}
                    open={Boolean(showAction)}
                    onClose={handleClose}
                >
                    <MenuItem disabled={!detail.lat || !detail.lng} onClick={handleClose}>
                        <Link className="contents" onClick={() => dispatch(setSelectedLocation(detail))} to="/site-location-map">
                            <MdOutlineLocationOn className="mr-2"/> View Map (Lat Long)
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleEdit}>
                        <FiEdit className="mr-2"/> Detail 
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <FaRegTrashAlt className="mr-2"/> Delete
                    </MenuItem>
                </Menu>
            </Card>
            {/* <FormDisplay open={open} setOpen={setOpen}>
                <FormSiteLocation selectedItem={null} open={open} setOpen={setOpen} refetch={refetch}/>
            </FormDisplay> */}
        </>
    );
};

export default ItemSiteLocation;
