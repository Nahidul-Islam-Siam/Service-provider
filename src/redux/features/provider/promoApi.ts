import { BundleDiscount } from "@/interface/globalType"; // Assuming this is the correct type for the request body
import baseApi from "@/redux/api/baseApi";

interface UpdateBundleDiscountData extends Partial<BundleDiscount> {
  status?: boolean;
  stutus?: boolean;
}

const promoApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createBundleDiscount: builder.mutation<{
      message: string;
    }, BundleDiscount>({
      query: (discountData) => ({
        url: `/bundle-discount/create`,
        method: "POST",
        body: discountData,
      }),
    }),

    getAllBundleDiscounts: builder.query<BundleDiscount[], void>({
      query: () => ({
        url: `/bundle-discount/getall`,
        method: "GET",
      }),
    }),

    updateBundleDiscount: builder.mutation<{
      message: string;
    }, { id: string; updatedData: UpdateBundleDiscountData }>({
      query: ({ id, updatedData }) => ({
        url: `/bundle-discount/update?id=${id}`,
        method: "PATCH",
        body: updatedData,
      }),
    }),

    deleteBundleDiscount: builder.mutation<{
      message: string;
    }, { id: string }>({  // Changed here, no need for `updatedData`
      query: ({ id }) => ({
        url: `/bundle-discount/delete?id=${id}`,  // Pass the id in the URL
        method: "DELETE",  // Correct HTTP method for DELETE
      }),
    }),
  }),
});

export const {
  useCreateBundleDiscountMutation,
  useGetAllBundleDiscountsQuery,
  useUpdateBundleDiscountMutation,
  useDeleteBundleDiscountMutation
} = promoApi;
