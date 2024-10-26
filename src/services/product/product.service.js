import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProductAsync = createAsyncThunk(
    'product/getProduct',
    async (id) => {
        // // const response = await GET(
        // //     `/employees/${employeeId}`
        // // );
        // return response.data.data.employee;
    }
);