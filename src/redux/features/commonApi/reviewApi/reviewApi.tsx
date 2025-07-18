import baseApi from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/review/create",
        method: "POST",
        body: reviewData,
      }),
    }),
  }),
});

export const {useCreateReviewMutation} = reviewApi;

