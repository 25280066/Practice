import React from "react";

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

export const ErrorMessage = ({message}) => (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{message}</p>
    </div>
);