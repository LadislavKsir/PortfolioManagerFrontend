import axios, {AxiosError} from "axios";
import useSWR from "swr";
import {errorNotification, fetchOkNotification} from "../utils/NotificationsHelper.ts";

const BASE_URL = 'http://192.168.0.106:8080/api'
export const axiosInstance = axios.create({
    baseURL: 'http://192.168.0.106:8080',
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

// const useFetch = <T>(url: string, method: string): T => {
//     const BASE_URL = 'http://localhost:8080'
//
//     const fetcher = async (url: string) => {
//         return await axiosInstance.get(url).then((res: { data: T; }) => res.data as T);
//     };
//
//     return useSWR(BASE_URL + url, fetcher).data as T
// };

const useCachedFetch = <T>(url: string): T => {
    // const BASE_URL = 'http://localhost:8080'

    const fetcher = async (url: string) => {
        return await axiosInstance
            .get(url)
            .then((res: { data: T; }) => res.data as T)
            .catch((err: AxiosError) => {
                errorNotification(err.code + ": " + err.message)
                throw err;
            });
    };

    const swrConfig = {
        // Cache the result for 1 minute (60000 ms)
        dedupingInterval: 60000,
        // Optionally, revalidate every 5 minutes
        refreshInterval: 300000,
        revalidateOnFocus: false, // Prevent refetching when the window is focused
    }

    return useSWR(BASE_URL + url, fetcher, swrConfig).data as T
}

const useFetch = <T>(url: string): T => {
    // const BASE_URL = 'http://localhost:8080/api'

    const fetcher = async (url: string) => {
        return await axiosInstance
            .get(url)
            .then((res: { data: T; }) => res.data as T)
            .catch((err: AxiosError) => {
                console.log("Error fetching data:", err);
                errorNotification(err.code + ": " + err.message)
                throw err;
            });
    };

    return useSWR(BASE_URL + url, fetcher).data as T
};

export const useFetchPost = async <T>(url: string, body: any): Promise<T> => {


    return await axiosInstance
        .post(BASE_URL + url, body)
        .then((res: { data: T; }) => {
            return res.data as T
        }).catch((err: AxiosError) => {
            errorNotification(err.code + ": " + err.message)
            throw err;
        });
};

export const useFetchDelete = async <T>(url: string): Promise<T> => {
    // const BASE_URL = 'http://localhost:8080'

    return await axiosInstance.delete(BASE_URL + url).then((res: { data: T; }) => {
            fetchOkNotification()
            return res.data as T
        }
    );
};

export default useFetch;