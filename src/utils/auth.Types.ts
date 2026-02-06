export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  Age: string;
  email: string;
  PhoneNumber: string;
  password: string;
  UserType: "Employer" | "Applicant";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    FirstName: string;
    LastName: string;
    UserType: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RequestResetRequest {
  email: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  UserType: string;
  iat?: number;
  exp?: number;
}
