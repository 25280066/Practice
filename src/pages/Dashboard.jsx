import React from "react";
import { SearchBar } from "../components/SearchBar";
import { FilterPanel } from "../components/FilterPanel";
import { JobList } from "../components/JobList";

export const Dashboard = () => {
    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900">Job Listings</h1>
                            <p className="text-slate-500 mt-1">Discover your next opportunity</p>
                        </div>

                        {/* Search */}
                        <div className="w-full md:w-1/2">
                            <div className="bg-white p-3 rounded-lg shadow-card">
                                <SearchBar />
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Controls */}
                <FilterPanel />

                {/* Jobs List */}
                <section>
                    <JobList />
                </section>
            </div>
        </main>
    );
};