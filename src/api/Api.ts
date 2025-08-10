import axios, {AxiosError} from "axios";
import useSWR from "swr";
import {errorNotification, fetchOkNotification} from "../utils/NotificationsHelper.ts";

// API Configuration
const API_CONFIG = {
    baseURL: 'http://192.168.0.106:8080',
    apiPath: '/api'
} as const;

const BASE_URL = `${API_CONFIG.baseURL}${API_CONFIG.apiPath}`;

export const axiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
});

axios.interceptors.response.use(
    async (response) => {
        return response;

    },
    (error: AxiosError) => {
        const {status} = error.response!;
        switch (status) {
            case 400:
                console.log(error.response);
                break;
            case 401:
                console.log("Unauthorized");
                break;
            case 404:
                console.log(error.response?.status);
                break;
            case 500:
                console.log("server error");
                break;
            default:
                console.log("an unknown error occurred");
                break;
        }
        return Promise.reject(error);
    }
);

export enum MethodTypes {
    POST = 'POST',
    PUT = 'PUT',
    GET = 'GET',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

// Common error handler for API requests
const handleApiError = (error: AxiosError, action: string = "request") => {
    const message = `${action} failed: ${error.code || 'Unknown'} - ${error.message}`;
    errorNotification(message);
    console.error("API Error:", error);
    throw error;
};

// Common fetcher function for SWR
const createFetcher = <T>() => async (url: string): Promise<T> => {
    return await axiosInstance
        .get(url)
        .then((res: { data: T; }) => res.data as T)
        .catch((err: AxiosError) => handleApiError(err, "GET"));
};

const useFetch = <T>(url: string): T => {
    const fetcher = createFetcher<T>();
    return useSWR(BASE_URL + url, fetcher).data as T
};

export const useFetchPost = async <T>(url: string, body: unknown): Promise<T> => {
    return await axiosInstance
        .post(BASE_URL + url, body)
        .then((res: { data: T; }) => {
            return res.data as T
        }).catch((err: AxiosError) => {
            handleApiError(err, "POST");
            throw err; // Re-throw to maintain Promise<T> return type
        });
};

export const useFetchDelete = async <T>(url: string): Promise<T> => {
    return await axiosInstance.delete(BASE_URL + url).then((res: { data: T; }) => {
            fetchOkNotification()
            return res.data as T
        }).catch((err: AxiosError) => {
            handleApiError(err, "DELETE");
            throw err; // Re-throw to maintain Promise<T> return type
        });
};

export default useFetch;