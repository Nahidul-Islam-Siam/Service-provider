import baseApi from "@/redux/api/baseApi";
// This is ONE availability entry (per range/date/time block)
export interface AvailabilityEntry {
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  description: string;
  status: string;
  barrelCapacity: number;
  hourseAvailabe: number;
}

// This is the payload you send to the backend
export interface Availability {
  sProviderId: string;
  Availability: AvailabilityEntry[];
}


// Response from your API when you fetch or create
export interface AvailabilityResponse {
  success: boolean;
  message: string;
  data: string;
}

const availibilityApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    getAllAvailibility: builder.query<AvailabilityResponse, void>({
      query: () => ({
        url: `/service-availability/getall`,
        method: "GET",
      }),
    }),

    createAvailability: builder.mutation<AvailabilityResponse, Availability>({
      query: (data) => ({
        url: `/service-availability/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllAvailibilityQuery,
  useCreateAvailabilityMutation,
} = availibilityApi;
