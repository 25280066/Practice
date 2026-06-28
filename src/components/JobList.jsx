import React, { useEffect } from "react";
import { useJobSearch } from "../hooks/useJobSearch";
import { JobCard } from "./JobCard";
import { LoadingSpinner, ErrorMessage } from "./LoadingSpinner";

export const JobList = () => {
    const { items, loading, error } = useJobSearch();

    if(loading) return <LoadingSpinner/>;
    if(error) return <ErrorMessage message={error}/>;

    return (
        <div className="grid grid-cols-1 gap-6">
            {
                items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                    <div className="text-sm text-gray-600 mb-4">
                        Found <span className="font-semibold">{items.length}</span> job(s)
                    </div>
                    {items.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                    </>
                )
            }
        </div>
    );
};