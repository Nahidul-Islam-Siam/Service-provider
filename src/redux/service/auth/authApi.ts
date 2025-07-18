import baseApi from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body: {
        idToken: string;
        refreshToken?: string;
        role?: string;
        userName?: string;
        phoneNumber?: string;
      }) => ({
        url: "/auth/register/user",
        method: "POST",
        body,
      }),
    }),
    loginUser: builder.mutation({
      query: (body: { idToken: string; refreshToken?: string }) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body: {email: string; password: string}) => ({
        url: "/auth/password/email/change",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useResetPasswordMutation } = authApi;
