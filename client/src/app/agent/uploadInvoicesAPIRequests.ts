import { UploadInvoicesDTO } from "../models/invoice/invoice.types";
import { requests } from "./agent";

export const UploadInovicesAPIRequests = {
  uploadToPreviewCSV: (uploadInvoicesDTO: UploadInvoicesDTO) =>
    requests.post("uploadInvoices/previewcsv", uploadInvoicesDTO),
};
