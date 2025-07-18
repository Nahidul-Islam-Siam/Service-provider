/* eslint-disable @typescript-eslint/no-explicit-any */

import baseApi from "@/redux/api/baseApi";

export const reviewProviderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSPreview: builder.query<any, void>({
      query: () => ({
        url: "/review/getSPReview",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSPreviewQuery } = reviewProviderApi;
