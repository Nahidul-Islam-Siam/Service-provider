import baseApi from "@/redux/api/baseApi";

export const adminProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAdmin: builder.mutation({
      query: ({id, data }) => ({
        url: `/user/update?id=${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});


export const {useUpdateAdminMutation} = adminProfileApi