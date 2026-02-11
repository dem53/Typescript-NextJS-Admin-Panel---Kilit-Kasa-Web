import { apiAuthFetch } from "../api/api";
import { ICreateJob, IJob, IUpdateJob } from "../types/jobTypes";


export const jobServices = {


    getAllJob(){
        return apiAuthFetch<IJob>('all/job', {
            method: "GET"
        });
    },

    createJob(data: ICreateJob){
        return apiAuthFetch<IJob>(`create/job`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    updateJob(data: IUpdateJob, id: string){
        return apiAuthFetch<IJob>(`update/job/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },


    deleteJob(id: string){
        return apiAuthFetch<IJob>(`delete/job/${id}`, {
            method: "DELETE"
        });
    },

}