import { IApiResponse } from "../types/apiResponseType";


const getSessionId = (): string => {
    if (typeof window === "undefined") {
        return "";
    }

    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        const prefix = "SES";
        const characters = "ABCDEFGHJKLMNOPRSTUVYZ0123456789";
        let randomPart = "";

        for (let i = 0; i < 24; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomPart += characters.charAt(randomIndex);
        }

        sessionId = `${prefix}${randomPart}`;
        localStorage.setItem("sessionId", sessionId);
    }

    return sessionId;
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
