import React from "react";
import {Link} from "react-router-dom";

export const JobCard = ({job}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const daysAgo = Math.floor((now - date)/(1000*60*60*24));
        return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
    };

    const initials = (company = "") => {
        return company
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0,2)
        .toUpperCase();
    };

    return (
        <Link to={`/job/${job.id}`} className="block">
            <article className="bg-white rounded-2xl border border-transparent shadow-card hover:shadow-card-hover transform transition duration-200 hover:-translate-y-1 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-semibold">
                                {initials(job.company)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                                <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                            {job.category}
                        </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-600 line-clamp-3">
                        {job.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                        <div className="flex gap-2">
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                💼 {job.type}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                💰 {job.salary}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">
                                {formatDate(job.postedDate)}
                            </span>
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};