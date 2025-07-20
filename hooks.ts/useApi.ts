import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  request: (
    endpoint: string,
    method?: HttpMethod,
    body?: any,
    config?: AxiosRequestConfig
  ) => Promise<T | null>;
}

export const useApi = <T = any>(): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthStore();

  const request = async (
    endpoint: string,
    method: HttpMethod = "GET",
    body: any = null,
    config: AxiosRequestConfig = {}
  ): Promise<T | null | any> => {
    setLoading(true);
    setError(null);

    try {
      const isFormData = body instanceof FormData;

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      // Only set Content-Type for JSON
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const axiosConfig: AxiosRequestConfig = {
        url: `${BASE_URL}${endpoint}`,
        method,
        headers,
        ...config,
      };

      if (method !== "GET") {
        axiosConfig.data = body;
      }

      const response = await axios.request<T>(axiosConfig);

      if (!response || !response.data) {
        throw new Error("No response data received from server");
      }

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      console.log(JSON.stringify(err.message));

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
};
