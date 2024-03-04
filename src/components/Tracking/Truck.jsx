import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ClassNames } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetailVehicle, getInformationMarker, setFocus, setInformation } from "../../features/maptracking/mapTrackingSlice";
import { useEffect } from "react";

const Truck = ({ truck, openDetailHandle }) => {
  const dispatch = useDispatch()
  const  information  = useSelector(state => state.mapTracking.information)
    // console.log(truck)
  
  const selectTruckHandle = (truck) => {
      openDetailHandle();
      // dispatch(setInformation(truck))
    // if(information?.truckId != truck.truckId){
    //     // dispatch(getInformationMarker({location:{lat: Number(truck?.driveInfo?.x), lng: Number(truck?.driveInfo?.y)}}))
    // }
    dispatch(setFocus(true))
    dispatch(fetchDetailVehicle({ plate: truck.plateLicence, callFrom: "List" }))
    // setSelectedTruck(truck);
  };

//   let color = getStatusVehicle(truck.driveInfo?.status, Number(truck.driveInfo?.speed))
  

  return (
    <li onClick={() => selectTruckHandle(truck)} className={`cursor-pointer ${information?.truckId == truck.truckId ? `bg-gray-200` : ''}`} >
      <a href={truck?.href} className="block hover:bg-gray-200">
        <div className="flex items-center py-4 px-2">
          <div className="flex min-w-0 flex-1 items-center">
            <Checkbox defaultChecked />
            
            {(truck?.driveInfo?.status == "Ign. OFF" || truck?.driveInfo?.status == 'Idling' || truck?.driveInfo?.status == 'Garage' || !truck?.driveInfo?.status) && <div className="mx-4 h-4 w-4 rounded-full bg-[#adadb2]"></div>}
            {( +truck?.driveInfo?.speed > 0 && +truck?.driveInfo?.speed <= 80) && <div className="mx-4 h-4 w-4 rounded-full bg-[#56cf66]"></div>}
            {+truck?.driveInfo?.speed > 80 && <div className="mx-4 h-4 w-4 rounded-full bg-red-500"></div>}
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-5 md:gap-2">
              <div className="col-span-4">
                <p className="text-lg font-bold">{truck.plateLicence}</p>
                <p className="mt-px flex items-center text-sm text-gray-400">
                  <span>{truck.truckId}</span>
                </p>
              </div>
              <Avatar className="flex h-12 w-12 flex-col border border-gray-200 bg-gray-100 text-gray-900">
                <p className="text-lg font-bold">{truck?.driveInfo?.speed || '--'}</p>
                <p className="text-[8px]">km/h</p>
              </Avatar>
            </div>
          </div>
          <div>
            <DotsVerticalIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </a>
    </li>
  );
};

export default Truck;
