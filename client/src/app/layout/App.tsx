import { useCallback, useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@emotion/react";
import { Container, createTheme } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { fetchCurrentUserAsync } from "../../features/account/accountSlice";
import LoadingComponent from "../components/LoadingComponent";
import Login from "../../features/account/Login";

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useAppSelector((state) => state.account);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUserAsync());
    } catch (error) {
      toast.error("Session Expired, Please login again.", { autoClose: 1000 });
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const theme = createTheme({
    palette: {
      background: {
        default: "white",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header />
      {loading ? (
        <LoadingComponent message="Initialising App..." />
      ) : location.pathname === "/" ? (
        <Container sx={{ mt: 20 }}>
          <Login />
        </Container>
      ) : (
        <Container sx={{ p: 0, mt: 12 }} maxWidth="xl">
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  );
};

export default App;
