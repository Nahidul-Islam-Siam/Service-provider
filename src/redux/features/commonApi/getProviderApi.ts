import baseApi from "@/redux/api/baseApi";

export const findProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findProvider: builder.query({
      query: () => ({
        url: "/service-provider/finding/service/provider",
        method: "GET",
      }),
    }),
  }),
});

export const { useFindProviderQuery } = findProviderApi;