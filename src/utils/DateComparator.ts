import {GridComparatorFn} from "@mui/x-data-grid";

export function compareDates(v1: string, v2: string): number {
    const dateA = new Date(v1.split('.').reverse().join('-'));
    const dateB = new Date(v2.split('.').reverse().join('-'));
    // @ts-ignore
    return (dateA - dateB);
}

export const dateStringSortComparator: GridComparatorFn<string> = (v1:string, v2:string) => compareDates(v1, v2);

