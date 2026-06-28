import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { api } from "../services/api";

export const fetchJobs = createAsyncThunk("job/fetchJobs", async () => {
    const response = await api.fetchJobs();
    return response.data;
});

export const fetchJobById = createAsyncThunk("job/fetchJobById", async (id) => {
    const response = await api.fetchJobById(id);
    return response.data;
});

export const searchJobs = createAsyncThunk("job/searchJobs", async (query) => {
    const response = await api.searchJobs(query);
    return response.data;
});

export const filterJobs = createAsyncThunk("jobs/filterJobs", async (filters) => {
    const response = await api.filterJobs(filters);
    return response.data;
});

const jobSlice = createSlice({
    name: "jobs",
    initialState: {
        items: [],
        selectedJob: null,
        loading: false,
        error: null,
        totalCount: 0
    },
    extraReducers: (builder) => {
        builder

        // fetch all jobs
        .addCase(fetchJobs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.totalCount = action.payload.length;
        })
        .addCase(fetchJobs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to load jobs";
        })

        // fetch single job
        .addCase(fetchJobById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchJobById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedJob = action.payload;
        })
        .addCase(fetchJobById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to load job details";
        })

        // search jobs
        .addCase(searchJobs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.totalCount = action.payload.length;
        })
        .addCase(searchJobs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to search jobs";
        })

        // filter jobs
        .addCase(filterJobs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(filterJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.totalCount = action.payload.length;
        })
        .addCase(filterJobs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to filter jobs";
        });
    }
});

export default jobSlice.reducer;