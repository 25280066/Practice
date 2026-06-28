import axios from "axios"
import { mockJobs } from "./mockData"

// simulate API display
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // fetch all jobs with simulated delay
    fetchJobs: async() => {
        try {
            await delay(1000); // simulate network delay
            return {data: mockJobs};
        } catch (error) {
            throw new Error("Failed to fetch jobs");
        }
    },

    // fetch single job by ID
    fetchJobById: async (id) => {
        try {
            await delay(500);
            const job = mockJobs.find(j => j.id === parseInt(id));
            if (!job) throw new Error("Job not found");
            return {data: job};
        } catch (error) {
            throw new Error("Failed to fetch job details");
        }
    },

    // search jobs
    searchJobs: async (query) => {
        try {
            await delay(300);
            const results = mockJobs.filter(job => 
                job.title.toLowerCase().includes(query.toLowerCase()) || 
                job.company.toLowerCase().includes(query.toLowerCase()) || 
                job.location.toLowerCase().includes(query.toLowerCase())
            );
            return {data: results};
        } catch (error) {
            throw new Error("Failed to search jobs");
        }
    },

    // filter Jobs
    filterJobs: async(filters) => {
        try {
            await delay(300);
            let results = mockJobs;
            if(filters.category && filters.category !== "All"){
                results = results.filter(job => job.category === filters.category);
            }
            if(filters.type && filters.type !== "All"){
                results = results.filter(job => job.type === filters.type);
            }
            if(filters.location){
                results = results.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
            }

            return {data: results};
        } catch (error) {
            throw new Error("Failed to filter jobs");
        }
    }
};