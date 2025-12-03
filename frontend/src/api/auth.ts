import axios from "axios";
import type { AuthUser } from "@/utils/auth";

const API_BASE_URL = "http://localhost:5000/api"; 

type LoginResponse = {
  status: boolean;
  message: string;
  data: AuthUser;
};

export const loginApi = async (username: string, password: string): Promise<AuthUser> => {
  const res = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });

  return res.data.data; 
};
