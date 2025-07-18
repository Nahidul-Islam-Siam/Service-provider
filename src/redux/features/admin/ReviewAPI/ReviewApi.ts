
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export interface AdminReview {
  id: string;
  shipmentID: string;
  userID: string;
  rating: number;
  title: string;
  comment: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminReviewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminReview[];
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReviews: builder.query<AdminReviewResponse, void>({
      query: () => ({
        url: "/review/adminReview",
        method: "GET",
      }),
    }),

    updateReviewStatus: builder.mutation<
      any,
      { id: string; status: boolean }
    >({
      query: ({ id, status }) => ({
        url: `/review/update/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
} = reviewApi;
