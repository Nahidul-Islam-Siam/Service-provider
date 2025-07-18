import baseApi from "../api/baseApi";

export interface Tuser {
  id: string;
  name: string;
  email: string;
  role: string;
  data: TProfile;
  success: boolean;
  message: string;
}

export interface TProfile {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  id?: string;
  message?: string;
  image?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get current user details
    getMe: builder.query<Tuser, void>({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation<TProfile, { id: string; data: UpdateProfileData }>({
      query: ({ id, data }) => ({
        url: `/user/update?id=${id}`, // Correctly place the ID in the URL
        method: "PATCH",
        body: data, // Send data in the body
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetMeQuery,
  useUpdateProfileMutation,
} = userApi;
