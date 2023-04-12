import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { routerpaths } from "./Routes";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import InitialRenderComponent from "./Sharedcomponents/InitialRenderComponent";

function App() {
  const { isLoading } = useDashboard();
  const router = createBrowserRouter(routerpaths, { basename: "/" });

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <RouterProvider router={router} />
      <InitialRenderComponent />
    </>
  );
}

export default App;
