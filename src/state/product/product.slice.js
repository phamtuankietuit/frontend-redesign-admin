import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    productDetail: {},
};


const productSlice = createSlice({
    name: 'product',
    initialState,
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchCountFromAPI.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         });
    // },
});

// export const {
//     saveEmployee,
//     resetEmployeesState,
//     selectEmployeeIds,
//     setEmployeeTableFilter,
//     setSelectOneEmployee,
//     setEmployeeRequestChange,
//   } = employeeSlice.actions;
  
//   export const selectEmployees = (state) => state.;
  
//   export default employeeSlice.reducer;