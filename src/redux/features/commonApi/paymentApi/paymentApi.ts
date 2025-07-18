import baseApi from "@/redux/api/baseApi";

export const paymentCheckoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentCheckout: builder.mutation({
      query: (body) => ({
        url: "/payment/payment-checkout",
        method: "POST",
        body,
      }),
    }),
  }),
});


export const { usePaymentCheckoutMutation } = paymentCheckoutApi;