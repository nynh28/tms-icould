import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import authReducer from "../features/auth/authSlice";
import driversReducer from "../features/drivers/driversSlice";
import masterDatasReducer from "../features/masterDatas/masterDatasSlice";
import fleetsReducer from "../features/fleets/fleetsSlice";
import truckReducer from "../features/truck/truckSlice";
import calendarReducer from "../features/calendar/calendarSlice";
import shipmentReducer from "../features/shipment/shipmentSlice";
import mapTrackingReducer from "../features/maptracking/mapTrackingSlice";
import mapLocationReducer from "../features/mapLocation/mapLocationSlice";
import { apiSlice } from "../services/apiSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    // whi
}

const rootReducer = combineReducers({ 
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    drivers: driversReducer,
    masterDatas: masterDatasReducer,
    fleets: fleetsReducer,
    calendar: calendarReducer,
    truck: truckReducer,
    mapTracking: mapTrackingReducer,
    mapLocation: mapLocationReducer,
    shipment: shipmentReducer
  })
  
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
//   reducer: persistedReducer,
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    drivers: driversReducer,
    masterDatas: masterDatasReducer,
    fleets: fleetsReducer,
    calendar: calendarReducer,
    truck: truckReducer,
    mapTracking: mapTrackingReducer,
    mapLocation: mapLocationReducer,
    shipment: shipmentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
      }).concat(apiSlice.middleware),
});

// setupListeners(store.dispatch);


export const persistor = persistStore(store)
