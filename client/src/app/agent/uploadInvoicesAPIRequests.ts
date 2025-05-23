import { UploadInvoicesDTO } from "../models/invoice/invoice.types";
import { requests } from "./agent";


export const UploadInovicesAPIRequests = {
  uploadInvoicesToSap: (uploadInvoicesDTO: UploadInvoicesDTO) =>
    requests.post("uploadInvoices", uploadInvoicesDTO),
};

