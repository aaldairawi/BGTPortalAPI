import { createSlice } from "@reduxjs/toolkit";
import { uploadSL2InvoiceToPreviewCSVThunk, uploadSL4InvoiceToPreviewCSVThunk } from "./uploadShippingLineInvoicesThunk";

interface UploadInvoicesState {
  invoicesUploadedSuccessfully: boolean;
  status: string;
}

const initialState: UploadInvoicesState = {
  status: "idle",
  invoicesUploadedSuccessfully: false,
};

export const uploadSlInvoicesPreviewSlice = createSlice({
  name: "uploadSlInvoicesPreviewSlice",
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
      state.status = "pendingSl2Preview";
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
      state.status = "pendingSl4Preview";
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
