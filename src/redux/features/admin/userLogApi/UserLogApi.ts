import baseApi from "@/redux/api/baseApi";

export const userLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserLogs: builder.query({
      query: (params) => ({
        url: "/user/alluser",
        method: "GET",
        params,
      }),
    }),
    updateUserLog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/update`,
        method: "PATCH",
        params: { id },
        body,
      }),
    }),
  }),
});

export const { useGetAllUserLogsQuery, useUpdateUserLogMutation } = userLogApi;
