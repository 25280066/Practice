import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./jobSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
    reducer: {
        jobs: jobReducer,
        filters: filterReducer
    }
});