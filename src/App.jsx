import React, { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Toaster } from "react-hot-toast";
import Routers from "./routes/Routers";
import { muiTheme } from "./themes/muiTheme";
import CircularProgress from "@mui/material/CircularProgress";
import "react-perfect-scrollbar/dist/css/styles.css";
import "simplebar-react/dist/simplebar.min.css";
import 'devextreme/dist/css/dx.light.css';
import dayjs from "dayjs";
import arraySupport from 'dayjs/plugin/arraySupport'
import timezone from 'dayjs/plugin/timezone'
import moment from 'moment-timezone'
const App = () => {
    // dayjs.extend(arraySupport);
    // dayjs.extend(timezone)
    // moment.tz.setDefault('Asia/Bangkok');

    // dayjs.tz.setDefault("Asia/Bangkok")

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <CircularProgress />
        </div>
      }
    >
      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routers />
        </LocalizationProvider>
      </ThemeProvider>
      <Toaster position="bottom-right" 
       toastOptions={{
        // Define default options
        duration: 5000,
      
      }}/>
    </Suspense>
  );
};

export default App;
