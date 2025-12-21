import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/courses",
    }),
    createCourse: builder.mutation({
      query: (course) => ({
        url: "/courses",
        method: "POST",
        body: course,
      }),
    }),
    // Add more endpoints for chapters, topics, forum, etc..
  }),
});

export const { useGetCoursesQuery, useCreateCourseMutation } = coursesApi;
