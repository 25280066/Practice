import React, {useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "../store/jobSlice";
import { JobDetail } from "../components/JobDetail";
import { LoadingSpinner, ErrorMessage } from "../components/LoadingSpinner";

export const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedJob, loading, error } = useSelector(state => state.jobs);

    useEffect(() => {
        dispatch(fetchJobById(id));
    }, [id, dispatch]);

    const handleClose = () => {
        navigate("/");
    };

    if(loading) return <LoadingSpinner/>;
    if(error) return <ErrorMessage message={error}/>;

    return <JobDetail job={selectedJob} onClose={handleClose}/>;
};