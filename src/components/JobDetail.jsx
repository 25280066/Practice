import React, {useState} from "react";
import { ApplyForm } from "./ApplyForm";

export const JobDetail = ({job, onClose}) => {
    const [showApplyForm, setShowApplyForm] = useState(false);

    if(!job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2x1 shadow-card w-full max-w-3xl my-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{job.title}</h1>
                            <p className="text-indigo-100">{job.company}</p>
                        </div>
                        <button
                        aria-label="Close"
                        onClick={onClose}
                        className="text-2xl font-bold text-white hover:text-indigo-200">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {!showApplyForm ? (
                        <>
                            {/* Job Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 text-sm font-medium">Location</p>
                                    <p className="text-gray-900 font-semibold">{job.location}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 text-sm font-medium">Job Type</p>
                                    <p className="text-gray-900 font-semibold">{job.type}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 text-sm font-medium">Salary</p>
                                    <p className="text-gray-900 font-semibold">{job.salary}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-600 text-sm font-medium">Category</p>
                                    <p className="text-gray-900 font-semibold">{job.category}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">About this job</h3>
                                <p className="text-gray-700 leading-relaxed">{job.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Requirements</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx} className="text-gray-700">{req}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Benefits</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {job.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center text-gray-700">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <ApplyForm jobTitle={job.title} onClose={() => { setShowApplyForm(false); onClose(); }}/>
                    )}
                </div>

                {/* Footer */}
                {!showApplyForm && (
                    <div className="border-t bg-gray-50 p-6 flex gap-3 rounded-b-2xl">
                        <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-lg hover:bg-gray-100">
                            Close
                        </button>
                        <button
                        onClick={() => setShowApplyForm(true)}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Apply Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};