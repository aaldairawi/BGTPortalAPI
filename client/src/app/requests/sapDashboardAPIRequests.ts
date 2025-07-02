import axios from "axios";
import { toast } from "react-toastify";
import { requests } from "../agent/agent";

export const SapDashboardAPIRequests = {
  getPendingInvoices: async (finalizedDate: string) => {
    const res = await axios.get(`invoicesdashboard/get-pending-invoices`, {
      params: { finalizedDate },
    });

    if (res.status === 204) {
      toast.info("No pending invoices found.", {
        autoClose: 1900,
      });
      return [];
    }

    return res.data;
  },

  getUploadedInvoices: (uploadDate: string) =>
    requests.get(
      `invoicesdashboard/get-uploaded-invoices?uploadedDate=${uploadDate}`
    ),
};
