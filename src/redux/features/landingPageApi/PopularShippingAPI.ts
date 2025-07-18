/* eslint-disable */

import baseApi from "@/redux/api/baseApi";

export interface PopularService {
  providerId: string;
  companyImage: string;
  companyname: string;
  itemTypes: string[];
  totalTypeAmount: number;
  totalReview: number;
  reviewCount: number;
}

export interface PopularServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PopularService[];
}

export const popularServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPopularProvider: builder.query<PopularServiceResponse, void>({
      query: () => ({
        url: "/peoplular-service/get",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPopularProviderQuery } = popularServiceApi;
