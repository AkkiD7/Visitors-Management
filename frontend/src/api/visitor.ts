import axiosInstance from "./axios";

export interface CreateVisitorPayload {
  visitorNumber: string;
  name: string;
  mobile: string;
  contactPersonId: string; 
  purpose: string;
  numberOfPersons: number;
  vehicleNumber?: string;
  inTime?: string | null;
  outTime?: string | null;
  totalTimeSpent?: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface VisitorContactPerson {
  _id: string;
  username: string;
  role: string;
}

export interface VisitorResponse {
  _id: string;
  visitorNumber: string;
  name: string;
  mobile: string;
  contactPersonId: VisitorContactPerson; 
  purpose: string;
  numberOfPersons: number;
  vehicleNumber?: string | null;
  inTime?: string | null;
  outTime?: string | null;
  totalTimeSpent?: number | null;
  createdAt: string;
  updatedAt: string;
}

export const createVisitor = async (data: CreateVisitorPayload) => {
  const res = await axiosInstance.post<ApiResponse<VisitorResponse>>(
    "/visitors",
    data
  );
  return res.data; 
};

export const getVisitorsApi = async () => {
  const res = await axiosInstance.get<ApiResponse<VisitorResponse[]>>(
    "/visitors"
  );
  return res.data; 
};

export const updateVisitorOutApi = async (id: string) => {
  const res = await axiosInstance.patch<ApiResponse<VisitorResponse>>(
    `/visitors/${id}/out`
  );
  return res.data;
};