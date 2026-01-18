import axios from "axios";
import type { User, UsersQueryParams } from "@/types/user";

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function fetchUsers(
  params: UsersQueryParams,
  signal?: AbortSignal
): Promise<User[]> {
  const { data } = await api.get<User[]>("/users", {
    params: {
      search: params.search || undefined,
      role: params.role || undefined,
    },
    signal,
  });
  return data;
}

export async function fetchUser(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

export async function toggleUserActive(id: string): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}/toggle-active`);
  return data;
}
