import axiosInstance from "./axios";

export type IUser = {
  _id: string;
  username: string;
  role: string;
};

export const createUserApi = async (payload: {
  username: string;
  password: string;
  role: string;
}) => {
  const res = await axiosInstance.post("/users", payload);
  return res.data;
};

export const getUsersApi = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};
