import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routes";

import { store } from "../store/configureStore";

import { UsersAPIRequests } from "../requests/usersAPIRequests";

import { AccountAPIRequests } from "../requests/accountAPIRequests";

import { RolesAPIRequests } from "../requests/rolesAPIRequests";

import { ConsigneeInvoiceAPIRequests } from "../requests/consigneeInvoiceAPIRequests";
import { ShippingLineInvoiceAPIRequests } from "../requests/shippingInvoiceAPIRequests";
import { NavisUnitApi } from "../requests/n4ContainerAPIRequests";

import { UploadInvoicesAPIRequests } from "../requests/uploadInvoicesAPIRequests";

import { StrippingUnitsAPI } from "../requests/strippingUnitsAPIRequests";
import { InvoiceFiltersAPIRequest } from "../requests/invoiceFiltersAPIRequests";
import { SingleInvoicesAPIRequest } from "../requests/singleInvoicesAPIRequest";
import { SapDashboardAPIRequests } from "../requests/sapDashboardAPIRequests";
import { VesselScheduleAPIRequests } from "../requests/vesselScheduleAPIRequests";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1));

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

// axios.defaults.baseURL = "/api/v1/";

const responseBody = (axiosResponse: AxiosResponse) => axiosResponse.data;
axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) {
      await sleep();
    }

    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data?.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }

        if (typeof data.message === "string") {
          toast.error(data.message, { autoClose: 3000 });
          break;
        }

        // Fallback
        toast.error("Bad request");
        break;
      case 404:
        toast.error(data.title, { autoClose: 1200 });
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("Your roles  forbid you to access this area.", {
          autoClose: 1500,
        });
        break;
      case 500:
        router.navigate("/v1/server-error", { state: { error: data } });
        toast.error("Server error", { autoClose: 1000 });
        break;
      default:
        toast.error("Unexpected error occured");
        break;
    }
  }
);

export const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),

  getBlob: (url: string, params?: { from: string; to: string }) =>
    axios.get(url, { params, responseType: "blob" }),
};

/*Test errors object to  validate error handling*/
const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Agent = {
  AccountAPIRequests,
  UsersAPIRequests,
  RolesAPIRequests,
  NavisUnitApi,
  ConsigneeInvoiceAPIRequests,
  ShippingLineInvoiceAPIRequests,
  TestErrors,
  UploadInovicesAPIRequests: UploadInvoicesAPIRequests,
  StrippingUnitsAPI,
  InvoiceFiltersAPIRequest,
  SingleInvoicesAPIRequest,
  SapDashboardAPIRequests,
  VesselScheduleAPIRequests,
};

export default Agent;
