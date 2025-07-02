/* eslint-disable @typescript-eslint/no-explicit-any */
// features/stripping/downloadCsvThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveAs } from "file-saver";
import Agent from "../../../app/agent/agent";
import { formatDateParam } from "../../../app/helper/dateOptions";

interface DownloadArgs {
  from: Date;
  to: Date;
}

/**
 * Thunk: downloads the stripped-containers CSV and saves it locally.
 * It returns void on success, or a readable error string on failure.
 */
export const downloadStrippedCsvThunk = createAsyncThunk<
  void, // return type
  DownloadArgs, // argument type
  { rejectValue: string } // custom error type
>(
  "strippingDashboardSlice/downloadStrippedCsvThunk",
  async ({ from, to }, thunkApi) => {
    try {
      /* ---------------------------------------------------------
         1️⃣  Call the backend through your Agent wrapper.
         - We pass plain YYYY-MM-DD strings to avoid timezone drift.
         - The Agent wrapper should already set responseType: 'blob';
           if not, add it in the wrapper or inline here.
      --------------------------------------------------------- */
      const response = await Agent.StrippingUnitsAPI.fetchCsvData({
        from: formatDateParam(from), // e.g. "2025-06-13"
        to: formatDateParam(to), // e.g. "2025-06-20"
      });

      /* ---------------------------------------------------------
         2️⃣  Extract filename from Content-Disposition (robust).
      --------------------------------------------------------- */
      const cd = response.headers?.["content-disposition"] as
        | string
        | undefined;

      const match = cd?.match(
        /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/
      );

      const fileName = decodeURIComponent(
        match?.[1] || match?.[2] || "stripped-containers.csv"
      );

      /* ---------------------------------------------------------
         3️⃣  Save the file locally.
      --------------------------------------------------------- */
      saveAs(response.data, fileName);

      // fulfilled action carries `void`
    } catch (err: any) {
      // Send a friendly message to the slice
      return thunkApi.rejectWithValue(
        err?.message ?? "CSV download failed. Please try again."
      );
    }
  }
);
