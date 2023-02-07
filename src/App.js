import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import AuthContainerLayout from "./Layouts/AuthContainerLayout";
import AuthLayout from "./Layouts/AuthLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "/",
          element: <AuthContainerLayout />,
          children: [
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/signup",
              element: <Signup />,
            },
          ],
        },
        {
          path: "/home",
          element: <Homepage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
