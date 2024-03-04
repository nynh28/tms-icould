import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import { DotsVerticalIcon } from "@heroicons/react/outline";

const Driver = ({ driver, openDetailHandle, setSelectedDriver }) => {
  
  const selectDriverHandle = (driver) => {
    openDetailHandle();
    setSelectedDriver(driver);
  };

  return (
    <li onClick={() => selectDriverHandle(driver)} className="cursor-pointer">
      <a href={driver?.href} className="block hover:bg-gray-50">
        <div className="flex items-center py-4 px-2">
          <div className="flex min-w-0 flex-1 items-center">
            <Checkbox defaultChecked />
            <div className="mx-4 h-4 w-4 rounded-full bg-red-500"></div>
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-5 md:gap-2">
              <div className="col-span-4">
                <p className="text-lg font-bold">{driver.fullName}</p>
                <p className="mt-px flex items-center text-sm text-gray-400">
                  <span>{driver.driverId}</span>
                </p>
              </div>
              <Avatar className="flex h-12 w-12 flex-col border border-gray-200 bg-gray-100 text-gray-900">
                <p className="text-lg font-bold">--</p>
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

export default Driver;
