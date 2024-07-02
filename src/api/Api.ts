import axios from "axios";
import useSWR from "swr";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
});

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

const useFetch = <T>(url: string): T => {
    const BASE_URL = 'http://localhost:8080'

    const fetcher = async (url: string) => {
        return await axiosInstance.get(url).then((res: { data: T; }) => res.data as T);
    };

    return useSWR(BASE_URL + url, fetcher).data as T
};

export const useFetchPost = async <T>(url: string, body: any): Promise<T> => {
    const BASE_URL = 'http://localhost:8080'

    return await axiosInstance.post(BASE_URL + url, body).then((res: { data: T; }) => res.data as T);
};

export default useFetch;