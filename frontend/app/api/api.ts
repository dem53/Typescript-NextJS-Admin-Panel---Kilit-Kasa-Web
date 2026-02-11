import { IApiResponse } from "../types/apiResponseType";


const getSessionId = (): string => {
    if (typeof window !== "undefined") {
        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
    }
    return "";
};


export const apiFetch = async<T>(url: string, options?: RequestInit): Promise<IApiResponse<T>> => {

    const response = await fetch(`http://localhost:8000/api/${url}`, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    const data: IApiResponse<T> = await response.json();

    return {
        ...data,
        status: response.status,
        statusText: response.statusText
    }

};


export const apiAuthFetch = async <T>(url: string, options?: RequestInit): Promise<IApiResponse<T>> => {
    
    const response = await fetch(`http://localhost:8000/api/${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
        },
        credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    return {
        ...data,
        status: response.status,
        statusText: response.statusText,
    };
};



export const apiCartFetch = async <T>(url: string, options?: RequestInit): Promise<IApiResponse<T>> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
    };

    headers["x-session-id"] = getSessionId();

    return fetch(`http://localhost:8000/api/${url}`, {
        ...options,
        headers,
        credentials: "include",
    }).then(async (res) => {
        const data: IApiResponse<T> = await res.json();
        return { ...data, status: res.status, statusText: res.statusText };
    });
};
