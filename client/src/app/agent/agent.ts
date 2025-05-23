import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routes";
import { store } from "../store/configureStore";
import {} from "../models/container/unitLifeTime.types";

import { UsersAPIRequests } from "./usersAPIRequests";

import { AccountAPIRequests } from "./accountAPIRequests";
import { RolesAPIRequests } from "./rolesAPIRequests";
import { InvoicesAPIRequest } from "./invoicesAPIRequests";
import { NavisUnitApi } from "./n4ContainerAPIRequests";
import { UploadInovicesAPIRequests } from "./uploadInvoicesAPIRequests";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 10));

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
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title, { autoClose: 1500 });
        break;
      case 404:
        toast.error(data.title, { autoClose: 1200 });
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("Your roles forbid you to access this area.", {
          autoClose: 1500,
        });
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        toast.error("Server error", { autoClose: 1000 });
        break;
      default:
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
  InvoicesAPIRequest,
  TestErrors,
  UploadInovicesAPIRequests,
};

export default Agent;
