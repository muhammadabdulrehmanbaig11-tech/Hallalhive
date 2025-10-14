export type Role = "customer" | "vendor" | "admin";

export type UserProfile = {
  uid: string;
  phone?: string | null;
  email?: string | null;
  displayName?: string | null;
  role: Role;              // default "customer"
  createdAt: number;       // epoch ms
  updatedAt: number;       // epoch ms
};
