/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../app/agent/agent";

export const getInvoiceFiltersAsync = createAsyncThunk("finalizedInvoicesSlice/getInvoiceFiltersAsync", 
    async(_,  thunkAPI) => {
        try {
            const result = agent.InvoicesAPIRequest.getInvoiceFilters();
            return result;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    
    }
);

