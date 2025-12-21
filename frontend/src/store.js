import { configureStore } from "@reduxjs/toolkit";
import { coursesApi } from "./features/coursesApi.js";

const store = configureStore({
  reducer: {
    [coursesApi.reducerPath]: coursesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware),
});

export default store;
