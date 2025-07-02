import { createSlice } from "@reduxjs/toolkit";
import { uploadSL2InvoiceToPreviewCSVThunk, uploadSL4InvoiceToPreviewCSVThunk } from "./uploadShippingLineInvoicesThunk";

interface UploadInvoicesState {
  invoicesUploadedSuccessfully: boolean;
  status: "idle" | "success" | "pending" | "rejected";
}

const initialState: UploadInvoicesState = {
  status: "idle",
  invoicesUploadedSuccessfully: false,
};

export const uploadShippingLineInvoicesSlice = createSlice({
  name: "uploadShippingLineInvoicesSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(
      uploadSL2InvoiceToPreviewCSVThunk.rejected,
      (state, action) => {
        console.log(action.payload);
        state.status = "rejected";
      }
    );
    builder.addCase(uploadSL2InvoiceToPreviewCSVThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      uploadSL2InvoiceToPreviewCSVThunk.fulfilled,
      (state, action) => {
        state.status = "success";
        state.invoicesUploadedSuccessfully = action.payload;
      }
    );

    builder.addCase(
      uploadSL4InvoiceToPreviewCSVThunk.rejected,
      (state, action) => {
        console.log(action.payload);
        state.status = "rejected";
      }
    );
    builder.addCase(uploadSL4InvoiceToPreviewCSVThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(
      uploadSL4InvoiceToPreviewCSVThunk.fulfilled,
      (state, action) => {
        state.status = "success";
        state.invoicesUploadedSuccessfully = action.payload;
      }
    );



  },
});
