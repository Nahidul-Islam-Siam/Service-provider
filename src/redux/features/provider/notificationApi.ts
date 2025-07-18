 // Import the correct type for user data
import baseApi from "@/redux/api/baseApi"; // Import the base API instance

// Define the API slice
const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Fetch all users from the /user/alluser endpoint
    getAllUsers: builder.query({
      query: () => ({
        url: "/user/alluser", // Endpoint to fetch all users
        method: "GET", // Specify the HTTP method
      }),
    }),


        getAllNotification: builder.query({
      query: () => ({
        url: "/notification/getById", // Endpoint to fetch all users
        method: "GET", // Specify the HTTP method
      }),
    }),


           getAllNotificationInfo: builder.query({
      query: () => ({
        url: "/notification/getNotificationsInfo", 
        method: "GET", 
      }),
    }),

    postNotification: builder.mutation({

      query: (data) => ({
        url: "/notification/create", // Endpoint to create a notification
        method: "POST", // Specify the HTTP method
        body: data, // Include the notification data in the request body
      }),

    }),

  }),
});

// Export hooks to be used in your components
export const {
  useGetAllUsersQuery, // Export the hook to fetch all users
  usePostNotificationMutation,
  useGetAllNotificationQuery,
  useGetAllNotificationInfoQuery
} = notificationApi;
