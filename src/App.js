import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { getLocalStorageData, removeSessionStorageData } from "./Store/Storage";
import HomeLayout from "./Layouts/HomeLayout";
import AuthLayout from "../src/Layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootElement } from "./Routes";
import { handleLoginData } from "./Store/Redux/Reducer/AuthReducer";
import Homepage from "./Components/Homepage/Homepage";
import Spinner from "./Sharedcomponents/Spinner";
import MainLayout from "./Layouts/MainLayout";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

function App() {
  const dispatch = useDispatch();
  const { loginUserData } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.dashboard);

  const getPrivateRouteValue = () => {
    if (loginUserData) {
      return { isAuth: false, isHome: true };
    } else {
      return { isAuth: true, isHome: false };
    }
  };

  const routerpaths = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
      ],
    },
    {
      path: "/",
      element: loginUserData ? <HomeLayout /> : <AuthLayout />,
      children: RootElement(getPrivateRouteValue()),
    },
  ];
  const router = createBrowserRouter(routerpaths, { basename: "/" });

  useEffect(() => {
    if (window.location.pathname !== "/setpassword") {
      removeSessionStorageData("CountDown");
    }
  }, [window.location]);

  useEffect(() => {
    if (getLocalStorageData("rawcaster_user_token")) {
      dispatch(
        handleLoginData(JSON.parse(getLocalStorageData("rawcaster_user_token")))
      );
    }
  }, []);

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
