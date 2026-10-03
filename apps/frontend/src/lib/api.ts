import axios from "axios";
import {
  FilterQuerySchema,
  LoginBodySchema,
  type Entry,
  type FilterApplied,
  type LoginBody,
} from "@repo/shared-types";
import { getAccessToken } from "@/lib/auth-storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginRequest(body: LoginBody): Promise<string> {
  const payload = LoginBodySchema.parse(body);
  const { data } = await api.post<{ access_token: string }>(
    "/auth/login",
    payload,
  );
  return data.access_token;
}

export async function fetchFilteredEntries(
  filter: FilterApplied,
): Promise<Entry[]> {
  const query = FilterQuerySchema.parse({ filter });
  const { data } = await api.get<Entry[]>("/filters", { params: query });
  return data;
}
