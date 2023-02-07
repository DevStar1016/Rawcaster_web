import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup";
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
              path: "/",
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
