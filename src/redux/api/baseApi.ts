/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setAccessToken } from "../features/auth";

const baseQuery = fetchBaseQuery({
	// baseUrl: "http://localhost:5000/api",
	baseUrl: "https://api.barrellink.com/api",
	credentials: "include",

	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth?.accessToken;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult = await baseQuery(
			{
				url: "/auth/refresh-token",
				method: "POST",
			},
			api,
			extraOptions
		);

		if (refreshResult.data) {
			const newAccessToken = (refreshResult.data as any).accessToken;

			api.dispatch(setAccessToken(newAccessToken));

			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}

	return result;
};

export const baseApi = createApi({
	reducerPath: "baseApi",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["auth", "roofing", "window"],
	endpoints: () => ({}),
});

export default baseApi;
