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

function App() {
  const dispatch = useDispatch();
  const { loginUserData } = useSelector((state) => state.auth);

  const getPrivateRouteValue = () => {
    if (loginUserData) {
      return { isAuth: false, isHome: true };
    } else {
      return { isAuth: true, isHome: false };
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: loginUserData ? <HomeLayout /> : <AuthLayout />,
      children: RootElement(getPrivateRouteValue()),
    },
  ]);

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

  return <RouterProvider router={router} />;
}

export default App;
