import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routes";
import { IUpdateUserDto, IUser, IUserRegister } from "../models/account/user";
import { FieldValues } from "react-hook-form";
import { store } from "../store/configureStore";
import { IRole } from "../models/role/role";
import {
  IContainerExportDto,
  IContainerImportDto,
} from "../models/container/unitLifeTime";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 100));

axios.defaults.baseURL = "http://localhost:5000/api/";

const responseBody = (axiosResponse: AxiosResponse) => axiosResponse.data;
axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  //const apiSupportedVersion = config.headers.get("api-supported-versions");
  //console.log(apiSupportedVersion);
  
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
            console.log(key);
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

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Users = {
  get: (): Promise<IUser[]> => requests.get("users/getall"),
  create: (userData: IUserRegister) =>
    requests.post("account/register", userData),
  edit: (object: IUpdateUserDto) => {
    return requests.put(`users/${object.userId}`, {
      roles: object.roles,
      password: { newPassword: object.password.newPassword },
    });
  },

  delete: (id: number) => requests.delete(`users/${id}`),
};

const Roles = {
  get: (): Promise<IRole[]> => {
    return requests.get("roles/getall");
  },
  delete: (roleId: number) => requests.delete(`roles/${roleId}`),
};

const Account = {
  login: (userData: FieldValues) => requests.post("account/login", userData),
  register: (userData: IUserRegister) =>
    requests.post("account/register", userData),
  getCurrentUser: () => requests.get("account/currentUser"),
};

const NavisUnitApi = {
  getUnitCurrentLocation: (unitNbr: string) =>
    requests.get(`containerlifetime/unitcurrentstatus/${unitNbr}`),
  getImportUnitLifeTime: (unitNumber: string): Promise<IContainerImportDto> =>
    requests.get(
      `containerlifetime/unitlifetimeimport?unitNumber=${unitNumber}&unitCategory=IMPORT`
    ),
  getExportUnitLifeTime: (unitNumber: string): Promise<IContainerExportDto> =>
    requests.get(
      `containerlifetime/unitlifetimeexport?unitNumber=${unitNumber}&unitCategory=EXPORT`
    ),
};
const SapIntegration = {
  getCTypeInvoiceTypes: () => requests.get("cTypeInvoices/getallcinvoicetypes"),
  getFinalizedCTypeInvoices: (object: {
    invoiceType: string;
    finalizedDate: string;
  }) =>
    requests.get(
      `cTypeInvoices/finalizedinvoices?invoiceType=${object.invoiceType}&finalizedDate=${object.finalizedDate}`
    ),
  getCTypeFinalizedInvoiceItems: (invoiceGkey: string) =>
    requests.get(`cTypeInvoices/invoiceitems?invoiceGkey=${invoiceGkey}`),
};
/*Test errors object to  validate error handling*/
const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const agent = {
  Account,
  Users,
  Roles,
  NavisUnitApi,
  SapIntegration,
  TestErrors,
};

export default agent;
