export interface LoginRequest {
  Email: string;
  password: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  Age: string;
  Email: string;
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
    Email: string;
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
  Email: string;
}

export interface JWTPayload {
  id: string;
  Email: string;
  UserType: string;
  iat?: number;
  exp?: number;
}
