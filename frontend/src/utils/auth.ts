export type UserRole = "admin" | "security" | "manager" | "hr";

export type AuthUser = {
  _id: string;
  username: string;
  role: UserRole;
  token: string;
};

export const setAuthUser = (user: AuthUser) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const stored = localStorage.getItem("authUser");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  localStorage.removeItem("authUser");
};
