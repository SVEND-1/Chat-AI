import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    withCredentials: true,
});


export interface LoginResponse {
    success: boolean;
    token: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    message?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterCodeRequest {
    email: string;
    password: string;
    name: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    resetId: string;
    message?: string;
}

export interface VerifyResetCodeResponse {
    success: boolean;
    message?: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message?: string;
}

export interface ResetPasswordRequest {
    resetId: string;
    newPassword: string;
    confirmPassword: string;
}

export interface VerifyRegisterRequest {
    registrationId: string;
    code: string;
}

export interface VerifyRegisterResponse {
    success: boolean;
    message?: string;
}

export const login = (data: LoginRequest) =>
    API.post<LoginResponse>("/login", data);

export const logout = () =>
    API.post("/logout");

export const sendRegisterCode = (data: RegisterCodeRequest) =>
    API.post("/register/send-code", data);

export const verifyRegister = (data: VerifyRegisterRequest) =>
    API.post<VerifyRegisterResponse>("/register/verify", data);

export const resendCode = (registrationId: string) =>
    API.post(`/register/resend-code?registrationId=${registrationId}`);


export const forgotPassword = (email: string) =>
    API.post<ForgotPasswordResponse>(
        `/password/forgot?email=${encodeURIComponent(email)}`
    );

export const verifyResetCode = (resetId: string, code: string) =>
    API.post<VerifyResetCodeResponse>(
        `/password/verify?resetId=${resetId}&code=${code}`
    );


export const resetPassword = (data: ResetPasswordRequest) =>
    API.post<ResetPasswordResponse>("/password/reset", data);

