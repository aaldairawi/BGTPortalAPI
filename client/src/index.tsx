import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./app/router/Routes.tsx";
import "../src/app/layout/styles.css";

import { store } from "./app/store/configureStore.ts";
createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>
);
