 // Import the correct type for user data
import baseApi from "@/redux/api/baseApi"; // Import the base API instance


// Define the API slice
const serviceRegionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
   

    createServiceRegion: builder.mutation({

      query: (data) => ({
        url: "/service-regions/create", 
        method: "POST", 
        body: data,
      }),

    }),

  }),
});


export const {

  useCreateServiceRegionMutation,

} = serviceRegionApi;
