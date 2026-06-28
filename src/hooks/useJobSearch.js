import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, searchJobs, filterJobs } from "../store/jobSlice";

export const useJobSearch = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.jobs);
    const filters = useSelector(state => state.filters);

    useEffect(() => {
        if (filters.searchQuery) {
            dispatch(searchJobs(filters.searchQuery));
        } else if (
            filters.category !== "All" || 
            filters.type !== "All" || 
            filters.location
        ) {
            dispatch(filterJobs({
                category: filters.category,
                type: filters.type,
                location: filters.location
            }));
        } else {
            dispatch(fetchJobs());
        }
    }, [filters, dispatch]);

    return { items, loading, error };
};