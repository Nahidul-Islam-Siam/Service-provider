/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

// Location for origin, destination, and address
export interface Location {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  district?: string;
  parish?: string;
  postalCode?: string | null;
  fullAddress?: string;
}

// Person details
export interface PersonDetails {
  name: string;
  phone: string;
  email: string;
}

// Optional service types
export interface Service {
  id: string;
  name: string;
}

// Enum for item type
export type ItemType = "BARREL" | "FURNITURE";

// Full payload structure
export interface ShipmentPayload {
  userId?: string; // optional for PATCH
  sProviderID?: string; // optional for PATCH
  pickupDate: string;
  deliveryDate?: string;
  amount: number;
  originLocation: Location;
  destinationLocation: Location;
  itemType: ItemType;
  itemDimension?: string;
  senderDetails?: PersonDetails;
  receiverDetails?: PersonDetails;
  takingAvailableService?: Service[];
  address: Location;
  deliveryInstraction?: string;
}

// GET single shipment response
export interface ShipmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any; // You can define a strict type later if needed
}

// Inject endpoints
export const userShipmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShipment: builder.mutation<ShipmentResponse, ShipmentPayload>({
      query: (payload) => {
        console.log('Payload being sent to API:', payload); // Log the payload to check its structure

        // Send the correct payload to the server
        return {
          url: "/service-item/singOrderCreate", // Keep as-is if correct
          method: "POST",
          body: payload, // Pass the payload to the server
        };
      },
      
    }),


    getSingleShipment: builder.query<ShipmentResponse, string>({
      query: (searchItem) => ({
        url: `/service-item/singleShipment?searchItem=${searchItem}`,
        method: "GET",
      }),
    }),


     getAllShipment: builder.query<ShipmentResponse, string>({
      query: () => ({
        url: `service-item/getPublicShipment`,
        method: "GET",
      }),
    }),

    updateShipment: builder.mutation<
      { success: boolean; message: string },
      { orderId: string; data: Partial<ShipmentPayload> } // PATCH can be partial
    >({
      query: ({ orderId, data }) => ({
        url: `/service-item/update/${orderId}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateShipmentMutation,
  useGetSingleShipmentQuery,
  useUpdateShipmentMutation,
  useGetAllShipmentQuery
} = userShipmentApi;
