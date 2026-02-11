export type IApiResponse <T> = {
    data: T,
    success: boolean,
    message?: string | null,
    error?: string,
    status?: number,
    statusText?: string,
    count?: number
}