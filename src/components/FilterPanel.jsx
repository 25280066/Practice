import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setType, setLocation, resetFilters } from "../store/filterSlice";
import { categories, jobTypes } from "../services/mockData";

export const FilterPanel = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filters);

    const handleCategoryChange = (e) => {
        dispatch(setCategory(e.target.value));
    };
    const handleTypeChange = (e) => {
        dispatch(setType(e.target.value));
    };
    const handleLocationChange = (e) => {
        dispatch(setLocation(e.target.value));
    };
    const handleReset = () => {
        dispatch(resetFilters());
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-card border border-transparent mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
                <button onClick={handleReset} className="text-sm text-slate-500 hover:text-slate-700">Reset</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
                    <select 
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Job Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Job Type</label>
                    <select 
                    value={filters.type}
                    onChange={handleTypeChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" >
                        {jobTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Location</label>
                    <input 
                    type="text"
                    placeholder="Enter Location..."
                    value={filters.location}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
            </div>
        </div>
    );
};