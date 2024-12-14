export interface PagedResponse<T> {
    data: T[],
    page: number,
    pageSize:number,
    totalElements: number
}