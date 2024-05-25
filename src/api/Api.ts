import axios from "axios";
import useSWR, {SWRResponse} from "swr";

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




const useFetch = <T>(url: string): T => {
    const BASE_URL = 'http://localhost:8080'

    const fetcher = async (url: string) => {
        return await axiosInstance.get(url).then((res: { data: T; }) => res.data as T);
    };

    // const fetcher = async () => {
    //     const init: RequestInit = {
    //         method: dataObj.method,
    //         headers: { 'Content-type': 'application/json' }
    //     }
    //     if (dataObj.body) {
    //         init.body = JSON.stringify(dataObj.body)
    //     }
    //     console.log("fetcher")
    //     axiosInstance.get(url).then((res: { data: any; }) => res.data);
    //     return await fetch(BASE_URL + url, init).then((res) => {
    //         console.log(res)
    //         return res.json() as T;
    //     });
    // };
//<T>
    const rr = useSWR(BASE_URL + url, fetcher)
    console.log("rr")
    console.log(rr)
    return rr.data as T

};

export default useFetch;