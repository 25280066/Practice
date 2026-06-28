import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filters",
    initialState:{
        searchQuery: "",
        category: "All",
        type: "All",
        location: ""
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload;
        },
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        resetFilters: (state) => {
            state.searchQuery = "";
            state.category = "All";
            state.type = "All";
            state.location = "";
        }
    }
});

export const { setSearchQuery, setCategory, setType, setLocation, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;