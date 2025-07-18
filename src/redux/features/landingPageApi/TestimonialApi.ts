import baseApi from "@/redux/api/baseApi";


// types/review.ts

export interface User {
  id: string;
  name: string;
  picture: string | null;
}

export interface Review {
  id: string;
  shipmentID: string;
  userID: string;
  rating: number;
  title: string;
  comment: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface ReviewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Review[];
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicReviews: builder.query<ReviewResponse, void>({
      query: () => ({
        url: "/review/getPublice",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPublicReviewsQuery } = reviewApi;
