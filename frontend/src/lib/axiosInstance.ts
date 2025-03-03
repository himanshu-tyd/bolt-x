import axios from "axios";
import { BASE_URL } from "./config";

export const api=axios.create({
    baseURL : BASE_URL,
    withCredentials:true,
    proxy: {
        port:8000,
        host:BASE_URL
    },
   


})


