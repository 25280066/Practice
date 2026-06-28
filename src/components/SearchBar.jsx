import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/filterSlice";

export const SearchBar = () => {
    const dispatch = useDispatch();
    const searchQuery = useSelector(state => state.filters.searchQuery);

    const handleChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    return (
        <div className="mb-6">
            <input 
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchQuery}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
    );
};