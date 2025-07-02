import {
  UploadInvoicesDTO,
  UploadShippingLineInvoicesDTO,
  UploadSl4InvoiceDto,
} from "../models/invoice/invoice.types";
import { requests } from "../agent/agent";

const uploadConsigneeRoute = "uploadconsigneeinvoices";
const uploadShippingLineRoute = "uploadshippinglineinvoices";

export const UploadInvoicesAPIRequests = {
  uploadConsigneeCSVToPreview: (uploadInvoicesDTO: UploadInvoicesDTO) =>
    requests.post(`${uploadConsigneeRoute}/previewcsv`, uploadInvoicesDTO),
  uploadConsigneeCSVToProduction: (uploadInvoicesDTO: UploadInvoicesDTO) =>
    requests.post(`${uploadConsigneeRoute}/uploadtosap`, uploadInvoicesDTO),

  uploadSL2InvoiceToPreview: (
    uploadInvoicesDTO: UploadShippingLineInvoicesDTO
  ) =>
    requests.post(
      `${uploadShippingLineRoute}/previewcsv/sl2`,
      uploadInvoicesDTO
    ),
  uploadSL2InvoiceToProduction: (
    uploadInvoicesDTO: UploadShippingLineInvoicesDTO
  ) =>
    requests.post(`${uploadShippingLineRoute}/uploadtosap`, uploadInvoicesDTO),
    
  uploadSL4ToPreview: (uploadInvoicesDTO: UploadSl4InvoiceDto) =>
    requests.post(`${uploadShippingLineRoute}/previewcsv/sl4`, uploadInvoicesDTO),
  uploadSL4ToProduction: (uploadInvoicesDTO: UploadSl4InvoiceDto) =>
    requests.post(`${uploadShippingLineRoute}/uploadtosap`, uploadInvoicesDTO),
};
