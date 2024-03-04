import { CheckIcon, ThumbUpIcon, UserIcon } from "@heroicons/react/solid";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

const Feeds = ({ data }) => {
  const pickup = data?.locations[0];
  const delivery = data?.locations[1];

  if (!data) {
    return <h1>No data...</h1>;
  }
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        <li>
          <div className="relative pb-4">
            <span
              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            <div className="relative flex items-center space-x-3">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full">
                  <Avatar className="h-6 w-6 bg-blue-500">
                    <span className="text-sm">P</span>
                  </Avatar>
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between pt-1.5">
                <Typography className="text-sm">
                  {pickup?.locationAddress}
                </Typography>
                <div className="whitespace-nowrap text-sm text-gray-500">
                  {dayjs(pickup?.locationDateTime).format("HH:mm DD/MM/YYYY")}
                </div>
              </div>
            </div>
          </div>
        </li>

        <li>
          <div className="relative mb-10">
            <div className="relative flex items-center space-x-3">
              <div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full">
                  <Avatar className="h-6 w-6 border border-blue-500 bg-white text-blue-500">
                    <span className="text-sm">D</span>
                  </Avatar>
                </span>
              </div>
              <div className="flex w-64 min-w-0 flex-1 flex-col justify-between pt-1.5">
                <Typography className="text-sm" noWrap>
                  {delivery?.locationAddress}
                </Typography>
                <div className="whitespace-nowrap text-sm text-gray-500">
                  {dayjs(delivery?.locationDateTime).format("HH:mm DD/MM/YYYY")}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Feeds;
