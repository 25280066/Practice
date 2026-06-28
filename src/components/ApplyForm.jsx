import React from "react";
import { useForm } from "react-hook-form";

export const ApplyForm = ({jobTitle, onClose}) => {
    const { register, handleSubmit, formState: {errors} } = useForm({
        defaultValues:{
            fullName: "",
            email: "",
            phone: "",
            resume: null
        }
    });

    const onSubmit = (data) => {
        console.log("Application Submitted:", data);
        alert("Application submitted successfully!");
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Apply for: {jobTitle}</h3>

            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                </label>
                <input
                type="text"
                {...register("fullName", {
                    required: "Full name is required",
                    minLength: {value: 2, message: "name must be at least 2 characters"},
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "Name can only contain letters" }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                </label>
                <input
                type="email"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format"
                        }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                </label>
                <input
                type="tel"
                {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                            value: /^[0-9\-\+\(\)\s]{10,}$/,
                            message: "Invalid phone number"
                        }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
            </div>

            {/* Resume */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume *
                </label>
                <input
                type="file"
                {...register("resume", {
                    required: "Resume is required",
                    validate: (files) => {
                        if(!files || files.length === 0) return "Resume is required";
                        const file = files[0];
                        const validTypes = ["application/pdf", "application/msword"];
                        if(!validTypes.includes(file.type)){
                            return "Only PDF or DOC files are allowed";
                        }
                        if(file.size > 5*1024*1024){
                            return "File size must be less than 5MB";
                        }
                        return true;
                    }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx" />
                {errors.resume && (
                    <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>
                )}
            </div>

            <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Submit Application
            </button>
        </form>
    );
};